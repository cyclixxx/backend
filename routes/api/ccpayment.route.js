const express = require('express')
const router = express.Router()

const ccpaymentController = require('../../controllers/ccpayment.controllers')
const requireAuth = require('../../middleware/requireAuth')

// auth middleware
router.use(requireAuth);

router.post('/get-permanent-deposit-address', ccpaymentController.getPermanentDepositAddress)
router.post('/get-deposit-record', ccpaymentController.getDepositRecord)
module.exports = router