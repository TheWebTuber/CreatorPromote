const statusBox = document.getElementById('status');
const infoBox = document.getElementById('server-info');
const playerList = document.getElementById('players');

const SERVER_IP = 'mc.creatorpromote.com';
const JAVA_PORT = 25565;
const BEDROCK_PORT = 19132;

async function fetchStatus() {
  try {
    const javaRes = await fetch(`https://api.mcstatus.io/v2/status/java/${SERVER_IP}:${JAVA_PORT}`);
    const bedrockRes = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${SERVER_IP}:${BEDROCK_PORT}`);
    
    const javaData = await javaRes.json();
    const bedrockData = await bedrockRes.json();

    const javaOnline = javaData.online;
    const bedrockOnline = bedrockData.online;

    if (javaOnline || bedrockOnline) {
      const javaPlayers = javaData.players?.online || 0;
      const bedrockPlayers = bedrockData.players?.online || 0;
      const totalPlayers = javaPlayers + bedrockPlayers;

      statusBox.textContent = `✅ Server is ONLINE with ${totalPlayers} player(s) (Java: ${javaPlayers}, Bedrock: ${bedrockPlayers})`;
      statusBox.className = 'status-box status-online';
      infoBox.classList.remove('hidden');

      playerList.innerHTML = '';

      const playerNames = [
        ...(javaData.players?.list?.map(p => p.name_raw) || []),
        ...(bedrockData.players?.list?.map(p => p.name_raw) || [])
      ];

      if (playerNames.length > 0) {
        playerNames.forEach(name => {
          const li = document.createElement('li');
          li.textContent = name;
          playerList.appendChild(li);
        });
      } else {
        playerList.innerHTML = '<li>No players online</li>';
      }

    } else {
      statusBox.textContent = '🔴 Server is OFFLINE';
      statusBox.className = 'status-box status-offline';
      infoBox.classList.add('hidden');
    }

  } catch (err) {
    statusBox.textContent = '⚠️ Error: Server is unreachable or in maintenance';
    statusBox.className = 'status-box status-maintenance';
    infoBox.classList.add('hidden');
    console.error(err);
  }
}

fetchStatus();
setInterval(fetchStatus, 60000);
