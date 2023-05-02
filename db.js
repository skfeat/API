const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bravebrowser1775:Raj%401775@cluster0.diayrzp.mongodb.net/UserData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  balance:Number,
  ReedemBalance:Number,
  upi:String,

});

const User = mongoose.model('User', userSchema);

module.exports = User;
