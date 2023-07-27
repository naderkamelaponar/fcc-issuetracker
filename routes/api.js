"use strict";
const Issue = require("../models/Issue");
const { StatusCodes } = require("http-status-codes");
module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      const issues = await Issue.find({ ...req.query });
      if (!issues) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send("No project called " + project + " found");
      }
      return res.status(StatusCodes.OK).json(issues);
    })

    .post(async function (req, res) {
      let project = req.params.project;

      let { body } = req;
      if (!body["issue_title"] || !body["issue_text"] || !body["created_by"])
        return res.send({ error: "required field(s) missing" });
      body = { ...body, project };
      const issue = await Issue.create(body);
      return res.status(StatusCodes.CREATED).json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
