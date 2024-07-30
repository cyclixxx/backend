const authRoute = require('./auth.route');
const gameRoute = require('./api/game.route');
const crash = require('./api/crashgame.route');
const profileRoute = require('./api/profile.route');
const ccpaymentRoute = require('./api/ccpayment.route');

const routeManager = (app) => {

    // API Routes
    app.use("/auth", authRoute);
    app.use('/api/games', gameRoute);
    app.use('/api/user/crash-game', crash);
    app.use("/api/profile", profileRoute);
    app.use("/api/ccpayment", ccpaymentRoute);

}

module.exports = routeManager