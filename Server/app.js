const express=require("express");
require("dotenv").config();
const app=express();
const cors=require('cors');
const mysql=require('mysql2');
const db=require("./utils/db-connection");
const fs=require("fs");
const morgan=require("morgan");
const path = require("path");

const usersRouter=require("./Router/userRouter");
const adminRouter=require("./Router/adminRouter");
const serviceRouter=require("./Router/serviceRouter");



require("./models/user");
require("./models/service");

//const accesslogStream=fs.createWriteStream(path.join(__dirname,'access.log',),{flags:'a'});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Client")));
//app.use(express.static('public'));

//app.use(morgan('combined',{stream:accesslogStream}));


app.use("/user",usersRouter)
app.use("/admin",adminRouter);
app.use("/salon",serviceRouter);


app.get("/", (req, res) => {
    res.redirect("/user/main.html");
  });



db.sync({force:false}).then(()=>{
    console.log('Database synced successfully.');
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err)=>{
    console.error('Error syncing database:',err);
});
