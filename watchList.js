/* GLOBAL VARIABLES */
let movieHtmlArray =[]; //Array for movie HTML elements to be rendered from search
const moviesContainer = document.getElementById("movies-container"); //DOM element for container where watched movies will be added to

/* Event listener for page load */
document.addEventListener('DOMContentLoaded', function() {
    let watchlistJSON = localStorage.getItem('watchlist');
    let watchlist = JSON.parse(watchlistJSON);
    renderMovies(watchlist);
});

/* Event listener for all button click events */
document.addEventListener('click', function(event) {
    /* LOCAL VARIABLES */
    const buttonID = event.target.dataset.imdbid;

    /* Action for remove button click */
    if(event.target.classList.contains('remove-button')) {
        removeFromWatchList(buttonID);
    /* Action for thumbs-up button set */
    } else if(event.target.classList.contains('thumbs-up')) {
        event.target.classList.remove('thumbs-up');
        event.target.classList.add('thumbs-up-rated');   
        if(event.target.parentNode.querySelector('.thumbs-down-rated')){
            let downButton = event.target.parentNode.querySelector('.thumbs-down-rated');
            downButton.classList.remove('thumbs-down-rated');
            downButton.classList.add('thumbs-down');
        }
        setRating(buttonID, 'like');
    /* Action for thumbs-down button set */
    } else if(event.target.classList.contains('thumbs-down')) {
        event.target.classList.remove('thumbs-down');
        event.target.classList.add('thumbs-down-rated');
        if(event.target.parentNode.querySelector('.thumbs-up-rated')){
            let upButton = event.target.parentNode.querySelector('.thumbs-up-rated');
            upButton.classList.remove('thumbs-up-rated');
            upButton.classList.add('thumbs-up');
        }
        setRating(buttonID, 'dislike');
    /* Action for thumbs-up unset */
    } else if(event.target.classList.contains('thumbs-up-rated')) {
        event.target.classList.remove('thumbs-up-rated');
        event.target.classList.add('thumbs-up');
        setRating(buttonID, 'none');
    /* Action for thumbs-down unset */
    } else if(event.target.classList.contains('thumbs-down-rated')) {
        event.target.classList.remove('thumbs-down-rated');
        event.target.classList.add('thumbs-down');
        setRating(buttonID, 'none');
    }
});

/* Function to remove movie from watchlist */
let removeFromWatchList = (buttonID) => {
    let watchlistJSON = localStorage.getItem('watchlist');
    let watchlist = JSON.parse(watchlistJSON);
    let filterlist = watchlist.filter((movie) => {
        return movie.imdbID !== buttonID;
    })
    
    watchlistJSON = JSON.stringify(filterlist);
    localStorage.setItem('watchlist', watchlistJSON);
    location.reload();
}

/* Function to set rating(like, dislike) for a movie */
let setRating = (buttonID, rating) => {
    let watchlistJSON = localStorage.getItem('watchlist');
    let watchlist = JSON.parse(watchlistJSON);
    for(let i = 0; i < watchlist.length; i++) {
        if(watchlist[i].imdbID === buttonID) {
            watchlist[i].rating = rating;
            watchlistJSON = JSON.stringify(watchlist);
            localStorage.setItem('watchlist', watchlistJSON);
            break;
        }
    }
}

/* Function to render search results to page */
let renderMovies = movieArray => {
    /* LOCAL VARIABLES */
    let title, releaseDate, poster, movieHTML, rowCounter, arrCounter, movieElement, imdbID, rating, movieDescription;

    /* Format each movie object into HTML elements */
    movieHtmlArray = movieArray.map((element) => {
        title = element.Title;
        releaseDate = element.Year;
        poster = element.Poster;
        imdbID = element.imdbID;
        rating = element.rating;
        movieDescription = element.description;

        /* Format rating buttons for previously rated movies */
        if(rating === 'like') {
            movieHTML = `<div class="card" style="width: 18rem;"><img src="${poster}" class="image-poster" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="${movieDescription}"><div class="card-body"><div class="movieInfo d-flex flex-row justify-content-between"><span class="movie-title">${title} &emsp;</span><span class="release-date">${releaseDate}</span></div><p><button type="button" class="btn btn-primary btn-sm remove-button" data-imdbid="${imdbID}">Remove</button><button type="button" class="btn thumbs-button thumbs-up-rated" data-imdbid="${imdbID}"></button><button type="button" class="btn thumbs-button thumbs-down" data-imdbid="${imdbID}"></button></p></div></div>`;
        } else if (rating === 'dislike') {
            movieHTML = `<div class="card" style="width: 18rem;"><img src="${poster}" class="image-poster" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="${movieDescription}"><div class="card-body"><div class="movieInfo d-flex flex-row justify-content-between"><span class="movie-title">${title} &emsp;</span><span class="release-date">${releaseDate}</span></div><p><button type="button" class="btn btn-primary btn-sm remove-button" data-imdbid="${imdbID}">Remove</button><button type="button" class="btn thumbs-button thumbs-up" data-imdbid="${imdbID}"></button><button type="button" class="btn thumbs-button thumbs-down-rated" data-imdbid="${imdbID}"></button></p></div></div>`;
        } else {
            movieHTML = `<div class="card" style="width: 18rem;"><img src="${poster}" class="image-poster" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="${movieDescription}"><div class="card-body"><div class="movieInfo d-flex flex-row justify-content-between"><span class="movie-title">${title} &emsp;</span><span class="release-date">${releaseDate}</span></div><p><button type="button" class="btn btn-primary btn-sm remove-button" data-imdbid="${imdbID}">Remove</button><button type="button" class="btn thumbs-button thumbs-up" data-imdbid="${imdbID}"></button><button type="button" class="btn thumbs-button thumbs-down" data-imdbid="${imdbID}"></button></p></div></div>`;
        }
        
        return movieHTML;
    })
    
    rowCounter = Math.ceil(movieHtmlArray.length/3);
    arrCounter = 0;
    
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
        moviesContainer.insertAdjacentHTML('beforeend', '<div class="row"><div class="col-12 results d-flex flex-row justify-content-start">'+movieElement+'</div></div>');
        rowCounter--;
    }

    /* Funtion call for popovers to render */
    $(document).ready(function(){
        $('[data-bs-toggle="popover"]').popover();   
      });      
}
