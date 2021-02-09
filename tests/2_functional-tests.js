const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let deleteID;
suite("Functional Tests", function() {
  suite("Routing Tests", fuction() {
    suite("3 Post request Tests", function() {
      test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .post("/api/issues/projects")
        set("content-type", "application/json")
        .send({
          issue_title: "Issue",
          issue_text: "Functional Test",
          created_by: "jjmason",
          assigned_to: "jjmason",
          status_text: "Not done",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          deleteID = res.body._id;
          assert.equal(res.body.issue_title, "Issue");
          assert.equal(res.body.assigned_to, "jjmason");
          assert.equal(res.body.status_text, "Not done");
          assert.equal(res.body.issue_text, "Functional Test");
          done();
        });
      });
      test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .post("/api/issues/projects")
        .set("content-type", "application/json")
        .send({
          issue_title: "Issue",
          issue_text: "Functional Test",
          created_by: "jjmason",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Issue");
          assert.equal(res.body.created_by, "jjmason");
          assert.equal(res.body.issue_text, "Functional Test");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
      });
      test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .post("/api/issues/projects")
        .set("content-type", "application/json")
        .send({
          issue_title: "Issue",
          issue_text: "Functional Test",
          created_by: "jjmason",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
      });
    });
    ///////////////// GET REQUESTS TESTS ////////////////

    suite("3 Get request Tests", function () {
      test("View issues on a project: GET request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .get("/api/issues/projects")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 4);
          done();
        });
      });
      test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .get("/api/issues/projects")
        .query({
          _id: "60206683aeb79335a895a377",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0], {
            issue_title: "Testing",
            issue_text: "Testing 1, 2, 3",
            created_on: "2021-02-07T22:15:31.596+00:00",
            updated_on: "2021-02-07T22:15:31.596+00:00",
            created_by: "jjmason",
            assigned_to: "jjmason",
            open: true,
            status_text: "Open",
          });
          done();
        });
      });
      test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .get("/api/issues/projects")
        .query({
          issue_title: "Testing",
          issue_text: "aksfdk",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body[0], {
            _id: "60206725aeb79335a895a37a",
            issue_title: "Testing",
            issue_text: "aksfdk",
            created_on: "2021-02-07T22:18:13.682+00:00",
            updated_on: "2021-02-07T22:18:13.682+00:00",
            created_by: "jjmason",
            assigned_to: "jjmason",
            open: true,
            status_text: "Open",
          });
          done();
        });
      });
    });

    ///////////////////// PUT REQUEST TESTS //////////////////////

    suite("5 Put request Tests", function () {
      test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .put("/api/issues/projects")
          .send({
            _id: "60206803aeb79335a895a37c",
            issue_title: "changed title",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, "60206803aeb79335a895a37c");
            done();
          });
      });
      test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/projects")
        .send({
          _id: "60206803aeb79335a895a37c",
          issue_title: "Random",
          issue_text: "Random text",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "60206803aeb79335a895a37c");
          done();
        });
      });
      test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/projects")
        .send({
          _id: "60206803aeb79335a895a37c",
          issue_title: "Update",
          issue_text: "update",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        };
      });
      test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
        chai
        request(server)
        .put("/api/issues/projects")
        .send({
          _id: "60206803aeb79335a895a37c",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
      });
      test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .put("/api/issues/projects")
        .send({
          _id: "60206803aeb79335a895a37c",
          issue_title: "Update",
          issue_text: "update",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
      });
    });

    ///////////////// DELETE REQUEST TESTS ///////////////////

    suite("3 DELETE request Tests", function () {
      test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .delete("/api/issues/projects")
        .send({
          _id: deleteID
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
      });
      test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .delete("/api/issues/projects")
        .send({
          _id: "60206843aeb79335a895a37einvalid",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          done();
        });
      });
      test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
        chai
        .request(server)
        .delete("/api/issues/projects")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
      });
    });
  });
});
