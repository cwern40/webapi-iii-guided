const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
// const logger = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();
const bodyParser = express.json();

//express.json is a method that returns a piece of middleware
server.use(express.json());

//Global middleware

//build in middleware
server.use(bodyParser);

//third party middleware
server.use(helmet());
// server.use(logger('dev'));

server.use(methodLogger);
server.use(addName);
// server.use(lockout);
// server.use(moodyGatekeeper);

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

// Custom middelware
function methodLogger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

function addName(req, res, next) {
  req.name = "Chris";
  next();
}

// function lockout(req, res, next) {
//   res.status(403).json({ message: 'API Lockout'})
// }

// function moodyGatekeeper(req, res, next) {
//   const seconds = new Date().getSeconds();

//   if (seconds % 3 === 0) {
//     res.status(403).json({
//       message: "You shall not pass"
//     })
//   } else {
//     next();
//   }
// }

module.exports = server;
