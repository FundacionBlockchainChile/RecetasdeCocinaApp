export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = { id, title, author, img };
    this.likes.push(like);

    // Persit data in local storage
    this.presistData()
    

    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(element => element.id === id);
    this.likes.splice(index, 1);
    this.presistData()
  }

  isLiked(id) {
    return this.likes.findIndex(element => element.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  presistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes))
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'))
    // Restore likes from localstorage
    if (storage) this.likes = storage
  }
}
