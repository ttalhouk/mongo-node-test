
const {MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if(err){
    return console.log('Unable to connect to MongoDb Server');
  }

  console.log('Connected to MongoDb Server');

  // delete many
  // db.collection('Todos').deleteMany({text: "Eat Lunch"}).then((res)=>{
  //   console.log(res);
  // });
  // delete one
  // db.collection('Todos').deleteOne({text: "Eat Lunch"}).then((res)=>{
  //   console.log(res);
  // });
  // find one and delete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((res)=>{
  //   console.log(res);
  // });
  // db.collection('Users').deleteMany({name: "Talal"}).then((res)=>{
  //   console.log(res);
  // });
  // db.collection('Users').findOneAndDelete({
  //   _id: new ObjectID("5912190b67641153137a296e")
  // }).then((res)=>{
  //   console.log(res);
  // });

  //db.close();
});
