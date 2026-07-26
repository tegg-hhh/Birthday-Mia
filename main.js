/* Shared page script for countdown, quiz, intro splash, and envelope reveal */
const BIRTHDAY_MONTH = 9; // October (0-based)
const BIRTHDAY_DAY = 12;
const BIRTHDAY_YEAR = 2009;

const TARGET_DATE = getNextBirthday();

function getNextBirthday() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let nextBirthday = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0);
  if (nextBirthday <= now) {
    nextBirthday = new Date(currentYear + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0);
  }
  return nextBirthday;
}

const QUESTIONS = [
  { q: "Bila first kali saya jatuh cinta kat awak?", opts: ["masa awak kenalkan diri", "masa first time kita tangkap gambar", "masa awak selalu tunjuk mini love kat saya"], correct: 2 },
  { q: "Apa makanan favourite saya?", opts: ["Roti Canai", "Ayam Goreng", "Nasi Lemak"], correct: 1 },
  { q: "Filem yang paling awal kita tengok bersama?", type: "text", answer: "Komang" },
  { q: "Lagu pertama yang saya nyanyikan untuk awak", opts: ["Pulang", "Sempurna", "Sampai Ke Hari Tua"], correct: 1 }
];

function getElement(id) {
  return document.getElementById(id);
}

function updateCountdown() {
  const heroSub = getElement('hero-sub');
  if (!heroSub) return;

  const now = new Date();
  const diff = TARGET_DATE - now;

  const dayEl = getElement('cd-days');
  const hourEl = getElement('cd-hours');
  const minEl = getElement('cd-mins');
  const secEl = getElement('cd-secs');

  if (!dayEl || !hourEl || !minEl || !secEl) return;

  if (diff <= 0) {
    dayEl.textContent = '0';
    hourEl.textContent = '0';
    minEl.textContent = '0';
    secEl.textContent = '0';
    heroSub.textContent = "Harii nii harii awakk sayangg! Happyy birthdayy Myy Bee 🎉";
    getElement('hero')?.classList.add('arrived');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  dayEl.textContent = String(days);
  hourEl.textContent = String(hours).padStart(2, '0');
  minEl.textContent = String(minutes).padStart(2, '0');
  secEl.textContent = String(seconds).padStart(2, '0');
}

function initCountdown() {
  if (!getElement('countdown')) return;
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function initQuiz() {
  const card = getElement('quiz-card');
  if (!card) return;

  let currentIndex = 0;
  let score = 0;

  function renderQuestion() {
    if (currentIndex >= QUESTIONS.length) {
      card.innerHTML = `
        <div class="q-score">${score} / ${QUESTIONS.length} betul 🎈</div>
        <div class="q-feedback">Haish nasib awakk ni comel .</div>
      `;
      return;
    }

    const item = QUESTIONS[currentIndex];
    card.innerHTML = `
      <div class="q-progress">Soalan ${currentIndex + 1} / ${QUESTIONS.length}</div>
      <div class="q-text">${item.q}</div>
      <div id="q-opts"></div>
      <div class="q-feedback" id="q-feedback"></div>
    `;

    const optsContainer = getElement('q-opts');
    if (!optsContainer) return;

    if (item.type === 'text') {
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.className = 'q-input';
      textInput.placeholder = 'Taip jawapan anda di sini';
      textInput.autocomplete = 'off';
      textInput.style.width = '100%';
      textInput.style.padding = '14px 16px';
      textInput.style.borderRadius = '14px';
      textInput.style.border = '1px solid rgba(245,235,224,0.18)';
      textInput.style.marginBottom = '12px';
      textInput.style.background = 'rgba(255,255,255,0.05)';
      textInput.style.color = 'inherit';

      const submit = document.createElement('button');
      submit.type = 'button';
      submit.className = 'q-opt';
      submit.textContent = 'Hantar jawapan';
      submit.disabled = true;
      submit.addEventListener('click', () => handleTextAnswer(textInput, submit, item));
      textInput.addEventListener('input', () => {
        submit.disabled = textInput.value.trim().length === 0;
      });
      textInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (!submit.disabled) submit.click();
        }
      });

      optsContainer.appendChild(textInput);
      optsContainer.appendChild(submit);
    } else {
      item.opts.forEach((opt, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'q-opt';
        button.dataset.index = String(index);
        button.textContent = opt;
        button.addEventListener('click', () => handleAnswer(button, item));
        optsContainer.appendChild(button);
      });
    }
  }

  function handleTextAnswer(input, submitButton, item) {
    const trimmedAnswer = input.value.trim();
    if (trimmedAnswer.length === 0) {
      return;
    }

    const allButtons = card.querySelectorAll('.q-opt');
    allButtons.forEach(el => (el.disabled = true));
    input.disabled = true;
    submitButton.disabled = true;
    const feedback = getElement('q-feedback');
    const answer = trimmedAnswer.toLowerCase();

    if (answer === item.answer.toLowerCase()) {
      score += 1;
      if (feedback) feedback.textContent = "Betul! 🎉";
    } else {
      if (feedback) feedback.textContent = `Alahai, takpela: ${item.answer}`;
    }

    setTimeout(() => {
      currentIndex += 1;
      renderQuestion();
    }, 1000);
  }

  function handleAnswer(button, item) {
    const answerIndex = Number(button.dataset.index);
    const allButtons = card.querySelectorAll('.q-opt');
    allButtons.forEach(el => (el.disabled = true));
    const feedback = getElement('q-feedback');

    if (answerIndex === item.correct) {
      button.classList.add('correct');
      score += 1;
      if (feedback) feedback.textContent = "Betul! 🎉";
    } else {
      button.classList.add('wrong');
      const correctButton = allButtons[item.correct];
      correctButton?.classList.add('correct');
      if (feedback) feedback.textContent = "Takpe saya maafkan sebab awak cantik 😄";
    }

    setTimeout(() => {
      currentIndex += 1;
      renderQuestion();
    }, 1000);
  }

  renderQuestion();
}

function initEnvelope() {
  const envelope = getElement('envelope');
  if (!envelope) return;
  const letter = getElement('letter');

  let opened = false;

  function celebrate() {
    const colors = ['#CBA35C', '#D98A94', '#F5EBE0', '#8FA283'];
    for (let i = 0; i < 40; i += 1) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3800);
    }
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');
    setTimeout(() => letter?.classList.add('show'), 350);
    celebrate();
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openEnvelope();
    }
  });
}

function initIntro() {
  const intro = getElement('intro');
  const main = getElement('main');
  const continueButton = getElement('intro-continue');
  const animatedText = getElement('intro-animate');
  if (!intro || !main || !continueButton || !animatedText) return;

  document.body.classList.add('intro-active');
  continueButton.disabled = true;

  const text = 'Happy Birthday Sayang! 🎉 Semoga panjang umur, sihat selalu, dan sentiasa bahagia. Baby sayang awak 💖';
  let index = 0;
  let timeoutId = null;

  const showMainContent = () => {
    intro.hidden = true;
    intro.style.display = 'none';
    main.style.display = '';
    document.body.classList.remove('intro-active');
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  function typeNextChar() {
    if (index < text.length) {
      animatedText.textContent += text[index];
      index += 1;
      setTimeout(typeNextChar, 80);
      return;
    }

    continueButton.disabled = false;
    continueButton.textContent = 'Teruskan';
    timeoutId = setTimeout(showMainContent, 1400);
  }

  continueButton.addEventListener('click', showMainContent);
  typeNextChar();
}

function initPage() {
  initIntro();
  initCountdown();
  initQuiz();
  initEnvelope();
}

document.addEventListener('DOMContentLoaded', initPage);
