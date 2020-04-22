const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");
const flash = require('connect-flash');

const app = express();

const db = require('./config/configFile').MongoURI;
// connect to mongoose
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{console.log("Connected to Cloud Atlas cluster")})
    .catch(err=> console.log("error connecting to DB",err))
//----------------------------------------------------------------------//

// express-session mgmt
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
// passport config
require("./config/passport")(passport);

// Connect flash
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}))
// parse application/json
app.use(bodyParser.json())

// import routes 
app.use('/',require('./routes/routes'))

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("server started on port ...",PORT)
})