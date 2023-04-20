const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser=require('body-parser')
require('dotenv').config();

const EmployeeRoute = require('./routes/employee');
const AuthRoute = require('./routes/auth');


mongoose.connect( `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
const db=mongoose.connection;
db.on('error',(err)=>{
console.log(err);
});

db.on('open',()=>{
console.log('Database Connection Established!')
});


// Create an Express app
const app = express();
if(app.get('env')=="development"){
  app.use(morgan('dev'));

}

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// Start the server and listen on a specific port
const port = process.env.PORT || 3000; // You can use any valid port number here
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


app.use('/api',AuthRoute);
app.use('/api',EmployeeRoute);

