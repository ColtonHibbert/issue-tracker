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

module.exports = function (app, db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var query = req.query;
      //console.log('get project', project)
      console.log('get params', req.params);
      console.log('get query', query);
      console.log('get body', req.body);
    })
    
    .post(async function (req, res){
      console.log('post params', req.params);
      console.log('post query', req.query);
      console.log('post body', req.body);
      var project = req.params.project;
      //err handling for missing required fields? none for this project, prevented on client side
      const issueTitle = req.body.issue_title;
      const issueText = req.body.issue_text;
      const createdBy = req.body.created_by;
      let assignedTo = req.body.assigned_to;
      let statusText = req.body.status_text;
      let projectId = null;
      let projectFound = true;

      if(assignedTo === undefined) {
        assignedTo = "";
      }
      if(statusText === undefined) {
        statusText = "";
      }
      await db.select('project_name').from('project').where('project_name', '=', project)
      .returning('*')
      .then( data => {
        console.log(data[0], 'data')
        if(data[0] === undefined ) {
          console.log(data, 'data and projectFound should be false')
          projectFound = false;
        }
        if(data[0]._id) {
          projectId = data[0]._id
        }
      })
      .catch(err => console.log(err))
      
      function insertProjectIfNeeded() {
        if(projectFound === false) {
          console.log('start of insertProjectifNeeded')
          return db.transaction(trx => {
            trx.insert({
              project_name: project
            })
            .into('project')
            .returning('_id')
            .then(data => {
              projectId = data[0];
              console.log(data[0], '_id for project, inserting project')
            })
            .then(trx.commit)
            .then(() => {
              return
            })
            .catch(trx.rollback)
          })
          .catch(err => console.log(err))
        }
      }
      await insertProjectIfNeeded();
      console.log('after insertProjectIfNeeded')

      await db.transaction(trx => {
        trx.insert({
          issue_title: issueTitle,
          issue_text: issueText,
          created_by: createdBy,
          assigned_to: assignedTo,
          status_text: statusText,
          project_id: projectId
        })
        .into('issue')
        .returning('*')
        .then(data => console.log(data, 'data in post'))
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => console.log(err))

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
