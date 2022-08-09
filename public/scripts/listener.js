var filterSelect = document.getElementById("filter");
var dateFil = new Date();
var whoName;

switch (document.getElementById("filterUsed").innerHTML){
    case "none":
        filterSelect.options[0].selected = true;
        break;
    case "have":
        filterSelect.options[1].selected = true;
        break;
    case "date":
        filterSelect.options[2].selected = true;
        break;
    case "out":
        filterSelect.options[3].selected = true;
        break;
    case "who":
        filterSelect.options[4].selected = true;
        break;
}

filterSelect.addEventListener("change", changeFilter);

function changeFilter(){
    let filter = filterSelect.options[filterSelect.selectedIndex].text;
    switch (filter){
        case "В наличии":
            callAjax("PUT", "http:\/\/localhost:3000/filter/have", () => {window.location = "/filter";})
            break;
        case "Отсутствует":
            callAjax("GET", "http:\/\/localhost:3000", () => {window.location ="/";});
            break;
        case "Вернуть до":
            document.getElementById("dateFilterBack").style.display = "block";
            break;
        case "Выданы":
            callAjax("PUT", "http:\/\/localhost:3000/filter/out", () => {window.location = "/filter";})
            break;
        case "Выданы кому":
            document.getElementById("outWhoBack").style.display = "block";
            break;
    }
}

function callAjax(method, url, callback = () => {}) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            callback();
        }
    };
    xhttp.open(method, url);
    xhttp.send();
}

function deleteBookEvent(button){
    let id = button.parentNode.childNodes[0].childNodes[2].innerHTML.split(';')[1];
    callAjax("DELETE", `http:\/\/localhost:3000/books/${id}`, () => {
        if (document.getElementById("filterUsed").innerHTML != "none") {
            callAjax("PUT", `http:\/\/localhost:3000/filter/update/${dateFil}/${whoName}`);
        }
        window.location.reload();
    });
}

function save(){
    callAjax("PUT", "http:\/\/localhost:3000/save");
}

function showAddingBook(){
     document.getElementById("addBookBack").style.display = "block";
}

function showGivingBook(button){
    document.getElementById("giveBookBack").style.display = "block";
    let id = button.parentNode.childNodes[0].childNodes[2].innerHTML.split(';')[1];
    document.getElementById("saveid").innerHTML = id;
}

function closeAddingBook(){
    document.getElementById("addBookBack").style.display = "none";
}

function closeGivingBook(){
    document.getElementById("giveBookBack").style.display = "none";
}

function closeDateFiltering(){
    document.getElementById("dateFilterBack").style.display = "none";
    filterSelect.options[0].selected = true;
    callAjax("GET", "http:\/\/localhost:3000", () => {window.location ="/";});
}

function closeWhoFiltering(){
    document.getElementById("outWhoBack").style.display = "none";
    filterSelect.options[0].selected = true;
    callAjax("GET", "http:\/\/localhost:3000", () => {window.location ="/";});
}

function addBook(){
    let author = document.getElementById("authorI").value;
    let name = document.getElementById("nameI").value;
    let date = document.getElementById("dateI").value;
    let id = document.getElementById("lastid").innerHTML;
    if(author == "" || name == "" || date == "") {
        window.alert("Заполните форму!");
        return;
    }
    callAjax("POST", `http:\/\/localhost:3000/books/${id}/${author}/${name}/${date}`, () => {
        if (document.getElementById("filterUsed").innerHTML != "none") {
            callAjax("PUT", `http:\/\/localhost:3000/filter/update/${dateFil}/${whoName}`);
        }
        window.location.reload();
    });
}

function returnBook(button){
    let id = button.parentNode.childNodes[0].childNodes[2].innerHTML.split(';')[1];
    callAjax("PUT", `http:\/\/localhost:3000/books/${id}`, () => {
        if (document.getElementById("filterUsed").innerHTML != "none") {
            callAjax("PUT", `http:\/\/localhost:3000/filter/update/${dateFil}/${whoName}`);
        }
        window.location.reload();
    });
}

function giveBook(){
    let owner = document.getElementById("owner").value;
    let dateback = document.getElementById("dateback").value;
    let id = document.getElementById("saveid").innerHTML;
    if(owner == "" || dateback == "") {
        window.alert("Заполните форму!");
        return;
    }
    callAjax("PUT", `http:/\/localhost:3000/books/give/${id}/${owner}/${dateback}`, () => {
        if (document.getElementById("filterUsed").innerHTML != "none") {
            callAjax("PUT", `http:\/\/localhost:3000/filter/update/${dateFil}/${whoName}`);
        }
        window.location.reload();
    });
}

function filterDate(){
    dateFil = document.getElementById("dateFilter").value;
    callAjax("PUT", `http:\/\/localhost:3000/filter/date/${dateFil}`, () => {window.location = "/filter";});
}

function bookEdit(button){
    let id = button.parentNode.childNodes[0].childNodes[2].innerHTML.split(';')[1];
    callAjax("GET", `http:\/\/localhost:3000/book/${id}`, () => {window.location = `/book/${id}`});
}

function filterWho(){
    whoName = document.getElementById("whoName").value;
    callAjax("PUT", `http:\/\/localhost:3000/filter/who/${whoName}`, () => {window.location = "/filter";});
}