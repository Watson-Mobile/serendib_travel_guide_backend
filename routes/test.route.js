const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

var path = require('path');

var desPath = path.join(__dirname, '..', 'uploads', 'images','fk');

var storage = multer.diskStorage(
    {
        destination:function ( req, file, cb ) {
            let desPath1 = path.join(__dirname, '..', 'uploads', 'images',req.body.name);
            if (!fs.existsSync(desPath1)){
                fs.mkdirSync(desPath1);
            }
            cb( null, desPath1 );
        },
        filename: function ( req, file, cb ) {
            cb( null, req.body.name +"_"+file.originalname );
        }
    }
);
const upload = multer({storage:storage}).array('photo',5);

router.post('/upload',(req, res) => {
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
        console.log(req.files[0]);
    });
   // console.log(req.body);
    
});

module.exports = router;
