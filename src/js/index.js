import Search from './models/Search'
import * as serachView from './views/searchView'
import { elements } from './views/base'

// Global State of the App **********************************************
// Search object
// Current recipe object
// Shopping list Object
// Liked recipes

const state = {}

// const search = new Search('pizza');
// console.log(search)
// console.log(search.getResults())

// Functions
const controlSearch = async () => {
    // Get query from view
    const query = serachView.getInput()
    console.log(query)

    if (query) {
        // Get query from view
        state.search = new Search(query)
        // Prepare UI for results
        serachView.clearInput()
        serachView.clearResult()
        // Search fro recipes
        await state.search.getResults()
        // Render result on UI
        serachView.renderResults(state.search.result)

    }
}

elements.searchForm.addEventListener('submit', e => {   
    e.preventDefault()    
    controlSearch()
})