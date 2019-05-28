# Fortnite Squad Finder

The application will allow users to find other Fortnite players to play with

https://fierce-tundra-18202.herokuapp.com/

## API Documentation

### GET All Posts

```
url: '/api/posts/'
type: 'GET',
headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}` <--- (Optional)
    }
```

This method gets all the posts in the database and does not require user to be logged in.

### GET My Posts

```
url: '/api/posts/my-posts/'
type: 'GET',
headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}` <--- (Required)
    }
```

If a user is logged in, they can retrieve all of the posts they made using this method.
An authorization header is required to access this endpoint. Only the user who created the posts will be able to access this page.

### POST Register Request

```
url: '/api/users/'
type: 'POST',
data: JSON.stringify({ username, password, platform }),
contentType: "application/json"
```

Registering users requires 3 things: username, password, platform

Username

- Must be an existing username in the Epic Games network
- Usernames are case sensitive
- Some users may not be able to sign up if their Epic Games username has already been claimed
- Client will receive a validation error if the username is already taken

  Password

- Minimum 8 characters
- Maximum 72 characters

  Platform

- This API currently supports 3 platforms: PC, Xbox, and Playstation
- Users should choose the platform that they created their Epic Games Account with
- Users will be allowed to make posts for different platforms after registering, they just need one main platform assigned to their profile

This data will all be sent to an external API called FortniteTracker that keeps Epic user statistics and validates that the user name is an Epic username.

### POST Login Request

```
url: '/api/auth/login'
type: 'POST',
data: JSON.stringify({ username, password }),
contentType: "application/json"
```

A login request takes a username and password and returns a valid authentication token. The API uses Passport.js to authenticate user data. The username and password must be correct in order to receive the token. Each authorization token lasts 7 days. After the 7 days the user will be logged out and redirected back to the login page to create a new token.
After the method you will want to set the authorization token in the client. You can use something like this:

```
localStorage.setItem("token", data.authToken)
```
