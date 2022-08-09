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

function goBack(){
    callAjax("GET", 'http:\/\/localhost:3000', () => {window.location = "/";});
}

function showEditingBook(){
    document.getElementById("editBookBack").style.display = "block";
}

function closeEditingBook(){
    document.getElementById("editBookBack").style.display = "none";
}

function showGivingBook(){
    document.getElementById("giveBookBack").style.display = "block";
}

function closeGivingBook(){
    document.getElementById("giveBookBack").style.display = "none";
}

function saveEditing(button){
    let author = document.getElementById("author").value;
    let name = document.getElementById("name").value;
    let date = document.getElementById("date").value;
    let id = button.parentNode.parentNode.parentNode.childNodes[1].childNodes[6].innerHTML.split(';')[1];
    if(author == "" || name == "" || date == "") {
        window.alert("Заполните форму!");
        return;
    }
    callAjax("PUT", `http:\/\/localhost:3000/books/edit/${id}/${author}/${name}/${date}`, () => {window.location.reload();});
}

function giveBook(button){
    let owner = document.getElementById("owner").value;
    let dateback = document.getElementById("dateback").value;
    let id = button.parentNode.parentNode.parentNode.childNodes[1].childNodes[6].innerHTML.split(';')[1];
    if(owner == "" || dateback == "") {
        window.alert("Заполните форму!");
        return;
    }
    callAjax("PUT", `http:\/\/localhost:3000/books/give/${id}/${owner}/${dateback}`, () => {window.location.reload();});
}

function returnBook(button){
    let id = button.parentNode.parentNode.childNodes[1].childNodes[6].innerHTML.split(';')[1];
    callAjax("PUT", `http:\/\/localhost:3000/books/${id}`, () => {window.location.reload();});
}