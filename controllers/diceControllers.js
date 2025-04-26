const crypto = require('crypto');
// const { handleWagerIncrease, handleProfileTransactions } = require("../profile_mangement/index")
const DiceEncription = require("../model/dice_encryped_seeds");
const DiceGame = require("../model/dice_game");
const { format } = require('date-fns');
const { wallet } = require("../wallet_transaction")
const currentTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
const Bills = require("../model/bill");
const { Console } = require('console');
let nonce = 0
let maxRange = 100
const salt = 'Qede00000000000w00wd001bw4dc6a1e86083f95500b096231436e9b25cbdd0075c4';
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const handleHashGeneration = (() => {
  const hash = crypto.randomBytes(32).toString('hex');
  const clientSeed = generateString(23);
  const combinedSeed = hash + salt + clientSeed;
  const serverSeed = crypto.createHash('sha256').update(combinedSeed).digest('hex');
  let encrypt = { hash, clientSeed, serverSeed }
  return encrypt
})

async function handleUpdatewallet(data) {
  try {
    if (data.token === "Fun Coupons") {
      let sjj = await wallet?.fun.findOne({ user_id: data.user_id });
      let prev_bal = parseFloat(sjj.balance);
      let wining_amount = parseFloat(data.wining_amount);
      let bet_amount = parseFloat(data.bet_amount);
      if (data.has_won) {
        let current_amount = prev_bal + wining_amount;
        await wallet?.fun.updateOne(
          { user_id: data.user_id },
          { balance: current_amount });
      }
      else {
        let current_amount = prev_bal - bet_amount;
        await wallet?.fun.updateOne(
          { user_id: data.user_id },
          { balance: prev_bal - bet_amount }
        );
      }
    }
    else if (data.token === "USD") {
      let sjj = await wallet?.dollar.find({ user_id: data.user_id });
      let prev_bal = parseFloat(sjj[0].balance);
      let wining_amount = parseFloat(data.wining_amount);
      let bet_amount = parseFloat(data.bet_amount);
      if (data.has_won) {
        let current_amount = prev_bal + wining_amount;
        await wallet?.dollar.updateOne(
          { user_id: data.user_id },
          { balance: prev_bal + wining_amount }
        );
      } else {
        let current_amount = prev_bal - bet_amount;
        await wallet?.dollar.updateOne(
          { user_id: data.user_id },
          { balance: current_amount }
        );
      }
    }
  }
  catch (error) {
    console.log(error);
  }
}

async function handleDiceBEt(data) {
  try {
    // if (events.token !== "WGF") {
    //   handleWagerIncrease(events);
    // }
    await DiceGame.create(data);
  }
  catch (error) {
    console.log(error);
  }
  let bil = {
    user_id: data.user_id,
    transaction_type: "Classic Dice",
    token_img: data.token_img,
    token_name: data.token,
    balance: data.current_amount,
    trx_amount: data.has_won ? data.wining_amount : data.bet_amount,
    datetime: data.time,
    status: data.has_won,
    bill_id: data.bet_id,
  };
  await Bills.create(bil);

}

async function getNonce(user_id){
  const result = await DiceEncription.findOneAndUpdate({user_id},{
    $inc: { nonce: 1 }
  })
  return result
}

function handleMybet(e, data, prev_bal, res, user_id, seed) {

  if (data.is_roll_under) {
    if (parseFloat(e.cashout) < parseFloat(data.chance)) {
      let wining_amount = parseFloat(data.wining_amount);
      let current_amount = parseFloat(prev_bal + wining_amount).toFixed(4);
      handleUpdatewallet({ has_won: true, current_amount, ...data, user_id, ...seed });
      const bet_data = {
          ...e,
          ...seed,
          ...data,
          current_amount,
          has_won: true,
          profit: wining_amount,
          bet_id: Math.floor(Math.random() * 100000000000) + 720000000000,
          user_id
        }
      handleDiceBEt(bet_data);
      return res.status(200).json(bet_data);
    } else {
      let bet_amount = parseFloat(data.bet_amount);
      let current_amount = parseFloat(prev_bal - bet_amount).toFixed(4);
      handleUpdatewallet({ current_amount, has_won: false, ...data , user_id, ...seed});
      const bet_data =  {
          ...e,
          ...data,
          ...seed,
          current_amount,
          has_won: false,
          profit: 0,
          bet_id: Math.floor(Math.random() * 100000000000) + 720000000000,
          user_id
        }
      handleDiceBEt(bet_data);
      return res.status(200).json(bet_data);
    }
  }
  else {
    if (parseFloat(e.cashout) > parseFloat(data.chance)) {
      let wining_amount = parseFloat(data.wining_amount);
      let current_amount = parseFloat(prev_bal + wining_amount).toFixed(4);
      handleUpdatewallet({ has_won: true, current_amount, ...data, user_id, ...seed  });
      const bet_data = {
          ...e,
          ...data,
          ...seed,
          current_amount,
          has_won: true,
          profit: wining_amount,
          bet_id: Math.floor(Math.random() * 100000000000) + 720000000000,
          user_id
        }
      handleDiceBEt(bet_data);
      return res.status(200).json(bet_data);
    } else {
      let bet_amount = parseFloat(data.bet_amount);
      let current_amount = parseFloat(prev_bal - bet_amount).toFixed(4);
      handleUpdatewallet({ current_amount, has_won: false, ...data , user_id, ...seed });
      const bet_data = {
          ...e,
          ...data,
          ...seed,
          current_amount,
          has_won: false,
          profit: 0,
          bet_id: Math.floor(Math.random() * 100000000000) + 720000000000,
          user_id
        }
      handleDiceBEt(bet_data);
      return res.status(200).json(bet_data);
    }
  }
}

