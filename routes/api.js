"use strict";
const Issue = require("../models/Issue");
const { StatusCodes } = require("http-status-codes");
module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      const issues = await Issue.find({ ...req.query});
      if (!issues) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send("No project called " + project + " found");
      }
      const response = issues.map((d) => ({
        _id: d._id,
        issue_title: d.issue_title,
        issue_text: d.issue_text,
        created_on: d.createdAt,
        updated_on: d.updatedAt,
        created_by: d.created_by,
        assigned_to: d.assigned_to,
        open: d.open,
        status_text: d.status_text
      }));
      return res.status(StatusCodes.OK).json(response);
    })

    .post(async function (req, res) {
      let project = req.params.project;
      let { body } = req;
      if (!body["issue_title"] || !body["issue_text"] || !body["created_by"])
        return res.send({ error: "required field(s) missing" });
      body = { ...body, project };
      let issue = await Issue.create(body);
      issue = {
        _id: issue._id,
        issue_title: issue.issue_title,
        issue_text: issue.issue_text,
        created_on: issue.createdAt,
        updated_on: issue.updatedAt,
        created_by: issue.created_by,
        assigned_to: issue.assigned_to,
        open: issue.open,
        status_text: issue.status_text
      };
      return res.status(StatusCodes.CREATED).json(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
