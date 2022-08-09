const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fs = require("fs");

const server = express();
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false}));
server.use('/public', express.static('public'));
server.set("view engine", "pug");
server.set("views", './views');

var libraryJSON;
var libraryStr;
var filteredLibraryStr;
var filter = "none";

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200){
        libraryJSON = this.responseText;
        libraryStr = JSON.parse(libraryJSON);
    }
};
xhttp.open("GET", "http:\/\/localhost:3000/public/data/library.json");
xhttp.send();


server.get('/', (req, res) => {
    res.render("main", {"books": libraryStr.books, "count": libraryStr.books.length, "filter": "none"});
})

server.delete("/books/:id", (req, res) => {
    let id = req.params.id;
    for (book of libraryStr.books) {
        if (book.id == id) {
            libraryStr.books.splice(id - 1, 1);
            for (let i = id - 1; i < libraryStr.books.length; i++) {
                let index = parseInt(libraryStr.books[i].id) - 1;
                libraryStr.books[i].id = index;
            }
            break;
        }
    }
    res.send();
});

server.put('/save', (req, res) => {
    libraryJSON = JSON.stringify(libraryStr);
    fs.writeFile("public/data/library.json", libraryJSON, (err) => {
        if (err) throw err;
    })
    res.send();
});

server.post("/books/:id/:author/:name/:date", (req, res) => {
    let newBook = new Object();
    newBook.id = req.params.id;
    newBook.name = req.params.name;
    newBook.author = req.params.author;
    newBook.date = req.params.date;
    newBook.have = "Да";
    newBook.owner = "";
    newBook.dateback = "";

    libraryStr.books.push(newBook);
    res.send();
});

server.put("/books/:id", (req, res) => {
    let id = req.params.id;
    for(book of libraryStr.books) {
        if(book.id == id) {
            book.have = "Да";
            book.owner = "";
            book.dateback = "";
            break;
        }
    }
    res.send();
});

server.put("/books/give/:id/:owner/:dateback", (req, res) => {
    let id = req.params.id;
    let owner = req.params.owner;
    let dateback = req.params.dateback;
    for(book of libraryStr.books) {
        if(book.id == id) {
            book.have = "Нет";
            book.owner = owner;
            book.dateback = dateback;
            break;
        }
    }
    res.send();
});

server.put("/filter/have", (req, res) => {
    filteredLibraryStr = new Array();
    for (book of libraryStr.books) {
        if (book.have == "Да") {
            filteredLibraryStr.push(book);
        }
    }
    filter = "have";
    res.send();
});

server.put("/filter/out", (req, res) => {
    filteredLibraryStr = new Array();
    for (book of libraryStr.books) {
        if (book.have == "Нет") {
            filteredLibraryStr.push(book);
        }
    }
    filter = "out";
    res.send();
});

server.put("/filter/update/:date/:name", (req, res) => {
    let date = req.params.date;
    if (filter == "have") {
        filteredLibraryStr = new Array();
        for (book of libraryStr.books) {
            if (book.have == "Да") {
                filteredLibraryStr.push(book);
            }
        }
    }
    else if (filter == "date") {
        filteredLibraryStr = new Array();
        for(book of libraryStr.books) {
            if(book.have == "Нет" && book.dateback <= date) {
                filteredLibraryStr.push(book);
            }
        }
    }
    else if (filter == "out") {
        filteredLibraryStr = new Array();
        for (book of libraryStr.books) {
            if (book.have == "Нет") {
                filteredLibraryStr.push(book);
            }
        }
    }
    else if (filter == "who") {
        filteredLibraryStr = new Array();
        for(book of libraryStr.books) {
            if(book.have == "Нет" && book.owner.indexOf(req.params.name) === 0) {
                filteredLibraryStr.push(book);
            }
        }
    }
    res.send();
});

server.get("/filter", (req, res) => {
    res.render("main", {"books": filteredLibraryStr, "count": libraryStr.books.length, "filter": filter});
});

server.put("/filter/date/:date", (req, res) => {
    filteredLibraryStr = new Array();
    for(book of libraryStr.books) {
        if(book.have == "Нет" && book.dateback <= req.params.date) {
            filteredLibraryStr.push(book);
        }
    }
    filter = "date";
    res.send();
});

server.put("/filter/who/:name", (req, res) => {
    filteredLibraryStr = new Array();
    for(book of libraryStr.books) {
        if(book.have == "Нет" && book.owner.indexOf(req.params.name) === 0) {
            filteredLibraryStr.push(book);
        }
    }
    filter = "who";
    res.send();
});

server.get("/book/:id", (req, res) => {
    let id = req.params.id;
    for (book of libraryStr.books) {
        if (book.id == id) {
            res.render("book", {"author": book.author, "name": book.name, "date": toRuDate(book.date), "have": book.have, "owner": book.owner, "dateback": toRuDate(book.dateback), "id": id});
            break;
        }
    }
})

server.put("/books/edit/:id/:author/:name/:date", (req, res) => {
    let id = req.params.id;
    let author = req.params.author;
    let name = req.params.name;
    let date = req.params.date;
    for(book of libraryStr.books) {
        if(book.id == id) {
            book.author = author;
            book.name = name;
            book.date = date;
            break;
        }
    }
    res.send();
});

function toRuDate(date){
    return (date === "") ? "" : (date.slice(-2) + '/' + date.slice(5,7) + '/' + date.slice(0, 4));
}


server.listen(3000);