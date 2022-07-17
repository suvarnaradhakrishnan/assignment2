const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const Schema = mongoose.Schema;

var NewBookSchema = new Schema({
    title : String,
    author: String,
    image: String,
    about: String
});

var Bookdata = mongoose.model('bookdata', NewBookSchema);                       

module.exports = Bookdata;