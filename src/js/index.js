import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as serachView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader, recipe } from "./views/base";
import Likes from "./models/Likes";

// Global State of the App      **********************************************
// Search object
// Current recipe object
// Shopping list Object
// Liked recipes

const state = {};
window.state = state

//  SEARCH CONTROLLERS          **********************************************************
//  **************************************************************************************

// Functions
const controlSearch = async () => {
  // Get query from view
  const query = serachView.getInput();
  // console.log(query)

  if (query) {
    // Get query from view
    state.search = new Search(query);
    
    // Prepare UI for results
    serachView.clearInput();
    serachView.clearResult();
    renderLoader(elements.searchRes);

    try {
      // Search fro recipes
      await state.search.getResults();
      // Render result on UI
      clearLoader();
      serachView.renderResults(state.search.result);

    } catch (error) {
      console.log("Something wrong with the search...");
      clearLoader();
    }
  }
  console.log("Please write a Recipe to search...");
};

// Listeners
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});


elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    serachView.clearResult();
    serachView.renderResults(state.search.result, goToPage);
  }
});

//  RECIPE CONTROLLERS          **********************************************************
//  **************************************************************************************

// Functions
const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace("#", "");
  console.log(id)

  if (id) {
    // prepare UI for changes
    recipeView.clearRecipe()
    renderLoader(elements.recipe)
    if (state.recipe) serachView.highlightSelected(id)

    // create new recipe object
    state.recipe = new Recipe(id);

    try {
      // get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients()

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader()
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
        )
    } catch (error) {
      console.log("Error procesing recipe!");
    }
  }
};

// Listener
// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)
["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));

//  LIST CONTROLLERS          ************************************************************
//  **************************************************************************************

const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List()

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(ingredient => {
    const item = state.list.addItem(ingredient.count, ingredient.unit, ingredient.ingredient)
    listView.renderItem(item)
  })
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  
  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id)
    // Delete from UI
    listView.deleteItem(id)

    // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const value = parseFloat(e.target.value, 10)

    if (value > 0) {state.list.updateCount(id, value)}
    else if (value <= 0) {state.list.deleteItem(id); listView.deleteItem(id)}
  }
});


//  like CONTROLLER          ************************************************************
//  **************************************************************************************

// TESTING
state.likes = new Likes()
likesView.toggleLikeMenu(state.likes.getNumLikes())

const controlLike = () => {
  if (!state.likes) state.likes = new Likes()
  const currentID = state.recipe.id

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img)
    // Toggle like button
    likesView.toggleLikeBtn(true)

    // Add like to UI list
    console.log(state.likes)
    
    // User HAS liked current recipe
  } else {
    // Remove like from state
    state.likes.deleteLike(currentID)
    
    // Toggle like button
    likesView.toggleLikeBtn(false)
    
    // Remove like from UI list
    console.log(state.likes)

    likesView.toggleLikeMenu(state.likes.getNumLikes())
  }
}

// // Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec')
      recipeView.updateServingsIngredients(state.recipe)
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc')
    recipeView.updateServingsIngredients(state.recipe)
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList()
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike()
  }
  // console.log(state.recipe)
})

window.l = new List()
