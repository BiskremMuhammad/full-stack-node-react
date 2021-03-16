const jwt = require('jsonwebtoken');
const User = require("../models/user");

const handleErrors = (e) => {
  let errors = { username: "", password: "" };

  if (e.code) {
    errors.username = "user already exists";
    return errors;
  }

  Object.values(e.errors).forEach(({ properties }) => {
    errors[properties.path] = properties.message;
  });

  return errors;
};

module.exports.post_login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    try {
      const user = await User.login(username, password);
      const token = createJWT(user._id);
      res.send({ status: 'ok', data: {
        jwt: token
      } });
    }
    catch (e) {
      res.send({ status: 'error', errors: e.message });
    }
  }
  else {
    res.send({ status: 'error', errors: 'missing data.' });
  }
};

const tokenAge = 1 * 24 * 60 * 60;
const createJWT = (id) => {
  const secret = 'helloJWTapp';
  return jwt.sign({ id }, secret, {
    expiresIn: tokenAge
  });
};

module.exports.post_signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    const token = createJWT(user.id);
    res.send({ status: 'ok', data: {
      jwt: token
    } });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors });
  }
};

module.exports.verify_auth = async function (req, res) {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, 'helloJWTapp', async (err, decodedToken) => {
      if (err) {
        res.send({ status: 'error', errors: err.message });
      }
      else {
        // user is now verified > so refresh the token meaning create new one to extend it's expiration time
        const user = await User.findById(decodedToken.id);
        const token = createJWT(user._id);
        res.send({ status: 'ok', data: {
          jwt: token
        } });
      }
    })
  }
  else {
    res.send({ status: 'error', errors: 'no token provided.' });
  }
}
