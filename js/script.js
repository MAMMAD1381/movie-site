async function init () {
    await router(window.location.pathname)
    activeSection()
}

// my global variables ot path which will be needed everywhere
global = {
    CURRENT_PATH : '/flixx-app-mine/', //TODO change the absolute path if needed
    KEY: getKey('keys/key.txt'),
    BEARER_KEY: getKey('keys/bearer key.txt'),
    BASE_URL : 'https://api.themoviedb.org/3'
}

async function router(path) {
    switch (path) {
        case `${global.CURRENT_PATH}`:
        case `${global.CURRENT_PATH}index.html`:
            spinner('show')
            addMoviesToDom((await request('/trending/movie/week')).results)
            spinner('hide')
            break

        case `${global.CURRENT_PATH}movie-details.html`:
            spinner('show')
            await movieDetails(window.location.search.split('=')[1])
            spinner('hide')
            break

        case `${global.CURRENT_PATH}search.html`:
            spinner('show')
            let type = window.location.search.split('=')[1].split('&')[0]
            let term = window.location.search.split('=')[2]
            await search(type, term)
            console.log(type, term)
            spinner('hide')
            break

        case `${global.CURRENT_PATH}shows.html`:
            spinner('show');
            addShowsToDom((await request('/tv/popular')).results)
            spinner('hide')
            break

        case `${global.CURRENT_PATH}tv-details.html`:
            spinner('show')
            await showDetails(window.location.search.split('=')[1])
            spinner('hide')
            break
    }
}

// highlights the navbar links (movies & tv shows) based on the current page url
function activeSection(){
    const movies = document.querySelector('header').querySelectorAll('.nav-link')[0]
    const shows = document.querySelector('header').querySelectorAll('.nav-link')[1]

    if (window.location.pathname.endsWith('index.html')){
        movies.classList.add('active')
        shows.classList.remove('active')
    }
    else if(window.location.pathname.endsWith('shows.html')){
        shows.classList.add('active')
        movies.classList.remove('active')
    }
}

// it will show up when browser is busy with fetching data
function spinner(command){
    if (command === 'show')
        document.querySelector('.spinner').classList.add('show')
    else if (command === 'hide')
        document.querySelector('.spinner').classList.remove('show')
}

// it will show some popular movies or tv shows in swiper mode
async function swiper(){
    let response = await request('/trending/movie/week');
    const movies = response.results
    console.log(movies)
    let randomNumber = Math.floor(Math.random() * 20)
    let selectedMovie = movies[randomNumber]
    const swiperDiv = document.querySelector('.swiper-wrapper')
    swiperDiv.innerHTML = ''
    let div = document.createElement('div')
    div.className = 'swiper-slide';
    div.innerHTML = `
    <a href="movie-details.html?id=${selectedMovie.id}">
              <img src="./images/no-image.jpg" alt="${selectedMovie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${randomNumber} ${selectedMovie.vote_average}
            </h4>
    `
    swiperDiv.appendChild(div)
}

function addMoviesToDom(movies){
    const popularMovieSection = document.getElementById('popular-movies');
    console.log(movies)
    movies.forEach((movie) => {
        let movieDiv = document.createElement('div');
        movieDiv.classList.add('card')
                                // images wouldn't load, so I used the no image thing :/
        movieDiv.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img
              src = images/no-image.jpg 
              class="card-img-top"
              alt="Movie Title"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">${movie.release_date}</small>
            </p>
          </div>
        `
        popularMovieSection.appendChild(movieDiv)
    })
}

function addShowsToDom(shows){
    const popularShowSection = document.getElementById('popular-shows');
    console.log(shows)
    shows.forEach((show) => {
        let movieDiv = document.createElement('div');
        movieDiv.classList.add('card')
        // images wouldn't load, so I used the no image thing :/
        movieDiv.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img
              src = images/no-image.jpg 
              class="card-img-top"
              alt="Movie Title"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">${show.first_air_date}</small>
            </p>
          </div>
        `
        popularShowSection.appendChild(movieDiv)
    })
}

