function displayHeaderButtons() {
  $(`.js-header-section`).html(`
    <button type="button" class="js-home-btn home-btn">Home</button>
    <button type="button" class="js-my-posts-btn my-posts-btn">My Posts</button>
    <button type="button" class="js-create-post-btn">Create Post</button>
    <button type="button" class="js-logout-btn">Logout</button>
  `);
}

function displayFilterControls() {
  // Set what gets displayed when an item is checked (repopulate posts)
  $(`.js-controls-section`).html(`
    <form class="js-platform-form platform-form">
      <legend class="filter-legend">Select one or more platform(s)</legend>
      <input type="checkbox" name="platform" id="pc" value="pc" checked><label for="pc">PC</label>
      <input type="checkbox" name="platform" id="xb1" value="xb1" checked><label for="xb1">Xbox</label>
      <input type="checkbox" name="platform" id="psn" value="psn" checked><label for="psn">Playstation</label>
      <button type="submit">Search</button>
    </form>
  `);
}

function displayLoginRegisterButton() {
  $(`.js-header-section`).html(`
    <button type="button" class="js-home-btn-logged-out home-btn">Home</button>
    <button type="button" class="js-login-btn">Login</button>
    <button type="button" class="js-register-btn">Register</button>
  `);
}

function displayPosts(posts) {
  const listOfPosts = posts.map(post => generatePostElement(post));
  $(`.js-content-section`).html(`
    <ul class="posts-list">
      ${listOfPosts.join("")}
    </ul>
  `);
  $(`.js-alert-section`).html(``);
}

function displayPost(post) {
  const post1 = generateViewPostElement(post);
  $(`.js-content-section`).html(`
  <ul class="posts-list">
    ${post1}
  </ul>`);
  $(`.js-alert-section`).html(``);
}

function mapMyPosts(posts) {
  const listOfPosts = posts.map(post => generateMyPostElement(post));
  $(`.js-content-section`).html(`
    <ul class="posts-list">
      ${listOfPosts.join("")}
    </ul>
  `);
  $(`.js-alert-section`).html(``);
}

function displayLoginPage() {
  displayLoginRegisterButton();
  $(`.js-content-section`).html(`
    <form class="js-login-form login-form">
      <p>Username is case sensitive</p>
      <label for="username-login">Username:</label>
      <input type="text" name="username-login" class="username-login">
      <br>
      <label for="password-login">Password:</label>
      <input type="password" name="password-login" class="password-login">
      <br>
      <button type="submit">Login</button>
    </form>
  `);
}

function displayRegisterPage() {
  displayLoginRegisterButton();
  $(`.js-content-section`).html(` 
      <form class="js-register-form register-form">
        <p>Username is case sensitive</p>
        <label for="username-register">Username:</label>
        <br>
        <input type="text" name="username-register" class="username-register" required>
        <br>
        <label for="password-register">Password:</label>
        <br>
        <input type="password" name="password-register" class="password-register" required>
        <br>
        <label for="password-confirm">Confirm Password:</label>
        <br>
        <input type="password" name="password-confirm" class="password-confirm" required> 
        <br>      
        <legend>Select one platform</legend>
        <input type="radio" name="platform" id="pc" value="pc" checked><label for="pc">PC</label>
        <input type="radio" name="platform" id="xb1" value="xb1"<label for="xb1">Xbox</label>
        <input type="radio" name="platform" id="psn" value="psn"><label for="psn">Playstation</label>
        <button type="submit">Register</button>
      </form>
  `);
}

function displayHomePage() {
  displayHeaderButtons();
  displayFilterControls();
  getPostsRequest(displayPosts);
}

function displayHomePageLoggedOut() {
  displayLoginRegisterButton();
  getPostsRequest(displayPosts);
  $(`.js-view-btn`).css("display", "none");
  $(`.js-reply-btn`).css("display", "none");
}

