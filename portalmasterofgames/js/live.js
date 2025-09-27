// Replace these with your API key and channel ID
const API_KEY = 'AIzaSyBvpCwNhDR-PvJ02tJ2iJDekFc3R9-g5V0';
const CHANNEL_ID = 'UCdOJvhjojFe3Z0yKeGEIERA'; // e.g., UCxxxxxx

const subscribersEl = document.getElementById('subscribers');
const viewsEl = document.getElementById('views');
const videosEl = document.getElementById('videos');

let lastStats = { subs: 0, views: 0, videos: 0 };

function animateValue(el, start, end, duration = 800) {
    const range = end - start;
    if (range === 0) return;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        el.textContent = Math.floor(start + range * progress).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

async function fetchStats() {
    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const stats = data.items[0].statistics;

        const subs = Number(stats.subscriberCount);
        const views = Number(stats.viewCount);
        const videos = Number(stats.videoCount);

        animateValue(subscribersEl, lastStats.subs, subs);
        animateValue(viewsEl, lastStats.views, views);
        animateValue(videosEl, lastStats.videos, videos);

        lastStats = { subs, views, videos };
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
    }
}

fetchStats();
setInterval(fetchStats, 5000);
