// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI Class: Handle UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBook();
    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr"); // A standard js method to create a DOM element
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete"> X </a></td>
    `;
    list.appendChild(row);
  }
  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }
  // Show alertMessage method
  static showAlert(message, className) {
    // Creating a div element using js and inserting it into the DOM
    //it will look like this
    //<div class="alert alert-danger">Message hoes in here</div>
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form); // insert the div before the form element in the DOM

    // showAlert display timeout
    setTimeout(() => document.querySelector(".alert").remove(), 3000); //3000 milliseconds === 3 seconds
  }
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getBook() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books")); // we used the JSON.parse method to convert the books from string to javaScript Object Notation
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBook();
    books.push(book);
    // setting the value to string because localstorage only accepts string
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBook();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display a Book
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", e => {
  // prevent actual submit
  e.preventDefault();

  // Get value from form fields
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // Validation
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("**please fill all fields", "danger");
  } else {
    // Instantiate a book to enable us Add a book
    const book = new Book(title, author, isbn);

    // Calling the addBookList method and parsing the book object as parameter
    UI.addBookToList(book);

    // Add book to localStorage
    Store.addBook(book);

    // Show success message
    UI.showAlert("Book Added", "success");

    // Calling clearFields method
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", e => {
  // Remove book from UI
  UI.deleteBook(e.target);

  // Remove book from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // Show success message
  UI.showAlert("Book Removed", "success");
});
