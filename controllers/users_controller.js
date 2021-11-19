const User = require('../models/user');

module.exports.profile = (req, res)=>
{
    return res.render('user_profile', { title : 'Profile' });
}

module.exports.signUp = (req, res)=>
{
    return res.render('user_sign_up', { title : 'Sign Up' });
}

module.exports.signIn = (req, res)=>
{
    return res.render('user_sign_in', { title : 'Sign In' });
}

module.exports.create = async (req, res)=>
{
    try 
    {
        const { name, email, password, confirm_password } = req.body;
        if( password != confirm_password )
        {
            console.log('password and confirm password must match');
            req.flash('error', 'password and confirm password must match');
            return res.redirect('back');
        }

        let user =  await User.findOne({email});
        if(user)
        {
            console.log('user already exists', user);
            req.flash('error', 'user already exists');
            return res.redirect('back');
        }
        user = new User({ name, email, password});
        await user.save();
        return res.redirect('/users/sign-in');    
    } 
    catch (err) 
    {
        console.log(err.message);
        req.flash('error', `Error is ${error.message}`);
    }
}

module.exports.destroySession = (req, res)=>
{
    req.logout();
    return res.redirect('/');
}