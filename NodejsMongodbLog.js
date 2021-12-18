const express = require("express")
const app = express()
const mongoose = require('mongoose');
const ejs = require('ejs')
mongoose.connect('mongodb://172.21.2.236:27017/190110910706');

const schema={
        username: {type: String, require: true},
        password: {type: String, require: true},
        age:Number,
        sex: String,
        tel: Number,
        dor: String,
        role: {type: String, require: true},
    }
const userdata = mongoose.model('user', schema);
// const user1 = new userdata({ username: 'admin' , password:'001' , sex:'female' , tel:'123456',role:'manager'});
// user1.save();

mongoose.connection.on('connected', () => {
    console.log('mongodb connect success')
})

app.use('/',express.static('public'))
app.use('/',express.static('views'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var loguser="";
var logpassword="";
var logrole="";
app.post('/login', function (req, res, next){
    // console.log(req.body)
    loguser=req.body.username;
    logpassword=req.body.password;
    logrole=req.body.role
    
    // 查询数据库
    userdata.find({"username":loguser},(err, doc) => {
        if (!err) {
            console.log(doc)
        } else {
            console.log(err)
        }
        finddata=doc[0]['_doc']
        // console.log(loguser==finddata['username'])
        //用户信息验证
        if(loguser==finddata['username']&&logpassword==finddata['password']&&logrole==finddata['role']){
            console.log('okok')
            res.setHeader('Content-Type', 'text/html');
            ejs.renderFile('views/home.html', function(err, str){
                // str => 输出渲染后的 HTML 字符串
                if(err){console.log(err)}
                else{
                    res.statusCode = 200;
                    
                     res.end(str)
                }
              });
        }
        else {
            alert("用户名、密码或身份选择错误，请重新登录");
        }
    })
    next();
})

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

app.post("/reg",(req,res,next)=>{
    console.log(req.body)
    var reguser=req.body.username;
    var regpassword=req.body.password;
    var regage=parseFloat(req.body.age);
    var regsex=req.body.sex;
    var regtel=parseFloat(req.body.tel);
    var regdor=req.body.dor;
    var regrole=req.body.role
    const userreg = new userdata({ username: reguser , password:regpassword , sex:regage , 
                                    tel:regtel,role:regrole});
    userreg.save();
    // res.send(req.query)
    if(regrole=="mannger")
        res.sendFile(path.join(__dirname, 'views/manager/home.html', 'test.html'));
    else
        res.sendFile(path.join(__dirname, 'views/student/home.html', 'test.html'));
    res.end();
    // res.sendFile(__dirname+"/views/reg.html",(err)=>{
    //     if(err)
    //         console.log(err)
    // })
    next();
})
app.listen(10706)
