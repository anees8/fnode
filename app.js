const express = require('express');
const fileUpload = require('express-fileupload'); 
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));

const port = process.env.PORT || 3000; // You can use any valid port number here

app.use(express.urlencoded({
  extended: true
})).use(express.json());

app.use(fileUpload());
app.use(express.static('public'));

const AuthRoute = require('./routes/auth');
const EmployeeRoute = require('./routes/employee');
const ProductRoute = require('./routes/product');
const ImapRoute = require('./routes/imap');



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
app.use('/api',ImapRoute);
app.use('/api',EmployeeRoute);
app.use('/api',ProductRoute);



// Start the server and listen on a specific port

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.use((req,res,next)=>{
   res.status(400).json({ success: false, message:"Invalid URL Request" });
});