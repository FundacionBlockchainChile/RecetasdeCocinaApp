import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as serachView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader, recipe } from "./views/base";

// Global State of the App      **********************************************
// Search object
// Current recipe object
// Shopping list Object
// Liked recipes

const state = {};

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
  // console.log(id)

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
      recipeView.renderRecipe(state.recipe)
    } catch (error) {
      console.log("Error procesing recipe!");
    }
  }
};

// Listener
// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)

["hashchange", "load"].forEach((element) => {window.addEventListener(element, controlRecipe)});

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec')
      recipeView.updateServingsIngredients(state.recipe)
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc')
    recipeView.updateServingsIngredients(state.recipe)
  }
  console.log(state.recipe)
})
