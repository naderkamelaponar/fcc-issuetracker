/** بسم الله الرحمن الرحيم */
const mongoose = require("mongoose");
const IssueSchema = new mongoose.Schema(
  {
    project: {
      type: String,
      required: [true, "project is requiredd"],
      maxlength: 50,
    },
    issue_title: {
      type: String,
      require: [true, "issue title is required"],
      maxlength: 30,
    },
    issue_text: {
      type: String,
      require: [true, "issue text is required"],
      maxlength: 250,
    },
    created_by: {
      type: String,
      require: [true, "created by is required"],
      maxlength: 30,
    },
    assigned_to: {
      type: String,
      default: "",
      maxlength: 30,
    },
    status_text: {
      type: String,
      default: "",
      maxlength: 30,
    },
    open: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports=mongoose.model("Issue",IssueSchema);