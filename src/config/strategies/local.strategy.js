const passport = require('passport');
const { Strategy } = require('passport-local');
const {MongoClient} = require('mongodb');
const debug = require('debug')('app:local.strategy');

const url = 'mongodb+srv://<username>:<password>@cluster0.teqms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const dbName = 'dbName';

module.exports = function localStrategy() {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    debug(username, password);
    (async function validateUser(){
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to MongoDb');
        const db = client.db(dbName);
        const user = await db.collection('users').findOne({username});
        debug(user);
        if(user && user.password === password) {
          done(null, user);
        } else {
          done(null, false);
        }
        
      } catch (err) {
        debug(err.stack);
        done(err, false);
      } finally {
        client.close();
      }
    }());
  
  }));
}