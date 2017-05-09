const {MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
  if(err){
    return console.log('Unable to connect to MongoDb Server');
  }

  console.log('Connected to MongoDb Server');

  // db.collection('Todos').find({_
  //   id: new ObjectID('59120a01535e2a53fa5197de')
  //   })
  //   .toArray()
  //   .then((docs)=>{
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   })
  //   .catch((err) => {
  //     console.log('Unable to fetch ToDos', err);
  //   })

  db.collection('Todos').find()
    .count()
    .then((count)=>{
      console.log(count + ' Todos');
    })
    .catch((err) => {
      console.log('Unable to fetch ToDos', err);
    })

  db.collection('Users').find({name:"Talal"})
    .count()
    .then((count)=>{
      console.log(count + ' Users with given Name');
    })
    .catch((err) => {
      console.log('Unable to fetch Users', err);
    })

  //db.close();
})
