const User = require('./db');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); // Add this line
app.use(cors());


app.get('/', async (req, res) => {
  res.json({status:"ok",message:"Server is working fine"});
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({message:'User already exists',status:false});
  }
  // Create a new user
  const newUser = new User({ name, email, password });
  try {
    await newUser.save();
    console.log('User created:', newUser.name);
    res.json({message:"Account Created Successfully",data:newUser,status:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'Error creating user',status:false});
  }
});
app.get(`/signup`,  (req, res) =>{
res.json({error:"get method is not allowed"})
})
app.get(`/login`, (req, res) =>{
  res.json({error:"get method is not allowed"})
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({message:"Logged in",data: user,status:true});
    } else {
      res.status(400).json({ message: 'Invalid User id or Password' ,status:false});
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong',status:false });
  }
});



app.listen(3450, () => {
  console.log('Server listening on port 3000');
});
