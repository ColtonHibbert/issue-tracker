/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const knex = require('knex');

chai.use(chaiHttp);

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
})

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'testing required fields filled in',
          issue_text: 'required fields filled',
          created_by: 'functional test- required fields should be filled'
        })
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          done();
        })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: 'funcitonal test- missing required fields',
          status_text: 'missing required fields should be the response'
        })
        .end( function(err, res) {
          assert.equal(res.status, 200 );
          assert.equal(res.body, 'missing required fields');
          done();
        })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no updated field sent');
          done();
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 1,
          issue_title: 'put request, one field updated'
        })
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'successfully updated');
          done();
        })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 1,
          issue_title: 'put request,  multiple fields updated',
          created_by: 'put test guy',
          assigned_to: 'colt put test'
        })
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'successfully updated');
          done();
        })
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: 'true'
        })
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].open, true)
          done();
        })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          open: 'true',
          status_text: '',
          assigned_to: ''
        })
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].open, true);
          assert.equal(res.body[0].status_text, '');
          assert.equal(res.body[0].assigned_to, '');
          done();
        })
      });

    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: 0})
        .end( function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'failed');
          done();
        })
      });
      
      test('Valid _id', function(done) {

        async function getLastIdAndDelete() {
          let lastId = null;
          await db('issue').max('_id').where('project_id', '=', 1)
          .returning('_id')
          .then( data => {
            lastId = data[0].max;
            console.log(data, 'here is lastId in delete')
          })

          chai.request(server)
          .delete('/api/issues/test')
          .send({_id: lastId })
          .end( function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'success');
            done();
          })
        }

        getLastIdAndDelete();
        
      });
      
    });

});
