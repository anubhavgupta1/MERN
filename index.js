const express = require('express');
const cookieParser =  require('cookie-parser');
const hostname = 'localhost';
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
db();

const session = require('express-session');
const MongoStore = require('connect-mongo');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const flash = require('connect-flash');
const flashMiddleWare = require('./middlewares/flash');

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static(__dirname +'/assets'));
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('view engine', 'ejs');
app.set('views', './views');

const config = require('config');
const sessionStore = MongoStore.create(
{
    mongoUrl : config.get('mongoURI')
});

const sess = 
{
    name : config.get('cookieName'), 
    secret : config.get('cookieSecret'), 
    saveUninitialized : false,
    resave : false,
    cookie : 
    {
        maxAge : (72*100*1000)
    },
    store: sessionStore 
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)

app.use(flash());
app.use(flashMiddleWare.setFlash);

app.use('/', require('./routes/index'));

//start the server
app.listen(port,hostname, (err)=>
{
    if(err)
    {
        console.log(err);
        return;
    }

    console.log(`Server is up and running at http://${hostname}:${port}`);
});
