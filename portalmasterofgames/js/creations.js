const gallery = document.getElementById("gallery");
const folder = "gifs/";

// Load JSON
fetch("gifs.json")
  .then(res => res.json())
  .then(gifs => {

    gifs.forEach(file => {

        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = folder + file;

        const info = document.createElement("div");
        info.className = "info";

        // Clean filename (remove .gif)
        const name = file.replace(/\.[^/.]+$/, "");

        const title = document.createElement("div");
        title.className = "filename";
        title.textContent = name;

        const button = document.createElement("button");
        button.className = "share-btn";
        button.textContent = "Copy Link";

        button.onclick = () => {
            const url = window.location.origin + "/" + folder + file;

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