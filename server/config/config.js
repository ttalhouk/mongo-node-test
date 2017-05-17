var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env];
  Object.keys(envConfig).forEach((key) => process.env[key] = envConfig[key])
}

// if (env === 'development'){
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
//   process.env.PORT =  3000;
// } else if (env === 'test'){
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
//   process.env.PORT =  3000;
// }
