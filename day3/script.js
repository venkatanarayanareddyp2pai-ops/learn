let unit = 'metric';
let demoMode = true;

window.addEventListener('DOMContentLoaded', () => {
  hide('loadingOverlay');
  loadDemo();
});

function setUnit(u) {
  unit = u;
  document.getElementById('btnC').classList.toggle('active', u === 'metric');
  document.getElementById('btnF').classList.toggle('active', u === 'imperial');
  if (demoMode) { renderDemoData(); return; }
  if (currentData) renderAll(currentData);
}

function searchCity() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) return;
  showError('Live search requires an API key. Showing demo data.');
}

async function fetchWeather(city) {
  showLoader();
  clearError();
  try {
    const u = unit;
    const [cur, fore] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${u}`).then(r => r.json()),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${u}&cnt=40`).then(r => r.json())
    ]);

    if (cur.cod !== 200) throw new Error(cur.message || 'City not found');
    if (fore.cod !== '200') throw new Error(fore.message || 'Forecast error');

    currentData = { cur, fore };
    demoMode = false;
    renderAll(currentData);
  } catch (e) {
    showError('⚠ ' + e.message + ' — Check city name or API key.');
  } finally {
    hideLoader();
    show('dashboard');
  }
}

function renderAll({ cur, fore }) {
  const u = unit;
  const windMult = u === 'metric' ? 3.6 : 1; 
  const windSuffix = u === 'metric' ? 'km/h' : 'mph';
  const tempSuffix = u === 'metric' ? '°C' : '°F';

  const dt = new Date((cur.dt + cur.timezone) * 1000);
  set('cityName', `${cur.name}, ${cur.sys.country}`);
  set('dateStr', dt.toUTCString().replace(' GMT','').slice(0,-4));
  set('mainTemp', Math.round(cur.main.temp));
  set('tempUnit', tempSuffix);
  set('mainCondition', capitalize(cur.weather[0].description));
  set('feelsLike', `Feels like ${Math.round(cur.main.feels_like)}${tempSuffix} · H:${Math.round(cur.main.temp_max)}° L:${Math.round(cur.main.temp_min)}°`);
  set('mainIcon', weatherEmoji(cur.weather[0].id, cur.weather[0].icon));

  const hum = cur.main.humidity;
  set('humidity', hum + '%');
  set('pressure', cur.main.pressure + ' hPa');
  set('visibility', cur.visibility ? (cur.visibility / 1000).toFixed(1) + ' km' : 'N/A');
  const dp = Math.round(cur.main.temp - ((100 - hum) / 5));
  set('dewPoint', dp + tempSuffix);
  setTimeout(() => { document.getElementById('humMeter').style.width = hum + '%'; }, 200);

  const ws = u === 'metric' ? (cur.wind.speed * 3.6).toFixed(1) : cur.wind.speed.toFixed(1);
  set('windSpeed', ws);
  set('windUnit', windSuffix);
  set('windDir', degreesToDir(cur.wind.deg) + ` (${cur.wind.deg}°)`);
  const gusts = cur.wind.gust ? (u === 'metric' ? (cur.wind.gust * 3.6).toFixed(1) : cur.wind.gust.toFixed(1)) + ' ' + windSuffix : 'N/A';
  set('windGust', gusts);
  set('beaufort', beaufortScale(cur.wind.speed));
  const needle = document.getElementById('needle');
  if (needle) needle.style.transform = `rotate(${cur.wind.deg}deg)`;

  const uv = estimateUV(cur);
  set('uvIndex', uv.toFixed(1));
  set('uvLabel', uvLabel(uv));
  setTimeout(() => {
    document.getElementById('uvMeter').style.width = Math.min(uv / 11 * 100, 100) + '%';
    document.getElementById('cloudMeter').style.width = cur.clouds.all + '%';
  }, 200);
  set('cloudCover', cur.clouds.all + '%');
  const rain = cur.rain ? cur.rain['1h'] || cur.rain['3h'] || 0 : 0;
  const snow = cur.snow ? cur.snow['1h'] || cur.snow['3h'] || 0 : 0;
  set('precip', rain > 0 ? rain.toFixed(1) + ' mm/h' : snow > 0 ? snow.toFixed(1) + ' mm/h ❄' : 'None');

  const sr = new Date((cur.sys.sunrise + cur.timezone) * 1000);
  const ss = new Date((cur.sys.sunset  + cur.timezone) * 1000);
  set('sunrise', fmtTime(sr));
  set('sunset',  fmtTime(ss));
  const dlMin = Math.round((cur.sys.sunset - cur.sys.sunrise) / 60);
  set('daylight', `${Math.floor(dlMin/60)}h ${dlMin%60}m`);
  set('timezone', 'UTC' + (cur.timezone >= 0 ? '+' : '') + (cur.timezone/3600));

  const nowSec = Math.floor(Date.now()/1000) + cur.timezone;
  const pct = Math.max(0, Math.min(1, (nowSec - cur.sys.sunrise) / (cur.sys.sunset - cur.sys.sunrise)));
  const dot = document.getElementById('sunDot');
  if (dot) {
    dot.style.left = (pct * 100) + '%';
    dot.style.top = (50 - Math.sin(pct * Math.PI) * 50) + 'px';
  }

  const hourly = fore.list.slice(0, 12);
  const nowTs = cur.dt;
  let html = '';
  hourly.forEach((h, i) => {
    const hdt = new Date((h.dt + cur.timezone) * 1000);
    const isNow = i === 0;
    html += `<div class="hourly-item ${isNow?'now':''}">
      <div class="hourly-time">${isNow ? 'Now' : fmtTime(hdt)}</div>
      <div class="hourly-icon">${weatherEmoji(h.weather[0].id, h.weather[0].icon)}</div>
      <div class="hourly-temp">${Math.round(h.main.temp)}°</div>
    </div>`;
  });
  document.getElementById('hourlyScroll').innerHTML = html;

  const daily = {};
  fore.list.forEach(item => {
    const d = new Date((item.dt + cur.timezone) * 1000);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }) + '-' + d.getUTCDate();
    if (!daily[key]) daily[key] = { ...item, temps: [], key };
    daily[key].temps.push(item.main.temp);
  });
  const days = Object.values(daily).slice(0, 5);
  let fhtml = '';
  days.forEach((d, i) => {
    const dd = new Date((d.dt + cur.timezone) * 1000);
    const dayLabel = i === 0 ? 'Today' : dd.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const hi = Math.round(Math.max(...d.temps));
    const lo = Math.round(Math.min(...d.temps));
    fhtml += `<div class="forecast-item">
      <div class="forecast-day ${i===0?'today':''}">${dayLabel}</div>
      <div class="forecast-icon">${weatherEmoji(d.weather[0].id, d.weather[0].icon)}</div>
      <div class="forecast-desc">${capitalize(d.weather[0].description)}</div>
      <div class="forecast-temps">
        <span class="forecast-hi">${hi}°</span>
        <span class="forecast-lo">${lo}°</span>
      </div>
    </div>`;
  });
  document.getElementById('forecastRow').innerHTML = fhtml;
}

