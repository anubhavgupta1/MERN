const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const fields = 
{
    usernameField: 'email',
    passwordField: 'password'
}

passport.use(new LocalStrategy(fields, async (email, password, done)=> 
{
    try 
    {
        let user = await User.findOne({email});
        if(!user)
        {
            console.log('Invalid Credentials');
            //error is nothing(null) but user is invalid 
            //therefore return false
            return done(null, false, { message: 'Invalid Credentials' });
        }

        await user.comparePassword(password, done);
    } 
    catch (err) 
    {
        return done(err);
    }
}));

passport.serializeUser((user, done)=> 
{
    done(null, user.id);
});
  

passport.deserializeUser( async function(id, done) 
{
   try 
   {
       const user = await User.findById(id);
       return done(null, user);    
   } 
   catch (err) 
   {
       return done(err); 
   }
});

// check if the user is authenticated
passport.checkAuthentication = (req, res, next)=>
{
    // if the user is signed in, then pass on 
    //the request to the next function(controller's action)
    if (req.isAuthenticated())
    {
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next)
{
    if (req.isAuthenticated())
    {
        // req.user contains the current signed in user from 
        //the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}

passport.checkLoginState = (req, res, next)=>
{
    if (req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }

    next();
}


module.exports = passport;


