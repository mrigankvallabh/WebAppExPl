const express = require('express');
const sessionsRouter = express.Router();
const {MongoClient, ObjectId} = require('mongodb');
const debug = require('debug')('app:sessionsRouter');

const url = 'mongodb+srv://<username>:<password>@cluster0.teqms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbName = 'dbName';

sessionsRouter.use((req, res, next) => {
  if(req.user) {
    next();
  } else {
    res.redirect('/auth/signin');
  }
});

sessionsRouter
  .route('/')
  .get((req, res) => {

    (async function mongo(){
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to MongoDb');

        const db = client.db(dbName);
        const sessions = await db.collection('sessions').find().toArray();
        res.render('sessions', {sessions: sessions});
      } catch (err) {
        debug(err.stack);
      }
    }());
  });

sessionsRouter
  .route('/:id')
  .get((req, res) => {
    const id = new ObjectId(req.params.id);

    (async function mongo(){
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to MongoDb');

        const db = client.db(dbName);
        const session = await db.collection('sessions').findOne({_id: id});
        res.render('session', {session: session});
      } catch (err) {
        debug(err.stack);
      }
    }());
  });

module.exports = sessionsRouter;