const HandlePlayDice = (async(req, res) => {
  const user_id = req.id
  let { data } = req.body

  const handleDicePoints = (e, bal, res, user_id, seed) => {
    function generateRandomNumber(serverSeed, clientSeed, nonce) {
      const combinedSeed = `${serverSeed}-${clientSeed}-${nonce}-${salt}`;
      const hmac = crypto.createHmac("sha256", combinedSeed);
      const hmacHex = hmac.digest("hex");
      const decimalValue = (parseInt(hmacHex, 32) % 10001) / 100;
      const randomValue = (decimalValue % maxRange).toFixed(2);
      let row = {
        cashout: randomValue,
        server_seed: serverSeed,
        client_seed: clientSeed,
        game_nonce: nonce,
      };
      return row;
    }

    let kjks = generateRandomNumber(
      seed.server_seed,
      seed.client_seed,
      seed.nonce
    );
    handleMybet(kjks, e, bal, res, user_id, seed);
  };
  const seeds = await getNonce(user_id)
  let wallet_bal = null
  if(data.token === "USD"){
      let response = await wallet?.dollar.findOne({user_id})
      wallet_bal = (response?.balance)
  }
  else if(data.token === "Fun Coupons"){
    let response = await wallet?.fun.findOne({user_id})
      wallet_bal = response?.balance
  }
  else{
     return  res.status(500).json("Select another coin")
  }
  if(data.bet_amount > wallet_bal){
    return res.status(500).json({error: "Insufficient funds"})
  }else{
    handleDicePoints(data, wallet_bal, res, user_id, seeds)
  }
})

const seedSettings = (async (req, res) => {
  const user_id = req.id
  const { client, server, hash } = req.body
  try {
  await DiceEncription.updateOne({ user_id }, {
      server_seed: server,
      client_seed: client,
      hash_seed: hash,
      nonce : 0,
      is_open: true,
      updated_at: new Date()
    })
   let responses = await DiceEncription.findOne({user_id})
    res.status(200).json(responses)
  }
  catch (err) {
    console.log(err)
    return res.status(403).json("Server Error")
  }
})

const getDiceGameHistory = (async (req, res) => {
  const user_id = req.id
  try {
    let diceGameHistory = await DiceGame.find({ user_id }).limit(15)
    res.status(200).json(diceGameHistory);
  } catch (err) {
    console.log(err)
    return res.status(403).json("Server Error")
  }
})


// ============================== Initialize dice game ===============================
const InitializeDiceGame = (async (user_id) => {
  try{
  const {serverSeed: server_seed, hash: hash_seed, clientSeed: client_seed } = handleHashGeneration();
  let data = {
    user_id: user_id,
    nonce: 0,
    server_seed,
    hash_seed,
    client_seed,
    is_open: false,
    updated_at: currentTime
  }
    await DiceEncription.create(data)
  }
  catch(error){
    console.log(err)
    return res.status(403).json("Server Error")
  }
})

const handleDiceGameEncryption = (async (req, res) => {
  try {
    const user_id  = req.id
    let history = await DiceGame.find({ user_id }).limit(15)
    let encrypt = await DiceEncription.findOne({ user_id })
    res.status(200).json({history, encrypt})
  }
  catch (err) {
    console.log(err)
    return res.status(403).json("Server Error")

  }
})

const gameDetalsByID = (async(req, res)=>{
  try{
    const data = req.params.id
    let result = await DiceGame.findOne({ bet_id:data })
    res.status(200).json(result)
  }
  catch(error){
    console.log(err)
    return res.status(403).json("Server Error")
  }
}) 

const generateNewServerSeed = (async(req, res)=>{
    try{
       let encrypt = handleHashGeneration()
        res.status(200).json(encrypt)
    }
    catch(error){
      console.log(err)
      return res.status(403).json("Server Error")
    }
})

const VerifyDice = (async(req, res)=>{
  try{
    const {server_seed,client_seed,nonce } = req.body
    let maxRange = 100
    function generateRandomNumber() {
      const combinedSeed = `${server_seed}-${client_seed}-${nonce}-${salt}`;
      const hmac = crypto.createHmac('sha256', combinedSeed);
      const hmacHex = hmac.digest('hex');
      const decimalValue = (parseInt(hmacHex , 32) % 10001 / 100)
      const randomValue = (decimalValue % maxRange).toFixed(2);
      let result = { point : randomValue, server_seed, client_seed, nonce }
      res.status(200).json({result})
    }
    generateRandomNumber()
  }
  catch(error){
    console.log(err)
    return res.status(403).json("Server Error")
  }
})

module.exports = { getDiceGameHistory, seedSettings, 
  handleDiceGameEncryption, InitializeDiceGame,VerifyDice, 
   HandlePlayDice, gameDetalsByID, generateNewServerSeed}