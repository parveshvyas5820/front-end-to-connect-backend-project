// let fs=require("fs");


let express = require("express")
let app = express();
let nodemailer=require("nodemailer")
let file_upload=require("express-fileupload")
let QR=require("qrcode")
let mongoose=require("mongoose");
let hbs = require("hbs")
let bcrypt= require("bcrypt")
let jwt=require("jsonwebtoken")
require("dotenv").config();
app.use(express.urlencoded({ extended: true }))
app.set("views-engine","hbs")

app.use(express.text());
app.use(express.json());
app.use(file_upload({
  useTempFiles:true,
  tempFileDir:'/tmp/'

}))

let userModel=require("./module/schema")

mongoose.connect("mongodb://127.0.0.1:27017/newDB");
mongoose.connection.once("open",()=>console.log("db is connected"))
mongoose.connection.on("err",(err)=>console.log(err));
// const { default: mongoose } = require("mongoose");


app.get("/register", (req, res) => {

    res.render("register.hbs")
});
 
app.get("/login", (req, res) => {

  res.render("login.hbs")
});


app.get("/page", (req, res) => {

  res.render("page.hbs")
});

app.get("/data", (req, res) => {

  res.render("data.hbs")

});
app.get("/data1",async(req,res)=>{
  let tabledata=await userModel.find({})
  if(tabledata){
    res.render("data.hbs",{data:tabledata})
  }
  
})
app.get("/deleteData/:id",async(req,res)=>{
  id=req.params.id;
  let result=await userModel.deleteOne({_id:id});
  
   result?res.redirect("/data1"):""
  
})

let id;
app.get("/update/:id",async(req,res)=>{
  id=req.params.id;
  let result=await userModel.findOne({_id:id});
  if(result){
    res.render("updateData.hbs",{data:result})
  }
})
app.post("/update",async(req,res)=>{
  let result=await userModel.updateOne({_id:id},{
    $set:{
      name:req.body.name,
      age:req.body.age,
      contact:req.body.contact,

    }
  })
  result?res.redirect("/data1"):""
})



app.post("/register",async(req,res)=>{
  try{
    let salt=bcrypt.genSaltSync(10);
    let hashPass=bcrypt.hashSync(req.body.password,salt)

let a= await userModel.create({
  name:req.body.name,
  age:req.body.age,
  contact:req.body.contact,
  email:req.body.email,
  password:hashPass
  });
if(a){

res.render("register.hbs",{message:"data is register"})

}

}


catch(error){
  console.log(error)
  res.render("register.hbs",{message:error})
}
});





app.post("/login",async(req,res)=>{
  try{
  let a=await userModel.findOne({name:req.body.name,})
 let compare=bcrypt.compareSync(req.body.password,a.password)
  if(!compare){
  
  res.render("login.hbs",{message:"login is not succesfully"})
  
  }else{
    let token=jwt.sign({name:a.name,age:a.age,email:a.email,contact:a.contact},process.env.SIGN,);
   console.log(token)
    res.render("login.hbs",{message:"login is succesfully"})
  
  }
}catch(err){
  res.render("login.hbs",{message:""+err})
}
  
  });
 app.get("/verify",(req,res)=>{
  try{
    let verify=jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2Frc2hhbSIsImFnZSI6MjIsImVtYWlsIjoic2Frc2hhbUBnbWFpbC5jb20iLCJjb250YWN0IjoiODc5ODc2NDQ2NSIsImlhdCI6MTY4NzMyMzAxNH0.ic2se-Bwr5BLeXf1hLGJB7f2yS7WZPrnuU7OEitOQMI",process.env.SIGN)
  if(verify){
    res.send("token is valid")
  }
  }catch(error){
    res.send(""+error)
  }
 })

  








//  NODEMIALER


app.get("/mail", (req, res) => {


  res.render("mail.hbs")
});

app.post("/mail",async(req,res)=>{
let d=JSON.stringify(req.body)
QR.toDataURL(d,{type:"image/png"},(err,data)=>{
  if(err){
    res.send(""+err)
  }
  res.render("mail.hbs",{URL:data})
})


  console.log(req.body)
  // let otp=Math.floor(Math.random()*1000)
  let transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:"parveshvyas2872@gmail.com",
      pass:"zwybosqvzwrwfztj"
    }
  });
  let mailoption={
  from:"parveshvyas2872@gmail.com",
  to:req.body.to,
  subject:req.body.subject,
  // text:`otp ${otp}`,
  text:req.body.message,
  attachments:{
    filename:req.files.image.name,
    path:req.files.image.tempFilePath
  }
  }
  transporter.sendMail(mailoption,(err,data)=>{
    if(err)console.log(err);
    res.render(mail.hbs,{message:"mail sent"})
  })
 
})




// zwybosqvzwrwfztj
  
app.listen(4600, ()=> console.log("server is created"))




// fs.mkdirSync("parvresh01");


// fs.mkdirSync("rahul");creat folder
// fs.renameSync("anshul","parvesh") rename file
// fs.writeFileSync("./parvesh/parvesh1.html","parvesh vyas") to creat a file
// fs.appendFileSync("./parvesh/parvesh1.html","\npalampur")  to add data
// fs.rmdirSync("rahul")   to delet empty folder
// fs.unlinkSync("parvesh/parvesh1.html")



// let http=require("http")
// http.createServer((req,res)=>{
//     res.write("parvesh")
//     res.end();
// }).listen(4000,console.log("hello"))

// console.log("palampur")

// ****get****
// let express=require("express")
// let app=express()

// app.get("/par",(req,res)=>{
//     res.send("hello")
// })

// app.get("/ans",(req,res)=>{
// let a=req.query;
// res.send(a)
// })

// app.get("/abc/:name/:age/:contact",(req,res)=>{
//     let a= req.params;
//     res.send(a);
// })

// // *****post***

// app.use(express.text())
// app.use(express.urlencoded({extended:true}))
// app.use(express.json())


// / app.post("/abc",(req,res)=>{
//         res.send(req.body);
//     })








// app.post("/abc",async(req,res)=>{
//     let a= await userModel.create(req.body);
//     res.send(a)
// })


