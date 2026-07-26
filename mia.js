function openGift() {
  document.getElementById("content").innerHTML = `
    <h2>🎁 Surprise untuk awak!</h2>
    <p>Awak adalah hadiah paling berharga dalam hidup saya 💕</p>
    <img src="mias-photo.jpeg" alt="Mia" style="width:100%;border-radius:15px;">
  `;
  startConfetti();
}

function openGallery() {
  document.getElementById("content").innerHTML = `
    <h2>📸 Galeri Kenangan</h2>
    <p>Setiap gambar ni ada cerita yang buat saya senyum 😊</p>
    <img src="spotify.jpeg" alt="Kenangan" style="width:100%;border-radius:15px;">
  `;
}

function openNote() {
  document.getElementById("content").innerHTML = `
    <h2>💌 Nota Cinta</h2>
    <p>Terima kasih sebab sentiasa ada untuk saya. Awaklah sebab saya percaya pada cinta sejati 💖</p>
  `;
}

function openFutureLetter() {
  document.getElementById("content").innerHTML = `
    <h2>📜 Surat Masa Depan</h2>
    <p id="letter"></p>
  `;
  const text = "5 tahun lagi, saya harap kita masih bersama, lebih kuat, lebih bahagia, dan sentiasa saling menyokong 💕";
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      document.getElementById("letter").innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
  typeWriter();
}

function openWishBoard() {
  document.getElementById("content").innerHTML = `
    <h2>🌟 Wish Board</h2>
    <div class="wish">🎉 "Happy Birthday Mia! Semoga panjang umur." - Aisyah</div>
    <div class="wish">💖 "Mia, semoga sentiasa ceria dan berjaya." - Farah</div>
    <div class="wish">🌹 "Selamat hari lahir! Stay awesome." - Amir</div>
  `;
}

function openGame() {
  document.getElementById("content").innerHTML = `
    <h2>🎮 Catch the Hearts</h2>
    <p>Klik hati yang jatuh untuk kumpul point!</p>
    <div id="gameArea" style="position:relative;width:100%;height:300px;background:#fff;border-radius:10px;overflow:hidden;"></div>
    <p>Score: <span id="score">0</span></p>
  `;
  let score = 0;
  const gameArea = document.getElementById("gameArea");

  function createHeart() {
    const heart = document.createElement("div");
    heart.innerHTML = "💖";
    heart.style.position = "absolute";
    heart.style.left = Math.random() * (gameArea.offsetWidth - 30) + "px";
    heart.style.top = "0px";
    heart.style.fontSize = "24px";
    heart.style.cursor = "pointer";
    gameArea.appendChild(heart);

    heart.onclick = () => {
      score++;
      document.getElementById("score").innerText = score;
      heart.remove();
      if (score >= 5) {
        document.getElementById("content").innerHTML += `<p>Awak dah menang hati saya selamanya 💕</p>`;
      }
    };

    let fall = setInterval(() => {
      heart.style.top = parseInt(heart.style.top) + 5 + "px";
      if (parseInt(heart.style.top) > gameArea.offsetHeight - 20) {
        heart.remove();
        clearInterval(fall);
      }
    }, 100);
  }

  setInterval(createHeart, 1000);
}

function playMusic() {
  document.getElementById("content").innerHTML = `
    <h2>🎶 Lagu untuk awak</h2>
    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC?utm_source=generator" 
      width="100%" height="152" frameBorder="0" allowfullscreen="" 
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
  `;
}

// Confetti animation
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettis = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 0.5 + 0.5,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettis.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    update();
  }

  function update() {
    confettis.forEach(c => {
      c.y += c.d;
      if (c.y > canvas.height) {
        c.y = 0;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  setInterval(draw, 20);
}
function openTimeline() {
  document.getElementById("content").innerHTML = `
    <h2>🕰️ Kenangan Bersama</h2>
    <ul style="text-align:left;">
      <li>💖 2024 - Hari pertama kita berkenalan</li>
      <li>🍦 2025 - First date makan ice cream</li>
      <li>🎬 2025 - Tengok movie favourite sama-sama</li>
      <li>🎂 2026 - Birthday Mia yang paling special</li>
    </ul>
  `;
}
