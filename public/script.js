// When the app loads, display view posts page
// Display filter controls
// Check if logged in
// If logged in:
// Display create button
// Display log out button
// Get posts from server of user's platform
// Set platform filter to user's platform
// Display posts and (edit, comment, view, delete) buttons
// Else:
// display login/register button
// Get posts from server
// Display posts

// When user clicks - Create button
// Load create post page

// When user clicks - Reply button

function displayHeaderButtons() {
  $(`.js-header-section`).html(`
    <button type="button" class="js-back-btn back-btn">Back</button>
    <button type="button" class="js-create-post-btn">Create Post</button>
    <button type="button" class="js-logout-btn">Logout</button>
  `);
}

function displayFilterControls() {
  // Should the name be the same as the id and value?
  // Set what gets displayed when an item is checked (repopulate posts)
  $(`.js-controls-section`).html(`
      <legend class="filter-legend">Select one or more platform(s)</legend>
      <input type="checkbox" name="platform" id="pc" value="pc" checked><label for="pc">PC</label>
      <input type="checkbox" name="platform" id="xb1" value="xb1" checked><label for="xb1">Xbox</label>
      <input type="checkbox" name="platform" id="psn" value="psn"><label for="psn">Playstation</label>
      <input type="submit" class="platform-submit" value="Search">
  `);
}

function displayLoginRegisterButton() {
  $(`.js-header-section`).html(`
    <button type="button" class="js-back-btn back-btn">Back</button>
    <button type="button" class="js-login-btn">Login</button>
    <button type="button" class="js-register-btn">Register</button>
  `);
}

function getPostsRequest(success) {
  $.ajax({
    url: "/api/posts/",
    type: "GET",
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      success(data);
    }
  });
}

function generatePostElement(post) {
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
    <li class="js-post post">
      <h2 class="posts-title">${post.postName}</h2>
      <div class="post-info">
        <p class="post-username">${post.user}</p>
        <p class="posts-platform">${post.platform}</p>
        <p class="posts-region">${post.region}</p>
        <p class="posts-deadline">${post.deadline.toLocaleString()}</p>
      </div>
      <div> 
        <p class="posts-message">${post.message}</p>
      </div>
      <ul class="comments-section">
        ${listOfReplies.join("")}
      </ul>
    </li>
`;
}

// Consider using a ternary operator to combine the protected function

function generatePostElementProtected(post) {
  const listOfReplies = post.comments.map(
    reply => `
    <li>
      <p class="reply-author">${reply.user}</p>
      <p class="reply-message">${reply.message}</p>
      <p class="reply-date">${reply.datePosted}</p>
    </li>
  `
  );
  return `
    <li class="js-post post ">
      <h2 class="posts-title">${post.postName}</h2>
      <div class="post-info">
        <p class="post-username">${post.user}</p>
        <p class="posts-platform">${post.platform}</p>
        <p class="posts-region">${post.region}</p>
        <p class="posts-deadline">${post.deadline.toLocaleString()}</p>
    </div>
    <div>
      <p class="posts-message">${post.message}</p>
    </div>
    <ul class="comments-section">
      ${listOfReplies.join("")}
    </ul>
    <button type="button" class="js-view-btn">View</button>
    <button type="button" class="js-reply-btn">Reply</button>
</li>
`;
}

function displayPosts(posts) {
  const listOfPosts = posts.map(post => generatePostElement(post));
  $(`.js-content-section`).html(`
    <ul class="posts-list">
      ${listOfPosts.join("")}
    </ul>
  `);
}

function displayPostsProtected(posts) {
  const listOfPosts = posts.map(post => generatePostElementProtected(post));
  $(`.js-content-section`).html(`
    <ul class="posts-list">
      ${listOfPosts.join("")}
    </ul>
  `);
  $(`.js-alert-section`).html(``);
}

function displayLoginPage() {
  $(`.js-header-section`).html(``);
  $(`.js-content-section`).html(`
    <form class="js-login-form">
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
  $(`.js-content-section`).html(` 
      <form class="js-register-form">
        <label for="username-register">Username:</label>
        <input type="text" name="username-register" class="username-register" required>
        <label for="password-register">Password:</label>
        <input type="password" name="password-register" class="password-register" required>
        <label for="password-confirm">Confirm Password:</label>
        <input type="password" name="password-confirm" class="password-confirm" required>       
          <legend>Select one platform</legend>
          <input type="radio" name="platform" id="pc" value="pc" checked><label for="pc">PC</label>
          <input type="radio" name="platform" id="xb1" value="xb1"<label for="xb1">Xbox</label>
          <input type="radio" name="platform" id="psn" value="psn"><label for="psn">Playstation</label>
          <legend>Select one region</legend>
          <input type="radio" name="region" id="na-west" value="na-west" checked><label for="na-west">North America (West)</label>
          <input type="radio" name="region" id="na-east" value="na-east"<label for="na-east">North America (EAST)</label>
          <input type="radio" name="region" id="eu" value="eu"><label for="eu">Europe</label>
        <button type="submit">Register</button>
      </form>
  `);
}

