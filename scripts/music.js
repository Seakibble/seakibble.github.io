let music = null
fetch('/scripts/music.json')
    .then((response) => response.json())
    .then((json) => music = json)
    .then(() => init())

let $tableDiv = document.getElementById('tableDiv')
let $clypDiv = document.getElementById('clypDiv')

function loadClyp(code) {
    if (code) {
        $clypDiv.innerHTML = '<iframe width="100%" height="200" src="https://clyp.it/' + code + '/widget" frameborder="0"></iframe>'
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
        output += music[i].name
        output += "<span class='tag'>" + music[i].length + "</span>"
        output += "<span class='tag'>" + music[i].year + "</span>"
        output += "<span class='tag'>" + music[i].album + "</span>"
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

function selectTrack(e) {
    let $clicked = e.target
    if ($clicked.dataset.id) {
        loadClyp(music[$clicked.dataset.id].code)
        // scrollToRecipe()

        if ($tableDiv.getElementsByClassName('selected')[0]) $tableDiv.getElementsByClassName('selected')[0].classList.remove('selected')
        document.getElementById('music-' + $clicked.dataset.id).classList.add('selected')
    }
}


function init() {
    loadTable()
    loadClyp(music[0].code)
    document.getElementById('music-0').classList.add('selected')

    $tableDiv.addEventListener("click", selectTrack)
}