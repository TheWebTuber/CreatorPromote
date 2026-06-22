const shareButton = document.querySelector("#shareButton");
const shareMessage = document.querySelector("#shareMessage");

function showShareMessage(message) {
  shareMessage.textContent = message;

  window.setTimeout(() => {
    shareMessage.textContent = "";
  }, 2600);
}

async function copyPageLink() {
  const pageUrl = window.location.href;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(pageUrl);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = pageUrl;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: "Fool's Stage: The Flip Side of Knowledge",
    text: "Read the beta reader edition of Fool's Stage.",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showShareMessage("Thanks for sharing!");
    } else {
      await copyPageLink();
      showShareMessage("Link copied!");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      showShareMessage("Could not share the page.");
    }
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
