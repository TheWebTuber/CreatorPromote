// Function for Thunder Strike Effect
function thunderStrike() {
    const overlay = document.getElementById('thunderOverlay');
    
    // Random delay between 4 and 10 seconds
    const delay = Math.random() * 6000 + 4000;

    setTimeout(() => {
        // Trigger Flash
        overlay.style.opacity = "0.1";
        
        setTimeout(() => {
            overlay.style.opacity = "0";
            
            // 30% chance of a double strike
            if(Math.random() > 0.7) {
                setTimeout(() => {
                    overlay.style.opacity = "0.2";
                    setTimeout(() => overlay.style.opacity = "0", 40);
                }, 80);
            }
        }, 60);

        thunderStrike(); // Repeat
    }, delay);
}

// Simple Glitch Flicker for the Title
function glitchEffect() {
    const title = document.querySelector('.glitch');
    setInterval(() => {
        title.style.opacity = Math.random() > 0.95 ? "0.5" : "1";
    }, 100);
}

// Start effects when page loads
window.addEventListener('DOMContentLoaded', () => {
    thunderStrike();
    glitchEffect();
});