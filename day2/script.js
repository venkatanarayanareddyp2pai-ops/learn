const ALL_QUESTIONS = [
  {
    category: "Maths",
    text: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    answer: 1,
  },
  {
    category: "Maths",
    text: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
    options: ["70 km/h", "75 km/h", "80 km/h", "90 km/h"],
    answer: 2,
  },
  {
    category: "Maths",
    text: "If you add all integers from 1 to 10, what do you get?",
    options: ["45", "50", "55", "60"],
    answer: 2,
  },
  {
    category: "Maths",
    text: "What is the next number in the series: 2, 4, 8, 16, ___?",
    options: ["18", "24", "32", "64"],
    answer: 2,
  },

  {
    category: "Logical",
    text: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
    options: ["Yes", "No", "Maybe", "Cannot determine"],
    answer: 0,
  },
  {
    category: "Logical",
    text: "You have a 3L jug and a 5L jug. How do you measure exactly 4 litres?",
    options: [
      "Fill 5L, pour into 3L, empty 3L, pour remaining into 3L, fill 5L again, top up 3L",
      "Fill both jugs halfway",
      "Fill 3L twice and remove 2L",
      "It's impossible"
    ],
    answer: 0,
  },
  {
    category: "Logical",
    text: "A is B's sister. B is C's brother. C is D's son. How is A related to D?",
    options: ["Daughter", "Niece", "Sister", "Granddaughter"],
    answer: 0,
  },
  {
    category: "Logical",
    text: "Which shape comes next in the pattern: ▲ ■ ▲ ■ ▲ ___?",
    options: ["▲", "■", "●", "★"],
    answer: 1,
  },

  {
    category: "JavaScript",
    text: "Which keyword declares a variable that can't be reassigned?",
    options: ["var", "let", "const", "fixed"],
    answer: 2,
  },
  {
    category: "JavaScript",
    text: "What will this print?",
    code: `const nums = [1, 2, 3];
console.log(nums.length);`,
    options: ["0", "2", "3", "4"],
    answer: 2,
  },
  {
    category: "JavaScript",
    text: "How do you write a comment in JavaScript?",
    options: ["# This is a comment", "<!-- comment -->", "// This is a comment", "** comment **"],
    answer: 2,
  },
  {
    category: "JavaScript",
    text: "What does this arrow function return?",
    code: `const double = n => n * 2;
console.log(double(7));`,
    options: ["7", "9", "14", "undefined"],
    answer: 2,
  }
];

let questions = [];
let current   = 0;
let score     = 0;
let answered  = false;
let timerID   = null;
let timeLeft  = 15;
let totalTime = 0;
let results   = [];

const TIMER_MAX   = 15;
const CIRCUMF     = 2 * Math.PI * 21; // ≈ 131.95

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function startQuiz() {
  questions = shuffle(ALL_QUESTIONS);
  current   = 0;
  score     = 0;
  results   = [];
  totalTime = 0;
  showScreen('quizScreen');
  renderQuestion();
}

function showStart() {
  showScreen('startScreen');
}

function renderQuestion() {
  const q = questions[current];
  answered = false;

  $('qNum').textContent = current + 1;
  $('livScore').textContent = `Score: ${score}`;
  $('progressFill').style.width = `${(current / questions.length) * 100}%`;
  $('qCategory').textContent = q.category;
  $('qText').textContent = q.text;

  if (q.code) {
    $('qCode').style.display = 'block';
    $('qCode').textContent = q.code;
  } else {
    $('qCode').style.display = 'none';
  }

  const letters = ['A', 'B', 'C', 'D'];
  $('optionsList').innerHTML = q.options.map((opt, i) => `
    <div class="option" id="opt${i}" onclick="selectAnswer(${i})">
      <div class="opt-letter">${letters[i]}</div>
      <span>${opt}</span>
      <span class="opt-icon" id="icon${i}"></span>
    </div>
  `).join('');

  $('feedback').className = 'feedback';
  $('feedback').innerHTML = '';
  $('nextWrap').classList.remove('show');

  startTimer();
}

function startTimer() {
  clearInterval(timerID);
  timeLeft = TIMER_MAX;
  updateTimerUI();

  timerID = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timerID);
      timeExpired();
    }
  }, 1000);
}

function updateTimerUI() {
  $('timerNum').textContent = timeLeft;

  // Arc
  const arc   = $('timerArc');
  const ratio = timeLeft / TIMER_MAX;
  arc.style.strokeDashoffset = CIRCUMF * (1 - ratio);

  arc.classList.remove('warning', 'danger');
  if (timeLeft <= 5) arc.classList.add('danger');
  else if (timeLeft <= 8) arc.classList.add('warning');
}

function timeExpired() {
  if (answered) return;
  answered = true;
  const elapsed = TIMER_MAX - timeLeft;
  totalTime += elapsed;
  results.push({ q: questions[current], chosen: -1, correct: false, time: elapsed });

  const correctIdx = questions[current].answer;
  $(`opt${correctIdx}`).classList.add('reveal');
  document.querySelectorAll('.option').forEach(o => o.classList.add('disabled'));

  showFeedback(false, questions[current].explanation, true);
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;
  clearInterval(timerID);

  const elapsed  = TIMER_MAX - timeLeft;
  totalTime     += elapsed;
  const q        = questions[current];
  const isCorrect = idx === q.answer;

  if (isCorrect) {
    score++;
    $(`opt${idx}`).classList.add('correct');
  } else {
    $(`opt${idx}`).classList.add('wrong');
    $(`opt${q.answer}`).classList.add('reveal');
  }

  document.querySelectorAll('.option').forEach(o => o.classList.add('disabled'));
  results.push({ q, chosen: idx, correct: isCorrect, time: elapsed });
  $('livScore').textContent = `Score: ${score}`;
  showFeedback(isCorrect, q.explanation);
}

function showFeedback(isCorrect, explanation, timeout = false) {
  const fb = $('feedback');

  if(timeout){
    fb.innerHTML = "⏱ Time's up!";
  }else if(isCorrect){
    fb.innerHTML = "Correct answer!";
  }else{
    fb.innerHTML = "Wrong answer!";
  }

  fb.className = `feedback show${isCorrect ? '' : ' wrong-fb'}`;
  $('nextWrap').classList.add('show');
}

function nextQuestion() {
  current++;
  if (current >= questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  showScreen('resultsScreen');

  const pct      = Math.round((score / questions.length) * 100);
  const avgTime  = Math.round(totalTime / questions.length);
  const wrong    = questions.length - score;

  setTimeout(() => {
    $('resultRing').style.strokeDashoffset = 440 * (1 - pct / 100);
  }, 100);

  $('scorePct').textContent = pct + '%';
  $('bdCorrect').textContent = score;
  $('bdWrong').textContent   = wrong;
  $('bdTime').textContent    = avgTime + 's';

  $('reviewList').innerHTML = results.map(({ q, chosen, correct }, i) => `
    <div class="review-item">
      <div class="review-dot ${correct ? 'c' : 'w'}"></div>
      <div>
        <div style="font-weight:700;margin-bottom:2px">${i+1}. ${q.text}</div>
        <div style="color:var(--muted);font-size:13px">
          ${correct
            ? ` ${q.options[q.answer]}`
            : chosen === -1
              ? ` Time expired · Answer: ${q.options[q.answer]}`
              : ` You chose: ${q.options[chosen]} · Answer: ${q.options[q.answer]}`
          }
        </div>
      </div>
    </div>
  `).join('');
}