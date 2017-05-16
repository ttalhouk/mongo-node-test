const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const usersSeed = [
  {
    _id: userOneId,
    email: 'example@example.com',
    password: 'password',
    tokens:[{
      access:'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'jim@example.com',
    password: 'password2'
  }
]

const todosSeed = [{_id: new ObjectID(), text: 'feed plant'},
  {_id: new ObjectID(), text: 'water dog', completed: true, completedAt: 333 },
  {_id: new ObjectID(), text: 'walk the fish'}]

const populateTodos = (done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todosSeed);
  })
  .then(() => done());
};
const populateUsers = (done) => {
  User.remove({}).then(()=> {
    var userOne = new User(usersSeed[0]).save();
    var userTwo = new User(usersSeed[1]).save();

    return Promise.all([userOne,userTwo]);
  })
  .then(() => done());
};

module.exports = {todosSeed, populateTodos, usersSeed, populateUsers}
