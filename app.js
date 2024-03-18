const express = require('express');
const app = express();
const port = 4000;

//connect flash and sessions
const session = require('express-session')
const flash = require('connect-flash');
//messages
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }))
//Flash messages
app.use(flash());

const web = require('./routes/web');

const UserModel = require('./models/user')
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const sendEmail = async (name,email) => {
  // console.log(name,email,status,comment)
  // connenct with the smtp server

  let transporter = await nodemailer.createTransport({
      //For Gmail
      host: "smtp.gmail.com",
      port: 587,

      auth: {
          user: "rag7731@gmail.com",
          pass: "mkbztxzzuczdrkpq",//Two-step Verification Password
      },
  });
  await transporter.sendMail({
  from: "test@gmail.com", // sender address
  to: email, // list of receivers
  subject: `Registered Successfully`, // Subject line
  text: "Hey Yo!!", // plain text body
  html: `<b>${name}</b> <br>You have Successfully Registered.<br>
        Your Registered Email :<b>${email}</b> <br>
        Your Default Password :<b>${email}</b> <br>
        Please Change your Password for Security Purposes as soon as possible. `, // html body
  });
}

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Configure Passport.js Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: '46650854774-po0f95t7mhtgkkpmvpnd3fhgaudlicv0.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "https://admissionportal-9uix.onrender.com/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // console.log(profile)
    // console.log(accessToken);
    // console.log(refreshToken);
    // console.log(done);

    // Check if user exists in MongoDB
    const user = await UserModel.findOne({ email: profile.emails[0].value });
    if (user) {
      // console.log(user)
      return done(null, user);
    }else {
      const p = profile.emails[0].value
      const hashPassword = await bcrypt.hash(p, 10);
      // Create a new user if not exists
      const result = new UserModel({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: hashPassword,
        image: {
            public_id:'userProfile/ogjhqekpvgaoknrunb4y',
            url:'https://res.cloudinary.com/dmtgrirpq/image/upload/v1709919759/userProfile/ogjhqekpvgaoknrunb4y.webp'
        },
        isVerified: 1
      });
      // console.log(result)
      await result.save();
      sendEmail(profile.displayName ,profile.emails[0].value)
      return done(null, result);
    }
  } catch (err) {
    return done(err);
  }
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await UserModel.findById(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});


// cookies
const cookieparser = require('cookie-parser')
app.use(cookieparser())

// To upload image
const fileUpload = require('express-fileupload')
//Tempfiles uploaderz
app.use(fileUpload({useTempFiles:true}))

//To get data as Object
app.use(express.urlencoded({extended:false}))

const connectDb = require('./db/dbcon.js');
connectDb();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use('/',web);

app.listen(port,()=>{
    console.log('listening on port');
});