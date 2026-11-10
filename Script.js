/* ---------- Mobile menu ---------- */
document.getElementById('navToggle').addEventListener('click', function () {
  document.getElementById('nav').classList.toggle('open');
});
document.querySelectorAll('#nav a').forEach(function (a) {
  a.addEventListener('click', function () { document.getElementById('nav').classList.remove('open'); });
});

/* ---------- Why DHI tabs ---------- */
document.querySelectorAll('#whyTabs .tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    document.querySelectorAll('#whyTabs .tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.tab-panels .panel').forEach(function (p) { p.classList.remove('active'); });
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

/* ---------- Hair restoration steps (click to highlight) ---------- */
document.querySelectorAll('#steps .step').forEach(function (step) {
  step.addEventListener('click', function () {
    document.querySelectorAll('#steps .step').forEach(function (s) { s.classList.remove('active'); });
    step.classList.add('active');
  });
});

/* ---------- Video modal (hero + surgeon) ---------- */
var modal = document.getElementById('videoModal');
var player = document.getElementById('videoPlayer');

document.querySelectorAll('.js-video').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    player.src = el.dataset.video;
    modal.classList.add('open');
    var p = player.play();
    if (p && p.catch) p.catch(function () {});
  });
});
function closeVideo() {
  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.classList.remove('open');
}
document.getElementById('videoClose').addEventListener('click', closeVideo);
modal.addEventListener('click', function (e) { if (e.target === modal) closeVideo(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideo(); });

/* ---------- Watch Real Transformations carousel ----------
   yt = YouTube ID | src = direct video URL | video = file inside /video | poster = cover image */
var clients = [
  { yt: 'v-YStVP5rMU', poster: 'images/home/transformations/janith.png', name: 'Janith Wickramage' },
  { yt: 'ghVvVFM6uFc', poster: 'images/home/transformations/nalin.png',    name: 'Nalin Perera' },
  { src: 'https://dhi.digitalmedia.lk/assets/img/home/Sanka%20Dineth%202.mp4', poster: 'images/home/transformations/sanka.webp', name: 'Sanka Dineth' },
  { video: 'Clip 1.mp4',  name: 'Client Result 1' },
  { video: 'Clip 2.mp4',  name: 'Client Result 2' },
  { video: 'Clip 3.mp4',  name: 'Client Result 3' },
  { video: 'Clip 4.mp4',  name: 'Client Result 4' },
  { video: 'Clip 5.mp4',  name: 'Client Result 5' },
  { video: 'Clip 6.mp4',  name: 'Client Result 6' },
  { video: 'Clip 7.mp4',  name: 'Client Result 7' },
  { video: 'Clip 8.mp4',  name: 'Client Result 8' },
  { video: 'Clip 9.mp4',  name: 'Client Result 9' },
  { video: 'Clip 10.mp4', name: 'Client Result 10' }
];

var stage = document.getElementById('tStage');
var dots = document.getElementById('tDots');
var current = 0;
var cards = [];

function startYt(card, c) {
  if (card.querySelector('iframe')) return;
  var f = document.createElement('iframe');
  f.className = 't-yt';
  f.src = 'https://www.youtube.com/embed/' + c.yt + '?autoplay=1&rel=0&playsinline=1';
  f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
  f.setAttribute('allowfullscreen', '');
  f.title = c.name;
  card.appendChild(f);
  card.classList.add('playing');
}
function stopYt(card) {
  var f = card.querySelector('iframe');
  if (f) f.remove();
  card.classList.remove('playing');
}

clients.forEach(function (c, i) {
  var card = document.createElement('div');
  card.className = 't-card';
  var media;
  if (c.yt) {
    media = '<img class="t-poster" src="' + encodeURI(c.poster) + '" alt="" onerror="this.style.display=\'none\'">';
  } else {
    var src = c.src ? c.src : 'video/' + encodeURIComponent(c.video);
    var poster = c.poster ? ' poster="' + encodeURI(c.poster) + '"' : '';
    media = '<video playsinline preload="metadata"' + poster + ' src="' + src + '#t=1.5"></video>';
  }
  card.innerHTML = media +
    '<span class="t-badge">REAL CLIENT</span>' +
    '<button type="button" class="t-play" aria-label="Play ' + c.name + '"><i class="fa-solid fa-play"></i></button>';

  var v = card.querySelector('video');
  card.addEventListener('click', function (e) {
    if (i !== current) { go(i, true); return; }
    if (e.target.closest('.t-play')) { if (v) v.play(); else startYt(card, c); }
  });
  if (v) {
    v.addEventListener('play',  function () { card.classList.add('playing'); });
    v.addEventListener('pause', function () { card.classList.remove('playing'); });
    v.addEventListener('ended', function () { card.classList.remove('playing'); if (i < clients.length - 1) go(i + 1, true); });
  }
  stage.appendChild(card);
  cards.push(card);

  var dot = document.createElement('span');
  dot.addEventListener('click', function () { go(i, false); });
  dots.appendChild(dot);
});

function layout() {
  var w = cards[0].offsetWidth, gap = w * 0.72;
  cards.forEach(function (card, i) {
    var d = i - current, a = Math.abs(d), v = card.querySelector('video');
    var scale = 1 - Math.min(a, 3) * 0.14;
    var shift = d * gap - (d > 0 ? 1 : d < 0 ? -1 : 0) * Math.max(a - 1, 0) * w * 0.28;
    card.style.transform = 'translateX(calc(-50% + ' + shift + 'px)) scale(' + scale + ')';
    card.style.zIndex = 20 - a;
    card.style.opacity = a > 2 ? 0 : 1;
    card.style.pointerEvents = a > 2 ? 'none' : 'auto';
    card.classList.toggle('active', d === 0);
    if (v) { v.controls = (d === 0); if (d !== 0) v.pause(); }
    else if (d !== 0) stopYt(card);
  });
  document.getElementById('tName').textContent = clients[current].name;
  document.getElementById('tCount').textContent = (current + 1) + ' / ' + clients.length + ' · DHI Sri Lanka';
  dots.querySelectorAll('span').forEach(function (d, i) { d.classList.toggle('on', i === current); });
}

function go(i, autoplay) {
  current = (i + clients.length) % clients.length;
  layout();
  if (autoplay) {
    var card = cards[current], v = card.querySelector('video');
    if (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    else startYt(card, clients[current]);
  }
}

document.getElementById('tPrev').addEventListener('click', function () { go(current - 1, false); });
document.getElementById('tNext').addEventListener('click', function () { go(current + 1, false); });

/* swipe */
var sx = null;
stage.addEventListener('pointerdown', function (e) { sx = e.clientX; });
stage.addEventListener('pointerup', function (e) {
  if (sx === null) return;
  var dx = e.clientX - sx; sx = null;
  if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1), false);
});

