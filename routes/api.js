"use strict";
const Issue = require("../models/Issue");
const { StatusCodes } = require("http-status-codes");
module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      const project = req.params.project;
      req.query.project = project;
      const issues = await Issue.find({ ...req.query });
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
        status_text: d.status_text,
      }));
      res.status(StatusCodes.OK).json(response);
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
        status_text: issue.status_text,
      };
      res.status(StatusCodes.CREATED).json(issue);
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const { body } = req;
      if (!body["_id"]) {
        return res.json({ error: "missing _id" });
      }
      if (
        !body["issue_title"] &&
        !body["issue_text"] &&
        !body["created_by"] &&
        !body["assigned_to"] &&
        !body["open"] &&
        !body["status_text"]
      ) {
        return res.json({ error: "no update field(s) sent", _id: body["_id"] });
      }
      const _id = body["_id"];
      const issue = await Issue.findByIdAndUpdate({ _id }, { $set: body });
      if (!issue) {
        return res.json({ error: "could not update", _id });
      }
      res.json({ result: "successfully updated", _id });
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const _id = req.body["_id"];
      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      const del = await Issue.findOneAndDelete({ _id });
      if (!del) {
        return res.json({ error: "could not delete", _id });
      }
      res.json({ result: "successfully deleted", _id });
    });
};
