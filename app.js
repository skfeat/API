const User = require('./db');
const UserBalance = require('./reedemdata')
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const secret = 'your-secret-key';

app.use(express.json()); // Add this line
app.use(cors());

//===================== GET HOME REQUEST FOR API ==============

app.get('/', async (req, res) => {
  res.json({status:"ok",message:"Server is working fine"});
});

//===================== POST SIGNUP REQUEST FOR API ==============
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({message:'User already exists',status:false});
  }
  // Create a new user
  const balance = 1500
  const newUser = new User({ name, email, password ,balance });
  try {
    await newUser.save();
    console.log('User created:', newUser.name);
    const tokenData = { details: { name: newUser.name, email: newUser.email ,balance:newUser.balance} };

    const token = jwt.sign(tokenData, secret);
    res.json({message:"Account Created Successfully",data:newUser,status:true,jwt:token});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Error creating user',status:false});
  }
});
//===================== GET DATA JWT REQUEST FOR API ==============
app.get('/data', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    res.json(decoded);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});
//===================== PUT UPDATE BAL REQUEST FOR API ==============
app.put('/update', async (req, res) => {
  const updateAmount = 100;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, secret);
  const email = decoded.details.email;
  console.log(email);
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found', status: false });
  }
  // Update user balance
  existingUser.balance += updateAmount;
  try {
    await existingUser.save();
    console.log('Balance updated:', existingUser.balance);
    res.json({ message: 'Balance updated successfully', data: existingUser, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating balance', status: false });
  }
});

//===================== PUT REEDEM REQUEST FOR API ==============
app.put('/reedem', async (req, res) => {
  const email = req.body.email;
  const upi = req.body.upi;


  const existingUser = await User.findOne({ email });

 
  console.log(email);
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found', status: false });
  } else if (existingUser) {
    const ReedemBal = existingUser.balance
    existingUser.ReedemBalance = ReedemBal;  
    existingUser.balance = 0;
    existingUser.upi = upi;
    const currentDate = new Date();
    try {
      await existingUser.save();
      const UserBal= new UserBalance ({name:existingUser.name,email:existingUser.email,upi:existingUser.upi,ReedemBalance:existingUser.ReedemBalance,Date:currentDate});
      await UserBal.save();
      res.json({ message: 'Redeemed successfully', data: existingUser, status: true, UPIID: upi,reedemat:currentDate });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error occurred while redeeming', status: false });
    }
  } else {
    res.status(500).json({ message: 'Error occurred while redeeming', status: false });
  }
});

app.get('/reedemusers', async (req, res) => {
  try {
    const users = await UserBalance.find();
    res.json({ data: users, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users', status: false });
  }
});


//===================== GET SIGNUP REQUEST FOR API ==============
app.get(`/signup`,  (req, res) =>{
res.json({error:"get method is not allowed"})
})
//===================== GET LOGIN REQUEST FOR API ==============
app.get(`/login`, (req, res) =>{
  res.json({error:"get method is not allowed"})
})
//===================== POST LOGIN REQUEST FOR API ==============
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const tokenData = { details: { name: user.name, email: user.email ,balance:user.balance} };
      const token = jwt.sign(tokenData, secret);
      res.json({message:"Logged in",data: user,status:true,jwt:token});
    } else {
      res.status(400).json({ message: 'Invalid User id or Password' ,status:false});
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong',status:false });
  }
});



app.listen(3450, () => {
  console.log('Server listening on port 3450');
});
