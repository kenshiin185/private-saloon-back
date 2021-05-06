const express = require('express');
const { Model } = require('mongoose');
const router = express.Router();
const MsgPost = require('../models/msgpost');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const User = require('../../auth/models/user');

router.get('/ping',(req,res)=> {
    res.status(200).json({msg:'pong',date:new Date()});
});

router.get('/msg-posts',(req,res)=> {
    console.log('req.user', req.user);
   MsgPost.find()
   .sort({ 'createdOn': 1})
   .exec()
   .then(msgPosts => res.status(200).json(msgPosts))
   .catch(err => res.status(500).json({
       message:'messages introuvables',
       error:err
   }));
});
// router.post('/users', (req,res)=> {
//     const user = new User(req.body);
//     user.save((err, user) => {
//         if(err) {
//             return res.status(500).json(err);
//         }
//         res.status(201).json(user);
//     })
// })




router.post('/msg-posts',(req,res)=> {
    console.log('req.body',req.body);
    const msgPost = new MsgPost(req.body);
    msgPost.save((err,msgPost)=> {
        if(err) {
            return res.status(500).json(err);
        }
        res.status(200).json(msgPost);
    });
});

router.get('/msg-posts/:id',(req,res)=> {
    const id = req.params.id;
    MsgPost.findById(id)
    .then(msgPost => res.status(200).json(msgPost))
    .catch(err => res.status(500).json({
        message:`message avec l id ${id} introuvable `,
        error:err
    }));
});

router.delete('/msg-posts/:id', (req,res)=> {
    const id = req.params.id;
    MsgPost.findByIdAndDelete(id, (err,msgPost)=> {
        if(err) {
            return res.status(500).json(err);
        }
        return res.status(200).json({msg:`message avec l'id ${id} a été supprimé`});
    });
});

module.exports = router;