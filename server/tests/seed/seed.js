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
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'jim@example.com',
    password: 'password2',
    tokens:[{
      access:'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
]

const todosSeed = [{_id: new ObjectID(), text: 'feed plant', _creator: userOneId},
  {_id: new ObjectID(), text: 'water dog', completed: true, completedAt: 333, _creator:userTwoId },
  {_id: new ObjectID(), text: 'walk the fish', _creator: userOneId}]

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
