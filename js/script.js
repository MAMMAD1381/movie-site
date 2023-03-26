async function init () {
    await router(window.location.pathname)
    activeSection()

}

global = {
    currentPath : '/javascript-sandbox-main/11-flixx-app-project/flixx-app-mine/' //change the absolute path if needed
}

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

function spinner(command){
    if (command === 'show')
        document.querySelector('.spinner').classList.add('show')
    else if (command === 'hide')
        document.querySelector('.spinner').classList.remove('show')
}

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

async function router(path) {
    switch (path) {
        case `${global.currentPath}`:
        case `${global.currentPath}index.html`:
            spinner('show')
            await addPopularMoviesToDom()
            spinner('hide')
            break

        case `${global.currentPath}movie-details.html`:
            let id = window.location.search.split('=')[1]
            spinner('show')
            await movieDetails(id)
            spinner('hide')
            break

        case `${global.currentPath}search.html`:
            console.log('search')
            break

        case `${global.currentPath}shows.html`:
            spinner('show')
            await addPopularShowsToDom()
            spinner('hide')
            break

        case `${global.currentPath}tv-details.html`:
            console.log(window.location.search.split('=')[1])
            break
    }
}
async function addPopularMoviesToDom(){
    let response = await request('/trending/movie/week');
    const movies = response.results
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
              alt="Movie Title"
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

}
async function addPopularShowsToDom(){
    let response = await request('/tv/popular');
    const shows = response.results
    const popularShowSection = document.getElementById('popular-shows');
    console.log(shows)
    shows.forEach((show) => {
        let movieDiv = document.createElement('div');
        movieDiv.classList.add('card')
        // images wouldn't load, so I used the no image thing :/
        movieDiv.innerHTML = `
          <a href="movie-details.html?id=${show.id}">
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


async function request(endpoint){
    const BASE_URL = 'https://api.themoviedb.org/3'
    const BEARER_KEY = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1M2UzMWE0YzVlYjk3NjJjYTMyYTg5ODM4NjkzOTVjMiIsInN1YiI6IjY0MTcxMjFlMGQ1ZDg1' +
        'MDA3YjY4MjhlYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H2QSmXDQIxeHMce0x7fbb9v3aJhSq-xRcxFvcrdBAcU'
    let request = await fetch(`${BASE_URL}${endpoint}`,
        {
            method: 'GET',
            headers:{
                'Authorization': BEARER_KEY,
                'Content-Type': 'application/json;charset=utf-8'
            }
        });
    return  await request.json()
}

document.addEventListener('DOMContentLoaded', init);