function displayCreatePostPage() {
  const todayDate = new Date().toJSON().slice(0, 19);
  const dt = new Date();
  dt.setMinutes(dt.getMinutes() + 30);
  $(`.js-header-section`).html(``);
  $(`.js-controls-section`).html(``);
  $(`.js-content-section`).html(`
    <form class="js-create-post-form">
      <label for="create-post-name">Title</label>
      <input type="text" name="create-post-name" class="create-post-name">
      <br>
      <legend>Select one platform</legend>
      <input type="radio" class="create-platform" name="create-platform" id="pc" value="pc" checked><label for="pc">PC</label>
      <input type="radio" class="create-platform" name="create-platform" id="xb1" value="xb1"<label for="xb1">Xbox</label>
      <input type="radio" class="create-platform" name="create-platform" id="psn" value="psn"><label for="psn">Playstation</label>
      <br>
      <label for="create-deadline">Deadline</label>
      <input type="datetime-local" id="create-deadline" class = "create-deadline"
       name="create-deadline" value="${todayDate}"
       min="${todayDate}" max="2025-06-14T00:00">
      <button type="submit">Create</button>
    </form>
  `);
}

function loginRequest(username, password) {
  $.ajax({
    url: "/api/auth/login",
    type: "POST",
    data: JSON.stringify({ username, password }),
    contentType: "application/json",
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      localStorage.setItem("token", data.authToken);
      displayHeaderButtons();
      displayFilterControls();
      getPostsRequest(displayPostsProtected);
    }
  });
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const username = $(event.currentTarget)
    .find(".username-login")
    .val();
  const password = $(event.currentTarget)
    .find(".password-login")
    .val();
  loginRequest(username, password);
}

function registerRequest(username, password, platform, region) {
  $.ajax({
    url: "/api/users",
    type: "POST",
    data: JSON.stringify({ username, password, platform, region }),
    contentType: "application/json",
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      document.location.reload();
    }
  });
}

function postPostRequest(postName, platform, deadline) {
  $.ajax({
    url: "/api/posts/",
    type: "POST",
    data: JSON.stringify({ postName, platform, deadline }),
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      displayHeaderButtons();
      displayFilterControls();
      getPostsRequest(displayPostsProtected);
    }
  });
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const username = $(event.currentTarget)
    .find(".username-register")
    .val();
  const password = $(event.currentTarget)
    .find(".password-register")
    .val();
  const passwordConfirm = $(event.currentTarget)
    .find(".password-confirm")
    .val();
  const platform = $(event.currentTarget)
    .find("[name=platform]:checked")
    .val();
  const region = $(event.currentTarget)
    .find("[name=region]:checked")
    .val();
  if (password === passwordConfirm) {
    registerRequest(username, password, platform, region);
    $(".js-alert-section").html(`<p></p>`);
    // document.location.reload()
    // loginRequest(username, password)
  } else {
    $(".js-alert-section").html(`<p>Passwords must match</p>`);
  }
}

function handlePostSubmit(event) {
  event.preventDefault();
  const postName = $(event.currentTarget)
    .find(".create-post-name")
    .val();
  const platform = $(event.currentTarget)
    .find(".create-platform")
    .val();
  const deadline = $(event.currentTarget)
    .find(".create-deadline")
    .val();

  postPostRequest(postName, platform, deadline);
}

function handleLogOut() {
  localStorage.clear();
  document.location.reload();
}

$(function onLoad() {
  let loggedIn = localStorage.getItem("token");

  if (loggedIn) {
    displayHeaderButtons();
    displayFilterControls();
    getPostsRequest(displayPostsProtected);
  } else {
    displayLoginRegisterButton();
    getPostsRequest(displayPosts);
    $(`.js-view-btn`).css("display", "none");
    $(`.js-reply-btn`).css("display", "none");

    // View Button
  }
  $(`.js-header-section`).on("click", ".js-logout-btn", handleLogOut);
  $(`.js-header-section`).on(
    "click",
    ".js-create-post-btn",
    displayCreatePostPage
  );
  $(`.js-header-section`).on("click", ".js-login-btn", displayLoginPage);
  $(`.js-header-section`).on("click", ".js-register-btn", displayRegisterPage);
  $(`.js-content-section`).on("submit", ".js-login-form", handleLoginSubmit);
  $(`.js-content-section`).on(
    "submit",
    ".js-register-form",
    handleRegisterSubmit
  );
  $(`.js-content-section`).on(
    "submit",
    ".js-create-post-form",
    handlePostSubmit
  );
});
