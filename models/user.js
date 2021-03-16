const mongo = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongo.Schema({
  username: {
    type: String,
    requried: [true, "Please anter a username"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"]
  },
  password: {
    type: String,
    requierd: [true, "Please enter a password."],
    minlength: [6, "Password must have 6+ characters."]
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ username: email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    else {
      throw Error('incorrect password.');
    }
  }
  else {
    throw Error('No user found with this email.');
  }
}

const User = mongo.model('users', userSchema);

module.exports = User;