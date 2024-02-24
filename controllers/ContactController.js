const ContactModel = require('../models/contact')
const CourseModel = require('../models/course')
const nodemailer = require('nodemailer');

class ContactController {
    static contactUs = async (req,res)=>{
        try{
            // console.log(req.body)
            const {id} = req.userData
            const {name,email,phone,course,description} = req.body
            const result = new ContactModel({
                name:name,
                email:email,
                phone:phone,
                course:course,
                description:description,
                user_id:id
            })
            await result.save();
            this.sendEmail(name,email,phone,course,description)
            res.redirect('/home')
        }catch(err){
            console.log(err)
        }
    }

    static sendEmail = async (name,email,phone,course,description) => {
        // console.log(name,email,phone,course,description);
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
            to: 'rag7731@gmail.com', // list of receivers
            subject: ` Problem in ${course} form`, // Subject line
            text: "Details :", // plain text body
            // html body
            html: `Name : <b>${name}</b> 
            <br> Course : <b>${course}</b> 
            <br> Phone No. : <b>${phone}</b> 
            <br> Email : <b>${email}</b>
            <br> Description : <b>${description}</b>` 
        });
    }
}

module.exports =ContactController