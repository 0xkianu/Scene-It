/* GLOBAL VARIABLES */
let movieHtmlArray = []; //Array for movie HTML elements to be rendered from search
let movieData = []; //Array of movie objects returned from API call
const container = document.getElementById("resultsContainer");  //DOM element for container where search results will be added to
const myForm = document.getElementById('search-form');  //DOM element for form which inputs search 

document.addEventListener('click', function(event) {
    // code for document click listener goes here
    if(event.target.classList.contains('add-button')) {
        const buttonID = event.target.dataset.imdbid;
        saveToWatchList(buttonID);
    }
})

/* Function to render search results to page */
let renderMovies = movieArray => {
    /* LOCAL VARIABLES */
    let title, releaseDate, poster, movieHTML, rowCounter, arrCounter, movieElement, imdbID, movieDescription;

    /* Format each movie object into HTML elements */
    movieHtmlArray = movieArray.map((element) => {
        title = element.Title;
        releaseDate = element.Year;
        poster = element.Poster;
        imdbID = element.imdbID;
        movieDescription = element.description;
        
        /* Check if movie has already been added.  If it has already been added do not include the add button */
        if(checkAdded(imdbID)) {
            movieHTML = `<div class="card" style="width: 18rem;"><img src="${poster}" class="image-poster" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="${movieDescription}"><div class="card-body"><div class="movieInfo d-flex flex-row justify-content-between"><span class="movie-title">${title} &emsp;</span><span class="release-date">${releaseDate}</span></div><p><button type="button" class="btn btn-primary btn-sm add-button" data-imdbid="${imdbID}">Add</button></p></div></div>`;
        } else {
            movieHTML = `<div class="card" style="width: 18rem;"><img src="${poster}" class="image-poster" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="${movieDescription}"><div class="card-body"><div class="movieInfo d-flex flex-row justify-content-between"><span class="movie-title">${title} &emsp;</span><span class="release-date">${releaseDate}</span></div></div></div>`;
        }
        return movieHTML;
    })
    
    rowCounter = Math.ceil(movieHtmlArray.length/3);
    arrCounter = 0;
    container.innerHTML = '';
    
    /* Format html into rows of 3 movies */
    while(rowCounter > 0) {
        movieElement = '';
        for(let i = 0; (arrCounter < movieHtmlArray.length)&&(i < 3); i++) {
            if(arrCounter % 3 === 0) {
                movieHtmlArray[arrCounter] = movieHtmlArray[arrCounter].replace(`class="card"`, `class="card left-card"`);
            } else if(arrCounter % 3 === 2) {
                movieHtmlArray[arrCounter] = movieHtmlArray[arrCounter].replace(`class="card"`, `class="card right-card"`); 
            }
            movieElement += movieHtmlArray[arrCounter];
            arrCounter++;
        }
        container.insertAdjacentHTML('beforeend', '<div class="row"><div class="col-12 results d-flex flex-row justify-content-start">'+movieElement+'</div></div>');
        rowCounter--;
    }
    
    /* Funtion call for popovers to render */
    $(document).ready(function(){
        $('[data-bs-toggle="popover"]').popover();   
      });    
}

/* Function to get movie data from OMDBAPI */
async function getMovieData(searchString) {
    /* LOCAL VARIABLES */
    let response2 = '';
    let details = '';
    let imdbid = '';

    /* Fetch data from OMDBAPI given the search string */
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=59354c85&s=${searchString}`);
        const data = await response.json();
        movieData = data.Search;

        /* Get additional details for each movie for description property */
        for(let i=0; i < movieData.length; i++) {
            imdbid = movieData[i].imdbID;
            response2 = await fetch(`https://www.omdbapi.com/?apikey=59354c85&i=${imdbid}`);
            details = await response2.json();
            movieData[i].description = await details.Plot;
        }
    
        renderMovies(movieData);
    /* Catch any errors from try code */
    } catch (e) {
        console.log("There was a problem fetching movie data");
    }
}

/* Function to save movies to watchlist */
let saveToWatchList = (movieID) => {
    const movie = movieData.find((currentMovie) => {
        return currentMovie.imdbID == movieID;
    })
    
    let watchlistJSON = localStorage.getItem('watchlist');
    let watchlist = JSON.parse(watchlistJSON);
    if(watchlist === null) {
        watchlist = [];
    }

    /* If the movie has not been added previously add it to watchlist.  Also add a new rating property */
    if(checkAdded(movieID)) {
        movie['rating'] = 'none';
        watchlist.push(movie);
        watchlistJSON = JSON.stringify(watchlist);
        localStorage.setItem('watchlist', watchlistJSON);
    }
}

/* Event listener for search form submission */
myForm.addEventListener('submit', function(e){
    e.preventDefault();
    const searchString = e.target.elements.searchTerm.value;
    const urlEncodedSearchString = encodeURIComponent(searchString);
    getMovieData(urlEncodedSearchString); 
})

/* Function to check of a movie has / has not been added to the watchlist */
let checkAdded = (imdbID) => {
    let watchlistJSON = localStorage.getItem('watchlist');
    let watchlist = JSON.parse(watchlistJSON);
    if(watchlist !== null) {
    for(let i = 0; i < watchlist.length; i++) {
        if(watchlist[i].imdbID === imdbID) {
            return false;
        }
    }}
    return true;
}