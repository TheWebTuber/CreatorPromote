// Slide control
const slides = document.querySelectorAll('.slide');
const nextBtns = document.querySelectorAll('.next-btn');
let current = 0;

nextBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  });
});

// Login popup
const loginBtn = document.getElementById('loginBtn');
const loginPopup = document.getElementById('loginPopup');

loginBtn.addEventListener('click', () => {
  loginPopup.style.display = 'flex';
});

loginPopup.addEventListener('click', (e) => {
  if (e.target === loginPopup) {
    loginPopup.style.display = 'none';
  }
});
