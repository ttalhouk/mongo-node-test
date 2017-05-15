const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
  var todo = new Todo({
    text: req.body.text
  });
  todo.save()
    .then((doc)=>{
      console.log('Todo Saved');
      //console.log(doc);
      res.send(doc)
    })
    .catch((e)=>{
      console.log("Todo could not be saved.");
      //console.log(e);
      res.status(400).send(e)
    })
});

app.get('/todos', (req,res) => {
  Todo.find()
    .then((todos) => {
      res.send({todos});
    })
    .catch(err => {
      res.status(400).send(err);
    })
})

app.get('/todos/:id', (req,res) => {
  // req.params.id
  var id = req.params.id;
  if (ObjectID.isValid(id)){

    Todo.findById(req.params.id)
    .then((doc)=>{
      if(!doc){
        return res.status(404).send();
      }
      console.log('Found: ', doc);
      res.send({todo: doc});
    }).catch((e) =>{
      res.status(400).send();
    })
  } else {
    res.status(404).send();
  }
})

app.delete('/todos/:id', (req, res) =>{
  var id = req.params.id;
  if (ObjectID.isValid(id)){

    Todo.findByIdAndRemove(id)
    .then((todo)=>{
      if(!todo){
        return res.status(404).send();
      }
      console.log('Removed: ', todo);
      res.send({todo});
    })
    .catch((e) =>{
      res.status(400).send();
    })
  } else {
    res.status(404).send();
  }
})

app.patch('/todos/:id', (req, res) =>{
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
  Todo.findByIdAndUpdate(id, {
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
      console.log('Updated: ', todo);
      res.send({todo});
    }).catch((e) =>{
      res.status(400).send();
    })
});

app.listen(port, ()=>{
  console.log('listening on port '+ port);
});

module.exports = {app};
