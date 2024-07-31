const express = require('express')
const router = express.Router()
const requireAuth = require('../../middleware/requireAuth')
const game = require('../../controllers/crashControllers');

router.post('/scripts/list', game.handleScriptList)
router.get('/history', game.handleCrashHistory)
router.get('/details/:betID', game.handleBetDetails)
router.get('/players/:gameID', game.handleCrashGamePlayers)
router.post('/verify', game.verify)

// auth middleware
router.use(requireAuth);
router.post('/my-bet', game.handleMybets);
router.post('/scripts/add', game.handleScriptAddOrUpdate)
router.post('/scripts/update', game.handleScriptAddOrUpdate)
router.post('/scripts/delete', game.handleScriptDelete)

module.exports = router