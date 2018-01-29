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

app.get("/transaction",function(req,res){
  res.sendFile(__dirname + '/public/transaction.html')
})

app.post("/transaction", function(req,res){
  var tx_hash = req.body.value;
  var object = web3.eth.getTransaction(tx_hash)
  if(object===null){
    io.emit('tx-hash-invalid')
  }
  else{
    var final_value = (web3.fromWei((object.value).toNumber(),'ether')) + " Ether";
    var final_gasPrice = (web3.fromWei((object.gasPrice).toNumber(),'ether')) + " Ether";
    object.final_value=final_value;
    object.final_gasPrice=final_gasPrice;
    io.emit('transaction-deets',(object));
  }
})

app.get("/blocks",function(req,res){
  res.sendFile(__dirname + '/public/blocks.html')
})

app.post("/blocks",function(req,res){
  var block = req.body.value;
  var test = web3.eth.getBlock(block);
  if(test===null){
    io.emit('block-error');
  }
  else{

    io.emit('block-deets',test);
  }
})
