const express = require("express")
const app = express()
const mongoose = require('mongoose');
const ejs = require('ejs')
mongoose.connect('mongodb://172.21.2.236:27017/190110910706');
const schema={
    name: String,
    age: Number,
    health: String,
    hooby:String
}
const mydata = mongoose.model('cat1s', schema);
// const kitty = new mydata({ name: 'testZildjian2' });
// kitty.save()

app.use('/',express.static('public'))
app.use('/',express.static('views'))
app.get("/input",(req,res,next)=>{
    // res.send(req.query)
    // console.log(req.query)
    // const kitty = new mydata({ name: req.query.first,health: req.query.second });
    // kitty.save()
    // ejs.renderFile(filename, data, options, function(err, str){
    //     // str => 输出渲染后的 HTML 字符串
    // });
    ejs.renderFile("result.html",{returnVal:"seccess"},(err,str)=>{
        res.send(str)
    })
    next();
})

app.get("/reg",(req,res,next)=>{
    // res.send(req.query)
    console.log(req.query)
    res.sendFile(--__dirname+"/views/reg.html",(err)=>{
        if(err)
            console.log(err)
    })
    next();
})
app.listen(10706)
