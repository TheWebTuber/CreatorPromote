document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        let rect = card.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width - 0.5;
        let y = (e.clientY - rect.top) / rect.height - 0.5;

        let rotateX = y * 20;
        let rotateY = -x * 20;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        card.querySelectorAll('.layer').forEach((layer, index) => {
            let depth = (index + 1) * 20; // Adjusted depth for 6 layers
            layer.style.transform = `translateZ(${depth}px) translateX(${x * depth}px) translateY(${y * depth}px)`;
        });
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
        card.querySelectorAll('.layer').forEach(layer => {
            layer.style.transform = '';
        });
    });
});