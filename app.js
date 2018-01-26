var express = require("express");
var app = express();
var bodyParser =require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var socket = require('socket.io');
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/S5pEiEIgs1t2nv79dcJ8"));
var server = app.listen(9001, function(){
    console.log('listening for requests on port 9001,');
});
var io = require('socket.io').listen(server);

app.get("/",function (req,res) {
	res.sendFile(__dirname + '/public/index.html');
})

app.get("/balance", function(req,res){
  res.sendFile(__dirname + '/public/balance.html')
})

app.post("/balance",function(req,res){
  var pub_key = req.body.value;
  if(web3.isAddress(pub_key)){
    var balanceWei = web3.eth.getBalance(pub_key);
    var balance  = web3.fromWei(balanceWei,'ether');
    io.emit('balance',balance)
  }
  else{
    io.emit('check-fail',"fail")
  }
})