window.addEventListener('resize', layout);
layout();

/* ---------- Google reviews arrows ---------- */
var track = document.getElementById('rvTrack');
function rvStep() { return track.querySelector('.rv-card').offsetWidth + 22; }
document.getElementById('rvPrev').addEventListener('click', function () { track.scrollBy({ left: -rvStep(), behavior: 'smooth' }); });
document.getElementById('rvNext').addEventListener('click', function () { track.scrollBy({ left: rvStep(), behavior: 'smooth' }); });

/* ---------- Google review popup ---------- */
var rvModal = document.getElementById('rvModal');
document.body.appendChild(rvModal);
var rvLast = null;

function openReview(card) {
  rvLast = card;
  var photo = card.querySelector('.rv-photo');
  var pEl = document.getElementById('rvModalPhoto');
  if (photo) { pEl.src = photo.src; pEl.alt = photo.alt; pEl.style.display = 'block'; }
  else { pEl.style.display = 'none'; }
  var authorLink = card.querySelector('.rv-author');
  var mA = document.getElementById('rvModalAuthor');
  mA.textContent = card.querySelector('.rv-foot strong').textContent;
  if (authorLink) { mA.href = authorLink.href; } else { mA.removeAttribute('href'); }
  document.getElementById('rvModalTime').textContent = card.querySelector('.rv-foot span').textContent;
  document.getElementById('rvModalStars').textContent = card.querySelector('.stars').textContent;
  document.getElementById('rvModalText').textContent = card.querySelector('.rv-full').textContent.trim();
  rvModal.hidden = false;
  document.body.style.overflow = 'hidden';
  rvModal.querySelector('.rv-modal-close').focus();
}
function closeReview() {
  rvModal.hidden = true;
  document.body.style.overflow = '';
  if (rvLast) rvLast.focus();
}
document.querySelectorAll('.rv-card').forEach(function (card) {
  card.addEventListener('click', function () { openReview(card); });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReview(card); }
  });
});
rvModal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-rv-close')) closeReview(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !rvModal.hidden) closeReview(); });

/* name link opens the Google review, not the popup */
document.querySelectorAll('.rv-author').forEach(function (a) {
  a.addEventListener('click', function (e) { e.stopPropagation(); });
  a.addEventListener('keydown', function (e) { e.stopPropagation(); });
});