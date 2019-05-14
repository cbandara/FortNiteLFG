function displayHeaderButtons() {
  $(`.js-header-section`).html(`
    <button type="button" class="js-back-btn back-btn">Back</button>
    <button type="button" class="js-my-posts-btn my-posts-btn">My Posts</button>
    <button type="button" class="js-create-post-btn">Create Post</button>
    <button type="button" class="js-logout-btn">Logout</button>
  `);
}
