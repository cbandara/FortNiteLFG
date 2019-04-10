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



function displayFilterControls() {
  // Should the name be the same as the id and value?
  // Set what gets displayed when an item is checked (repopulate posts)
  $(`.js-controls-section`).html(`
    <fieldset>
      <legend>Select one or more platform(s)</legend>
      <input type="checkbox" name="platform" id="pc" value="pc" checked><label for="pc">PC</label>
      <input type="checkbox" name="platform" id="xbox" value="xbox" checked><label for="xbox">Xbox</label>
      <input type="checkbox" name="platform" id="psn" value="psn"><label for="psn">Playstation</label>
      <input type="submit">
    </fieldset>
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
      <button type="button" class="view-btn">View</button>
      <button type="button class="reply-btn">Reply</button>
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

function displayLoginPage() {
  $(`.js-content-section`).html(`
    <form class="js-login-form">
      <label for="username-login">Username:</label>
      <input type="text" name="username-login" class="username-login">
      <label for="password-login">Password:</label>
      <input type="password" name="password-login" class="password-login">
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
        <button type="submit">Login</button>
      </form>
  `)
}

function loginRequest(username, password) {
  $.ajax({
    url: "http://localhost:8080/login",
    type: 'POST',
    data: {username, password},
    error : function(err) {
      // console.log(username, password)
     console.log('Error here!', err)
    },
    success: function(data) {
      console.log(data)
      console.log('Success!')
      // localStorage.setItem('token', data.id_token);
    }
  });
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const username = $(event.currentTarget).find('.username-login').val();
  const password = $(event.currentTarget).find('.password-login').val();
  loginRequest(username, password);
}

function registerRequest(username,password) {
  $.ajax({
    url: "http://localhost:8080/register",
    type: 'POST',
    data: {username,password},
    error : function(err) {
      console.log('Error here!', err)
    },
    success: function(data) {
      console.log('Success!')
      // What do I put here?
    }
  });
}


function handleRegisterSubmit(event) {
  event.preventDefault();
  const username = $(event.currentTarget).find('.username-register').val()
  const password = $(event.currentTarget).find('.password-register').val()
  const passwordConfirm = $(event.currentTarget).find('.password-confirm').val()
  
  if (password === passwordConfirm) {
    registerRequest(username,password)
  }
  else {
    console.error("Passwords did not match")
  }
  
}

$(function onLoad() {
  
  // Login Process:
  // Read from local storage
  // Check if token is present
  // Read token and put in header for AJAX request

  //Register Process:
  // Read from
  // Create Token?
  
  let loggedIn = false

  displayFilterControls()
  if (loggedIn) {
    displayHeaderButtons()
    getPostsRequest(displayPosts)

    $(`.js-main-section`).on('click', '.create-btn', displayCreatePostPage)

    // $(`.js-header-section`).on('click'), '.logout-btn', logOut)
  }
  else {
    // displayLoginRegisterButton()
    // getPostsRequest(displayPosts)
    displayRegisterPage()

    // View Button
    $(`.js-header-section`).on('click', '.js-login-btn', displayLoginPage)
    $(`.js-header-section`).on('click', '.js-register-btn', displayRegisterPage)
    $(`.js-content-section`).on('submit', '.js-login-form', handleLoginSubmit)
    $(`.js-content-section`).on('submit', '.js-register-form', handleRegisterSubmit)
  }

})