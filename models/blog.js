const mongo = require('mongoose');
const Schema = mongo.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    requierd: true
  },
  content: {
    type: String,
    requried: true
  }
}, { timestamps: true });

const Blog = mongo.model('Blog', blogSchema);

module.exports = Blog;