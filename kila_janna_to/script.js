// Updated script.js for tracking all types of books

async function searchBooks() {
    const query = document.getElementById("searchInput").value;
    if (!query) return alert("Please enter a book name in the search bar! 📚");

    const bookResults = document.getElementById("bookResults");
    bookResults.innerHTML = "<p>🔍 Searching for books...</p>";

    try {
        const [itbookData, googleData, openLibraryData] = await Promise.all([
            fetch(`https://api.itbook.store/1.0/search/${query}`).then(res => res.json()),
            fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`).then(res => res.json()),
            fetch(`https://openlibrary.org/search.json?title=${query}`).then(res => res.json())
        ]);

        bookResults.innerHTML = "";

        // IT Book Store resultsa
        if (itbookData.books) {
            itbookData.books.forEach(book => {
                const image = book.image || "https://via.placeholder.com/150";
                bookResults.appendChild(createBookCard(image, book.title, book.subtitle, book.url));
            });
        }

        // Google Books results
        if (googleData.items) {
            googleData.items.forEach(book => {
                const info = book.volumeInfo;
                const image = info.imageLinks ? info.imageLinks.thumbnail : "https://via.placeholder.com/150";
                bookResults.appendChild(createBookCard(image, info.title, info.authors ? info.authors.join(", ") : "Unknown Author", info.infoLink));
            });
        }

        // Open Library results
        if (openLibraryData.docs) {
            openLibraryData.docs.slice(0, 10).forEach(book => {
                const image = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "https://via.placeholder.com/150";
                bookResults.appendChild(createBookCard(image, book.title, book.author_name ? book.author_name.join(", ") : "Unknown Author", `https://openlibrary.org${book.key}`));
            });
        }

    } catch (error) {
        console.error("Error fetching book data:", error);
        bookResults.innerHTML = "<p>❌ Failed to load books. Please try again.</p>";
    }
}

function createBookCard(image, title, subtitle, link) {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    bookCard.innerHTML = `
        <img src="${image}" alt="${title}">
        <h3>${title}</h3>
        <p>${subtitle || "No description available."}</p>
        <a href="${link}" target="_blank">View Details</a>
    `;

    return bookCard;
}
