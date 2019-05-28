"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, runServer, closeServer } = require("../server");
const { PORT, TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

const testUser = {
  
}

function seedUserData() {
  console.info("seeding user data");
  const UserData = [];
  for (let i = 1; i <= 10, i++; )
}

function seedPostData() {
  console.info("seeding post data");
  const PostData = [];
  for (let i = 1; i <= 10, i++; ) {
    PostData.push({
      postName: "sample post name",
      user: "ninja",
      platform: "pc",
      region: "na-west",
      datePosted: new Date.now(),
      deadline: new Date.now(),
      message: "let's play",
      comments: []
    });
  }
}

describe("Posts", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL, 3000);
  });

  after(function() {
    return closeServer();
  });

  it("should list posts on GET", function() {
    return chai
      .request(app)
      .get("/")
      .then(function(res) {
        expect(res).to.have.status(200);
        res.body.should.be.a("array");
      });
  });
});

// describe("Posts", function() {
//   it("should list all posts on GET", function(done) {
//     chai
//       .request(app)
//       .get("/")
//       .then(function(res) {
//         expect(res).to.have.status(200);
//         // expect(res).to.be.json;
//         // expect(res.body).to.be.a("array");
//         // expect(res.body.length).to.be.above(0);
//         // res.body.forEach(function(post) {
//         //   expect(post).to.be.a("object");
//         //   expect(post).to.have.all.keys(
//         //     "id",
//         //     "commemnts",
//         //     "datePosted",
//         //     "deadline",
//         //     "message",
//         //     "platform",
//         //     "postName",
//         //     "region",
//         //     "username"
//         //   );
//         // });
//         done();
//       });
//   });
// });
