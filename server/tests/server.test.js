const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todosSeed, populateTodos, usersSeed, populateUsers} = require('./seed/seed');


beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('GET /users/me', () => {
  it('should return user if valid authenication token exists', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', usersSeed[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(usersSeed[0]._id.toHexString());
        expect(res.body.email).toBe(usersSeed[0].email);
      })
      .end(done);
  });
  it('should return 401 if there is no authenication token', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
})

describe('POST /users', () => {
  it('should create user if provided information is valid', (done) =>{
    var email = 'email@gmail.com';
    var password = 'password';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch(err => done(err));
      });
  });
  it('should return 401 if provided information is invalid', (done) =>{
    var email = 'email';
    var password = '';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.body.errors.email.message).toBe("email is not a valid email");
        //console.log(res.body.errors);
        expect(res.body.errors.password.name).toBe('ValidatorError')
      })
      .end(done)
  });
  it('should not create user if email in use', (done) =>{
    var email = usersSeed[0].email;
    var password = 'password';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });
})

describe('POST /users/login', () => {
  it('Should return a token with with credentials', (done) => {
    var email = usersSeed[1].email;
    var password = usersSeed[1].password;
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(usersSeed[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access:'auth',
            token:res.headers['x-auth']
          });
          done();
        }).catch(err => done(err));
      });
  });
  it('Should return a 400 if invald credentials', (done) => {
    var email = usersSeed[1].email;
    var password = usersSeed[1].password + "wrong";
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(usersSeed[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(err => done(err));
      });
  });
});
describe('DELETE /users/me/logout', () => {
  it('Should remove token from logged in user', (done) => {
    request(app)
      .delete('/users/me/logout')
      .set('x-auth', usersSeed[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(usersSeed[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(err => done(err));
      });
  })
})