function loadDemo() {
  demoMode = true;
  hide('apiSetup');
  show('searchWrap');
  show('dashboard');
  hideLoader();
  clearError();
  renderDemoData();
}

function renderDemoData() {
  const u = unit;
  const base = { C: { temp: 22, feel: 20, max: 26, min: 18, dp: 14 }, F: { temp: 72, feel: 68, max: 79, min: 64, dp: 57 } }[u === 'metric' ? 'C' : 'F'];
  const ws = u === 'metric' ? '18.5' : '11.5';
  const wsu = u === 'metric' ? 'km/h' : 'mph';
  const ts = u === 'metric' ? '°C' : '°F';

  set('cityName', 'India,Demo-data');
  set('dateStr', new Date().toUTCString().replace(' GMT','').slice(0,-4) + ' (Demo)');
  set('mainTemp', base.temp);
  set('tempUnit', ts);
  set('mainCondition', 'Partly Cloudy');
  set('feelsLike', `Feels like ${base.feel}${ts} · H:${base.max}° L:${base.min}°`);
  set('mainIcon', '⛅');
  set('humidity', '65%');
  set('pressure', '1013 hPa');
  set('visibility', '9.5 km');
  set('dewPoint', base.dp + ts);
  set('windSpeed', ws);
  set('windUnit', wsu);
  set('windDir', 'SW (225°)');
  set('windGust', u === 'metric' ? '24.0 km/h' : '14.9 mph');
  set('beaufort', '3');
  set('uvIndex', '4.2');
  set('uvLabel', uvLabel(4.2));
  set('cloudCover', '40%');
  set('precip', 'None');
  set('sunrise', '06:32 AM');
  set('sunset', '07:48 PM');
  set('daylight', '13h 16m');
  set('timezone', 'UTC+1');

  setTimeout(() => {
    document.getElementById('humMeter').style.width = '65%';
    document.getElementById('uvMeter').style.width = '38%';
    document.getElementById('cloudMeter').style.width = '40%';
    const needle = document.getElementById('needle');
    if (needle) needle.style.transform = 'rotate(225deg)';
    const dot = document.getElementById('sunDot');
    const pct = 0.55;
    if (dot) { dot.style.left = (pct * 100) + '%'; dot.style.top = (50 - Math.sin(pct * Math.PI) * 50) + 'px'; }
  }, 200);

  const days = ['Today','Mon','Tue','Wed','Thu'];
  const icons = ['⛅','🌤️','☁️','🌧️','🌤️'];
  const descs = ['Partly cloudy','Mostly sunny','Overcast','Light rain','Sunny spells'];
  const his = [base.max, base.max+2, base.max-2, base.max-4, base.max+1];
  const los = [base.min, base.min+2, base.min-1, base.min-2, base.min+3];
  let fhtml = '';
  days.forEach((d,i) => {
    fhtml += `<div class="forecast-item">
      <div class="forecast-day ${i===0?'today':''}">${d}</div>
      <div class="forecast-icon">${icons[i]}</div>
      <div class="forecast-desc">${descs[i]}</div>
      <div class="forecast-temps">
        <span class="forecast-hi">${his[i]}°</span>
        <span class="forecast-lo">${los[i]}°</span>
      </div>
    </div>`;
  });
  document.getElementById('forecastRow').innerHTML = fhtml;

  const hIcons = ['⛅','⛅','🌤️','🌤️','☀️','☀️','🌤️','⛅','🌧️','🌧️','☁️','☁️'];
  const hTemps = [base.temp,base.temp+1,base.temp+2,base.temp+3,base.temp+4,base.temp+3,base.temp+2,base.temp+1,base.temp,base.temp-1,base.temp-1,base.temp-2];
  let hhtml = '';
  const now = new Date();
  hIcons.forEach((ic,i) => {
    const h = new Date(now.getTime() + i*3600000);
    hhtml += `<div class="hourly-item ${i===0?'now':''}">
      <div class="hourly-time">${i===0?'Now':fmtTime(h)}</div>
      <div class="hourly-icon">${ic}</div>
      <div class="hourly-temp">${hTemps[i]}°</div>
    </div>`;
  });
  document.getElementById('hourlyScroll').innerHTML = hhtml;
}

