
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
    

    // generate name
    $name.innerHTML = recipe.name ? recipe.name : '???'
    
    $about.innerHTML = ''
    // generate image
    if (recipe.pic) {
        $about.innerHTML += "<img class='bigPic' src=" + ('/images/recipes/' + recipe.pic) + ">"
    }

    // generate about text
    $about.innerHTML += "<p>" + (recipe.about ? recipe.about : '???') + "</p>"

    // generate tags
    if (Array.isArray(recipe.tags)) {
        $tags.innerHTML = ''
        if (recipe.isVegetarian) $tags.innerHTML += "<span class='green'>Vegetarian</span>"
        for (let i = 0; i < recipe.tags.length; i++) {
            $tags.innerHTML += "<span>" + recipe.tags[i] + "</span>"
        }
    } else {
        $tags.innerHTML = '???'
    }

    // generate ingredients
    if (Array.isArray(recipe.ingredients)) {
        $ingredients.innerHTML = ''
        for (let i = 0; i < recipe.ingredients.length; i++) {
            $ingredients.innerHTML += "<li>" + recipe.ingredients[i] + "</li>"
        }
    } else {
        $ingredients.innerHTML = '???'
    }

    // generate instructions
    if (Array.isArray(recipe.instructions)) {
        $instructions.innerHTML = ''
        for (let i = 0; i < recipe.instructions.length; i++) {
            $instructions.innerHTML += "<li>" + recipe.instructions[i] + "</li>"
        }
    } else {
        $instructions.innerHTML = '???'
    }

    // generate notes
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

    // Update selected recipe in table
    if ($tableDiv.getElementsByClassName('selected')[0]) $tableDiv.getElementsByClassName('selected')[0].classList.remove('selected')
    document.getElementById('recipe-'+index).classList.add('selected')
}

function getTable() {
    $tableDiv.innerHTML = ''
    for (let i = 0; i < recipes.length; i++) {
        let urlName = makeURLFriendly(recipes[i].name)
        let output = ''
        output += "<a href=#" + urlName + " id='recipe-" + i + "'><div data-id='" + i + "'>"
        output += recipes[i].name
        if (recipes[i].isVegetarian) {
            output += "<span class='veg'>V</span>"
        }
        output += "</div></a>"
        $tableDiv.innerHTML += output
    }    
}

function selectRecipe(e) {
    let $clicked = e.target
    if ($clicked.dataset.id) {
        setSelectedRecipe($clicked.dataset.id)
        scrollToRecipe()
    } else alert('Something went wrong?!')
}

function scrollToRecipe() {
    if (document.body.clientWidth <= 700) document.getElementById("top").scrollIntoView({ behavior: 'smooth' });
}

function quickLink(e) {
    if (e.target.classList.contains("quickLink")) {
        setTimeout(() => {
            selectRecipeFromURL()
            scrollToRecipe()
        }, 10);
    }
}

function selectRecipeFromURL() {
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
}

function init() {
    cleanLinks()
    getTable()
    selectRecipeFromURL()

    
    $display.addEventListener("click", quickLink)
    $tableDiv.addEventListener("click", selectRecipe)
}


/*
/// Recipes to add

,
    
    {
        "name": "Lentils and Rice",
        "isVegetarian": "true",
        "tags": []
    },
    {
        "name": "Bowtie Pasta",
        "isVegetarian": "true"
    }
    {
        "name": "Sterz"
    },
    {
        "name": "Sauerkraut Soup"
    },
    {
        "name": "Vegetarian Chilli",
        "isVegetarian": "true",
        "tags": []
    },
    {
        "name": "Shakshouka",
        "isVegetarian": "true",
        "tags": []
    },
    {
        "name": "Mushroom Burgers",
        "isVegetarian": "true",
        "tags": []
    },
    {
        "name": "Loobia Korosht",
        "tags": []
    },
    {
        "name": "Ham and Pasta",
        "tags": []
    },
    {
        "name": "Pizza",
        "pic": "pizza.jpg",
        "isVegetarian": "true",
        "tags": []
    }

*/