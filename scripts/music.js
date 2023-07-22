let music = null
fetch('/scripts/music.json')
    .then((response) => response.json())
    .then((json) => music = json)
    .then(() => init())

let $tableDiv = document.getElementById('tableDiv')
let $clypDiv = document.getElementById('clypDiv')

function loadClyp(index) {
    let code = music[index].code
    if (code) {
        $clypDiv.innerHTML = '<iframe width="100%" height="200" src="https://clyp.it/' + code + '/widget" frameborder="0"></iframe>'

        if ($tableDiv.getElementsByClassName('selected')[0]) $tableDiv.getElementsByClassName('selected')[0].classList.remove('selected')
        document.getElementById('music-' + index).classList.add('selected')
    } else {
        console.log('No code!')
    }
}

function loadTable() {
    $tableDiv.innerHTML = ""
    for (let i = 0; i < music.length; i++) {
        let urlName = makeURLFriendly(music[i].name)
        let output = ''
        output += "<a href=#" + urlName + " id='music-" + i + "'><div data-id='" + i + "'>"
        
        output += "<span class='title'>" + music[i].name
        music[i].favourite ? output += "<span class='favourite'>Favourite!</span>" : ""
        output += "</span>"
        
        output += "<span class='tag'>" + (music[i].album ? music[i].album : "-") + "</span>"
        
        output += "<span class='tag'>" + (music[i].year ? music[i].year : "-")  + "</span>"
        output += "<span class='tag'>" + (music[i].length ? music[i].length : "-") + "</span>"
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
        scrollToClyp()

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
        loadClyp(0)
    }
}

function init() {
    loadTable()
    document.getElementById('music-0').classList.add('selected')

    selectTrackFromURL()

    $tableDiv.addEventListener("click", selectTrack)
}