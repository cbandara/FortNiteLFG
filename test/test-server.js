"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { User, Post } = require("../models");

const expect = chai.expect;

const should = chai.should();

chai.use(chaiHttp);

// const testUser = {

// }

// function seedUserData() {
//   console.info("seeding user data");
//   const UserData = [];
//   for (let i = 1; i <= 10, i++; )
// }

// function seedPostData() {
//   console.info("seeding post data");
//   const PostData = [];
//   for (let i = 1; i <= 10, i++; ) {
//     PostData.push({
//       postName: "sample post name",
//       user: "ninja",
//       platform: "pc",
//       region: "na-west",
//       datePosted: new Date.now(),
//       deadline: new Date.now(),
//       message: "let's play",
//       comments: []
//     });
//   }
// }

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe("API Tests", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(function() {
    return User.remove();
  });

  after(function() {
    return closeServer();
  });

  it("POST should create a new user", function() {
    const newUser = {
      username: "ninja",
      password: "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
      platform: "pc"
    };
    console.log(newUser);
    return chai
      .request(app)
      .post("/api/users/")
      .send(newUser)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.include.keys("username", "id");
        res.body.username.should.equal(newUser.username);
      });
  });

  it("POST should login with a valid user", function() {
    const loginUser = {
      username: "ninja",
      password: "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG"
    };
    return chai
      .request(app)
      .post("/api/auth/login")
      .send(loginUser)
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.include.keys("authToken");
        // Need to save the authToken to use in the next test
      });
  });

  it("POST should create a post", function() {
    const newPost = {
      postName: "Test Post",
      platform: "xb1",
      region: "eu",
      deadline: new Date(6 / 4 / 2019),
      message: "test post message body"
    };
    console.log();
    return chai
      .request(app)
      .post("/api/auth/login")
      .set({ Authorization: `Bearer ${authToken}` })
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
      });
  });

  // it("GET should show all posts (not logged in)", function() {
  //   return chai
  //     .request(app)
  //     .get("/api/posts/")
  //     .then(res => {
  //       res.should.have.status(200);
  //       res.body.should.have.lengthOf.at.least(1);
  //     });
  // });
});

// it("Should return an empty array given the database is empty", function() {
//   return chai
//     .request(app)
//     .get("/api/users/")
//     .then(function(res) {
//       expect(res).to.have.status(200);
//       expect(res.body).to.eql([]);
//     });
// });

// describe("Create a user", function() {
//   beforeEach(async function() {
//     // Seed Users
//     const user = await User.create({
// username: "TestUser",
// password:
//   "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
// platform: "pc"
//     });
//     console.log(user);
//     // Seed Posts
//     await Post.insertMany([
//       {
// postName: "Test Post",
// user: user._id,
// platform: "xb1",
// region: "eu",
// deadline: new Date(6 / 4 / 2019),
// message: "test post message body"
//       }
//     ]);
//   });

//   afterEach(function() {
//     return User.remove();
//   });

// it("should", function() {
// return chai
//   .request(app)
//   .post("/api/users/")
//   .send(user)
//   .then(function(res) {
//     expect(res).to.have.status;
//     });
// });
// });

// Users
// Create User
// Login User

// Posts
// Get All Posts(Logged in and out)
// Get My Posts(Logged in)
// Create a post
// Edit a post
// Add a reply
// Delete a post
