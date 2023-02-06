require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');
const app = express();

//connect to mongoDB
const MongoClient = mongodb.MongoClient;
const url = process.env.URL;
MongoClient.connect(url, {useNewUrlParser: true}).then(client => {
    console.log('DB connection successful...!');

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`App is running on port ${port}...`);});

//Database
const DB = client.db('basicWallet');
//Collection
const DBCollection = DB.collection('users');

//Create a User Wallet
app.post('/register', (req, res) => {
    const user = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        balance: 0};
        DBCollection.createIndex( { username: 1 }, { unique: true } )    
DBCollection.insertOne(user).then(result => {res.status(201).json({ message: 'User successfully created', data: user })}).catch(err => {res.send(err.message)})});


//Login to User Account
app.post('/login', async(req, res) => {
   const username = req.body.username
   const password = req.body.password
   const user = await DBCollection.findOne({ username: username })

   if (!user) {
     return res.status(401).json({
       msg: 'Invalid Credentials'
     });
   }
    DBCollection.findOne({ username: username }).then(result => {res.status(200).json({ message: 'User logged in' })}).catch(err =>
        res.send('Something went wrong'))});


//credit a user wallet
app.patch('/credit-wallet', (req, res) => {
    const username = req.body.username;
    const amount = req.body.amount;
    DBCollection.updateOne({ username: username }, { $inc: { balance: amount } }).then(result => {
        res.status(200).json({ message: 'Wallet credited' })}).catch(err => {res.send('Something went wrong')})});


//Get a User Wallet Balance
app.get('/balance/:username', (req, res) => {
    const username = req.params.username;
    DBCollection.findOne({ username: username}).then(result => {res.status(201).json({ message: 'Balance fetched', data: result })}).catch(err => {res.send('Something went wrong')})})
    

// Update User wallet password
 app.patch('/update-password', (req, res) => {
    const username = req.body.username;
    const newPassword = bcrypt.hashSync(req.body.password, 10);
DBCollection.updateOne({ username : username}, { $set: {password : newPassword} }).then(result => {
    res.status(200).json({ message: 'Password Updated' })}).catch(err => {res.send('Something went wrong')})})


// Delete a userWallet
 app.delete('/delete-user', (req, res) => {
    const username = req.body.username;
 DBCollection.deleteOne({ username : username}).then(result => {res. status(200).json({message: 'User Deleted Successfully'})}).catch(err => {res.send('something went wrong')});
 })
})
  
   