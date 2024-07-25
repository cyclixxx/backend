const httpStatus = require("http-status");
const ccpaymentService = require("../services/ccpayment.services")
const catchAsync = require("../utils/catchAsync");

const getPermanentDepositAddress = catchAsync (async (req, res) => {
    const { body: reqBody, reqId } = req;
    const reqData = {
        "referenceId": reqId + String(Math.floor(Date.now() / 1000)),
        "chain": reqBody.chain,
    }
    try {
        const pda = await ccpaymentService.getOrCreateAppDepositAddress(reqData)
        res.send(pda)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            "message": "Internal Sever Error",
        })
    }
});

const getDepositRecord = catchAsync(async (req, res) => {
    const { body: reqBody } = req;
    try {
        const record = await ccpaymentService.getDepositRecord(reqBody)
        res.send(record)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            "message": "Internal Sever Error",
        })
    }
});

module.exports = { getPermanentDepositAddress, getDepositRecord }