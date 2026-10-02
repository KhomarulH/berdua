/**
 * ==========================================================================
 * KHOMARUL & HANFARA — ROMANTIC COUPLE WEBSITE
 * script.js — Interaktivitas, Animasi & Logika Realtime
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     KONFIGURASI UTAMA [EDIT DI SINI DENGAN MUDAH]
     ========================================================================== */
  const CONFIG = {
    // Tanggal jadian / awal cerita: 22 Agustus 2026 (Format: Tahun, Bulan [0-11], Tanggal, Jam, Menit, Detik)
    // Catatan: Bulan Agustus = index 7 (Januari=0, Februari=1, ..., Agustus=7)
    startDate: new Date(2026, 7, 22, 0, 0, 0),

    // Nama Pasangan
    groomName: "Khomarul Hidayat",
    brideName: "Hanfara Lovisya",

    // Informasi Lagu
    songTitle: "Khomarul & Hanfara — Our Song",

    // Pengaturan Animasi
    starCount: 130, // Jumlah bintang di langit malam
    heartIntervalMs: 2200 // Jarak kemunculan hati melayang (milidetik)
  };

  /* ==========================================================================
     1. BACKGROUND STARS & DUST CANVAS (Bintang Berkedip Random)
     ========================================================================== */
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let stars = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function initStars() {
    stars = [];
    const count = window.innerWidth < 768 ? Math.floor(CONFIG.starCount * 0.6) : CONFIG.starCount;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        twinkleFactor: Math.random() * 0.03 + 0.01,
        increasing: Math.random() > 0.5,
        color: Math.random() > 0.3 ? '#ffffff' : '#ffd1dc' // Kombinasi putih dan pink muda
      });
    }
  }

  function drawStars() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      // Logika kelap-kelip lembut
      if (star.increasing) {
        star.alpha += star.twinkleFactor;
        if (star.alpha >= 1) star.increasing = false;
      } else {
        star.alpha -= star.twinkleFactor;
        if (star.alpha <= 0.15) star.increasing = true;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.shadowBlur = star.radius * 4;
      ctx.shadowColor = 'rgba(255, 182, 193, 0.8)';
      ctx.fill();
    });

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  if (canvas) {
    initStars();
    drawStars();
  }

  /* ==========================================================================
     2. FLOATING HEARTS (Hati Kecil Melayang dari Bawah ke Atas)
     ========================================================================== */
  const heartsContainer = document.getElementById('floating-hearts-container');
  const heartIcons = ['❤️', '💖', '💕', '💗', '🌸', '✨'];

  function createFloatingHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement('span');
    heart.className = 'floating-heart-particle';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

    // Acak posisi horizontal, ukuran, dan durasi terbang
    const leftPos = Math.random() * 100;
    const fontSize = Math.random() * 14 + 14; // 14px - 28px
    const duration = Math.random() * 6 + 7;   // 7s - 13s

    heart.style.left = `${leftPos}vw`;
    heart.style.fontSize = `${fontSize}px`;
    heart.style.animationDuration = `${duration}s`;

    heartsContainer.appendChild(heart);

    // Hapus elemen setelah animasi selesai agar memori tetap ringan
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  setInterval(createFloatingHeart, CONFIG.heartIntervalMs);

  /* Efek Klik Muncul Hati (Interactive Tap Heart) */
  document.addEventListener('click', (e) => {
    // Jangan muncul jika klik tombol play musik atau tutup modal
    if (e.target.closest('#music-player-widget') || e.target.closest('.lightbox-close')) return;

    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * 4)];
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 900);
  });

  /* ==========================================================================
     3. OPENING SCREEN & ENTRY INTERACTION
     ========================================================================== */
  const openingScreen = document.getElementById('opening-screen');
  const btnEnter = document.getElementById('btn-enter');
  const mainWrapper = document.getElementById('main-wrapper');

  if (btnEnter && openingScreen) {
    btnEnter.addEventListener('click', () => {
      // Efek ledakan partikel cinta kecil
      for (let i = 0; i < 18; i++) {
        setTimeout(createFloatingHeart, i * 80);
      }

      // Animasi transisi membuka halaman utama
      openingScreen.classList.add('fade-out');
      if (mainWrapper) {
        mainWrapper.classList.remove('is-locked');
      }

      // Mainkan musik otomatis setelah interaksi klik
      playAudio();

      // Hapus opening screen dari DOM setelah animasi selesai
      setTimeout(() => {
        openingScreen.style.display = 'none';
      }, 1200);
    });
  }

  /* ==========================================================================
     4. RELATIONSHIP COUNTER (Menghitung Waktu Hubungan Realtime)
     ========================================================================== */
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateRelationshipCounter() {
    const now = new Date();
    let diff = now.getTime() - CONFIG.startDate.getTime();

    // Jika waktu masih sebelum tanggal mulai (misal testing di masa depan)
    if (diff < 0) {
      diff = Math.abs(diff); // Tampilkan countdown positif
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
     5. GALLERY & FULLSCREEN LIGHTBOX
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

  // Kumpulkan data gambar dan caption
  galleryCards.forEach((card, idx) => {
    const imgEl = card.querySelector('img');
    galleryData.push({
      src: imgEl ? imgEl.src : '',
      alt: imgEl ? imgEl.alt : '',
      caption: card.getAttribute('data-caption') || 'Our Moment',
      sub: card.getAttribute('data-sub') || ''
    });

    card.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  function openLightbox(index) {
    if (!lightboxModal || !galleryData[index]) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // Kunci scroll halaman belakang
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

  // Navigasi Keyboard (ESC untuk tutup, Panah Kiri/Kanan)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });

  /* ==========================================================================
     6. LOVE LETTER (Amplop Digital Interaktif)
     ========================================================================== */
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const btnToggleLetter = document.getElementById('btn-toggle-letter');
  const envelopeStatusText = document.getElementById('envelope-status-text');

  function toggleEnvelope() {
    if (!envelopeWrapper) return;
    const isOpen = envelopeWrapper.classList.toggle('is-open');

    if (isOpen) {
      if (envelopeStatusText) envelopeStatusText.textContent = "Surat telah dibuka dengan penuh cinta 💌";
      if (btnToggleLetter) btnToggleLetter.style.display = 'inline-block';
    } else {
      if (envelopeStatusText) envelopeStatusText.textContent = "Klik amplop di atas untuk membaca ✨";
      if (btnToggleLetter) btnToggleLetter.style.display = 'none';
    }
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', toggleEnvelope);
    envelopeWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleEnvelope();
      }
    });
  }

  if (btnToggleLetter) {
    btnToggleLetter.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEnvelope();
    });
  }

  /* ==========================================================================
     7. MUSIC PLAYER & WEB AUDIO FALLBACK (Memutar Musik Romantis)
     ========================================================================== */
  const audio = document.getElementById('bg-audio');
  const btnMusicToggle = document.getElementById('btn-music-toggle');
  const musicBtnIcon = document.getElementById('music-btn-icon');
  const musicDisc = document.getElementById('music-disc');
  const musicStatus = document.getElementById('music-status');
  let isPlaying = false;

  function updateMusicUI(playing) {
    isPlaying = playing;
    if (playing) {
      if (musicBtnIcon) musicBtnIcon.textContent = '⏸';
      if (musicDisc) musicDisc.classList.add('is-spinning');
      if (musicStatus) musicStatus.textContent = 'Memutar Musik';
    } else {
      if (musicBtnIcon) musicBtnIcon.textContent = '▶';
      if (musicDisc) musicDisc.classList.remove('is-spinning');
      if (musicStatus) musicStatus.textContent = 'Musik Dijeda';
    }
  }

  function playAudio() {
    if (!audio) return;
    audio.volume = 0.8;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateMusicUI(true);
        })
        .catch((err) => {
          console.warn("Autoplay audio browser memerlukan interaksi pengguna:", err);
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

  /* ==========================================================================
     8. SCROLL REVEAL (Animasi Elemen Saat di-Scroll)
     ========================================================================== */
  const revealElements = document.querySelectorAll(
    '.story-card, .counter-item, .gallery-card, .timeline-item, .envelope-wrapper, .closing-container'
  );

  revealElements.forEach(el => el.classList.add('fade-in-element'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

});
