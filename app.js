const express = require('express');
const app = express();
const api = require('./api/v1/index');
const auth = require('./auth/routes');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');
const connection = mongoose.connection;
app.set('port',(process.env.port || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors({credentials:true, origin: 'http://localhost:4200'}));

//passport
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Strategy = require('passport-local').Strategy;
const User = require('./auth/models/user');

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave:true,
    saveUninitialized:true,
    name:'private-saloon-cookie'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb)=> {
    cb(null, user);
});

passport.deserializeUser((user, cb)=> {
    cb(null, user);
});

passport.use(new Strategy({
    usernameField:'user',
    passwordField:'password'
}, (name, pwd, cb)=> {
    User.findOne( {user: name}, (err,user)=> {
        if(err) {
            console.error(`${name} introuvable dans la BDD :(`);
        }
        if(user.password !== pwd) {
            console.log(`mot de passe incorrect pour ${name}`);
            cb(null,false);
        }else{
            console.log(`${name} authentifié`);
            cb(null, user);
        }
    });
}));

const uploadsDir = require('path').join(__dirname, '/uploads');
console.log('fichier images :', uploadsDir);
app.use(express.static(uploadsDir));
app.use('/api/v1', api);
app.use('/auth', auth);
app.use((req,res)=> {
    const err = new Error('404-not found !!!!');
    err.status= 404;
    res.json({msg:'404 - not found', err:err});
})

mongoose.connect('mongodb://localhost:27017/privateSaloon', { useNewUrlParser: true});
connection.on('error', ()=> {
    console.error(`erreur de connexion à mongo ${err.message}`);
});

connection.once('open', ()=> {
    console.log('Connexion réussie');
    app.listen(app.get('port'),()=> {
        console.log(`serveur en écoute sur ${app.get('port')}!!!`);
    });
});

