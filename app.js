const express = require('express');
const fileUpload = require('express-fileupload'); 
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000; // You can use any valid port number here

app.use(express.urlencoded({
  extended: true
})).use(express.json());

app.use(fileUpload());
app.use(express.static('public'));

const EmployeeRoute = require('./routes/employee');
const AuthRoute = require('./routes/auth');




mongoose.connect( `mongodb+srv://meeranjianees1:Anees%4084@anees.r0egejs.mongodb.net/${process.env.DB_NAME}`);
const db=mongoose.connection;
db.on('error',(err)=>{
console.log(err);
});

db.on('open',()=>{
console.log('Database Connection Established!')
});

// Create an Express app

if(app.get('env')=="development"){
  app.use(morgan('dev'));

}




app.use('/api',AuthRoute);
app.use('/api',EmployeeRoute);


// Start the server and listen on a specific port

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
