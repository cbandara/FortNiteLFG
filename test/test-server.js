"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { User, Post } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config");

const expect = chai.expect;

const should = chai.should();

chai.use(chaiHttp);

const createAuthToken = function(user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

// GET posts
describe("GET /api/posts", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  it("Should return an empty array given the database is empty", function() {
    return chai
      .request(app)
      .get("/api/posts/")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.eql([]);
      });
  });

  context("Given Posts in Database", function() {
    let user;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "TestUser",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
      // Seed Posts
      await Post.insertMany([
        {
          postName: "Test Post",
          user: user._id,
          platform: "xb1",
          region: "eu",
          deadline: new Date(6 / 4 / 2019),
          message: "test post message body"
        }
      ]);
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should return all posts", function() {
      return chai
        .request(app)
        .get("/api/posts/")
        .then(res => {
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);
          res.body.should.be.a("array");
        });
    });
  });
});

// GET my posts
describe("GET /api/my-posts", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  context("Given user but no posts in database", function() {
    let user;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "TestUser",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should return an empty array", function() {
      return chai
        .request(app)
        .get("/api/posts/my-posts")
        .set({ Authorization: `Bearer ${createAuthToken(user.serialize())}` })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body).to.eql([]);
          res.body.should.be.a("array");
        });
    });
  });

  context("Given Posts in Database", function() {
    let user;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "TestUser",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
      // Seed Posts
      await Post.insertMany([
        {
          postName: "Test Post",
          user: user._id,
          platform: "xb1",
          region: "eu",
          deadline: new Date(6 / 4 / 2019),
          message: "test post message body"
        }
      ]);
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should return my posts", function() {
      return chai
        .request(app)
        .get("/api/posts/my-posts")
        .set({ Authorization: `Bearer ${createAuthToken(user.serialize())}` })
        .then(res => {
          res.should.have.status(200);
          res.body.should.have.lengthOf.at.least(1);
          res.body.should.be.a("array");
        });
    });
  });
});

// POST a post
describe("POST /api/posts", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  context("Given a user in database", function() {
    let user;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "TestUser",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should create a post", function() {
      const newPost = {
        postName: "Test Post",
        platform: "xb1",
        region: "eu",
        deadline: new Date(6 / 4 / 2019),
        message: "test post message body"
      };
      return chai
        .request(app)
        .post("/api/posts/")
        .set({ Authorization: `Bearer ${createAuthToken(user.serialize())}` })
        .send(newPost)
        .then(function(res) {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("postName");
          res.body.should.have.property("platform");
          res.body.should.have.property("region");
          res.body.should.have.property("deadline");
          res.body.should.have.property("id");
          res.body.should.have.property("comments");
          res.body.should.have.property("message");
        });
    });
  });
});

// POST platforms for filtered search
describe("POST /api/posts/platforms/", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  context("Given a user and posts in database", function() {
    let user;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "TestUser",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
      await Post.insertMany([
        {
          postName: "Test Post",
          user: user._id,
          platform: "xb1",
          region: "eu",
          deadline: new Date(6 / 4 / 2019),
          message: "test post message body"
        },
        {
          postName: "Test Post2",
          user: user._id,
          platform: "pc",
          region: "na-east",
          deadline: new Date(6 / 5 / 2019),
          message: "test post message body 2"
        }
      ]);
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should filter posts", function() {
      const platforms = ["pc", "xb1"];
      return chai
        .request(app)
        .post("/api/posts/platforms/")
        .send({ platforms })
        .then(function(res) {
          res.should.have.status(200);
        });
    });
  });
});

// PUT edit a post
describe("PUT /api/posts/id", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  context("Given a user and post in database", function() {
    let user;
    let post;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "TestUser",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
      post = await Post.create({
        postName: "Test Post",
        user: user._id,
        platform: "xb1",
        region: "eu",
        deadline: new Date(6 / 4 / 2019),
        message: "test post message body"
      });
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should edit a post", function() {
      const editedPost = {
        postName: "Edited Post",
        platform: "xb1",
        region: "eu",
        deadline: new Date(6 / 4 / 2019),
        message: "edited post message body"
      };
      return chai
        .request(app)
        .put(`/api/posts/${post._id}`)
        .set({ Authorization: `Bearer ${createAuthToken(user.serialize())}` })
        .send(editedPost)
        .then(function(res) {
          res.should.have.status(201);
        });
    });
  });
});

// PUT add a comment
describe("PUT /api/posts/reply/id", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  context("Given a user and post in database", function() {
    let user;
    let post;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "TestUser",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
      post = await Post.create({
        postName: "Test Post",
        user: user._id,
        platform: "xb1",
        region: "eu",
        deadline: new Date(6 / 4 / 2019),
        message: "test post message body"
      });
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should add a comment", function() {
      const reply = "test reply";
      return chai
        .request(app)
        .put(`/api/posts/reply/${post._id}`)
        .set({ Authorization: `Bearer ${createAuthToken(user.serialize())}` })
        .send(reply)
        .then(function(res) {
          res.should.have.status(201);
        });
    });
  });
});

// DELETE a post
describe("PUT /api/posts/my-posts/id", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  context("Given a user and post in database", function() {
    let user;
    let post;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "TestUser",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
      post = await Post.create({
        postName: "Test Post",
        user: user._id,
        platform: "xb1",
        region: "eu",
        deadline: new Date(6 / 4 / 2019),
        message: "test post message body"
      });
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should delete a post", function() {
      return chai
        .request(app)
        .delete(`/api/posts/my-posts/${post._id}`)
        .set({ Authorization: `Bearer ${createAuthToken(user.serialize())}` })
        .then(function(res) {
          res.should.have.status(204);
        });
    });
  });
});

//USERS

// POST create a new user
describe("POST /api/users/", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  context("Given no users in the database", function() {
    let user;
    beforeEach(async function() {
      // Seed Users
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should create a new user", function() {
      user = {
        username: "ninja",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      };
      return chai
        .request(app)
        .post("/api/users/")
        .send(user)
        .then(function(res) {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          res.body.should.have.property("username");
        });
    });

    it("should not create a new user if the username is not a valid Epic username", function() {
      user = {
        username: "TestUser1222222",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      };
      return chai
        .request(app)
        .post("/api/users/")
        .send(user)
        .then(function(res) {
          res.should.have.status(400);
          expect(res.body).to.eql({});
        });
    });
  });
});

// POST login with valid user credentials
describe("POST /auth/login/", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  before(async function() {
    await Post.remove();
    await User.remove();
  });

  after(function() {
    return closeServer();
  });

  context("Given a user in the database", function() {
    let user;
    beforeEach(async function() {
      // Seed Users
      user = await User.create({
        username: "ninja",
        password:
          "$2b$10$XV9jYqJ8S32CgYIh4FuIJ.toAOYDZ2vttaeAhJnbbsPuLMdfZVazG", // Should be a bcrypt string
        platform: "pc"
      });
    });

    afterEach(async function() {
      await Post.remove();
      await User.remove();
    });

    it("should login user and return authToken", function() {
      const username = "ninja";
      const password = "12345678"; // Should be a bcrypt string
      const loginUser = { username, password };
      return chai
        .request(app)
        .post("/api/auth/login/")
        .send(loginUser)
        .then(function(res) {
          res.should.have.status(200);
          res.body.should.have.property("authToken");
        });
    });
  });
});
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
