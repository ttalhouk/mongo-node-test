const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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


app.listen(3000, ()=>{
  console.log('listening on port 3000');
});

module.exports = {app};
