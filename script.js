/**
 * ==========================================================================
 * KHOMARUL & HANFARA — OUR ETERNAL UNIVERSE
 * script.js — Interaktivitas Premium, Shooting Stars & Logika Realtime
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     KONFIGURASI UTAMA
     ========================================================================== */
  const CONFIG = {
    // Tanggal jadian: 22 Agustus 2026
    startDate: new Date(2026, 7, 22, 0, 0, 0),

    // Nama Pasangan
    groomName: "Khomarul Hidayat",
    brideName: "Hanfara Lovisya",

    // Konfigurasi Bintang & Meteor
    starCount: 160,
    shootingStarIntervalMs: 3800,
    heartIntervalMs: 2000
  };

  /* ==========================================================================
     1. COSMIC STARRY SKY & SHOOTING STARS (METEOR JATUH)
     ========================================================================== */
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let stars = [];
  let shootingStars = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function initStars() {
    stars = [];
    const count = window.innerWidth < 768 ? Math.floor(CONFIG.starCount * 0.55) : CONFIG.starCount;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        twinkleFactor: Math.random() * 0.03 + 0.01,
        increasing: Math.random() > 0.5,
        color: Math.random() > 0.25 ? '#ffffff' : '#ffd1dc'
      });
    }
  }

  // Membuat Shooting Star (Meteor)
  function createShootingStar() {
    if (shootingStars.length > 2) return;
    const startX = Math.random() * width * 0.8 + width * 0.1;
    const startY = Math.random() * height * 0.3;
    const length = Math.random() * 90 + 70;
    const speed = Math.random() * 6 + 7;
    const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // Diagonally downward

    shootingStars.push({
      x: startX,
      y: startY,
      len: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      alpha: 1.0,
      life: 0,
      maxLife: 45
    });
  }

  setInterval(createShootingStar, CONFIG.shootingStarIntervalMs);

  function drawCosmos() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // 1. Gambar Bintang Berkedip
    stars.forEach(star => {
      if (star.increasing) {
        star.alpha += star.twinkleFactor;
        if (star.alpha >= 1) star.increasing = false;
      } else {
        star.alpha -= star.twinkleFactor;
        if (star.alpha <= 0.12) star.increasing = true;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.shadowBlur = star.radius * 3.5;
      ctx.shadowColor = 'rgba(255, 182, 193, 0.7)';
      ctx.fill();
    });

    // 2. Gambar Shooting Stars (Meteor Luminous)
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.x += s.dx;
      s.y += s.dy;
      s.life++;
      s.alpha = Math.max(0, 1 - (s.life / s.maxLife));

      // Gradien ekor meteor
      const tailX = s.x - (s.dx * (s.len / s.speed));
      const tailY = s.y - (s.dy * (s.len / s.speed));

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'rgba(255, 117, 143, 0)');
      grad.addColorStop(0.7, `rgba(255, 182, 193, ${s.alpha * 0.6})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#fff';
      ctx.stroke();

      if (s.life >= s.maxLife || s.x > width || s.y > height) {
        shootingStars.splice(i, 1);
      }
    }

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
    requestAnimationFrame(drawCosmos);
  }

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  if (canvas) {
    initStars();
    drawCosmos();
  }

  /* ==========================================================================
     2. CURSOR STARLIGHT GLOW (DESKTOP)
     ========================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.innerWidth > 992) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  /* ==========================================================================
     3. FLOATING AMBIENT HEARTS & TAP HEARTS
     ========================================================================== */
  const heartsContainer = document.getElementById('floating-hearts-container');
  const heartIcons = ['❤️', '💖', '💕', '💗', '🌸', '✨'];

  function createFloatingHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement('span');
    heart.className = 'floating-heart-particle';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

    const leftPos = Math.random() * 100;
    const fontSize = Math.random() * 14 + 14;
    const duration = Math.random() * 6 + 7;

    heart.style.left = `${leftPos}vw`;
    heart.style.fontSize = `${fontSize}px`;
    heart.style.animationDuration = `${duration}s`;

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), duration * 1000);
  }

  setInterval(createFloatingHeart, CONFIG.heartIntervalMs);

  // Efek Ketuk Layar (Tap/Click Hearts Burst)
  document.addEventListener('click', (e) => {
    if (e.target.closest('#music-player-widget') || e.target.closest('.lightbox-close') || e.target.closest('.btn-like-photo')) return;

    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * 4)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 850);
  });

  /* ==========================================================================
     4. OPENING SCREEN & ENTRY ANIMATION
     ========================================================================== */
  const openingScreen = document.getElementById('opening-screen');
  const btnEnter = document.getElementById('btn-enter');
  const mainWrapper = document.getElementById('main-wrapper');

  if (btnEnter && openingScreen) {
    btnEnter.addEventListener('click', () => {
      // Ledakan 20 hati kecil saat tombol diklik
      for (let i = 0; i < 20; i++) {
        setTimeout(createFloatingHeart, i * 60);
      }

      openingScreen.classList.add('fade-out');
      if (mainWrapper) {
        mainWrapper.classList.remove('is-locked');
      }

      playAudio();

      setTimeout(() => {
        openingScreen.style.display = 'none';
      }, 1200);
    });
  }

  /* ==========================================================================
     5. LIVE RELATIONSHIP COUNTER
     ========================================================================== */
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateRelationshipCounter() {
    const now = new Date();
    let diff = now.getTime() - CONFIG.startDate.getTime();

    if (diff < 0) {
      diff = Math.abs(diff);
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (daysEl) daysEl.textContent = days.toLocaleString();
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateRelationshipCounter();
  setInterval(updateRelationshipCounter, 1000);

  /* ==========================================================================
     6. REASONS WHY I LOVE YOU GENERATOR (INTERAKTIF)
     ========================================================================== */
  const reasonsList = [
    "Senyuman manismu selalu berhasil membuat hari yang lelah terasa tenang dan penuh harapan.",
    "Caramu mendengarkan ceritaku dengan penuh perhatian tanpa pernah menghakimi.",
    "Tawamu yang begitu lepas, melodi paling indah yang selalu ingin aku dengar setiap hari.",
    "Kebaikan hatimu dan ketulusanmu yang membuatku selalu ingin menjadi pribadi yang lebih baik.",
    "Binar matamu saat menceritakan hal-hal yang kamu sukai dengan penuh semangat.",
    "Cara kita saling menguatkan di saat salah satu dari kita sedang merasa rapuh.",
    "Kehangatan pelukan dan genggaman tanganmu yang membuat dunia terasa aman.",
    "Setiap candaan konyol kita yang hanya bisa dipahami oleh kita berdua.",
    "Kesabaranmu yang luar biasa dan caramu selalu menenangkan hatiku.",
    "Karena bersamamu, aku merasa pulang dan menemukan rumah ternyaman di dunia."
  ];

  const reasonsText = document.getElementById('reasons-text');
  const reasonsNumber = document.getElementById('reasons-number');
  const btnNextReason = document.getElementById('btn-next-reason');
  let currentReasonIndex = 0;

  if (btnNextReason && reasonsText && reasonsNumber) {
    btnNextReason.addEventListener('click', () => {
      reasonsText.style.opacity = '0';
      reasonsNumber.style.opacity = '0';

      setTimeout(() => {
        currentReasonIndex = (currentReasonIndex + 1) % reasonsList.length;
        reasonsText.textContent = `“${reasonsList[currentReasonIndex]}”`;
        reasonsNumber.textContent = `Alasan #${currentReasonIndex + 1}`;
        reasonsText.style.opacity = '1';
        reasonsNumber.style.opacity = '1';
      }, 300);
    });
  }

  /* ==========================================================================
     7. GALLERY LIGHTBOX & INTERACTIVE LIKE BUTTONS
     ========================================================================== */
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxSub = document.getElementById('lightbox-sub');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryCards.forEach((card, idx) => {
    const imgEl = card.querySelector('img');
    const likeBtn = card.querySelector('.btn-like-photo');
    const likeCountSpan = card.querySelector('.like-count');
    const likeHeartSpan = card.querySelector('.like-heart');

    galleryData.push({
      src: imgEl ? imgEl.src : '',
      alt: imgEl ? imgEl.alt : '',
      caption: card.getAttribute('data-caption') || 'Our Moment',
      sub: card.getAttribute('data-sub') || ''
    });

    // Buka Lightbox saat gambar/kartu diklik
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-like-photo')) return;
      openLightbox(idx);
    });

    // Like Button Interaction
    if (likeBtn) {
      let isLiked = false;
      let count = 1;
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isLiked = !isLiked;
        if (isLiked) {
          count++;
          likeBtn.classList.add('is-liked');
          likeHeartSpan.textContent = '💖';
          createFloatingHeart();
        } else {
          count--;
          likeBtn.classList.remove('is-liked');
          likeHeartSpan.textContent = '🤍';
        }
        likeCountSpan.textContent = count;
      });
    }

    // 3D Card Tilt pada Desktop
    if (window.innerWidth > 992) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }
  });

  function openLightbox(index) {
    if (!lightboxModal || !galleryData[index]) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryData[currentGalleryIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
    if (lightboxCaption) lightboxCaption.textContent = item.caption;
    if (lightboxSub) lightboxSub.textContent = item.sub;
    if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });

  /* ==========================================================================
     8. LOVE LETTER (AMPLOP 3D & WAX SEAL)
     ========================================================================== */
  const envelopeBox = document.getElementById('envelope-box');
  const btnCloseEnvelope = document.getElementById('btn-close-envelope');
  const envHint = document.getElementById('env-hint');

  function toggleEnvelope() {
    if (!envelopeBox) return;
    const isOpen = envelopeBox.classList.toggle('is-open');

    if (isOpen) {
      if (envHint) envHint.textContent = "Surat telah terbuka dengan segenap cinta 💌";
      if (btnCloseEnvelope) btnCloseEnvelope.style.display = 'inline-block';
      // Burst sparkling hearts
      for (let i = 0; i < 8; i++) setTimeout(createFloatingHeart, i * 90);
    } else {
      if (envHint) envHint.textContent = "Ketuk amplop di atas untuk membaca surat cinta ✨";
      if (btnCloseEnvelope) btnCloseEnvelope.style.display = 'none';
    }
  }

  if (envelopeBox) {
    envelopeBox.addEventListener('click', toggleEnvelope);
    envelopeBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleEnvelope();
      }
    });
  }

  if (btnCloseEnvelope) {
    btnCloseEnvelope.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEnvelope();
    });
  }

  /* ==========================================================================
     9. VIRTUAL HUG / SEND LOVE INTERACTION
     ========================================================================== */
  const btnSendHug = document.getElementById('btn-send-hug');
  const hugCountNum = document.getElementById('hug-count-num');
  let hugCount = 128;

  if (btnSendHug && hugCountNum) {
    btnSendHug.addEventListener('click', (e) => {
      hugCount++;
      hugCountNum.textContent = hugCount;

      // Burst efek cinta di layar
      for (let i = 0; i < 15; i++) {
        setTimeout(createFloatingHeart, i * 70);
      }

      // Animasi tombol pop
      btnSendHug.style.transform = 'scale(0.92)';
      setTimeout(() => {
        btnSendHug.style.transform = 'scale(1)';
      }, 180);
    });
  }

  /* ==========================================================================
     10. MUSIC PLAYER CONTROLLER & VISUALIZER
     ========================================================================== */
  const audio = document.getElementById('bg-audio');
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const heroMusicBtn = document.getElementById('hero-music-btn');
  const heroMusicText = document.getElementById('hero-music-text');
  const musicBtnIcon = document.getElementById('music-btn-icon');
  const musicDisc = document.getElementById('music-disc');
  const musicStatus = document.getElementById('music-status');
  const soundwaveBars = document.getElementById('soundwave-bars');
  let isPlaying = false;

  function updateMusicUI(playing) {
    isPlaying = playing;
    if (playing) {
      if (musicBtnIcon) musicBtnIcon.textContent = '⏸';
      if (musicDisc) musicDisc.classList.add('is-spinning');
      if (musicStatus) musicStatus.textContent = 'Memutar Lagu';
      if (soundwaveBars) soundwaveBars.classList.add('is-active');
      if (heroMusicText) heroMusicText.textContent = 'Jeda Lagu';
    } else {
      if (musicBtnIcon) musicBtnIcon.textContent = '▶';
      if (musicDisc) musicDisc.classList.remove('is-spinning');
      if (musicStatus) musicStatus.textContent = 'Musik Dijeda';
      if (soundwaveBars) soundwaveBars.classList.remove('is-active');
      if (heroMusicText) heroMusicText.textContent = 'Putar Lagu Kita';
    }
  }

  function playAudio() {
    if (!audio) return;
    audio.volume = 0.85;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateMusicUI(true);
        })
        .catch((err) => {
          console.warn("Autoplay browser diblokir sebelum interaksi:", err);
          updateMusicUI(false);
        });
    }
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
    updateMusicUI(false);
  }

  if (btnMusicToggle) {
    btnMusicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  if (heroMusicBtn) {
    heroMusicBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  /* ==========================================================================
     11. SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll(
    '.story-card, .counter-card, .gallery-card, .timeline-item, .envelope-box, .hug-card, .closing-container'
  );

  revealElements.forEach(el => el.classList.add('fade-in-element'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

});