function displayCreatePostPage() {
  let todayDate = new Date();
  // const date1 = todayDate.toJSON().slice(0, 16);
  todayDate.setMinutes(todayDate.getMinutes() + 60);
  const date2 = dateFns.format(todayDate.toLocaleString(), "YYYY-MM-DDTHH:mm");
  displayHeaderButtons();
  $(`.js-controls-section`).html(``);
  $(`.js-content-section`).html(`
    <form class="js-create-post-form create-post-form">
      <label for="create-post-name">Title</label>
      <br>
      <input type="text" name="create-post-name" class="create-post-name">
      <br>
      <label for="create-message">Message</label>
      <br>
      <textarea rows="4" cols="50" name="create-message" class="create-message" form="js-create-post-form"></textarea>
      <br>
      <legend>Select one platform</legend>
      <input type="radio" class="create-platform" name="create-platform" id="pc" value="pc" checked><label for="pc">PC</label>
      <input type="radio" class="create-platform" name="create-platform" id="xb1" value="xb1"<label for="xb1">Xbox</label>
      <input type="radio" class="create-platform" name="create-platform" id="psn" value="psn"><label for="psn">Playstation</label>
      <br>
      <legend>Select one region</legend>
      <input type="radio" name="region" class="region" id="na-west" value="na-west" checked><label for="na-west">North America (West)</label>
      <input type="radio" name="region" class="region" id="na-east" value="na-east"<label for="na-east">North America (EAST)</label>
      <input type="radio" name="region" class="region" id="eu" value="eu"><label for="eu">Europe</label>
      <br>
      <label for="create-deadline">Deadline</label>
      <input type="datetime-local" id="create-deadline" class = "create-deadline"
       name="create-deadline" value="${date2}"
       min="${date2}">
       <br>
      <button type="submit">Create</button>
    </form>
  `);
}

function displayEditPostPage(post) {
  let todayDate = new Date(post.deadline);
  // const date1 = todayDate.toJSON().slice(0, 16);
  // todayDate.setMinutes(todayDate.getMinutes() + 60);
  const date2 = dateFns.format(todayDate.toLocaleString(), "YYYY-MM-DDTHH:mm");
  displayHeaderButtons();
  $(`.js-controls-section`).html(``);
  $(`.js-content-section`).html(`
    <form class="js-edit-post-form create-edit-form">
      <input type="hidden" name="post-id" class="post-id" value="${post.id}">
      <label for="create-post-name">Title</label>
      <br>
      <input type="text" name="create-post-name" class="create-post-name" value="${
        post.postName
      }">
      <br>
      <label for="create-message">Message</label>
      <br>
      <textarea rows="4" cols="50" name="create-message" class="create-message" form="js-create-post-form" placeholder="${
        post.message
      }"></textarea>
      <br>
      <legend>Select one platform</legend>
      <input type="radio" class="create-platform" name="create-platform" id="pc" value="pc" checked><label for="pc">PC</label>
      <input type="radio" class="create-platform" name="create-platform" id="xb1" value="xb1"<label for="xb1">Xbox</label>
      <input type="radio" class="create-platform" name="create-platform" id="psn" value="psn"><label for="psn">Playstation</label>
      <br>
      <legend>Select one region</legend>
      <input type="radio" name="region" class="region" id="na-west" value="na-west" checked><label for="na-west">North America (West)</label>
      <input type="radio" name="region" class="region" id="na-east" value="na-east"<label for="na-east">North America (EAST)</label>
      <input type="radio" name="region" class="region" id="eu" value="eu"><label for="eu">Europe</label>
      <br>
      <label for="create-deadline">Deadline</label>
      <input type="datetime-local" id="create-deadline" class = "create-deadline"
       name="create-deadline" value="${date2}"
       min="${date2}">
       <br>
      <button type="submit">Update</button>
    </form>
  `);
}

