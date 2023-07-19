
let recipes = null
fetch('/scripts/recipes.json')
    .then((response) => response.json())
    .then((json) => recipes = json)
    .then(() => init())

let $tableDiv = document.getElementById('tableDiv') 
let $display = document.getElementById('displayedRecipe')

function setSelectedRecipe(index) {
    let recipe = recipes[index]

    let $name = document.getElementById('name')
    let $tags = document.getElementById('tags')
    let $about = document.getElementById('about')
    let $ingredients = document.getElementById('ingredients')
    let $instructions = document.getElementById('instructions')
    let $notes = document.getElementById('notes')
    let $pic = document.getElementById('pic')
    
    $name.innerHTML = recipe.name ? recipe.name : '???'
    $name.innerHTML += '<a class="anchor" id="top"></a>'
    

    $about.textContent = recipe.about ? recipe.about : '???'
    
    $pic.src = recipe.pic ? '/images/recipes/' + recipe.pic : ''

    if (Array.isArray(recipe.instructions)) {
        $instructions.innerHTML = ''
        for (let i = 0; i < recipe.instructions.length; i++) {
            $instructions.innerHTML += "<li>" + recipe.instructions[i] + "</li>"
        }
    } else {
        $instructions.innerHTML = '???'
    }

    if (Array.isArray(recipe.tags)) {
        $tags.innerHTML = ''
        for (let i = 0; i < recipe.tags.length; i++) {
            $tags.innerHTML += "<span>" + recipe.tags[i] + "</span>"
        }
    } else {
        $tags.innerHTML = '???'
    }

    if (Array.isArray(recipe.ingredients)) {
        $ingredients.innerHTML = ''
        for (let i = 0; i < recipe.ingredients.length; i++) {
            $ingredients.innerHTML += "<li>" + recipe.ingredients[i] + "</li>"
        }
    } else {
        $ingredients.innerHTML = '???'
    }

    if (Array.isArray(recipe.notes)) {
        if (recipe.notes.length == 0) $notes.innerHTML = ''
        else {
            let output = '<div class="noteBox"><p class="emphasis">Notes:</p><ol>'
        
            for (let i = 0; i < recipe.notes.length; i++) {
                output += "<li>" + recipe.notes[i] + "</li>"
            }
            output += '</ol></div>'
            $notes.innerHTML = output
        }
    } else {
        $notes.innerHTML = ''
    }
    if ($tableDiv.getElementsByClassName('selected')[0]) $tableDiv.getElementsByClassName('selected')[0].classList.remove('selected')

    document.getElementById('recipe-'+index).classList.add('selected')
}

function getTable() {
    for (let i = 0; i < recipes.length; i++) {
        let urlName = makeURLFriendly(recipes[i].name)
        $tableDiv.innerHTML += "<a href=#"+urlName+" id='recipe-"+i+"'><div data-id='"+i+"'>" + recipes[i].name + "</div></a>"
    }    
}

function makeURLFriendly(text) {
    return text.replaceAll(' ', '_').toLowerCase()
}

function selectRecipe(e) {
    let $clicked = e.target
    if ($clicked.dataset.id) {
        setSelectedRecipe($clicked.dataset.id)
        if (document.body.clientWidth <= 700) document.getElementById("top").scrollIntoView({ behavior: 'smooth' });
    } else alert('Something went wrong?!')
}


function init() {
    getTable()
    if (window.location.hash) {
        for (let i = 0; i < recipes.length; i++) {
            if (recipes[i] && recipes[i].name && '#' + makeURLFriendly(recipes[i].name) == window.location.hash) {
                setSelectedRecipe(i)
                break
            }
        }
    } else {
        setSelectedRecipe(0)
    }

    $tableDiv.addEventListener("click", selectRecipe)
}