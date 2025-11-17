function toggleStats() {
  const content = document.querySelector('.stats-content');
  const button = document.querySelector('.toggle-stats');
  content.classList.toggle('show');
  button.classList.toggle('open');
}
