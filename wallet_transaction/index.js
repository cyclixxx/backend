const ClyclixDollar = require("../model/dollar-wallet")
const FunCoupon = require("../model/fun-wallet")
const ClyclixPoint = require("../model/cp-wallet")

let clyclixDollarImage = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1721026026/USD_Coin_-_Green_ai65gw.png"
let funCouponImage = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1721026027/Fun_Coupon_-_Blue_c60t1j.jpg"
let clyclixPointImage = "https://res.cloudinary.com/dxwhz3r81/image/upload/v1721026026/Cyclix_Points_-_Purple_njsnim.png"
 
// ================ store default wallet details ===================
const handleWalletInstance = (()=>{
    let wallet = [
        {
           is_active: false,
            balance: 0,
           coin_image: clyclixDollarImage, 
           coin_name: "USD", 
       },
       {
        is_active: false,   
        balance: 0,
        coin_image: clyclixPointImage, 
        coin_name: "Cyclix Points", 
       },
       {
        is_active: true,   
        balance: 10000,
        coin_image: funCouponImage, 
        coin_name: "Fun Coupons", 
       }
   ]
   return wallet
})

const fetchCPWallet = (async(user_id)=>{
    try{
       let response = await ClyclixPoint.findOne({user_id})
       return response
    }
    catch(error){
        console.log(error)
        return null
    }
})

const fetchCDWallet = (async(user_id)=>{
    try{
       let response = await ClyclixDollar.findOne({user_id})
       return response
    }
    catch(error){
        console.log(error)
        return null
    }
})

const fetchFunWallet = (async(user_id)=>{
    try{
       let response = await FunCoupon.findOne({user_id})
       return response
    }
    catch(error){
        console.log(error)
        return null
    }
})

const handleAllWallets = (async(user_id)=>{
    let wallet = [await fetchCDWallet(user_id), await fetchCPWallet(user_id), await fetchFunWallet(user_id)]
    return wallet
})

// ================ store CP wallet details ===================
const createCP = (async(user_id)=>{
    let balance =  0
    let coin_image = clyclixPointImage
    let coin_name = "Cyclix Points"
    let data = {user_id, balance, coin_image, coin_name, is_active: false}
    await ClyclixPoint.create(data)
})

 // ================ store CD wallet  details===================
 const createCD = (async(user_id)=>{
    let coin_image = clyclixDollarImage
    let coin_name = "USD"
    let data = {user_id, balance:0.0000, coin_image, coin_name, is_active: false}
    await ClyclixDollar.create(data)
})

// ================ store FC wallet  details===================
const createFC = (async(user_id)=>{
    let coin_image = funCouponImage
    let date = new Date()
    let data = {user_id, balance:10000, coin_image, coin_name: "Fun Coupons", date, is_active: true}
    await FunCoupon.create(data)
})

const handleChangeDefaultWalletEl = (async(user_id ,data, res)=>{
    if(data.coin_image === clyclixDollarImage){
        await ClyclixDollar.updateOne({user_id},{
            is_active: true
        })
        await FunCoupon.updateOne({user_id},{
            is_active: false
        })
    }
    if(data.coin_image === funCouponImage){
        await FunCoupon.updateOne({user_id},{
            is_active: true
        })
        await ClyclixDollar.updateOne({user_id},{
            is_active: false
        })
    }
    let wallet = await handleAllWallets(user_id)
    return res.status(200).json(wallet)
})

const fetchWallet = (async(req, res)=>{
    try{
        const user_id = req.id
        const wallet = req.params.wallet
        if(wallet === "fun"){
            const result = await FunCoupon.findOne({user_id})
            return res.status(200).json(result)
        }
        if(wallet === "usd"){
            const result = await ClyclixDollar.findOne({user_id})
            return res.status(200).json(result)
        }
    }
    catch(err){
        return res.status(401).json("Internal Sever Error")
    }
})

const wallet = {
    dollar: ClyclixDollar,
    fun: FunCoupon
}

module.exports = {createFC, createCD, createCP,wallet,fetchWallet,  handleWalletInstance, handleAllWallets, handleChangeDefaultWalletEl }