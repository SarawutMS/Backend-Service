var express = require('express');
var service = express.Router();
const multer = require('multer');
var fs = require('fs');
const mongoose = require('mongoose');
//var ObjectID = require('mongoose').ObjectID;
var url = "mongodb://localhost:27017/Database";
var uploads = multer()
var ObjectId = require('mongoose').Types.ObjectId;

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
            let check = false; /// Check Email in data 
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
http://localhost:3000/services/arm_service/register

var login = multer()
service.post('/login', login.none(), (req, res, next) => {
    const email = req.body.email;
    const pass = req.body.pass;

    mongoose.connect(url, (err, db) => {
        if (err) throw err;
        let check = false;
        let id = '';
        db.collection('users').find({}).toArray(function (err, result) {
            for (i in result) {
                if (result[i].email == email && result[i].password == pass) {
                    check = true;
                    id = result[i]._id;
                    console.log(result[i]._id)
                }
            }
            if (check) {
                res.send({ 'state': 'success', 'id': id })
            } else {
                res.send({ 'state': 'error' });
            }
            db.close();
        });
    });
});

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

fileFn = (id_name, count, fileuploads, prototype) => {
    try {




        var base64String = fileuploads;
        let base64Data = base64String.split(';base64,').pop();
        let type = base64String.split(';', 1);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let result_type = type[0].slice(11);

        const folderName = `./public/images`;
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
        const name_ = `${id_name}_${count}_${uniqueSuffix}${prototype}_shirt`;
        const path_ = `${folderName}/${name_}.${result_type}`;

        fs.writeFile(path_, base64Data, 'base64', function (err) {
            if (err) console.log(err);
            fs.readFile(path_, function (err, data) {
                if (err) throw err;
                console.log("Upload Done")
            });
        });

        return name_;
        // fs.writeFile(`${folderName}${component_folder}/${uniqueSuffix}_shirt.svg`, req.body.svg, (err) => {
        // throws an error, you could also catch it here
        //if (err) throw err;

        // success case, the file was saved

        //});
    }
    catch (e) {
        //  Block of code to handle errors
        console.log("error")
    }
};

var create = multer()
service.post('/create_shirt', create.none(), (req, res, next) => {
    res.send(req.body.for_edit)

    mongoose.connect(url, (err, db) => {
        if (err) throw err;
        let id = "";

        db.collection("users").find({ email: req.body.email }).toArray((err, result) => {
            if (err) throw err;

            for (i in result) {
                id = result[i]._id;
            }

            db.collection("shirt").find({ users_id: id }).toArray((err, result_shirt) => {
                if (err) throw err;
                let count = result_shirt.length;
                let _type = req.body.type_shirt;

                const front_path = fileFn(id, count, req.body.front, 'front')
                const back_path = fileFn(id, count, req.body.back, 'back')
                const edit_front = req.body.for_edit;
                var myobj = {

                    nameshirt_: req.body.nameshirt_,
                    shirt_path: { "front": front_path, "back": back_path, "edit_front": edit_front },
                    property: { "_type": _type, "count": count },
                    detail: req.body.detail,
                    users_id: id,
                    permission: req.body.permission,
                };
                db.collection('shirt').insertOne(myobj, function (err, result) {
                    if (err) throw err;


                    db.close();
                });

            });
        })


    });
});


service.get('/shirts/:pages', (req, res, next) => {
    mongoose.connect(url, (err, db) => {


        if (req.params.pages == 'gallery') {
            db.collection("shirt").find({ permission: 'true' }).toArray((err, result) => {
                if (err) throw err;

                res.send(result);

            });
        }
        else if (req.params.pages == 'home') {
            db.collection("shirt").find({ permission: 'true' }).limit(6).toArray((err, result) => {
                if (err) throw err;

                res.send(result);

            });
        }


        else if (req.params.pages == 'gallery_home') {

            db.collection("users").find().toArray((err, result_) => {
                if (err) throw err;




                res.send(result_);

            });


        }

    });

});

service.get('/own_shirts/:_id/:permission', (req, res, next) => {
    try {
        mongoose.connect(url, (err, db) => {
            var user_id = new ObjectId(req.params._id);
            let data = [];

            let filter = { users_id: user_id }


            if (req.params.permission == 'true') {

                filter = { users_id: user_id, permission: 'true' }
            }
            db.collection("shirt").find(filter).toArray((err, result) => {

                if (err) throw err;
                res.send(result);
            });
        });
    }
    catch (err) {
        res.send(err);
    }




});




service.get('/searchshirt/:_id', (req, res, next) => {
    try {
       
        mongoose.connect(url, (err, db) => {
            var shirt_id = new ObjectId(req.params._id);
            let data = [];
            db.collection("shirt").find({ users_id: shirt_id, permission: 'true' }).toArray((err, result) => {

                if (err) throw err;
                res.send(result);
            });
        });
    }
    catch (err) {
        res.send(err);
    }




});



service.post('/user', (req, res, next) => {
    mongoose.connect(url, (err, db) => {
        var _id = new ObjectId(req.body.user_id);
        db.collection("users").find({ _id: _id }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
});

service.get('/store/:_id', (req, res, next) => {
    var user_id = new ObjectId(req.params._id);
    mongoose.connect(url, (err, db) => {
        db.collection("users").find({ _id: user_id }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });

});






service.get('/users', (req, res, next) => {

    mongoose.connect(url, (err, db) => {
        db.collection("users").find({}).toArray((err, result) => {
            if (err) throw err;

            res.send(result);

        });


    });

});






module.exports = service;
