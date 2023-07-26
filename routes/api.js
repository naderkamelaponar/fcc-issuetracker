'use strict';
const mongoose = require('mongoose');


const issues =[
  {
    "apitest":
      [{"_id": "5871dda29faedc3491ff93bb",
  "issue_title": "Fix error in posting data",
  "issue_text": "When we post data it has an error.",
  "created_on": "2017-01-08T06:35:14.240Z",
  "updated_on": "2017-01-08T06:35:14.240Z",
  "created_by": "Joe",
  "assigned_to": "Joe",
  "open": true,
  "status_text": "In QA"}]
    
  }
]
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      const getProject=issues.map(a=>{
        return a[project]
      })
      project=getProject?getProject[0]:null
      res.send(project?project:"Not Found")
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let cPro=issues.filter(a=>{
        return a[project]
      })
      cPro=cPro?cPro:null
      let {body}=req  
      if(!body["issue_title"] || !body["issue_text"] || !body["created_by"]) return res.send({ error: 'required field(s) missing' }
      )
      let assigned_to=body["assigned_to"]||""
      let status_text=body["status_text"]||""
      let _id=new mongoose.Types.ObjectId().toString()
      body={
        _id,
        issue_title:body["issue_title"],
        issue_text:body["issue_text"],
        created_on:new Date().toISOString(),
        updated_on:new Date().toISOString(),
        created_by:body["created_by"],
        assigned_to,
        open:true,
        status_text
      }
      issues[issues.indexOf(cPro[0])][project]=[body,...issues[issues.indexOf(cPro[0])][project]]
      console.log(issues[issues.indexOf(cPro[0])][project])
      body={
        assigned_to,
        status_text,
        open:true,
        _id:body["_id"],
        issue_title:body["issue_title"],
        issue_text:body["issue_text"],
        created_by:body["created_by"],
        created_on:body["created_on"],
        updated_on:body["updated_on"],
      }
      return res.send(body)
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
