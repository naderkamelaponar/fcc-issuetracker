/** بسم الله الرحمن الرحيم */
const chaiHttp = require("chai-http");
const chai = require("chai");
const { ObjectId } = require("mongoose").Types;
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  let testId;
  let wrongId = new ObjectId();
  test("Issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "test",
        issue_text: "test",
        created_by: "test",
        assigned_to: "test",
        status_text: "test",
        open: true,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          const { body } = res;
          testId = body["_id"] || null;
          assert.equal(res.status, 201);
          done();
        }
      });
  });
  test("Issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "test",
        issue_text: "test",
        created_by: "test",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 201);
          done();
        }
      });
  });

  test("Issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "xd",
        created_by: "xd",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          assert.isNotNull(res["body"]["error"]);
          done();
        }
      });
  });

  test("Issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 200);
          done();
        }
      });
  });

  test("Issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?open=true")
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 200);
          done();
        }
      });
  });

  test("Issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?open=true&issue_text=test&issue_title=test")
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 200);
          done();
        }
      });
  });

  test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: testId,
        issue_title: "test1",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 200);
          done();
        }
      });
  });

  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: testId,
        issue_title: "test2",
        issue_text: "test1",
        assigned_to: "test1",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.status, 200);
          done();
        }
      });
  });

  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        issue_title: "test2",
        issue_text: "test1",
        assigned_to: "test1",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          const { body } = res;
          const { error } = body;
          assert.equal(error, "missing _id");
          done();
        }
      });
  });

  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: testId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          const { body } = res;
          const { error } = body;
          assert.isDefined(error);
          done();
        }
      });
  });

  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: wrongId,
        issue_title: "test2",
        issue_text: "test1",
        assigned_to: "test1",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          const { body } = res;
          const { error } = body;
          assert.equal(error, "could not update");
          done();
        }
      });
  });

  test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({
        _id: testId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          const { body } = res;
          const { error } = body;
          assert.equal(res.status, 200);
          done();
        }
      });
  });

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({
        _id: wrongId,
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          const { body } = res;
          const { error } = body;
          assert.isDefined(error);
          done();
        }
      });
  });

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({
        _id: "",
      })
      .end(function (err, res) {
        if (err) {
          done(err);
        } else {
          const { body } = res;
          const { error } = body;
          assert.isDefined(error);
          done();
        }
      });
  });
});
