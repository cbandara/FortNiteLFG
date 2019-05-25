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

function getMyPostsRequest(success) {
  $.ajax({
    url: "/api/posts/my-posts/",
    type: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      success(data);
    }
  });
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

function registerRequest(username, password, platform) {
  $.ajax({
    url: "/api/users",
    type: "POST",
    data: JSON.stringify({ username, password, platform }),
    contentType: "application/json",
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      document.location.reload();
    }
  });
}

function postPostRequest(postName, platform, region, deadline, message) {
  $.ajax({
    url: "/api/posts/",
    type: "POST",
    data: JSON.stringify({ postName, platform, region, deadline, message }),
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    error: function(err) {
      console.log(err);
      if (err.status === 401) {
        localStorage.clear();
        $(".js-alert-section").html(`<p>Your Session has expired</p>`);
        displayLoginPage();
        return;
      }
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      displayHeaderButtons();
      displayFilterControls();
      getPostsRequest(displayPostsProtected);
    }
  });
}

function deleteMyPost(id, success) {
  $.ajax({
    url: `/api/posts/my-posts/${id}`,
    type: "DELETE",
    data: JSON.stringify({ id }),
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      success(data);
    }
  });
}

function getPostRequest(id, success) {
  $.ajax({
    url: `/api/posts/${id}`,
    type: "GET",
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      success(data);
    }
  });
}

function getPostsRequestwPlatforms(platforms, success) {
  $.ajax({
    url: `/api/posts/platforms/`,
    data: JSON.stringify({ platforms }),
    type: "GET",
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      success(data);
    }
  });
}

function getReplyRequest(id, reply, success) {
  $.ajax({
    url: `/api/posts/reply/${id}`,
    type: "GET",
    error: function(err) {
      $(".js-alert-section").html(`<p>${err.responseText}</p>`);
    },
    success: function(data) {
      success(data);
    }
  });
}
