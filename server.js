" use strict";
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const server = express();
server.use(cors());
require("dotenv").config();
const axios = require("axios");
server.use(express.json());
const PORT = process.env.PORT;
const API = process.env.API_URL;

// mongoose.connect(
//   "mongodb://adhammhaydat:12345@cluster0-shard-00-00.qi4a6.mongodb.net:27017,cluster0-shard-00-01.qi4a6.mongodb.net:27017,cluster0-shard-00-02.qi4a6.mongodb.net:27017/finalExamses?ssl=true&replicaSet=atlas-ipru7s-shard-0&authSource=admin&retryWrites=true&w=majority"
// );
mongoose.connect("mongodb://localhost:27017/final", { useNewUrlParser: true });
const criptoSchema = mongoose.Schema({
  title: String,
  description: String,
  toUSD: String,
  image_url: String,
});

const userSchema = mongoose.Schema({
  email: String,
  cripto: [criptoSchema],
});
const userModel = mongoose.model("User", userSchema);

function seed() {
  const newmodel = new userModel({
    email: "v.salvatore7.gs@gmail.com",
    cripto: {
      title: "Ethereum",
      description:
        "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. After Bitcoin, it is the largest cryptocurrency by market capitalization. Ethereum was invented in 2013 by programmer Vitalik Buterin.",
      toUSD: "3,288.49",
      image_url:
        "https://media.wired.com/photos/598a36a7f15ef46f2c68ebab/master/pass/iStock-696221484.jpg",
    },
  });
  newmodel.save();
  console.log(newmodel);
}
// seed();
function getAllData(req, res) {
  let email = req.params.email;
  axios.get(API).then((result) => {
    res.send(result.data);
  });
}

function addFav(req, res) {
  let email = req.params.email;
  const { title, description, toUSD, image_url } = req.body;
  userModel.findOne({email:email},(err,result)=>{
    if(err){
      res.send(err)
    }else{
      result.cripto.push({ title:title, description:description, toUSD:toUSD, image_url:image_url})
      result.save();
      res.send(result.data);
    }
  })
}
function getFavData(req,res){
  let email = req.params.email;
  userModel.findOne({email:email},(err,result)=>{
    if(err){
      res.send(err)
    }else{res.send(result.data)}
    
  })
 
}

function deleteFave(req,res){
  let email = req.params.email;
  let id=req.params.id;
  userModel.findOne({email:email},(err,result)=>{
    if(err){
      res.send(err)
    }else{
      result.cripto.splice(id,1);
    }
    
  })
}

function updatFav(req,res){
  let email = req.params.email;
  let data= { title, description, toUSD, image_url } = req.body;

  let id=req.params.id;
  userModel.findOne({email:email},(err,result)=>{
    if(err){
      res.send(err)
    }else{
      result.cripto.splice(id,1,data);
    }
    
  })
}
server.get("/", (req, res) => {
  res.send("hello");
});

server.get("/allData", getAllData);
server.post("/addFav/:email", addFav);
server.get('/getFavaData/:email',getFavData);
server.delete('/delete/:email/:id',deleteFave);
server.put('/updatFav/:email/:id',updatFav)
server.listen(PORT, () => {
  console.log(`i am on ${PORT}`);
});
