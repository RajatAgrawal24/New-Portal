const express = require('express');
const FrontController = require('../controllers/FrontController');
const CourseController = require('../controllers/CourseController');
const ContactController = require('../controllers/ContactController');
const passport = require('passport');
const route = express.Router();
const jwt = require('jsonwebtoken');

// For Authentication
const checkUserAuth = require('../middleware/auth');
const AdminController = require('../controllers/AdminController');
const isLogin = require('../middleware/isLogin');
const adminRole = require('../middleware/adminRole');

route.get('/',isLogin,FrontController.login)
route.get('/register',FrontController.register)
route.get('/home' ,checkUserAuth,FrontController.home)
route.get('/about',checkUserAuth ,FrontController.about)
route.get('/contact',checkUserAuth ,FrontController.contact)

// Route for initiating the Google OAuth authentication
route.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route for handling the Google OAuth callback
route.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // console.log(req.user)
    const token = jwt.sign({ ID: req.user.id }, 'guptchabi@123456');
    res.cookie('token', token);
    // Successful authentication, redirect to the home page or wherever you want
    res.redirect('/home');
  });

route.post('/forgotPassword' , FrontController.forgetPasswordVerify)
route.get('/reset-password',FrontController.resetPassword)
route.post('/reset_Password1',FrontController.reset_Password1)

route.get('/verify',FrontController.verify)

route.post('/contactUs/:id',checkUserAuth ,ContactController.contactUs)


route.post('/userinsert', FrontController.userinsert)

route.get('/profile',checkUserAuth ,FrontController.profile)
route.post('/updateProfile',checkUserAuth ,FrontController.updateProfile)
route.post('/changePassword',checkUserAuth ,FrontController.changePassword)


route.post('/verifyLogin', FrontController.verifyLogin)
route.get('/logOut',FrontController.logOut)

//admin routes
route.get('/admin/dashboard',checkUserAuth , adminRole('admin') ,AdminController.dashboard)

route.post("/update_status/:id",checkUserAuth , AdminController.updateStatus)

//Course Route
route.post("/course_insert",checkUserAuth , CourseController.courseInsert)
route.get("/course_display",checkUserAuth , CourseController.courseDisplay)
route.get("/course_view/:id",checkUserAuth , CourseController.courseView)
route.get("/course_edit/:id",checkUserAuth , CourseController.courseEdit)
route.post("/courseUpdate/:id",checkUserAuth , CourseController.courseUpdate)
route.get("/course_delete/:id",checkUserAuth , CourseController.courseDelete)

//post is used in: update insert form-fill submit verifylogin

module.exports = route;