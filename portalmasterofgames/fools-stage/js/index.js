const books = [
  {
    title: "The Flip Side of Knowledge",
    author: "Alias Lupus",
    series: "Fool's Stage",
    bookNumber: "Book One",
    genre: "Philosophical Fantasy",
    status: "Available",
    description: "Fantasy mystery about an archive, a coin, and an impossible road.",
    coverImage: "images/book1-cover.jpg",
    pageLink: "https://creatorpromote.com/portalmasterofgames/fools-stage/the-flipside-of-knowlage",
    color: "blue"
  },
  {
    title: "Burned Memories and Made-Up Apologies",
    author: "Alias Lupus",
    series: "Fool's Stage",
    bookNumber: "Book Two",
    genre: "Fantasy Mystery",
    status: "Available",
    description: "A memory-focused fantasy mystery and the second Fool's Stage book.",
    coverImage: "images/book2-cover.jpg",
    pageLink: "#",
    color: "red"
  },
  {
    title: "Go Home...",
    author: "Alias Lupus",
    series: "Fool's Stage",
    bookNumber: "Book Three",
    genre: "Fantasy Finale",
    status: "Available",
    description: "The final Fool's Stage book.",
    coverImage: "images/book3-cover.jpg",
    pageLink: "#",
    color: "gray"
  },
  {
    title: "New Author Comming Soon",
    author: "New Author Name",
    series: "Standalone",
    bookNumber: "Standalone",
    genre: "Adventure",
    status: "Coming Soon",
    description: "Cover image and description will be added when the book is released.",
    coverImage: "",
    pageLink: "#",
    color: "green"
  }
];

const coverColors = {
  blue: "linear-gradient(145deg, #111827, #31506f, #090b10)",
  red: "linear-gradient(145deg, #2a0d12, #7c1f2a, #090609)",
  gray: "linear-gradient(145deg, #17171d, #5b5660, #08080b)",
  green: "linear-gradient(145deg, #102018, #3f644d, #070b08)"
};

const searchInput = document.getElementById("search-input");
const authorFilter = document.getElementById("author-filter");
const seriesFilter = document.getElementById("series-filter");
const bookGrid = document.getElementById("book-grid");
const authorGrid = document.getElementById("author-grid");
const emptyState = document.getElementById("empty-state");
const resultsLine = document.getElementById("results-line");

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("page-link").textContent = window.location.href;

function uniqueValues(key) {
  return [...new Set(books.map((book) => book[key]))].sort();
}

function fillSelect(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function bookSearchText(book) {
  return [
    book.title,
    book.author,
    book.series,
    book.bookNumber,
    book.genre,
    book.status,
    book.description
  ]
    .join(" ")
    .toLowerCase();
}

function createBookCard(book) {
  const card = document.createElement("a");
  card.className = "book-card";
  card.href = book.pageLink;
  card.setAttribute("aria-label", `Open ${book.title} by ${book.author}`);

  const coverStyle = coverColors[book.color] || coverColors.blue;
  const statusClass = book.status.toLowerCase().includes("available") ? "available" : "coming";
  const imageHtml = book.coverImage
    ? `<img src="${book.coverImage}" alt="${book.title} cover" onerror="this.hidden = true">`
    : "";

  card.innerHTML = `
    <div class="cover">
      ${imageHtml}
      <div class="cover-fallback" style="background: ${coverStyle}">
        <div class="cover-title">
          <small>${book.series} - ${book.bookNumber}</small>
          ${book.title}
        </div>
      </div>
    </div>
    <div class="book-info">
      <div class="book-meta">
        <span class="chip ${statusClass}">${book.status}</span>
        <span class="chip">${book.author}</span>
        <span class="chip">${book.genre}</span>
      </div>
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <div class="open-row">Open book page</div>
    </div>
  `;

  return card;
}

function renderBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedAuthor = authorFilter.value;
  const selectedSeries = seriesFilter.value;

  const filteredBooks = books.filter((book) => {
    const matchesSearch = bookSearchText(book).includes(query);
    const matchesAuthor = selectedAuthor === "all" || book.author === selectedAuthor;
    const matchesSeries = selectedSeries === "all" || book.series === selectedSeries;
    return matchesSearch && matchesAuthor && matchesSeries;
  });

  bookGrid.innerHTML = "";
  filteredBooks.forEach((book) => bookGrid.appendChild(createBookCard(book)));

  emptyState.style.display = filteredBooks.length === 0 ? "block" : "none";
  resultsLine.textContent = `${filteredBooks.length} book${filteredBooks.length === 1 ? "" : "s"} shown`;
}

function renderAuthors() {
  const authorCounts = books.reduce((counts, book) => {
    counts[book.author] = (counts[book.author] || 0) + 1;
    return counts;
  }, {});

  authorGrid.innerHTML = "";

  Object.entries(authorCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([author, count]) => {
      const card = document.createElement("article");
      card.className = "author-card";
      card.innerHTML = `
        <strong>${author}</strong>
        <p>${count} book${count === 1 ? "" : "s"} in the library</p>
      `;
      authorGrid.appendChild(card);
    });
}

fillSelect(authorFilter, uniqueValues("author"));
fillSelect(seriesFilter, uniqueValues("series"));

searchInput.addEventListener("input", renderBooks);
authorFilter.addEventListener("change", renderBooks);
seriesFilter.addEventListener("change", renderBooks);

renderBooks();
renderAuthors();
