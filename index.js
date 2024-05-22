const express = require("express")
const cors = require("cors")
//install node mailer using npm
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()


app.use(cors())
app.use(express.json())

// mongodb://127.0.0.1:27017/passkey

mongoose.connect("mongodb+srv://HARISURYA:Hack@Hari143@atlascluster.ryqjuke.mongodb.net/passkey?retryWrites=true&w=majority&appName=AtlasCluster").then(function(){
    console.log("connectd to DB")
}).catch(function(){
    console.log("Failed to connect")
})

const credential = mongoose.model("credential",{},"bulkmail")


app.post("/sendemail",function(req,res){

    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function(data){
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth: {
              user: data[0].toJSON().user,
              pass: data[0].toJSON().pass,
            },

          });

          new Promise(async function(resolve,reject){
            try{
                for(var i=0;i<emailList.length;i++){
                    await transporter.sendMail(
                        {
                            from:"harisuryaravikumar@gmail.com",
                            to:emailList[i],
                            subject:"A message from bilk mail app",
                            text:msg
                        }
                    )
                    console.log("email send to:"+emailList[i])
                }
                resolve("success")
            }catch(error){
                reject("failed")
            }
    
        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })


    }).catch(function(error){
        console.log(error)
    })

  

})


app.listen(5000,function(){
    console.log("server started....")
})

