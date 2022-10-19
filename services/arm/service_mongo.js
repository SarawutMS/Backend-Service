var express = require('express');
var service = express.Router();
const multer = require('multer');
var fs = require('fs');
const mongoose = require('mongoose');
//var ObjectID = require('mongoose').ObjectID;
var url = "mongodb://localhost:27017/arm_db";
var uploads = multer()

service.post('/upload', uploads.single('fileupload'), (req, res) => {
    try {
        var base64String = req.body.fileuploads;
        let base64Data = base64String.split(';base64,').pop();
        let type = base64String.split(';', 1);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //let ts = type.split('/');
        let result_type = type[0].slice(11);

        console.log(req.body.name);
        console.log(req.body.count);
        const folderName = `./services/arm/mongo_db/${req.body.name}/${req.body.count}`;
        const component_folder = `/component`;
        try {
            if (!fs.existsSync(folderName)) {
                const path_ = folderName + component_folder;
                console.log(path_);
                fs.mkdirSync(folderName + component_folder, { recursive: true });
            }
        } catch (err) {
            console.error(err);
        }
        fs.writeFile(`${folderName}/${uniqueSuffix}_shirt.${result_type}`, base64Data, 'base64', function (err) {
            if (err) console.log(err);
            fs.readFile(`${folderName}/${uniqueSuffix}_shirt.${result_type}`, function (err, data) {
                if (err) throw err;
                res.send("Upload Done");
            });
        });


        fs.writeFile(`${folderName}${component_folder}/${uniqueSuffix}_shirt.svg`, req.body.svg, (err) => {
            // throws an error, you could also catch it here
            if (err) throw err;

            // success case, the file was saved

        });
    }
    catch (e) {
        //  Block of code to handle errors

        res.send(e)
    }

})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './mongo_db/img')
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/').reverse()[0])
    }
})


survey_data = async (collection, data) => {
    let check = "";
    let test = mongoose.connect(url, (err, db) => {
        if (err) throw err;
        db.collection(collection).find({}).toArray(function (err, result) {
            if (err) throw err;
            let email = "parnsa-ard@hotmail.com";
            for (i in result) {
                if (result[i].email == data) {
                    check = "err";
                }
            }
            db.close();

            return true;
        });

    });
    console.log(test);
    return check;
}


/* GET home page. */
service.get('/', function (req, res, next) {

    let log = "";

    survey_data('users', "parnsa-ard@hotmail.com").then((e) => {
        res.send(e);
    },
        (err) => {
            res.send(err);
        }
    )

});

var register = multer()
service.post('/register', register.none(), (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const last_name = req.body.last_name;
    const pass = req.body.pass;
    mongoose.connect(url, function (err, db) {
        if (err) throw err;
        var myobj = {
            email: email,
            name: name,
            last_name: last_name,
            password: pass,
        };
        db.collection("users").find({}).toArray(function (err, result) {
            if (err) throw err;
            let check = false;
            for (i in result) {
                if (result[i].email == email) {
                    check = true;
                }
            }
            if (check == false) {
                db.collection("users").insertOne(myobj, function (err, re) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    db.close();
                    res.send("success")
                })
            } else {
                res.send("error")
            }

        })

    });
});


var login = multer()
service.post('/login', login.none(), (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.pass;
    mongoose.connect(url, (err, db) => {
        if (err) throw err;
        let check = false;
        db.collection('users').find({}).toArray(function (err, result) {
            for (i in result) {
                if (result[i].email == email && result[i].password == pass) {
                    check = true;
                }
            }
            if (check) {
                res.send('success')
            } else {
                res.send('error');
            }
            db.close();
        });
    });
});


module.exports = service;