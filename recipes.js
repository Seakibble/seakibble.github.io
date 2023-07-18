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
        ]
    }
]


let $display = document.getElementById('displayedRecipe')
function setSelectedRecipe(recipe) {
    let $name = document.getElementById('name')
    let $tags = document.getElementById('tags')
    let $about = document.getElementById('about')
    let $ingredients = document.getElementById('ingredients')
    let $instructions = document.getElementById('instructions')
    
    $name.textContent = recipe.name
    $about.textContent = recipe.about

    $instructions.innerHTML = recipe.instructions
    $instructions.innerHTML = ''
    for (let i = 0; i < recipe.instructions.length; i++) {
        $instructions.innerHTML += "<li>" + recipe.instructions[i] + "</li>"
    }

    $tags.innerHTML = ''
    for (let i = 0; i < recipe.tags.length; i++) {
        $tags.innerHTML += "<span>"+recipe.tags[i]+"</span>"
    }

    $ingredients.innerHTML = ''
    for (let i = 0; i < recipe.ingredients.length; i++) {
        $ingredients.innerHTML += "<li>" + recipe.ingredients[i] + "</li>"
    }
}

setSelectedRecipe(recipes[0])