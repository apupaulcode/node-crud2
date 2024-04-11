// external imports 

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
dotenv.config();


// internal imports
const {errorHandler,notFoundHandler} = require('./middlewares/common/errorHandler') 
const loginRouter = require('./router/loginRouter')
const usersRouter = require('./router/usersRouter')
const inboxRouter = require('./router/inboxRouter')


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Connection Successfull'))
.catch(err=>console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");

app.use(express.static(path.join(__dirname,"public")));


app.use(cookieParser(process.env.COOKIE_SECRET));

// setup route 
app.use('/',loginRouter);
app.use('/users',usersRouter);
app.use('/inbox',inboxRouter);

// error handle 
// 404 not found handler 
app.use(notFoundHandler);
// common error handler 
app.use(errorHandler);

app.listen(process.env.PORT,()=>{
    console.log(`App is listening to port ${process.env.PORT}`);
})