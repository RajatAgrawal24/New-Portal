const mongoose  = require('mongoose')
const liveUrl = 'mongodb+srv://rag7731:Rajat123@cluster0.5tva6b3.mongodb.net/AdmissionPortal?retryWrites=true&w=majority&appName=Cluster0'
const localUrl = 'mongodb://127.0.0.1:27017/admission'

const connectDb = () => {
    return mongoose.connect(liveUrl)
    .then(()=>{
        console.log("Connected to MongoDB")
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDb;