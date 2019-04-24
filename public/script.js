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
    <button type="button" class="js-create-post-btn">Create Post</button>
    <button type="button" class="js-logout-btn">Logout</button>
  `)
  
}


function displayFilterControls() {
  // Should the name be the same as the id and value?
  // Set what gets displayed when an item is checked (repopulate posts)
  $(`.js-controls-section`).html(`
      <legend>Select one or more platform(s)</legend>
      <input type="checkbox" name="platform" id="pc" value="pc" checked><label for="pc">PC</label>
      <input type="checkbox" name="platform" id="xbox" value="xbox" checked><label for="xbox">Xbox</label>
      <input type="checkbox" name="platform" id="psn" value="psn"><label for="psn">Playstation</label>
      <input type="submit" class="platform-submit" value="Search">
  `) 
}


function displayLoginRegisterButton() {
  $(`.js-header-section`).html(`
    <button type="button" class="js-login-btn">Login</button>
    <button type="button" class="js-register-btn">Register</button>
  `)
}


function getPostsRequest(success) {
  // Grab posts from API
  console.log('loaded posts')
  let posts = [{
    postName: "Duos Battlepass",
    author: "ninja",
    platform:"PC",
    region:"NA-EAST",
    datePosted: new Date(),
    deadline: new Date("4/3/2019"),
    message:"Lets play",
    id: "1234",
    replies: [
      {
        datePosted: new Date(),
        message: "yeah sure",
        author: "tfue"
      }
    ]
  },{
    postName: "Squads scrimmage",
    author: "tfue",
    platform:"Xbox",
    region:"NA-WEST",
    datePosted: new Date(),
    deadline: new Date("4/5/2019"),
    message:"Looking for a person to play duos. Must have K/D ratio over 2.0",
    id: "12345",
    replies: [
      {
        datePosted: new Date(),
        message: "yeah sure",
        author: "user3"
      }
    ]
  }]
  // AJAX request
  // $.ajax({
  //   url: `${BASE_URL}/${id}`,
  //   type: 'GET',
  //   success: callback
  // });

  setTimeout(function() { 
    success(posts)
  }, 500)

}


function generatePostElement(post) {
  const listOfReplies = post.replies.map((reply) => `
    <li>
      <p class="reply-author">${reply.author}</p>
      <p class="reply-message">${reply.message}</p>
      <p class="reply-date">${reply.datePosted}</p>
    </li>
  `)
  return `
    <li class="js-post">
      <h2 class="posts-title">${post.postName}</h2>
      <p class="post-username">${post.author}</p>
      <p class="posts-platform">${post.platform}</p>
      <p class="posts-platform">${post.region}</p>
    
      <div>
        <hp class="posts-deadline">${post.deadline}</p>
        <p class="posts-message">${post.message}</p>
      </div>
      <ul class="replies-section">
        ${listOfReplies.join('')}
      </ul>
    </li>
`
}

function generatePostElementProtected(post) {
  const listOfReplies = post.replies.map((reply) => `
    <li>
      <p class="reply-author">${reply.author}</p>
      <p class="reply-message">${reply.message}</p>
      <p class="reply-date">${reply.datePosted}</p>
    </li>
  `)
  return `
    <li class="js-post">
      <h2 class="posts-title">${post.postName}</h2>
      <p class="post-username">${post.author}</p>
      <p class="posts-platform">${post.platform}</p>
      <p class="posts-platform">${post.region}</p>
    
      <div>
        <hp class="posts-deadline">${post.deadline}</p>
        <p class="posts-message">${post.message}</p>
      </div>
      <ul class="replies-section">
        ${listOfReplies.join('')}
      </ul>
      <button type="button" class="js-view-btn">View</button>
      <button type="button class="js-reply-btn">Reply</button>
    </li>
`
}


function displayPosts(posts) {
  const listOfPosts = posts.map((post) => generatePostElement(post))
  $(`.js-content-section`).html(`
    <ul class="posts-list">
      ${listOfPosts.join('')}
    </ul>
  `)
}

function displayPostsProtected(posts) {
  const listOfPosts = posts.map((post) => generatePostElementProtected(post))
  $(`.js-content-section`).html(`
    <ul class="posts-list">
      ${listOfPosts.join('')}
    </ul>
  `)
  $(`.alert-section`).html(``)
}

function displayLoginPage() {
  $(`.js-header-section`).html(``)
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
  `)
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
          <input type="radio" name="platform" id="xbox" value="xbox"<label for="xbox">Xbox</label>
          <input type="radio" name="platform" id="psn" value="psn"><label for="psn">Playstation</label>
        
        <button type="submit">Register</button>
      </form>
  `)
}


function loginRequest(username, password) {
  $.ajax({
    url: "http://localhost:8080/api/auth/login",
    type: 'POST',
    data: JSON.stringify({username, password}),
    contentType: "application/json",
    error : function(err) {
      $('.alert-section').html(`<p>${err.responseText}</p>`)
    },
    success: function(data) {
      localStorage.setItem('token', data.authToken)
      displayHeaderButtons()
      displayFilterControls()
      getPostsRequest(displayPostsProtected)
      $(`.js-header-section`).on('click', '.js-logout-btn', handleLogOut)
      // $(`.js-header-section`).on('click', '.js-create-post-btn', handleCreatePost)
    }
  });
}


function handleLoginSubmit(event) {
  event.preventDefault();
  const username = $(event.currentTarget).find('.username-login').val();
  const password = $(event.currentTarget).find('.password-login').val();
  loginRequest(username, password);
}


function registerRequest(username,password, platform) {
  $.ajax({
    url: "http://localhost:8080/api/users",
    type: 'POST',
    data: JSON.stringify({username,password, platform}),
    contentType: "application/json",
    error : function(err) {
      $('.alert-section').html(`<p>${err.responseText}</p>`)
    },
    success: function(data) {
    }
  });
}


function handleRegisterSubmit(event) {
  event.preventDefault();
  const username = $(event.currentTarget).find('.username-register').val()
  const password = $(event.currentTarget).find('.password-register').val()
  const passwordConfirm = $(event.currentTarget).find('.password-confirm').val()
  const platform = $(event.currentTarget).find('[name=platform]:checked').val()
  if (password===passwordConfirm) {
    registerRequest(username, password, platform)
    $('.alert-section').html(`<p></p>`)
  }
  else {
    $('.alert-section').html(`<p>Passwords must match</p>`)
  }
  
}


function handleLogOut() {
  localStorage.clear()
  document.location.reload()
}


$(function onLoad() {
  
  // Login Process:
  // Read from local storage
  // Check if token is present
  // Read token and put in header for AJAX request

  //Register Process:
  // Read from
  // Create Token?
  
  let loggedIn = localStorage.getItem('token')
  
  if (loggedIn) {
    displayHeaderButtons()
    displayFilterControls()
    getPostsRequest(displayPosts)
    $(`.js-header-section`).on('click', '.js-logout-btn', handleLogOut)
    // $(`.js-main-section`).on('click', '.create-btn', displayCreatePostPage)
  }
  else {
    displayLoginRegisterButton()
    getPostsRequest(displayPosts)
    $(`.js-view-btn`).css( "display", "none" )
    $(`.js-reply-btn`).css( "display", "none" )
    // displayRegisterPage()

    // View Button
    $(`.js-header-section`).on('click', '.js-login-btn', displayLoginPage)
    $(`.js-header-section`).on('click', '.js-register-btn', displayRegisterPage)
    $(`.js-content-section`).on('submit', '.js-login-form', handleLoginSubmit)
    $(`.js-content-section`).on('submit', '.js-register-form', handleRegisterSubmit)
  }

})