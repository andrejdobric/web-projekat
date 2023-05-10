var uri = "http://localhost:3001"

function Startup(){
    GetMovies();
}

const generateID = ()=> {
    return Math.round(Math.random()*100000);
 }

 function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}



function GetMovies(){
    $.ajax({
        url: `${uri}/movies`,
        type: 'GET',
        success: function(response){
            parent = document.getElementById("parent");

            removeAllChildNodes(parent);


            for (var i in response){
                var genreString = '';
                for(var a in response[i].genre) {
                    genreString += `<button class="tag-button" onclick="GetMoviesGenreFilter('${response[i].genre[a]}')">${response[i].genre[a]}</button>`;
                }
                $("#parent").append(`<div class="movie${(i%3+1)}" id=${response[i]._id}><div class="delete-movie">✖</div><h2 class="title">${response[i].title} (${response[i].year})</h2> <p class="description">${response[i].director}</p> <p class="description">${response[i].actors.join(", ")}</p> <div class="genre-tags">${genreString}</div></div>`);
            }
        }
    })
}

function GetMoviesSearch(){

    var searchTerm = document.getElementById("search-input").value;
    
    $.ajax({
        url: `${uri}/movies/search/?q=${searchTerm}`,
        type: 'GET',
        success: function(response){
            parent = document.getElementById("parent");

            removeAllChildNodes(parent);

            for (var i in response){
                var genreString = '';
                for(var a in response[i].genre) {
                    genreString += `<button class="tag-button" onclick="GetMoviesGenreFilter('${response[i].genre[a]}')">${response[i].genre[a]}</button>`;
                }
                $("#parent").append(`<div class="movie${(i%3+1)}" id=${response[i].id}> <h2 class="title">${response[i].title} (${response[i].year})</h2> <p class="description">${response[i].director}</p> <p class="description">${response[i].actors.join(", ")}</p> <div class="genre-tags">${genreString}</div></div>`);
            }
        }
    })
}

function GetMoviesGenreFilter(genre){
    $.ajax({
        url: `${uri}/movies/filter/?genre=${genre}`,
        type: 'GET',
        success: function(response){
            parent = document.getElementById("parent");

            removeAllChildNodes(parent);


            for (var i in response){
                var genreString = '';
                for(var a in response[i].genre) {
                    genreString += `<button class="tag-button" onclick="GetMoviesGenreFilter('${response[i].genre[a]}')">${response[i].genre[a]}</button>`;
                }
                $("#parent").append(`<div class="movie${(i%3+1)}" id=${response[i].id}> <h2 class="title">${response[i].title} (${response[i].year})</h2> <p class="description">${response[i].director}</p> <p class="description">${response[i].actors.join(", ")}</p> <div class="genre-tags">${genreString}</div></div>`);
            }
        }
    })
}



function PostLogin(username, password){

    var User = {"username" : username, "password" : password}

    console.log(User);

    $.ajax({
        url: `${uri}/login`,
        type: 'POST',
        data: JSON.stringify(User),
        contentType: 'application/json',
        success: () => {location.reload()}
        })
}

function PostMovie(Movie){
    console.log(Movie);

    $.ajax({
        url: `${uri}/movies`,
        type: 'POST',
        data: JSON.stringify(Movie),
        contentType: 'application/json',
        success: () => {location.reload()}
        })
}

function DeleteMovie(_id){
    $.ajax({
        url: `${uri}/movies/${_id}`,
        type: 'DELETE',
    });
}

function SetDate(){
    document.getElementById("time-input").valueAsDate = new Date();
}

