let music = null
fetch('/scripts/music.json')
    .then((response) => response.json())
    .then((json) => music = json)
    .then(() => init())

let musicSearchResults = null
let musicFiltered = []

let $tableDiv = document.getElementById('tableDiv')
let $clypDiv = document.getElementById('clypDiv')
let $random = document.getElementById('random')
let $randomFavourite = document.getElementById('randomFavourite')
let $time = document.getElementById('time')

let $search = document.getElementById('search')
let $searchClear = document.getElementById('searchClear')

let $filterFavourites = document.getElementById('filterFavourites')
let $filterCollection = document.getElementById('filterCollection')
let $filterYear = document.getElementById('filterYear')

let $tableHeader = document.getElementById('tableHeader')

function loadClyp(index) {
    let code = music[index].code
    if (code) {
        $clypDiv.innerHTML = '<iframe width="100%" height="200" src="https://clyp.it/' + code + '/widget" frameborder="0"></iframe>'

        if ($tableDiv.getElementsByClassName('selected')[0]) $tableDiv.getElementsByClassName('selected')[0].classList.remove('selected')
        if (document.getElementById('music-' + index)) document.getElementById('music-' + index).classList.add('selected')

        // For when a track is assigned, not selected by the user (i.e. randomly through code)
        location.hash = makeURLFriendly(music[index].name)
        setTimeout(modifyState, 10)
    } else {
        console.log('No code!')
    }
}

const sortUp = '&#9652;'
const sortDown = '&#9662;'

