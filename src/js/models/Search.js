import axios from "axios";
import { proxyList } from '../config'

// Class                    **********************************************

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(
        `${proxyList}${this.query}`
      );
      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}

// const details = await axios(
//     `https://forkify-api.herokuapp.com/api/get?rId=${recipie}`
//   );
//   console.log(details.data.recipe);
