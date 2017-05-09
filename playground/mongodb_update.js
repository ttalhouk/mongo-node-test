
const {MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if(err){
    return console.log('Unable to connect to MongoDb Server');
  }

  console.log('Connected to MongoDb Server');
  // findOneAndUpdate

  // db.collection('Todos').findOneAndUpdate({
  //     _id: new ObjectID("591217c567641153137a296d")
  //   }, {
  //     $set:{completed: true}
  //   }, {
  //     returnOriginal:false
  //   })
  //   .then((res) => {
  //     console.log(res);
  //   })

  // db.collection('Users').findOneAndUpdate({
  //     _id: new ObjectID("59120adab091e0541932f3cd")
  //   }, {
  //     $set:{name: "Talal"},
  //     $inc: {age:1}
  //   }, {
  //     returnOriginal:false
  //   })
  //   .then((res) => {
  //     console.log(res);
  //   })

  //db.close();
});
