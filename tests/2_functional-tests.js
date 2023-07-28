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
  test("Issue with every field: POST request to /api/issues/{project}", function () {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "issue title",
        issue_text: "issue text",
        created_by: "created by",
        assigned_to: "assigned to",
        status_text: "status text",
        open: true,
      })
      .end(function (err, res) {
        if (err) {
          console.log(err);
          done(err);
        } else {
          console.log(res);
          assert.equal(res.status, 201);
          done();
        }
      });
  });
  test("Issue with only required fields: POST request to /api/issues/{project}", function () {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        issue_title: "issue title",
        issue_text: "issue text",
        created_by: "created by",
      })
      .end(function (err, res) {
        console.log(res)
        if (err) {
          console.log(res);
          done(err);
        } else {
          console.log(res);
          assert.equal(res.status, 201);
          done();
        }
      });
  });
});
