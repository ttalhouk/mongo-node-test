const {MongoClient, ObjectID } = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if(err){
    return console.log('Unable to connect to MongoDb Server');
  }

  console.log('Connected to MongoDb Server');

  // db.collection('Todos').insertOne({
  //   text: 'Something ToDo',
  //   finished: false
  // }, (err, result)=>{
  //   if(err){
  //     return console.log('Unable to add record', err);
  //
  //   }
  //   console.log('successfully created record', JSON.stringify(result.ops, undefined, 2));
  // })

  // db.collection('Users').insertOne({
  //   name: 'Talal',
  //   age: 38,
  //   location: "Santa Clara"
  // }, (err, result)=>{
  //   if(err){
  //     return console.log('Unable to add record', err);
  //
  //   }
  //   //console.log('successfully created record', JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // })

  db.close();
})
