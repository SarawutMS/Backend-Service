var express = require('express');
var router = express.Router();
var arm_table = require('.././mongo_db/Arm/arm.json')
const multer = require('multer');


//Set Dir.

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './mongo_db/img')
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/').reverse()[0])
    }
})




/* GET users listing. */
router.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/arm/index.html');
});
//db setup.
router.get('/arm_db', (req, res) => {
    res.json(arm_table)
})
router.post('/arm_db', (req, res) => {
    arm_table.push(req.body)
    let json = req.body
    res.send(req.body)
})

const upload = multer({ storage: storage });




router.post('/test', (req, res) => {
    res.send("req")
})

router.post('/upload', upload.single('fileupload'), (req, res) => {
    res.send("Upload Done")
})




module.exports = router;

