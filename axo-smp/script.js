const memories = document.querySelectorAll('.memory');


memories.forEach(memory => {
const container = memory.querySelector('.memory-container');
const story = memory.querySelector('.story');
const video = memory.querySelector('video');


if (video) video.play();


container.addEventListener('click', () => {
story.classList.toggle('show');


if (video) {
video.currentTime = 0;
video.play();
}
});
});
document.querySelectorAll('.memory-container').forEach(container => {
  const media = container.querySelector('.media');
  const cutout = container.querySelector('.cutout');

  container.addEventListener('mousemove', e => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    container.style.transform = `
      rotateX(${y * 10}deg)
      rotateY(${-x * 10}deg)
    `;

    media.style.transform = `
      translateZ(20px)
      translateX(${x * 10}px)
      translateY(${y * 10}px)
    `;

    cutout.style.transform = `
      translateZ(60px)
      translateX(${x * 20}px)
      translateY(${y * 20}px)
    `;
  });

  container.addEventListener('mouseleave', () => {
    container.style.transform = 'rotateX(0) rotateY(0)';
    media.style.transform = 'translateZ(20px)';
    cutout.style.transform = 'translateZ(60px)';
  });
});
