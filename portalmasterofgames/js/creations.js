const gallery = document.getElementById("gallery");
// Correct folder path for URL and images
const folder = "portalmasterofgames/gifs/"; // <— include the subfolder

fetch("gifs.json")
  .then(res => res.json())
  .then(gifs => {

    gifs.forEach(file => {

        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        // For preview: use the correct folder path but don't encode for HTML
        img.src = folder + file;

        const info = document.createElement("div");
        info.className = "info";

        const name = file.replace(/\.[^/.]+$/, "");

        const title = document.createElement("div");
        title.className = "filename";
        title.textContent = name;

        const button = document.createElement("button");
        button.className = "share-btn";
        button.textContent = "Copy Link";

        button.onclick = () => {
            // Encode filename for safe URL copying
            const url = window.location.origin + "/" + folder + encodeURIComponent(file);
            navigator.clipboard.writeText(url).then(() => {
                button.textContent = "Copied!";
                setTimeout(() => {
                    button.textContent = "Copy Link";
                }, 1500);
            });
        };

        info.appendChild(title);
        info.appendChild(button);

        card.appendChild(img);
        card.appendChild(info);

        gallery.appendChild(card);
    });

  })
  .catch(err => {
    console.error("Failed to load gifs.json:", err);
  });