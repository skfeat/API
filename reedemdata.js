const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bravebrowser1775:Raj%401775@cluster0.diayrzp.mongodb.net/UserData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('User Reedem Data Connected');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  ReedemBalance:Number,
  upi:String,
  Date:Date

});

const UserBalance = mongoose.model('ReedemUserData', userSchema);

module.exports = UserBalance;
