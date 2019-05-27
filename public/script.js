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

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  let month = date.getMonth();
  let day = date.getDate();
  let year = date.getFullYear();
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime =
    hours + ":" + minutes + " " + ampm + " " + month + "/" + day + "/" + year;
  return strTime;
}

// Consider using a ternary operator to combine the protected function

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

  if (password === passwordConfirm) {
    registerRequest(username, password, platform);
    $(".js-alert-section").html(`<p></p>`);
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
  const region = $(event.currentTarget)
    .find(".region")
    .val();
  const message = $(event.currentTarget)
    .find(".create-message")
    .val();
  postPostRequest(
    postName,
    platform,
    region,
    deadline,
    message,
    displayHomePage
  );
}

function handleLogOut() {
  localStorage.clear();
  document.location.reload();
}

function displayMyPosts() {
  getMyPostsRequest(mapMyPosts);
  $(".js-controls-section").html("");
}

function handleViewPost(event) {
  const id = $(event.target)
    .closest(".js-post")
    .data("post-id");
  getPostRequest(id, displayPost);
}

function handleEditPost(event) {
  const id = $(event.target)
    .closest(".js-post")
    .data("post-id");
  getPostRequest(id, displayEditPostPage);
}

function handleEditPostSubmit(event) {
  event.preventDefault();
  const id = $(event.target)
    .find(".post-id")
    .val();
  const postName = $(event.currentTarget)
    .find(".create-post-name")
    .val();
  const platform = $(event.currentTarget)
    .find(".create-platform")
    .val();
  const deadline = $(event.currentTarget)
    .find(".create-deadline")
    .val();
  const region = $(event.currentTarget)
    .find(".region")
    .val();
  const message = $(event.currentTarget)
    .find(".create-message")
    .val();
  putPostRequest(
    id,
    postName,
    platform,
    region,
    deadline,
    message,
    displayHomePage
  );
}

function handleReplyPost(event) {
  const id = $(event.target)
    .closest(".js-post")
    .data("post-id");
  console.log(id);
  getPostRequest(id, displayReplyPostPage);
}

function handleDeleteMyPost(event) {
  const id = $(event.target)
    .closest(".js-post")
    .data("post-id");
  deleteMyPost(id, displayMyPosts);
}

function handlePlatformSearch(event) {
  event.preventDefault();
  const platforms = [];
  $("input[name='platform']:checked").each(function() {
    platforms.push($(this).val());
  });
  getPostsRequestwPlatforms(platforms, displayPosts);

  console.log(platforms);
}

function handleReplySubmit(event) {
  event.preventDefault();
  const id = $(event.target)
    .closest(".js-post")
    .data("post-id");
  const reply = $(event.currentTarget)
    .find(".create-comment")
    .val();
  console.log(id, reply);
  putReplyRequest(id, reply, displayPost);
}

$(function onLoad() {
  let loggedIn = localStorage.getItem("token");

  if (loggedIn) {
    displayHeaderButtons();
    displayFilterControls();
    getPostsRequest(displayPosts);
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
  $(`.js-header-section`).on("click", ".js-my-posts-btn", displayMyPosts);
  $(`.js-header-section`).on("click", ".js-home-btn", displayHomePage);
  $(`.js-header-section`).on(
    "click",
    ".js-home-btn-logged-out",
    displayHomePageLoggedOut
  );
  $(`.js-header-section`).on("click", ".js-register-btn", displayRegisterPage);
  $(`.js-content-section`).on("click", ".js-edit-btn", handleEditPost);
  $(`.js-content-section`).on("click", ".js-reply-btn", handleReplyPost);
  $(`.js-controls-section`).on(
    "submit",
    ".js-platform-form",
    handlePlatformSearch
  );
  $(`.js-content-section`).on("click", ".js-delete-btn", handleDeleteMyPost);
  $(`.js-content-section`).on("click", ".js-view-btn", handleViewPost);
  $(`.js-content-section`).on("submit", ".js-login-form", handleLoginSubmit);
  $(`.js-content-section`).on(
    "submit",
    ".js-register-form",
    handleRegisterSubmit
  );
  $(`.js-content-section`).on("submit", ".js-reply-form", handleReplySubmit);
  $(`.js-content-section`).on(
    "submit",
    ".js-create-post-form",
    handlePostSubmit
  );
  $(`.js-content-section`).on(
    "submit",
    ".js-edit-post-form",
    handleEditPostSubmit
  );
});
