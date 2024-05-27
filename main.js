const books=[];
const TAMPIL_DATA = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist(){
    if (typeof(storage) === undefined){
        alert('Ups, Sepertinya Browser Anda Tidak Mendukung Local Storage 😔');
        return false;
    }
    return true;
}

function saveData(){
    if (isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
        for (const book of data){
            books.push(book)
        }
    }

    document.dispatchEvent(new Event(TAMPIL_DATA));
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

function addBook(){
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBookString = document.getElementById('inputBookYear').value;
    const yearBook = parseInt(yearBookString);

    const checkBox = document.getElementById('inputBookIsComplete');
    let status = false;
        if (checkBox.checked) {
            status = true;
        } else {
            status = false;
        }

    const generatedID = generateID();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, status);
    books.push(bookObject);

    document.dispatchEvent(new Event(TAMPIL_DATA));
    saveData();
}

function generateID(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

document.addEventListener(TAMPIL_DATA, function(){
    console.log(books);
});


function makeBook(bookObject) {
    
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: ' + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + bookObject.year;

    const articleButton = document.createElement('div');
    articleButton.classList.add('action');

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear, articleButton);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum selesai dibaca';
        undoButton.classList.add('green');
        undoButton.setAttribute('id', `${bookObject.id}`);
        undoButton.addEventListener('click', function() {
            undoBookFromCompleted(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Hapus buku';
        removeButton.classList.add('red');
        removeButton.setAttribute('id', `${bookObject.id}`)
        removeButton.addEventListener('click', function() {
            const confirmation = confirm("Apakah Anda yakin ingin menghapus buku? ❌");
            if (confirmation) {
                removeBookFromCompleted(bookObject.id);
            } else {
                
            }
        });
        
        articleButton.append(undoButton, removeButton);
        container.append(articleButton);

    } else {
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Selesai dibaca';
        checkButton.classList.add('green');
        checkButton.setAttribute('id', `${bookObject.id}`);
        checkButton.addEventListener('click', function() {
            addBookToCompleted(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Hapus buku';
        removeButton.classList.add('red');
        removeButton.setAttribute('id', `${bookObject.id}`)
        removeButton.addEventListener('click', function() {
            const confirmation = confirm("Apakah Anda yakin ingin menghapus buku? ❌");
            if (confirmation) {
                removeBookFromCompleted(bookObject.id);
            } else {
                
            }
        });

        articleButton.append(checkButton, removeButton);
        container.append(articleButton);
    }
    return container;
}



function addBookToCompleted(bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(TAMPIL_DATA));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(TAMPIL_DATA));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(TAMPIL_DATA));
    saveData();
}

document.addEventListener(TAMPIL_DATA, function(){
    const notReadedBook = document.getElementById('incompleteBookshelfList')
    notReadedBook.innerHTML = '';

    const readedBook = document.getElementById('completeBookshelfList')
    readedBook.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) 
            notReadedBook.append(bookElement);
        else
            readedBook.append(bookElement);
    }
});