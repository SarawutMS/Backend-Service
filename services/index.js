var express = require('express');
var router = express.Router();

var list_api = ['/arm_service'];
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.setHeader("Content-Type", "text/html")

    var service = "";
    for (let i = 0; i < list_api.length; i++) {
        service += ` <h3>[${i}]${list_api[i]}</h3>`;
    }
    res.send(`<H1> Service for <text style="color:Green;">connect </text> to database  </H1>
    <br>
   
    ${service}`);
});
//db setup.


router.use(list_api[0], require('./arm/service_mongo'))


module.exports = router;

