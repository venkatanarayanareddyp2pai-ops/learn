
let unit        = 'metric';
let demoMode    = true;
let currentData = null;

let ddResults = [];
let ddIndex   = -1;
let ddTimer   = null;

window.addEventListener('DOMContentLoaded', () => {
  hide('loadingOverlay');
  show('dashboard');
  showEmptyState();
});

function onSearchInput() {
  const q = document.getElementById('searchInput').value.trim();
  clearTimeout(ddTimer);
  if (q.length < 2) { ddClose(); return; }
  ddTimer = setTimeout(() => ddFetch(q), 320);
}

function onSearchKeydown(e) {
  const items = document.querySelectorAll('#searchDropdown .dd-item');
  if (e.key === 'ArrowDown')  { e.preventDefault(); ddMove(items,  1); }
  else if (e.key === 'ArrowUp')   { e.preventDefault(); ddMove(items, -1); }
  else if (e.key === 'Enter') {
    if (ddIndex >= 0 && ddResults[ddIndex]) ddPick(ddResults[ddIndex]);
    else searchCity();
  }
  else if (e.key === 'Escape') ddClose();
}

function ddMove(items, dir) {
  ddIndex = Math.max(0, Math.min(ddIndex + dir, items.length - 1));
  items.forEach((el, i) => el.classList.toggle('active', i === ddIndex));
  if (items[ddIndex]) items[ddIndex].scrollIntoView({ block: 'nearest' });
}