function loadTable() {
    sort()
    applyFilter()

    $tableDiv.innerHTML = ""
    for (let i = 0; i < musicFiltered.length; i++) {
        let track = music[musicFiltered[i]]
        let urlName = makeURLFriendly(track.name)
        let output = ''
        output += "<a href=#" + urlName + " id='music-" + musicFiltered[i] + "'><div class='track' data-id='" + musicFiltered[i] + "'>"
        
        output += "<div class='title'>" + track.name
        track.favourite ? output += "<span class='favourite'>Favourite!</span>" : ""
        output += "</div>"
        
        output += "<div class='tag album'>" + (track.album ? track.album : "-") + "</div>"
        
        output += "<div class='tag'>" + (track.year ? track.year : "-")  + "</div>"
        output += "<div class='tag'>" + (track.length ? track.length : "-") + "</div>"
        output += "</div></a>"
        $tableDiv.innerHTML += output
    }
    if (musicFiltered.length == 0) {
        let output = "<div class='empty'>No search results...</div>"
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
    if (document.body.clientWidth <= 1100) document.getElementById("top").scrollIntoView({ behavior: 'smooth' });
}

function selectTrack(e) {
    let $clicked = e.target.closest('.track')
    if ($clicked.dataset.id) {
        loadClyp($clicked.dataset.id)
        scrollToClyp()
    }
}

function selectTrackFromURL() {
    if (window.location.hash) {
        let track = window.location.hash.split('?')[0]
        
        for (let i = 0; i < music.length; i++) {
            if (music[i] && music[i].name && '#' + makeURLFriendly(music[i].name) == track) {
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
    $time.innerHTML += "<span>Max has produced </span><span class='emphasis'>" + music.length +"</span> tracks, with a total duration of <span class='emphasis'>" + countTime()+"</span>."
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

    // Account for leading 0s.
    if (seconds < 10) seconds = "0" + seconds
    if (minutes < 10) minutes = "0" + minutes
    
    return hours + ":" + minutes + ":" + seconds
}

function convertLengthToSeconds(length) {
    let time = length.split(":")
    return parseInt(time[0]) * 60 + parseInt(time[1])
}

let filter = {
    search: '',
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
            && makeURLFriendly(track.album) !== filter.collection
        ) continue
        if (filter.year != '' && track.year !== parseInt(filter.year)) continue

        musicFiltered.push(i)
    }

    if (musicSearchResults !== null) {
        for (let i = musicFiltered.length - 1; i >= 0; i--) {
            if (!musicSearchResults.includes(musicFiltered[i])) musicFiltered.splice(i,1)
        }
    }
}

function updateFilterEvent(e) {
    if (e.target.classList.contains('filter')) {
        filterFavourites()
    }

}

function filterFavourites() {
    let $btn = $filterFavourites
    let classes = $btn.classList
    if (classes.contains('include')) {
        classes.remove('include')
        classes.add('exclude')
        filter[$btn.dataset.filter] = false
    } else if (classes.contains('exclude')) {
        classes.remove('exclude')
        filter[$btn.dataset.filter] = null
    } else {
        classes.add('include')
        filter[$btn.dataset.filter] = true
    }
    filter.favourites = filter[$btn.dataset.filter]
    updateFavouritesText()

    modifyState()
    loadTable()
}
function updateFavouritesText() {
    let $btn = $filterFavourites
    let classes = $btn.classList
    if (classes.contains('include')) {
        $btn.innerHTML = 'Only Favourites'
    } else if (classes.contains('exclude')) {
        $btn.innerHTML = 'No Favourites'
    } else {
        $btn.innerHTML = 'Favourites'
    }
}

function updateFilterSelect(e) {
    if (e.target.classList.contains('filter')) {
        if (e.target.dataset.filter == 'collection') {
            filter.collection = e.target.value
            filter.collection = e.target.value
            modifyState()
        } else if (e.target.dataset.filter == 'year') {
            filter.year = e.target.value
            filter.year = e.target.value
            modifyState()
        }
        
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
        $filterCollection.innerHTML += "<option value='" + makeURLFriendly(albums[i])+"'>"+albums[i]+"</option>"
    }
    $filterCollection.innerHTML += "<option value='-'>Other</option>"

    $filterYear.innerHTML = "<option value=''>All Years</option>"
    for (let i = 0; i < years.length; i++) {
        $filterYear.innerHTML += "<option value='" + years[i] + "'>" + years[i] + "</option>"
    }
}

function sortEvent(e) {
    let $clicked = e.target
    let $sortSpan = $clicked.getElementsByClassName('sort')[0]
    if ($sortSpan == undefined) {
        $sortSpan = e.target
        $clicked = $clicked.parentElement
    }
    let allSortUp = $tableHeader.getElementsByClassName('sortUp')
    let allSortDown = $tableHeader.getElementsByClassName('sortDown')
    
    sortBy.type = $clicked.dataset.sort
    if ($clicked.classList.contains('sortUp')) sortBy.reverse = true
    else sortBy.reverse = false
    
    for (let i = 0; i < allSortUp.length; i++){
        allSortUp[i].getElementsByClassName('sort')[0].innerHTML = ''
        
        allSortUp[i].classList.remove('sortUp')
    }
    for (let i = 0; i < allSortDown.length; i++) {
        allSortDown[i].getElementsByClassName('sort')[0].innerHTML = ''
        allSortDown[i].classList.remove('sortDown')
    }

    if (sortBy.reverse) {
        $sortSpan.innerHTML = sortDown
        $clicked.classList.add('sortDown')
    } else {
        $sortSpan.innerHTML = sortUp
        $clicked.classList.add('sortUp')
    }

    loadTable()
}

let sortBy = {
    type: 'collection',
    reverse: false
}

function sortByName(a, b) {
    let fa = a.name
    fa === undefined ? fa = '-' : fa = fa.toLowerCase()
    let fb = b.name
    fb === undefined ? fb = '-' : fb = fb.toLowerCase()

    if (fa < fb) return -1
    if (fa > fb) return 1
    return 0
}
function sortByAlbum(a, b) {
    let fa = a.album
    fa === undefined ? fa = 'zzz' : fa = fa.toLowerCase()
    let fb = b.album
    fb === undefined ? fb = 'zzz' : fb = fb.toLowerCase()

    if (fa < fb) return -1
    if (fa > fb) return 1
    return sortByTrack(a, b)
}
function sortByYear(a, b) {
    let fa = a.year
    fa === undefined ? fa = 'zzz' : fa = parseInt(fa)
    let fb = b.year
    fb === undefined ? fb = 'zzz' : fb = parseInt(fb)

    if (fa < fb) return -1
    if (fa > fb) return 1
    return sortByAlbum(a, b)
}

function sortByLength(a, b) {
    let fa = a.length
    fa === undefined ? fa = 'zzz' : fa = convertLengthToSeconds(fa)
    let fb = b.length
    fb === undefined ? fb = 'zzz' : fb = convertLengthToSeconds(fb)

    if (fa < fb) return -1
    if (fa > fb) return 1
    return 0
}

function sortByTrack(a, b) {
    let fa = a.track
    fa === undefined ? fa = 'zzz' : fa = parseInt(fa)
    let fb = b.track
    fb === undefined ? fb = 'zzz' : fb = parseInt(fb)

    if (fa < fb) return -1
    if (fa > fb) return 1
    return sortByName(a,b)
}

function sort() {
    switch (sortBy.type) {
        case 'title':
            music.sort((a, b) => sortByName(a, b))
            break
        case 'collection':
            music.sort((a, b) => sortByAlbum(a, b))
            break
        case 'year':
            music.sort((a, b) => sortByYear(a, b))
            break
        case 'length':
            music.sort((a, b) => sortByLength(a, b))
            break
    }
    if (sortBy.reverse) music.reverse()
}

function searchEvent(e) {
    search(e.target.value)
}

function search(query = '') {
    query = query.toLowerCase()
    if (query === '') {
        musicSearchResults = null
        filter.search = ''
    } else {
        filter.search = query
        musicSearchResults = []
        // get search results
        for (let i = 0; i < music.length; i++) {
            let track = music[i]
            
            if (track.name && track.name.toLowerCase().search(query) !== -1) {
                musicSearchResults.push(i)
                continue
            }
            if (track.album && track.album.toLowerCase().search(query) !== -1) {
                musicSearchResults.push(i)
                continue
            }
        }
    }
    modifyState()
    loadTable()
}

function modifyState() {
    let queryParams = []
    if (filter.search !== '') queryParams.push('search=' + filter.search)
    if (filter.favourites !== null) queryParams.push('favourites=' + filter.favourites)
    if (filter.collection !== '') queryParams.push('collection=' + filter.collection)
    if (filter.year !== '') queryParams.push('year=' + filter.year)
    
    queryParams = queryParams.join('&')
    if (queryParams !== '') queryParams = "?" + queryParams

    let stateObj = { id: "100" };
    window.history.replaceState(stateObj,
        "Search", window.location.href.split('?')[0] + queryParams);
}

function getQueryParams() {
    let queryParams = window.location.href.split('?')
    if (queryParams[1]) queryParams = queryParams[1].split('&')

    for (let i = 0; i < queryParams.length; i++) {
        let param = queryParams[i].split('=')

        if (param[0] == 'favourites') {
            if (param[1] == 'true') filter.favourites = true
            else if (param[1] == 'false') filter.favourites = false
            if (filter.favourites) $filterFavourites.classList.add('include') 
            else $filterFavourites.classList.add('exclude')
        } else if (param[0] == 'collection') {
            filter.collection = param[1]
            $filterCollection.value = filter.collection
        } else if (param[0] == 'year') {
            filter.year = param[1]
            $filterYear.value = filter.year
        } else if (param[0] == 'search') {
            filter.search = param[1]
            $search.value = filter.search
            search(filter.search)
        }
    }
}

function searchClear(e) {
    $search.value = ''
    search()
}



function init() {
    redirectToHttps()
    cleanLinks()
    
    loadFilterCollectionOptions()
    sort()
    getQueryParams()
    updateFavouritesText()

    loadTable()
    loadTime()
    selectTrackFromURL()

    $tableDiv.addEventListener("click", selectTrack)
    $random.addEventListener("click", loadRandom)
    $randomFavourite.addEventListener("click", loadRandomFavourite)

    $filterFavourites.addEventListener("click", updateFilterEvent)
    $filterCollection.addEventListener("change", updateFilterSelect)
    $filterYear.addEventListener("change", updateFilterSelect)

    $tableHeader.addEventListener("click", sortEvent)
    $search.addEventListener("input", searchEvent)
    $searchClear.addEventListener("click", searchClear)
}