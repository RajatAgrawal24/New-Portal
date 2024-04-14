const CourseModel = require('../models/course')
const nodemailer = require('nodemailer');

class CourseController {
    static courseInsert = async (req,res)=>{
        try{
            // console.log(req.body)
            const {id} = req.userData
            const {name,email,phone,dob,address,gender,education,course} = req.body
            const result = new CourseModel({
                name:name,
                email:email,
                phone:phone,
                dob:dob,
                gender:gender,
                address:address,
                education:education,
                course:course,
                user_id:id
            })
            await result.save()
            this.sendEmail(name,email,course)
            res.redirect('/course_display')
        }catch(err){
            console.log(err)
        }
    }

    static courseDisplay = async (req,res)=>{
        try{
            const {name , image ,id,role} = req.userData
            const data = await CourseModel.find({user_id:id})
            // console.log(data)
            res.render('course/display',{n:name , i:image , d:data , r:role, msg:req.flash('success')})
        }catch(err){
            console.log(err)
        }
    }

    static courseView = async (req,res)=>{
        try{
            // console.log(req.params.id)
            const {name , image ,role} = req.userData
            const data = await CourseModel.findById(req.params.id)
            // console.log(data)
            res.render('course/view',{n:name , i:image ,r:role, d:data})
        }catch(err){
            console.log(err)
        }
    }

    static courseEdit = async (req,res)=>{
        try{
            // console.log(req.params.id)
            const {name , image ,role} = req.userData
            const data = await CourseModel.findById(req.params.id)
            // console.log(data)
            res.render('course/edit',{n:name , i:image , r:role , d:data})
        }catch(err){
            console.log(err)
        }
    }

    static courseUpdate = async (req,res)=>{
        try{
            // console.log(req.params.id)
            const {name,email,phone,dob,address,gender,education,course} = req.body
            await CourseModel.findByIdAndUpdate(req.params.id,{
                name:name,
                email:email,
                phone:phone,
                dob:dob,
                gender:gender,
                address:address,
                education:education,
                course:course
            })
            req.flash('success','Course Updated Successfully')
            res.redirect('/course_display')
        }catch(err){
            console.log(err)
        }
    }

    static courseDelete = async (req,res)=>{
        try{
            const {name , image ,role} = req.userData
            const data = await CourseModel.findByIdAndDelete(req.params.id)
            req.flash('success','Course Deleted Successfully')
            if(role==='admin'){
                res.redirect('/admin/dashboard')
            }else{
                res.redirect('/course_display')
            }
        }catch(err){
            console.log(err)
        }
    }

    static sendEmail = async (name,email,course) => {
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
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: ` Course ${course}`, // Subject line
            text: "hello", // plain text body
            html: `<b>${name}</b> Course  <b>${course}</b> Successfully Inserted! <br>`, // html body
        });
    }
}

module.exports =CourseController