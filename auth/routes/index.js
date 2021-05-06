const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');


router.post('/register', (req,res)=> {
    console.log('utilisateur depuis req.body', req.body);
    console.log('inImage: ',lastUploadedImage);
    // const newUser = new User(req.body);
    const newUser = new User({...req.body, image:lastUploadedImage});
    newUser.save((err,user)=> {
        if(err) {
            console.log('erreur!!!!!1');
            return res.status(500).json(err);
        }
        req.login(req.body, (err)=> {
            if(err) {
                console.log('err in registre | req.logIn()', err);
            }
            res.status(200).json(user);
        });
    });
});


router.get('/users', (req,res)=> {
    User.find()
    .sort({' createdOn':-1 })
    .exec()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({
        msg:'users introuvables',
        error:err
    }));
});

router.get('/users/:id', (req,res) => {
    const id = req.params.id;
    User.findById(id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({
        msg:'utilisateur introuvable',
        error:err
    }));
});
let lastUploadedImage = '';
//upload config
const storage = multer.diskStorage({
    destination:'./uploads/',
    filename: function (req,file, callback) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if(err) return callback(err);
             //callback(null, raw.toString('hex') + path.extname(file.originalname));
             lastUploadedImage = raw.toString('hex') + path.extname(file.originalname);
             console.log('lastUploadedImage: ', lastUploadedImage);
             callback(null, lastUploadedImage);
        });
    }
});
const upload = multer({storage: storage});

//upload
router.post('/register/images', upload.single('image'), (req,res) => {
    if(!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        console.log('refus de l upload');
        return res.status(400).json({msg:'seul les fichiers images sont autorisés'});
    }
    res.status(200).send({ filename: req.file.filename, file: req.file});
});





router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/failure'
}));


router.get('/success', (req,res)=> {
    res.status(200).json({msg:'loggé', user: req.user});
});

router.get('/failure', (req,res)=> {
    res.status(401).json({msg:'pas loggé'});
});

router.get('/logout', (req,res)=> {
    req.logout();
    res.status(200).json({msg:'Vous vous êtes déconnecté'});
});

module.exports = router;