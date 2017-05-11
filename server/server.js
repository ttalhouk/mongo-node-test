const express = require('express');
const bodyParser = require('body-parser');

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
})


app.listen(3000, ()=>{
  console.log('listening on port 3000');
});

module.exports = {app};
