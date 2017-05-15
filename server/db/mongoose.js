var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');


module.exports = {mongoose};


// examples
// Model

// var Todo = mongoose.model('Todo', {
//   text:{
//     type: String,
//     required: true,
//     minlength: 1,
//     trim: true
//   },
//   completed:{
//     type: Boolean,
//     default: false
//   },
//   completedAt:{
//     type: Number,
//     default: null
//   }
// })
// var User = mongoose.model('Users', {
//   email:{
//     type: String,
//     required: true,
//     minlength: 1,
//     trim: true
//   }
// })


// instances
// var newTodo = new Todo({
// })
//
// newTodo.save()
//   .then((doc)=>{
//     console.log("Saved todo");
//     console.log(doc);
//   })
//   .catch((e)=>{
//     console.log('Unable to save todo');
//   })

// var newUser = new User({
//   email: "talal@example.com"
// })
// newUser.save()
//   .then((doc)=>{
//     console.log("Saved User");
//     console.log(doc);
//   })
//   .catch((e)=>{
//     console.log('Unable to save User');
//     console.log(e);
//   })
