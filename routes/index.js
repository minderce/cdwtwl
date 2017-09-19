
var homeCtrl = require('./home');

module.exports = function (app) {

    app.use('/', homeCtrl);
};