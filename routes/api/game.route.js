const express = require('express')
const router = express.Router()

const controller = require('../../controllers/diceControllers')
const requireAuth = require('../../middleware/requireAuth')

router.get('/dice-game/historyByID/:id', controller.gameDetalsByID)
router.get('/dice-game/generate-seed', controller.generateNewServerSeed)
router.post('/dice-game/Verify-dice', controller.VerifyDice)

// auth middleware
router.use(requireAuth);

router.get('/dice-game/encrypt', controller.handleDiceGameEncryption)
router.get('/dice-game/dice-history', controller.getDiceGameHistory)
router.post('/dice-game/bet', controller.HandlePlayDice)
router.post('/dice-game/seed-settings', controller.seedSettings)

module.exports = router