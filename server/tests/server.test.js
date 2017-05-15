const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

const todosSeed = [{_id: new ObjectID(), text: 'feed plant'},
  {_id: new ObjectID(), text: 'water dog', completed: true, completedAt: 333 },
  {_id: new ObjectID(), text: 'walk the fish'}]

beforeEach((done) => {
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todosSeed);
  })
  .then(() => done());
});

describe('POST /todos', () => {
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

describe('GET /todos/:id', () => {
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

describe('DELETE /todos/:id', () => {
  it('should remove todo with valid matching id', (done)=>{
    var id = todosSeed[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todosSeed[0].text);
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }
        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        })
        .catch(err => {
          done(err);
        })
      });
  });
  it('should return a 404 if todo not found',(done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
  it('should return a 404 if id is not valid', (done) => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });

})

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of first item
    var id = todosSeed[0]._id.toHexString();
    var updates = {text: 'new text', completed: true}
    // set text, completed to true
    request(app)
      .patch(`/todos/${id}`)
      .send(updates)
      // assert 200
      .expect(200)
      .expect((res) => {
        // assert text = new text, complted = true, completedAt is number (.toBeA)
        expect(res.body.todo.text).toBe(updates.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });
  it('should clear completed at if completion set to false', (done) => {
    // grab id of second item
    // text changed, completed to false
    var id = todosSeed[1]._id.toHexString();
    var updates = {text: 'new text', completed: false}
    request(app)
      .patch(`/todos/${id}`)
      .send(updates)
      // assert 200
      .expect(200)
      .expect((res) => {
        // assert text = new text, complted = true, completedAt is number (.toBeA)
        expect(res.body.todo.text).toBe(updates.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
})