function addMoviesToSearchDom(movies){
    const popularMovieSection = document.getElementById('search-results');
    console.log(movies)
    movies.forEach((movie) => {
        let movieDiv = document.createElement('div');
        movieDiv.classList.add('card')
        // images wouldn't load, so I used the no image thing :/
        movieDiv.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img
              src = images/no-image.jpg 
              class="card-img-top"
              alt="Movie Title"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">${movie.release_date}</small>
            </p>
          </div>
        `
        popularMovieSection.appendChild(movieDiv)
    })
}

function addShowsToSearchDom(shows){
    const popularShowSection = document.getElementById('search-results');
    console.log(shows)
    shows.forEach((show) => {
        let movieDiv = document.createElement('div');
        movieDiv.classList.add('card')
        // images wouldn't load, so I used the no image thing :/
        movieDiv.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img
              src = images/no-image.jpg 
              class="card-img-top"
              alt="Movie Title"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">${show.first_air_date}</small>
            </p>
          </div>
        `
        popularShowSection.appendChild(movieDiv)
    })
}
async function movieDetails(id){
    let movie = await request(`/movie/${id}`)

    let genresDiv = document.createElement('ul')
    genresDiv.className = 'list-group'
    movie.genres.forEach((genre) => {
        let li = document.createElement('li')
        li.innerText = genre.name
        genresDiv.appendChild(li)
    });

    let companiesDiv = document.createElement('div')
    companiesDiv.className = 'list-group'
    movie.production_companies.forEach((company) => {
        let text = document.createTextNode(`${company.name} ,`)
        companiesDiv.appendChild(text)
    })

    let movieDiv = document.createElement('div')
    movieDiv.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Number(movie.vote_average).toFixed(1)}
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            ${genresDiv.outerHTML}
            <a href="" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> ${movie.budget} $</li>
            <li><span class="text-secondary">Revenue:</span> ${movie.revenue} $</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} hour</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          ${companiesDiv.outerHTML}
        </div>
    `
    document.querySelector('#movie-details').innerHTML = movieDiv.innerHTML

}

async function showDetails(id){
    let show = await request(`/tv/${id}`)

    let genresDiv = document.createElement('ul')
    genresDiv.className = 'list-group'
    show.genres.forEach((genre) => {
        let li = document.createElement('li')
        li.innerText = genre.name
        genresDiv.appendChild(li)
    });

    let companiesDiv = document.createElement('div')
    companiesDiv.className = 'list-group'
    show.production_companies.forEach((company) => {
        let text = document.createTextNode(`${company.name} ,`)
        companiesDiv.appendChild(text)
    })

    let showDiv = document.createElement('div')
    showDiv.innerHTML = `
        <div class="details-top">
          <div>
            <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${Number(show.vote_average).toFixed(1)}
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            ${genresDiv.outerHTML}
            <a href="" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.episode_number} </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          ${companiesDiv.outerHTML}
        </div>
    `
    document.querySelector('#show-details').innerHTML = showDiv.innerHTML
}

// sends a request to given endpoint base on the BASE_URL(in global section) and returns the response
async function request(endpoint){
    let request = await fetch(`${global.BASE_URL}${endpoint}`,
        {
            method: 'GET',
            headers:{
                'Authorization': await global.BEARER_KEY,
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
    return  await request.json()
}

// fetches the keys from given path for authorization purposes
async function getKey(path){
    let request = await fetch(path)
    return await request.text()
}

// searches the in defined section(in here type) based on given term
async function search(type, term){
    if(type === 'movie') {
        let response = await request(`/search/movie?api_key=${await global.KEY}&language=en-US&page=1&include_adult=false&query=${term}`)
        addMoviesToSearchDom(response.results)
    }
    else if(type === 'tv') {
        let response = await request(`/search/tv?api_key=${await global.KEY}&language=en-US&page=1&include_adult=false&query=${term}`)
        addShowsToSearchDom(response.results)
    }

}

document.addEventListener('DOMContentLoaded', init);