function set(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function show(id) { const el = document.getElementById(id); if (el) el.style.display = ''; }
function hide(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }
function showLoader() { const el = document.getElementById('loadingOverlay'); if (el) { el.style.display='flex'; el.classList.remove('hidden'); } }
function hideLoader() { const el = document.getElementById('loadingOverlay'); if (el) el.classList.add('hidden'); setTimeout(() => { if (el) el.style.display='none'; }, 400); }
function showError(msg) { const el = document.getElementById('errorBanner'); if (el) { el.textContent = msg; el.classList.add('show'); } }
function clearError() { const el = document.getElementById('errorBanner'); if (el) el.classList.remove('show'); }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function fmtTime(d) {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' });
}

function degreesToDir(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function beaufortScale(ms) {
  if (ms < 0.5) return 0;
  if (ms < 1.6) return 1;
  if (ms < 3.4) return 2;
  if (ms < 5.5) return 3;
  if (ms < 8.0) return 4;
  if (ms < 10.8) return 5;
  if (ms < 13.9) return 6;
  if (ms < 17.2) return 7;
  if (ms < 20.8) return 8;
  if (ms < 24.5) return 9;
  if (ms < 28.5) return 10;
  if (ms < 32.7) return 11;
  return 12;
}

function uvLabel(uv) {
  if (uv < 3) return '🟢 Low';
  if (uv < 6) return '🟡 Moderate';
  if (uv < 8) return '🟠 High';
  if (uv < 11) return '🔴 Very High';
  return '🟣 Extreme';
}

function estimateUV(cur) {
  const hour = new Date().getUTCHours();
  const noon = 12;
  const diff = Math.abs(hour - noon);
  const timeFactor = Math.max(0, 1 - diff / 6);
  const cloudFactor = 1 - (cur.clouds.all / 100) * 0.75;
  return Math.min(11, timeFactor * cloudFactor * 10);
}

function weatherEmoji(id, icon) {
  const night = icon && icon.endsWith('n');
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 510) return '🌧️';
  if (id === 511) return '🌨️';
  if (id >= 511 && id < 600) return '🌧️';
  if (id >= 600 && id < 700) return '❄️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800) return night ? '🌙' : '☀️';
  if (id === 801) return night ? '🌤️' : '🌤️';
  if (id === 802) return '⛅';
  if (id >= 803) return '☁️';
  return '🌡️';
}