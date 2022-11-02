var express = require('express');
var router = express.Router();
var arm_table = require('.././mongo_db/Arm/arm.json')
const multer = require('multer');
var fs = require('fs');
//var mongo = require('mongodb');
//Set Dir.
const mongoose = require('mongoose');
var url = "mongodb://localhost:27017/arm_db";
mongoose.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();

});
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



const img = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './mongo_db/img')
    },
    filename: function (req, file, cb) {
        var base64String = req.body.fileuploads;
        console.log(base64String)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/').reverse()[0])
    }
})

var uploads = multer().single('fileupload');



router.post('/upload', uploads, (req, res) => {
    try {
        var base64String = req.body.fileuploads;
        let base64Data = base64String.split(';base64,').pop();
        let type = base64String.split(';', 1);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //let ts = type.split('/');
        let result_type = type[0].slice(11);

        let folderName = `./mongo_db/img/test`;
        try {
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName);
            }



        } catch (err) {
            console.error(err);
        }
        fs.writeFile(`${folderName}/${uniqueSuffix}_shirt.${result_type}`, base64Data, 'base64', function (err) {
            if (err) console.log(err);
            fs.readFile(`${folderName}/${uniqueSuffix}_shirt.${result_type}`, function (err, data) {
                if (err) throw err;
                console.log(data);
                res.send("Upload Done");
            });
        });
    }
    catch (e) {
        //  Block of code to handle errors

        res.send(e)
    }

})



router.post('/upload_text', upload.single('fileupload'), (req, res) => {
    try {
        //  Block of code to try
        console.log(req.body)
        res.send("upload done")
    }
    catch (e) {
        //  Block of code to handle errors

        res.send("sds")
    }

})
module.exports = router;

