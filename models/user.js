const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
{
    name: 
    {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },

    email: 
    {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },

    password: 
    {
      type: String,
      required: true,
      min: 6,
    },

    profilePicture: 
    {
      type: String,
      default: "",
    },
    
    coverPicture: 
    {
      type: String,
      default: "",
    },

    followers: 
    {
      type: Array,
      default: [],
    },

    followings: 
    {
      type: Array,
      default: [],
    },

    isAdmin: 
    {
      type: Boolean,
      default: false,
    },

    desc: 
    {
      type: String,
      max: 50,
    },

    city: 
    {
      type: String,
      max: 50,
    },

    from: 
    {
      type: String,
      max: 50,
    },

    relationship: 
    {
      type: Number,
      enum: [1, 2, 3],
    },
},
{ 
    timestamps: true 
});

userSchema.pre('save', async (next)=> 
{
    
    const user = this;
    if (!user.isModified('password')) 
    {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();

});
  
  
userSchema.methods.comparePassword = async (password, done)=> 
{
    const result = await bcrypt.compare(password, this.password);
    done(err, result);    
};


const User = model('User', userSchema);
module.exports = User;