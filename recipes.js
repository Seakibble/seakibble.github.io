const recipes = [
    {
        name: 'Italian Sausage Soup',
        pic: 'max_oh_no.jpg',
        tags: [
            "Serves 6-8 Italians"
        ],
        about: "This is a definite favourite meal of mine. I love making it when I feel sick or just need to be reminded of home.",
        ingredients: [
            "4-6 Italian sausages",
            "A bunch of kale",
            "1 can of chopped tomates",
            "6 cups of water",
            "2 beef stock cubes",
            "1 can of mixed beans",
            "1 cup of Macoroni",
            "Garlic (chopped or minced)",
            "Basil",
            "Cheese (Monterey Jack or Cheddar recommended)",
            "Bread"
        ],
        instructions: [
            "Remove the sausages from their casings and brown them in a big pot. Add the garlic when they're about halfway brown.",
            "When the sausages are brown, add the tomatoes, water, beef stock, beans and season with basil, salt and pepper to taste. Bring to a boil.",
            "Add the Macoroni and bring to a simmer until the macoroni is cooked.",
            "Add the kale. Wait 10-15 minutes.",
            "Garnish with cheese, then serve with a slice or two of bread."
        ],
        notes: ["You can do cool stuff with this recipe!", 'And other stuff too.']
    },
    {
        name: "Tortellini Soup",
        pic: 'max_prayer.jpg',
        tags: [
            "Serves 6-8 Tortellinis"
        ],
        about: "One of the classic meals my mother used to make, this soup is one of my biggest comfort foods.",
        ingredients: [
            "1 large pack of fresh Tortellini",
            "1 kielbasa sausage, chopped",
            "1 onion, chopped",
            "1 can of chopped tomates",
            "6 cups of water",
            "2 stock cubes",
            "1 can of mixed beans",
            "Garlic (chopped or minced)",
            "Basil",
            "Cheese (Monterey Jack or Cheddar recommended)",
            "Bread"
        ],
        instructions: [
            "Saute the onion and garlic in oil. When they're nearly done, add the sausage.",
            "Add the tomatoes, water, stock cubes, beans and basil. Bring to a steady simmer.",
            "Add the tortellini. Wait until it's cooked, probably about 10 minutes or so.",
            "Garnish with cheese, then serve with a slice or two of lovely bread!"
        ]
    },
    {
        name: "Paneer"
    },
    {
        name: "Lentils and Rice"
    },
    {
        name: "Bowtie Pasta"
    },
    {
        name: "Italian Sausage and Zucchini"
    },
    {
        name: "Sterz"
    },
    {
        name: "Sauerkraut Soup"
    },
    {
        name: "Vegetarian Chilli"
    },
    {
        name: "Dad's Chilli"
    },
    {
        name: "Shakshouka"
    },
]

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


$tableDiv.addEventListener("click",selectRecipe)