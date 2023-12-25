const myLibrary = [];

const btnAdd = document.getElementsByClassName("btn-add")[0];

const bookList = document.getElementById("list-books");

const formAddBook = document.getElementById("form-add-book");
formAddBook.addEventListener("submit", e => {
    e.preventDefault();
    e.stopPropagation();

    let isValidForm = true;

    // Validation sử dụng html validation attributes (required, min, ...)
    if (!formAddBook.checkValidity()) {
        isValidForm = false;
    }

    const titleInput = formAddBook.querySelector("input#title");
    const title = titleInput.value;
    const author = formAddBook.querySelector("input#author").value;
    const pages = formAddBook.querySelector("input#pages").value;
    const isRead = formAddBook.querySelector("input#isRead").checked;

    formAddBook.classList.add('was-validated');

    if (!isValidForm) {
        return;
    }

    const newBook = new Book(title, author, pages, isRead);
    addBookToLibrary(newBook);
    disposeAddingModal();
});

// Validation input title of adding form
formAddBook.querySelector("input#title").addEventListener('input', e => {
    const titleInput = e.target;
    // Validate exist title
    if (isExistBookWithTitle(titleInput.value)) {
        // Add custom error, ngăn form submit (form.checkValidity() -> return false)
        // khi input.validity error thì state invalid cx được thêm vào
        titleInput.setCustomValidity('Book with this title already exists.');
    } else {
        titleInput.setCustomValidity(''); // remove custom validity
    }
});


addBookToLibrary(new Book("A", "B", "12"));
addBookToLibrary(new Book("B", "B", "12"));
addBookToLibrary(new Book("C", "B", "12"));



function getUniqueId() {
    const timestamp = new Date().getTime();
    const randomValue = Math.floor(Math.random() * 10000); // Số ngẫu nhiên từ 0 đến 999

    const uniqueId = timestamp + '-' + randomValue;
    return uniqueId;
}

function Book(title, author, pages, isRead = false) {
    // Tạm thời set id như này, vẫn có khả năng trùng khi trong 1 ms tạo nhiều Book
    this.id = getUniqueId(); 

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

function addBookToLibrary(newBook) {
    myLibrary.push(newBook);
    appendBookCard(newBook);
}

function getBookCardById(id) {
    return bookList.querySelector(`#card${id}`);
}

function getBookById(id) {
    return myLibrary.find(book => book.id == id); // book | undefined
}

function updateBookCardById(id) {
    let oldCard = getBookCardById(id);
    let newCard = createBookCard(getBookById(id));
    oldCard.replaceWith(newCard); // Node.replaceWith(otherNode)
}

// Xoá trong myLib lẫn UI
function removeBook(id) {
    // Xóa ra khỏi myLibrary[]
    myLibrary.splice(myLibrary.indexOf(getBookById(id)), 1);

    // Xóa ra khỏi UI
    const deleteCard = getBookCardById(id);
    deleteCard.remove(); // Node.remove()
}

function isExistBookWithTitle(title) {
    return myLibrary.findIndex(book => book.title == title) != -1;
}

function createBookCard(book) {
    // Tạo các phần tử HTML
    const cardDiv = document.createElement('div');
    cardDiv.id = "card" + book.id;
    cardDiv.classList.add('card', 'shadow');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'd-flex', 'flex-column', 'row-gap-3', 'text-center');

    const titleParagraph = document.createElement('p');
    titleParagraph.textContent = book.title;

    const authorParagraph = document.createElement('p');
    authorParagraph.textContent = book.author;

    const pagesParagraph = document.createElement('p');
    pagesParagraph.textContent = `Pages: ${book.pages}`;

    const readButton = document.createElement('button');
    readButton.dataset.bookId = book.id;
    readButton.classList.add('btn', book.isRead ? 'btn-success' : 'btn-warning');
    readButton.textContent = book.isRead ? 'Read' : 'Not read';

    readButton.onclick = (e) => {
        let id = readButton.dataset.bookId;
        let selectedBook = getBookById(id);
        selectedBook.isRead = !selectedBook.isRead;
        updateBookCardById(id);
    };

    const removeButton = document.createElement('button');
    removeButton.dataset.bookId = book.id;
    removeButton.classList.add('btn', 'btn-secondary');
    removeButton.textContent = 'Remove';

    removeButton.onclick = (e) => {
        removeBook(removeButton.dataset.bookId);
    };

    // Thêm các phần tử vào các phần tử cha
    cardBodyDiv.append(titleParagraph);
    cardBodyDiv.append(authorParagraph);
    cardBodyDiv.append(pagesParagraph);
    cardBodyDiv.append(readButton);
    cardBodyDiv.append(removeButton);

    cardDiv.append(cardBodyDiv);

    return cardDiv;
}

function appendBookCard(book) {
    let cardDiv = createBookCard(book);
    bookList.append(cardDiv);
}


function disposeAddingModal() {
    // Clear form state
    formAddBook.reset();
    formAddBook.classList.remove("was-validated");
    // Close modal
    document.getElementById("btn-close").click();
}