function displayReplyPostPage(post) {
  let deadline = new Date(post.deadline);
  // const date2 = dateFns.format(todayDate.toLocaleString(), "YYYY-MM-DDTHH:mm");
  displayHeaderButtons();
  const listOfComments = post.comments.map(
    reply => `
    <li>
      <p class="reply-author">${reply.user.username}</p>
      <p class="reply-message">${reply.message}</p>
      <p class="reply-date">${reply.datePosted}</p>
    </li>
  `
  );
  $(`.js-controls-section`).html(``);
  $(`.js-content-section`).html(`
   <div class="js-post post" data-post-id="${post.id}">
      <h2 class="posts-title">${post.postName}</h2>
      <div class="post-info">
      <p class="post-username info-box">User: ${post.username}</p>
        <p class="post-platform info-box">${post.platform.toUpperCase()}</p>
        <p class="post-region info-box">${post.region.toUpperCase()}</p>
        <p class="post-deadline info-box">${formatAMPM(deadline)}</p>
    </div>
    <div>
      <p class="posts-message">${post.message}</p>
    </div>
    <br>
    <ul class="comments-section">
      ${listOfComments.join("")}
    </ul>
    <br>
    <form class="js-reply-form reply-form">
      <textarea rows="4" cols="50" name="create-message" class="js-create-comment create-comment" form="js-reply-form"></textarea>
    <br>
      <button type="submit">Reply</button>
    
</div>
  `);
}

function generateReplies(post) {
  const listOfReplies = post.comments.map(reply => {
    const commentDate = new Date(reply.datePosted);
    return `
      <li class="reply-li">
        <p class="reply-message">${reply.message}</p> 
        <p class="reply-author">${reply.user.username}</p>
        <p class="reply-date">${formatAMPM(commentDate)}</p>
      </li>
    `;
  });
  return listOfReplies;
}

function generatePostElement(post) {
  const postButtons = !!localStorage.getItem("token")
    ? `<button type="button" class="js-view-btn post-controls">View</button>
  <button type="button" class="js-reply-btn post-controls">Reply</button>`
    : `<button type="button" class="js-view-btn post-controls">View</button>`;
  const deadline = new Date(post.deadline);
  return `
    <li class="js-post post " data-post-id="${post.id}">
      <h2 class="posts-title">${post.postName}</h2>
      <div class="post-info">
      <p class="post-username info-box">User: ${post.username}</p>
        <p class="post-platform info-box">${post.platform.toUpperCase()}</p>
        <p class="post-region info-box">${post.region.toUpperCase()}</p>
        <p class="post-deadline info-box">${formatAMPM(deadline)}</p>
    </div>
    <div>
      <p class="posts-message">${post.message}</p>
    </div>
    <ul class="comments-section">
      ${generateReplies(post).join("")}
    </ul>
    ${postButtons}
</li>
`;
}

function generateViewPostElement(post) {
  const deadline = new Date(post.deadline);
  return `
    <li class="js-post post " data-post-id="${post.id}">
      <h2 class="posts-title">${post.postName}</h2>
      <div class="post-info">
      <p class="post-username info-box">User: ${post.username}</p>
        <p class="post-platform info-box">${post.platform.toUpperCase()}</p>
        <p class="post-region info-box">${post.region.toUpperCase()}</p>
        <p class="post-deadline info-box">${formatAMPM(deadline)}</p>
    </div>
    <div>
      <p class="posts-message">${post.message}</p>
    </div>
    <ul class="comments-section">
      ${generateReplies(post).join("")}
    </ul>
    <button type="button" class="js-reply-btn post-controls">Reply</button>
</li>
`;
}

function generateMyPostElement(post) {
  const deadline = new Date(post.deadline);

  const listOfReplies = post.comments.map(
    reply => `
    <li>
      <p class="reply-author">${reply.user.username}</p>
      <p class="reply-message">${reply.message}</p>
      <p class="reply-date">${reply.datePosted}</p>
    </li>
  `
  );
  return `
    <li class="js-post post" data-post-id="${post.id}">
      <h2 class="posts-title">${post.postName}</h2>
      <div class="post-info">
      <p class="post-username info-box">User: ${post.username}</p>
        <p class="post-platform info-box">${post.platform.toUpperCase()}</p>
        <p class="post-region info-box">${post.region.toUpperCase()}</p>
        <p class="post-deadline info-box">${formatAMPM(deadline)}</p>
    </div>
    <div>
      <p class="posts-message">${post.message}</p>
    </div>
    <ul class="comments-section">
      ${generateReplies(post).join("")}
    </ul>
    <button type="button" class="js-view-btn post-controls">View</button>
    <button type="button" class="js-reply-btn post-controls">Reply</button>
    <button type="button" class="js-edit-btn post-controls">Edit</button>
    <button type="button" class="js-delete-btn post-controls">Delete</button>
</li>
`;
}
