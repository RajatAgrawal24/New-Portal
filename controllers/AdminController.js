const CourseModel = require('../models/course');
const nodemailer = require('nodemailer');

class AdminController {
    static dashboard = async (req, res) => {
        try {
            const {name , image , role} = req.userData
            const data = await CourseModel.find()
            res.render("admin/dashboard" , {n:name,i:image ,d:data , r:role})
        }catch(err) {
            console.error(err);
        }
    }

    static updateStatus = async (req, res) => {
        try {
            // console.log(req.body);
            const {name, email , comment , status} = req.body
            await CourseModel.findByIdAndUpdate(req.params.id,{
                comment: comment,
                status: status
            })

            this.sendEmail(name, email, status,comment)
            res.redirect('/admin/dashboard')
        }catch(err) {
            console.error(err);
        }
    }

    static sendEmail = async (name,email,status,comment) => {
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
            subject: ` Course ${status}`, // Subject line
            text: "hello", // plain text body
            html: `<b>${name}</b> Course  <b>${status}</b> successful! <br>
             <b>Comment from Admin</b> ${comment} `, // html body
        });
    }
}
module.exports = AdminController;