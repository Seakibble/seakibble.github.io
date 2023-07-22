let music = null
fetch('/scripts/music.json')
    .then((response) => response.json())
    .then((json) => music = json)
    .then(() => init())

let musicFiltered = []

let $tableDiv = document.getElementById('tableDiv')
let $clypDiv = document.getElementById('clypDiv')
let $random = document.getElementById('random')
let $randomFavourite = document.getElementById('randomFavourite')
let $time = document.getElementById('time')

let $filterFavourites = document.getElementById('filterFavourites')
let $filterCollection = document.getElementById('filterCollection')
let $filterYear = document.getElementById('filterYear')


function loadClyp(index) {
    let code = music[index].code
    if (code) {
        $clypDiv.innerHTML = '<iframe width="100%" height="200" src="https://clyp.it/' + code + '/widget" frameborder="0"></iframe>'

        if ($tableDiv.getElementsByClassName('selected')[0]) $tableDiv.getElementsByClassName('selected')[0].classList.remove('selected')
        if (document.getElementById('music-' + index)) document.getElementById('music-' + index).classList.add('selected')

        scrollToClyp()
    } else {
        console.log('No code!')
    }
}

function loadTable() {
    applyFilter()

    $tableDiv.innerHTML = ""
    for (let i = 0; i < musicFiltered.length; i++) {
        let track = music[musicFiltered[i]]
        let urlName = makeURLFriendly(track.name)
        let output = ''
        output += "<a href=#" + urlName + " id='music-" + musicFiltered[i] + "'><div data-id='" + musicFiltered[i] + "'>"
        
        output += "<span class='title'>" + track.name
        track.favourite ? output += "<span class='favourite'>Favourite!</span>" : ""
        output += "</span>"
        
        output += "<span class='tag'>" + (track.album ? track.album : "-") + "</span>"
        
        output += "<span class='tag'>" + (track.year ? track.year : "-")  + "</span>"
        output += "<span class='tag'>" + (track.length ? track.length : "-") + "</span>"
        output += "</div></a>"
        $tableDiv.innerHTML += output
    }
}

// function addToTable(id) {
//     fetch('https://api.clyp.it/' + id)
//         .then((response) => response.json())
//         .then((json) => music[i].metadata = json)
//         .then(() => init())
    
// }

function scrollToClyp() {
    // if (document.body.clientWidth <= 700)
    document.getElementById("top").scrollIntoView({ behavior: 'smooth' });
}

function selectTrack(e) {
    let $clicked = e.target.closest('div')
    if ($clicked.dataset.id) {
        loadClyp($clicked.dataset.id)
    }
}

function selectTrackFromURL() {
    if (window.location.hash) {
        for (let i = 0; i < music.length; i++) {
            if (music[i] && music[i].name && '#' + makeURLFriendly(music[i].name) == window.location.hash) {
                loadClyp(i)
                break
            }
        }
    } else {
        loadRandomFavourite()
    }
}

function loadRandom() {
    let rand = Math.floor(Math.random() * musicFiltered.length)
    let index = musicFiltered[rand]
    loadClyp(index)
}

function loadRandomFavourite() {
    let favourites = []
    for (let i = 0; i < music.length; i++) {
        if (music[i].favourite) favourites.push(i)
    }
    loadClyp(favourites[Math.floor(Math.random()*favourites.length)])
}

function loadTime() {
    $time.innerHTML += "<span>Total music Max has made: </span><span>" + countTime()+"</span>"
}

function countTime() {
    let minutes = 0
    let seconds = 0
    let hours = 0
    for (let i = 0; i < music.length; i++) {
        let time = music[i].length.split(":")
        minutes += parseInt(time[0])
        seconds += parseInt(time[1])
    }
    while (seconds >= 60) {
        seconds -= 60
        minutes++
    }

    while (minutes >= 60) {
        minutes -= 60
        hours++
    }
    
    return hours + ":" + minutes + ":" + seconds
}

let filter = {
    favourites: null,
    collection: '',
    year: ''
}
function applyFilter() {
    musicFiltered = []
    for (let i = 0; i < music.length; i++) {
        let track = music[i]

        if (filter.favourites === true && !track.favourite) continue
        if (filter.favourites === false && track.favourite) continue
        
        if (
            filter.collection != ''
            && track.album !== filter.collection
        ) continue
        if (filter.year != '' && track.year !== parseInt(filter.year)) continue

        musicFiltered.push(i)
    }
}

function updateFilter(e) {
    if (e.target.classList.contains('filter')) {
        switch (e.target.dataset.filter) {
            case 'favourites':
                if (e.target.classList.contains('include')) {
                    e.target.classList.remove('include')
                    e.target.classList.add('exclude')
                    filter[e.target.dataset.filter] = false
                } else if (e.target.classList.contains('exclude')) {
                    e.target.classList.remove('exclude')
                    filter[e.target.dataset.filter] = null
                } else {
                    e.target.classList.add('include')
                    filter[e.target.dataset.filter] = true
                }

                loadTable()
                break
        }
    }
}
function updateFilterSelect(e) {
    if (e.target.classList.contains('filter')) {
        if (e.target.dataset.filter == 'collection') filter.collection = e.target.value
        else if (e.target.dataset.filter == 'year') filter.year = e.target.value

        if (filter.collection === '-') filter.collection = undefined
        loadTable()
    }
}

function loadFilterCollectionOptions() {
    let albums = []
    let years = []

    for (let i = 0; i < music.length; i++) {
        if (music[i].album && !albums.includes(music[i].album)) albums.push(music[i].album)

        if (music[i].year && !years.includes(music[i].year)) years.push(music[i].year)
    }

    albums.sort()
    years.sort()

    $filterCollection.innerHTML = "<option value=''>All Collections</option>"
    for (let i = 0; i < albums.length; i++) {
        $filterCollection.innerHTML += "<option value='" + albums[i]+"'>"+albums[i]+"</option>"
    }
    $filterCollection.innerHTML += "<option value='-'>Other</option>"

    $filterYear.innerHTML = "<option value=''>All Years</option>"
    for (let i = 0; i < years.length; i++) {
        $filterYear.innerHTML += "<option value='" + years[i] + "'>" + years[i] + "</option>"
    }
}

function init() {
    loadFilterCollectionOptions()
    loadTable()
    loadTime()
    
    if (document.getElementById('music-0')) {
        document.getElementById('music-0').classList.add('selected')
        selectTrackFromURL()
    } else {
        // No tracks in table, likely due to filter
    }

    $tableDiv.addEventListener("click", selectTrack)
    $random.addEventListener("click", loadRandom)
    $randomFavourite.addEventListener("click", loadRandomFavourite)

    $filterFavourites.addEventListener("click", updateFilter)
    $filterCollection.addEventListener("change", updateFilterSelect)
    $filterYear.addEventListener("change", updateFilterSelect)
}