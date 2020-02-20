/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
//var MongoClient = require('mongodb');
//var ObjectId = require('mongodb').ObjectID;

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var query = req.query;
      //console.log('get project', project)
      console.log('get params', params);
      console.log('get query', query);
      console.log('get body', req.body);
    })
    
    .post(function (req, res){
      console.log('post params', req.params);
      console.log('post query', req.query);
      console.log('post body', req.body);
      var project = req.params.project;
      const issueTitle = req.query.issue_title;
      const issueText = req.query.issue_text;
      const createdBy = req.query.created_by;
      const assignedTo = req.query.assigned_to;
      const statusText = req.query.status_text;
    })
    
    .put(function (req, res){
      var project = req.params.project;
      console.log('put project', project);
      console.log('put params', req.params);
      console.log('put query', req.query);
      console.log('put body', req.body);
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