async function ddFetch(q) {
  ddOpen('<div class="dd-loading"><span class="dd-spin"></span>Searching…</div>');
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`
    ).then(r => r.json());
    ddResults = res.results || [];
    ddIndex   = -1;
    if (!ddResults.length) {
      ddOpen(`<div class="dd-empty">No results for "<strong>${q}</strong>"</div>`);
      return;
    }
    const html = ddResults.map((r, i) => {
      const sub  = [r.admin1, r.country].filter(Boolean).join(', ');
      const flag = r.country_code ? toFlag(r.country_code) : '🌍';
      return `<div class="dd-item" onmousedown="event.preventDefault();ddPickIdx(${i})">
        <span class="dd-flag">${flag}</span>
        <div class="dd-text">
          <span class="dd-city">${r.name}</span>
          <span class="dd-sub">${sub}</span>
        </div>
        <span class="dd-coord">${(+r.latitude).toFixed(2)}, ${(+r.longitude).toFixed(2)}</span>
      </div>`;
    }).join('');
    ddOpen(html);
  } catch {
    ddClose();
  }
}

function ddOpen(html) {
  const dd    = document.getElementById('searchDropdown');
  const input = document.getElementById('searchInput');
  if (!dd || !input) return;

  /* position relative to input */
  const rect    = input.getBoundingClientRect();
  dd.style.top  = (rect.bottom + 6) + 'px';
  dd.style.left = rect.left + 'px';
  dd.style.width = rect.width + 'px';

  dd.innerHTML   = html;
  dd.style.display = 'block';        
  dd.style.opacity = '1';
}

function ddClose() {
  const dd = document.getElementById('searchDropdown');
  if (dd) { dd.style.display = 'none'; dd.innerHTML = ''; }
  ddResults = []; ddIndex = -1;
}

function ddPickIdx(i) {
  const loc = ddResults[i];
  if (loc) ddPick(loc);
}

function ddPick(loc) {
  document.getElementById('searchInput').value = loc.name;
  ddClose();
  fetchWeatherByLoc(loc);
}

function toFlag(code) {
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
  );
}

document.addEventListener('mousedown', e => {
  const wrap = document.getElementById('searchWrap');
  if (wrap && !wrap.contains(e.target)) ddClose();
});

window.addEventListener('scroll', repositionDropdown, { passive: true });
window.addEventListener('resize', repositionDropdown, { passive: true });

function repositionDropdown() {
  const dd    = document.getElementById('searchDropdown');
  const input = document.getElementById('searchInput');
  if (!dd || dd.style.display === 'none' || !input) return;
  const rect    = input.getBoundingClientRect();
  dd.style.top  = (rect.bottom + 6) + 'px';
  dd.style.left = rect.left + 'px';
  dd.style.width = rect.width + 'px';
}

function searchCity() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return;
  ddClose();
  geocodeAndFetch(q);
}

async function geocodeAndFetch(city) {
  showLoader(); clearError();
  try {
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    ).then(r => r.json());
    if (!geo.results?.length) throw new Error(`"${city}" not found.`);
    await fetchWeatherByLoc(geo.results[0]);
  } catch (err) {
    showError('⚠ ' + err.message);
    hideLoader();
  }
}

async function fetchWeatherByLoc(loc) {
  showLoader(); clearError();
  try {
    const { latitude, longitude, timezone } = loc;
    const tUnit = unit === 'metric' ? 'celsius'    : 'fahrenheit';
    const wUnit = unit === 'metric' ? 'kmh'        : 'mph';

    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude',          latitude);
    url.searchParams.set('longitude',         longitude);
    url.searchParams.set('timezone',          timezone);
    url.searchParams.set('past_days',         '0');
    url.searchParams.set('temperature_unit',  tUnit);
    url.searchParams.set('wind_speed_unit',   wUnit);
    url.searchParams.set('precipitation_unit','mm');
    url.searchParams.set('current', [
      'precipitation','temperature_2m','cloud_cover','wind_speed_10m'
    ].join(','));
    url.searchParams.set('hourly', [
      'temperature_2m','weather_code','wind_speed_10m','wind_direction_80m',
      'relative_humidity_2m','precipitation_probability','precipitation',
      'rain','showers','uv_index','is_day','sunshine_duration',
      'snowfall','visibility','surface_pressure',
      'cloud_cover','cloud_cover_mid','cloud_cover_high','cloud_cover_low'
    ].join(','));
    url.searchParams.set('daily', [
      'weather_code','temperature_2m_max','temperature_2m_min',
      'precipitation_sum','sunrise','sunset','uv_index_max'
    ].join(','));

    const wx = await fetch(url.toString()).then(r => r.json());
    if (wx.error) throw new Error(wx.reason || 'Forecast unavailable');

    const nowStr = new Date().toISOString().slice(0, 13);
    let nowIdx = wx.hourly.time.findIndex(t => t.slice(0,13) >= nowStr);
    if (nowIdx < 0) nowIdx = wx.hourly.time.length - 1;

    currentData = { wx, loc, nowIdx };
    demoMode    = false;
    renderAll(currentData);

  } catch (err) {
    showError('⚠ ' + err.message);
    if (!currentData) showEmptyState();
  } finally {
    hideLoader();
    show('dashboard');
  }
}

function renderAll({ wx, loc, nowIdx }) {
  const c  = wx.current;
  const h  = wx.hourly;
  const d  = wx.daily;
  const ts = unit === 'metric' ? '°C' : '°F';
  const wu = unit === 'metric' ? 'km/h' : 'mph';
  const hv = k => h[k]?.[nowIdx];

  const isDay = hv('is_day') ?? 1;
  const wCode = hv('weather_code') ?? 0;
  const hum   = hv('relative_humidity_2m') ?? 65;
  const temp  = c.temperature_2m;
  const feels = Math.round(temp - 0.4 * (temp - 10) * (1 - hum / 100));
  const hiDay = d.temperature_2m_max[0] != null ? Math.round(d.temperature_2m_max[0]) : '—';
  const loDay = d.temperature_2m_min[0] != null ? Math.round(d.temperature_2m_min[0]) : '—';

  set('cityName',      [loc.name, loc.admin1, loc.country].filter(Boolean).join(', '));
  set('dateStr',       new Date().toUTCString().replace(' GMT','').slice(0,-4));
  set('mainTemp',      Math.round(temp));
  set('tempUnit',      ts);
  set('mainCondition', wmoDesc(wCode, isDay));
  set('mainIcon',      wmoIcon(wCode, isDay));
  set('feelsLike',     `Feels like ${feels}${ts} · H:${hiDay}° L:${loDay}°`);

  const pressure = hv('surface_pressure');
  const vis      = hv('visibility');
  const dp       = Math.round(temp - ((100 - hum) / 5));
  set('humidity',   hum + '%');
  set('pressure',   pressure != null ? Math.round(pressure) + ' hPa' : 'N/A');
  set('visibility', vis      != null ? (vis / 1000).toFixed(1) + ' km' : 'N/A');
  set('dewPoint',   dp + ts);
  later(() => { document.getElementById('humMeter').style.width = hum + '%'; });

  const windSpd = c.wind_speed_10m ?? 0;
  const windDir = hv('wind_direction_80m') ?? 0;
  const mps     = unit === 'metric' ? windSpd / 3.6 : windSpd * 0.44704;
  set('windSpeed', Math.round(windSpd));
  set('windUnit',  wu);
  set('windDir',   degreesToDir(windDir) + ` (${Math.round(windDir)}°)`);
  set('windGust',  'N/A');
  set('beaufort',  beaufortScale(mps));
  const needle = document.getElementById('needle');
  if (needle) needle.style.transform = `rotate(${windDir}deg)`;

  const uv    = hv('uv_index') ?? d.uv_index_max?.[0] ?? 0;
  const cloud = c.cloud_cover ?? 0;
  set('uvIndex',    (+uv).toFixed(1));
  set('uvLabel',    uvLabel(+uv));
  set('cloudCover', cloud + '%');

  const rain = (hv('rain') ?? 0) + (hv('showers') ?? 0);
  const snow = hv('snowfall') ?? 0;
  const prec = c.precipitation ?? rain;
  set('precip', prec > 0 ? prec.toFixed(1) + ' mm/h'
              : snow > 0 ? snow.toFixed(1) + ' mm/h ❄' : 'None');

  later(() => {
    document.getElementById('uvMeter').style.width    = Math.min((+uv)/11*100,100) + '%';
    document.getElementById('cloudMeter').style.width = cloud + '%';
  });

  const srStr = d.sunrise?.[0]?.slice(11,16) ?? null;
  const ssStr = d.sunset?.[0]?.slice(11,16)  ?? null;
  set('sunrise', srStr ? fmtHHMM(srStr) : '—');
  set('sunset',  ssStr ? fmtHHMM(ssStr) : '—');
  if (srStr && ssStr) {
    const srMin = toMin(srStr), ssMin = toMin(ssStr);
    const dlMin = ssMin - srMin;
    set('daylight', `${Math.floor(dlMin/60)}h ${dlMin%60}m`);
    const nowMin = new Date().getHours()*60 + new Date().getMinutes();
    const pct    = Math.max(0, Math.min(1, (nowMin - srMin)/(ssMin - srMin)));
    const dot    = document.getElementById('sunDot');
    if (dot) { dot.style.left=(pct*100)+'%'; dot.style.top=(50-Math.sin(pct*Math.PI)*50)+'px'; }
  }
  set('timezone', wx.timezone_abbreviation || wx.timezone || '—');

  let hhtml = '';
  for (let i = 0; i < 12; i++) {
    const idx = nowIdx + i;
    if (idx >= h.time.length) break;
    const t = new Date(h.time[idx] + ':00');
    hhtml += `<div class="hourly-item ${i===0?'now':''}">
      <div class="hourly-time">${i===0?'Now':fmtTime(t)}</div>
      <div class="hourly-icon">${wmoIcon(h.weather_code[idx], h.is_day[idx])}</div>
      <div class="hourly-temp">${Math.round(h.temperature_2m[idx])}°</div>
    </div>`;
  }
  document.getElementById('hourlyScroll').innerHTML = hhtml;

  let fhtml = '';
  for (let i = 0; i < Math.min(5, d.time.length); i++) {
    const dt    = new Date(d.time[i] + 'T12:00:00');
    const label = i===0 ? 'Today' : dt.toLocaleDateString('en-US',{weekday:'short'});
    fhtml += `<div class="forecast-item">
      <div class="forecast-day ${i===0?'today':''}">${label}</div>
      <div class="forecast-icon">${wmoIcon(d.weather_code[i], 1)}</div>
      <div class="forecast-desc">${wmoDesc(d.weather_code[i], 1)}</div>
      <div class="forecast-temps">
        <span class="forecast-hi">${Math.round(d.temperature_2m_max[i])}°</span>
        <span class="forecast-lo">${Math.round(d.temperature_2m_min[i])}°</span>
      </div>
    </div>`;
  }
  document.getElementById('forecastRow').innerHTML = fhtml;
}

function showEmptyState() {
  demoMode = true;
  ['cityName','dateStr','mainTemp','mainCondition','feelsLike','humidity','pressure',
   'visibility','dewPoint','windSpeed','windDir','windGust','beaufort','uvIndex',
   'uvLabel','cloudCover','precip','sunrise','sunset','daylight','timezone']
    .forEach(id => set(id, '—'));
  set('mainIcon', '🌤️');
  set('tempUnit', unit === 'metric' ? '°C' : '°F');
  set('windUnit', unit === 'metric' ? 'km/h' : 'mph');
  later(() => {
    ['humMeter','uvMeter','cloudMeter'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.width = '0%';
    });
  });
  document.getElementById('hourlyScroll').innerHTML = '';
  document.getElementById('forecastRow').innerHTML  = '';
}

function wmoDesc(code, isDay) {
  const m = {
    0: isDay ? 'Clear Sky' : 'Clear Night',
    1:'Mainly Clear', 2:'Partly Cloudy', 3:'Overcast',
    45:'Foggy', 48:'Icy Fog',
    51:'Light Drizzle', 53:'Drizzle', 55:'Heavy Drizzle',
    61:'Light Rain', 63:'Rain', 65:'Heavy Rain',
    71:'Light Snow', 73:'Snow', 75:'Heavy Snow', 77:'Snow Grains',
    80:'Light Showers', 81:'Showers', 82:'Heavy Showers',
    85:'Snow Showers', 86:'Heavy Snow Showers',
    95:'Thunderstorm', 96:'Thunderstorm + Hail', 99:'Severe Thunderstorm'
  };
  return m[code] ?? 'Unknown';
}
function wmoIcon(code, isDay) {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code === 1) return '🌤️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

function set(id, val)  { const e=document.getElementById(id); if(e) e.textContent=val; }
function show(id)      { const e=document.getElementById(id); if(e) e.style.display=''; }
function hide(id)      { const e=document.getElementById(id); if(e) e.style.display='none'; }
function later(fn)     { setTimeout(fn, 200); }
function showLoader()  { const e=document.getElementById('loadingOverlay'); if(e){e.style.display='flex';e.classList.remove('hidden');} }
function hideLoader()  { const e=document.getElementById('loadingOverlay'); if(e){e.classList.add('hidden');setTimeout(()=>{e.style.display='none';},400);} }
function showError(m)  { const e=document.getElementById('errorBanner'); if(e){e.textContent=m;e.classList.add('show');} }
function clearError()  { const e=document.getElementById('errorBanner'); if(e) e.classList.remove('show'); }
function fmtTime(d)    { return d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true}); }
function fmtHHMM(hhmm) {
  if (!hhmm) return '—';
  const [hh,mm] = hhmm.split(':').map(Number);
  return `${(hh%12||12).toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')} ${hh>=12?'PM':'AM'}`;
}
function toMin(hhmm)   { const [h,m]=hhmm.split(':').map(Number); return h*60+m; }
function degreesToDir(deg) {
  return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(deg/22.5)%16];
}
function beaufortScale(ms) {
  if(ms<0.5)return 0;if(ms<1.6)return 1;if(ms<3.4)return 2;if(ms<5.5)return 3;
  if(ms<8.0)return 4;if(ms<10.8)return 5;if(ms<13.9)return 6;if(ms<17.2)return 7;
  if(ms<20.8)return 8;if(ms<24.5)return 9;if(ms<28.5)return 10;if(ms<32.7)return 11;
  return 12;
}
function uvLabel(uv) {
  if(uv<3)return'🟢 Low';if(uv<6)return'🟡 Moderate';
  if(uv<8)return'🟠 High';if(uv<11)return'🔴 Very High';
  return'🟣 Extreme';
}