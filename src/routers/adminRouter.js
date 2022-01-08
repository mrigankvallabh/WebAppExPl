const express = require('express');
const {MongoClient} = require('mongodb');
const debug = require('debug')('app:adminRouter');

const adminRouter = express.Router();

const sessions = require('../data/sessions.json');
const url = 'mongodb+srv://<username>:<password>@cluster0.teqms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbName = 'dbName';

adminRouter
  .route('/')
  .get((req, res) => {
    (async function mongo(){
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to MongoDb');

        const db = client.db(dbName);
        const responseMg = await db.collection('sessions').insertMany(sessions);
        res.json(responseMg);

      } catch (err) {
        debug(err.stack);
      } finally {
        client.close();
      }
    }());
  });

module.exports = adminRouter;