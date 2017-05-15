const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

const todosSeed = [{_id: new ObjectID(), text: 'feed plant'},
  {_id: new ObjectID(), text: 'water dog'},
  {_id: new ObjectID(), text: 'walk the fish'}]

beforeEach((done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todosSeed);
  })
  .then(() => done());
});

describe('POST /todos', () =>{
  it('should create a new todo', (done)=>{
    var text = 'test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      })

  })

  it('should not create db object with invalid data', (done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err)
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((err) => done(err));
      })
  })

})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        //console.log(res.body);
        expect(res.body.todos.length).toBe(3);
      })
      .end(() => {
        done();
      })
  })
})

describe('GET /todos/:id', ()=>{
  it('should get todo with valid matching id', (done)=>{
    request(app)
      .get(`/todos/${todosSeed[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todosSeed[0].text);
      })
      .end(done);
  });
  it('should return a 404 if todo not found',(done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it('should return a 404 if id is not valid', (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });

})