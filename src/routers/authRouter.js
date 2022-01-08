const express = require('express');
const {MongoClient} = require('mongodb');
const passport = require('passport');
const debug = require('debug')('app:authRouter');

const authRouter = express.Router();

const url = 'mongodb+srv://<username>:<password>@cluster0.teqms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbName = 'dbName';

authRouter
  .route('/signup')
  .post((req, res) => {
    // * Creating User */
    const {username, password} = req.body;
    
    (async function createUser(){
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to MongoDb');
        const user = {username, password};
        const db = client.db(dbName);
        const responseMg = await db.collection('users').insertOne(user);
        debug(responseMg.insertedId);
        req.login(responseMg, () => {
          res.redirect('/auth/profile');
        });

      } catch (err) {
        debug(err.stack);
      } finally {
        client.close();
      }
    }());

  });

authRouter
  .route('/signin')
  .get((req, res) => {
    res.render('signin');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/'
  }));

authRouter
  .route('/profile')
  .get((req, res) => {
    res.send(req.user);
  });

module.exports = authRouter;