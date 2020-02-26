/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

module.exports = function (app, db) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res) {
      var project = req.params.project;
      var query = req.query;
      //console.log('get project', project);
      console.log('get params', req.params);
      console.log('get query', query);
      console.log('get body', req.body);
      
      let queryObject = {};

      if(query.issue_title !== undefined ) {
        queryObject.issue_title = query.issue_title;
      }
      if(query.issue_text !== undefined ) {
        queryObject.issue_text = query.issue_text;
      }
      if(query.created_by !== undefined ) {
        queryObject.created_by = query.created_by;
      }
      if(query.assigned_to !== undefined ) {
        queryObject.assigned_to = query.assigned_to;
      }
      if(query.status_text !== undefined ) {
        queryObject.status_text = query.status_text;
      }
      if(query.open !== undefined ) {
        queryObject.open = query.open;
      }
      console.log(queryObject, 'here is the queryObject')
    
      db.select('_id').from('project').where('project_name', '=', project)
      .then(data => {
        const projectId = data[0]._id;
        console.log('here is the projectid', projectId);
        db.select('_id', 'issue_title', 'issue_text', 'created_on', 'updated_on', 'created_by', 'assigned_to', 'open', 'status_text')
        .from('issue')
        .where('project_id', '=', projectId)
        .andWhere(queryObject)
        .then(data => {
          console.log(data, 'data in get');
          res.json(data);
        })
      })
      
    })
    
    //data not inserting project_id 
    .post(async function (req, res){
      console.log('post params', req.params);
      console.log('post query', req.query);
      console.log('post body', req.body);
      var project = req.params.project;
      const issueTitle = req.body.issue_title;
      const issueText = req.body.issue_text;
      const createdBy = req.body.created_by;
      if(issueTitle === undefined || issueText === undefined || createdBy === undefined ) {
        return res.json('missing required fields')
      }
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
      await db.select('*').from('project').where('project_name', '=', project)
      .returning('*')
      .then( data => {
        console.log(data[0], 'data');
        if(data[0] === undefined ) {
          console.log(data, 'data and projectFound should be false');
          projectFound = false;
        }
        if(data[0] !== undefined ) {
          projectId = data[0]._id;
          console.log(data);
          console.log(projectId, 'projectId, data not undefined');
        }
      })
      .catch(err => console.log(err))
      
      function insertProjectIfNeeded() {
        if(projectFound === false) {
          console.log('start of insertProjectifNeeded');
          return db.transaction(trx => {
            trx.insert({
              project_name: project
            })
            .into('project')
            .returning('_id')
            .then(data => {
              projectId = data[0];
              console.log(data[0], '_id for project, inserting project');
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
      console.log('after insertProjectIfNeeded');

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
        .then(data => {
          console.log(data, 'data in post')
          res.json({
            _id: data[0]._id,
            issue_title: data[0].issue_title,
            issue_text: data[0].issue_text,
            created_on: data[0].created_on,
            updated_on: data[0].updated_on,
            created_by: data[0].created_by,
            assigned_to: data[0].assigned_to,
            open: data[0].open,
            status_text: data[0].status_text
          });
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => console.log(err))

    })
    
    .put(async function (req, res) {
      var project = req.params.project;
      console.log('put project', project);
      console.log('put params', req.params);
      console.log('put query', req.query);
      console.log('put body', req.body);
      let updatingObject = {};
      if(req.body.issue_title !== '' && req.body.issue_title !== undefined ) {
        updatingObject.issue_title = req.body.issue_title;
      }
      if(req.body.issue_text !== '' && req.body.issue_text !== undefined ) {
        updatingObject.issue_text = req.body.issue_text;
      }
      if(req.body.created_by !== '' && req.body.created_by !== undefined ) {
        updatingObject.created_by = req.body.created_by;
      }
      if(req.body.assigned_to !== '' && req.body.assigned_to !== undefined ) {
        updatingObject.assigned_to = req.body.assigned_to;
      }
      if(req.body.status_text !== '' && req.body.status_text !== undefined ) {
        updatingObject.status_text = req.body.status_text;
      }
      if (req.body.open !== undefined ) {
        updatingObject.open = req.body.open;
      }
      console.log(updatingObject, 'here is updating object');
      if(Object.keys(updatingObject).length === 0 && updatingObject.constructor === Object) {
        console.log('res.json should be no updated field sent');
        return res.json('no updated field sent');
      }
      //_id to number
      const issueId = Number(req.body._id);
      await db.transaction(trx => {
        trx('issue')
        .where('_id', '=', issueId)
        .update(updatingObject)
        .update('updated_on',  db.fn.now())
        .returning('*')
        .then(data => {
          console.log(data, 'data inside put after update');
          if(data[0] === undefined) {
            return res.json('could not update ' + issueId);
          }
          res.json('successfully updated');
        })
        .then(trx.commit)
        .catch(trx.rollback)
      }).catch(err => console.log(err))

    })
    
    .delete(function (req, res){
      console.log('delete')
      var project = req.params.project;
      const issueId = Number(req.body._id);
      console.log(project, 'delete, project_name');
      console.log(issueId, 'delete issueId');
      if(issueId === undefined ) {
        return res.json('_id error');
      }

      db.transaction(trx => {
        trx.delete('*').from('issue').where('_id', '=', issueId)
        .returning('*')
        .then(data => {
          console.log(data, 'data returned from delete')
          if(data[0] === undefined) {
            res.json({ failed: 'could not delete '+ issueId });
          }
          if(data[0] !== undefined ) {
            res.json({ success: 'deleted '+ issueId });
          }
        })
        .then(trx.commit)
        .catch(trx.rollback)
      }).catch(err => console.log(err))
      
    });
    
};
