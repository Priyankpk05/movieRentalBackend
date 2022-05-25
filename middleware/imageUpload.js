
// const multer =  require('multer');
// const uploadImage = multer({ dest: './Images' })

// exports.uploadImage = uploadImage.single('image')


const express = require('express')
const path = require('path')
const file = express();

const multer =  require('multer');


const imageStore = multer.diskStorage({                         //where to store image

    destination : './Images',
    __filename : (req,file, cb) =>{

        cb(null, file.__filename +'_' + Date.now() + path.extname(file.orignalname))
    }
});

const imageUpload = multer({

    storage : imageStore,
    limits : {
        fileSize : 3000000
    },
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return callback(new Error('Please Upload a Image with extention "png" or "jpg" !!'))
        }
        callback(undefined, true);
    }
});
module.exports.uploadImage = imageUpload.single('image');