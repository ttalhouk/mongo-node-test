require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {authenticate} = require('./middleware/authenticate');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save()
    .then((doc)=>{
      console.log('Todo Saved');
      res.send(doc)
    })
    .catch((e)=>{
      console.log("Todo could not be saved.");
      //console.log(e);
      res.status(400).send(e)
    })
});

app.get('/todos', authenticate, (req,res) => {
  Todo.find({
    _creator: req.user._id
  })
    .then((todos) => {
      res.send({todos});
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.get('/todos/:id',authenticate, (req,res) => {
  // req.params.id
  var id = req.params.id;
  if (ObjectID.isValid(id)){

    Todo.findOne({_id: id, _creator: req.user._id })
    .then((doc)=>{
      if(!doc){
        return res.status(404).send();
      }
      //console.log('Found: ', doc);
      res.send({todo: doc});
    }).catch((e) =>{
      res.status(400).send();
    })
  } else {
    res.status(404).send();
  }
})

app.delete('/todos/:id', authenticate, (req, res) =>{
  var id = req.params.id;
  if (ObjectID.isValid(id)){

    Todo.findOneAndRemove({_id:id, _creator: req.user._id})
    .then((todo)=>{
      if(!todo){
        return res.status(404).send();
      }
      //console.log('Removed: ', todo);
      res.send({todo});
    })
    .catch((e) =>{
      res.status(400).send();
    })
  } else {
    res.status(404).send();
  }
})

app.patch('/todos/:id', authenticate, (req, res) =>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)){
    res.status(404).send();
  }
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  // could shorten to {$set: body}
  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {
    $set: {
      text: body.text,
      completed: body.completed,
      completedAt: body.completedAt
    }
    }, {
        new: true
    })
    .then(todo => {
      if(!todo){
        return res.status(404).send();
      }
      //console.log('Updated: ', todo);
      res.send({todo});
    }).catch((e) =>{
      res.status(400).send();
    })
});

app.post('/users', (req, res)=>{
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user.save()
    .then(()=>{
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header('x-auth', token).send(user)
    })
    .catch((e)=>{
      console.log("User could not be saved.");
      res.status(400).send(e)
    });
});

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user)
})

// POST /users/login {email, password}

app.post('/users/login', (req,res) => {
  var {email, password} = req.body;
  User.findByCredentials(email, password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send();
    })
})

app.delete('/users/me/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(err => {
      res.status(400).send();
    });
});



app.listen(port, ()=>{
  console.log('listening on port '+ port);
});

module.exports = {app};
