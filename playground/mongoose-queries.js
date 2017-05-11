const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {ObjectID} = require('mongodb');

var id = '5914d21e1633dd929d575adb';


// // .find query
// // returns all documents
// Todo.find({
//   // search criteria
//   _id: id
// }).then((todos) => {
//   console.log('Todos',todos);
// });
//
//
// // .findOne query
// // returns first document matching criteria
//
// Todo.findOne({
//   // search criteria
//   completed: false
// }).then((todo) => {
//   console.log('Todo',todo);
// });
//
// // .findById query
// // returns document matching the ID all documents
// Todo.findById(id).then((todo) => {
//   console.log('Todo',todo);
// });
//
//
// // ID validation
//
// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid');
// }
//
//
// // not found handing
// Todo.findById('6914d21e1633dd929d575adb')
//   .then((todo) => {
//     // valid id but no record
//     if (!todo){
//       return console.log('No record found by this id');
//     }
//     // record found
//     console.log('Todo',todo);
//   })
//   .catch((err) => {
//     // invalid record handle Error
//     console.log(err);
//   });


// quering user

const {User} = require('../server/models/user')

var userId = "59122e2a11854e5fc80ccbc7"

if(ObjectID.isValid(userId)){

  User.findById(userId).then((user) => {
    if(!user){
      return console.log('No user with that ID found');
    }
    console.log(user);
  })
} else {
  console.log('Invalid ID');
}
