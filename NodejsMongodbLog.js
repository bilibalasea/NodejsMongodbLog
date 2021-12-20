const express = require("express")
const app = express()
const mongoose = require('mongoose');
const ejs = require('ejs')
mongoose.connect('mongodb://172.21.2.236:27017/190110910706');

const schema1={
        username: {type: String, require: true},
        password: {type: String, require: true},
        age:Number,
        sex: String,
        tel: Number,
        dor: String,
        role: {type: String, require: true},
    }
const userdata = mongoose.model('user', schema1);
// const user1 = new userdata({ username: 'admin' , password:'001' , sex:'female' , tel:'123456',role:'manager'});
// user1.save();

const schema2={
    notice: String,
    editor: String,
}
const noticedata = mongoose.model('notice', schema2);

mongoose.connection.on('connected', () => {
    console.log('mongodb connect success')
})

app.use('/',express.static('public'))
// app.use('/',express.static('views'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var loguser="";
var logpassword="";
var logrole="";
app.post("/login",function(req,res,next){
    loguser=String(req.body.username);
    logpassword=String(req.body.password);
    logrole=String(req.body.role);
    console.log("post ok")
    console.log(logrole)
    next();
})

app.use('/login', function (req, res, next){
    userdata.findOne({ username: loguser },  function (err, userdata) {
        if (err) return handleError(err);
        console.log(logpassword == userdata.password)
        console.log(logrole==userdata.role)

        if(logpassword == userdata.password&&logrole == userdata.role){
            if(logrole=='manager'){
                ejs.renderFile('public/views/manager/home.html',function(err, str){
                    // str => 输出渲染后的 HTML 字符串
                    if(err) {
                        console.log(err)
                    }else{
                        res.setHeader('Content-Type','text/html');
                        res.end(str)
                    }                          
                });
            }else{
                ejs.renderFile('public/views/student/home.html',function(err, str){
                    // str => 输出渲染后的 HTML 字符串
                    if(err) {
                        console.log(err)
                    }else{
                        res.setHeader('Content-Type','text/html');
                        res.end(str)
                    }                          
                });
            }
        }
        else{
            console.log("your password is wrong");
            ejs.renderFile('public/index.html', {info:"用户名、密码或身份选择错误，请重新登录"},function(err, str){
                // str => 输出渲染后的 HTML 字符串
                if(err) {
                    console.log(err)
                }else{
                    //  res.statusCode = 200;
                    res.setHeader('Content-Type','text/html');
                    res.end(str)
                }
            });
        }
    });
    // next();
});

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
    reguser=req.body.username;
    regpassword=req.body.password;
    regage=parseFloat(req.body.age);
    regsex=req.body.sex;
    regtel=parseFloat(req.body.tel);
    regdor=req.body.dor;
    regrole=req.body.role
    loguser=reguser
    const userreg = new userdata({ username: reguser , password:regpassword , sex:regage , 
                                    tel:regtel,role:regrole});
    userreg.save();

    // res.send(req.query)
    if(regrole=="mannger"){
        ejs.renderFile('public/manager/home.html', {user:reguser},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.end(str)
            }
       });
        // res.sendFile(path.join(__dirname, 'public/views/manager/home.html', 'test.html'));
    }
    else{
        ejs.renderFile('public/student/home.html', {user:reguser},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.end(str)
            }
       });
    }
    next();
})
//管理员发布公告
app.post("/notice",(req,res,next)=>{
    console.log(req.body)
    adnotice=req.body.notice;
    adeditor=req.body.editor;
    const addnotice = new noticedata({ notice:adnotice , editor:adeditor});
    addnotice.save();
    ejs.renderFile('public/views/manager/Addnotice.html', function(err, str){
        // str => 输出渲染后的 HTML 字符串
        if(err){console.log(err)}
        else{
            res.setHeader('Content-Type', 'text/html');
            res.end(str)
        }
   });
   next();
})

app.use("/perinfo",(req,res,next)=>{
    userdata.findOne({ username: loguser },  function (err, userdata) {
        if (err) return handleError(err);
        ejs.renderFile('public/views/manager/perInfo.html', {username: userdata.username, age:userdata.age,
        sex: userdata.sex,tel: userdata.tel,dor: userdata.dor,role: userdata.role},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.send(str)
            }
        })
   });
})

app.use("/stuinfo",(req,res,next)=>{
    userdata.findOne({ username: loguser },  function (err, userdata) {
        if (err) return handleError(err);
        ejs.renderFile('public/views/manager/perInfo.html', {username: userdata.username,age:userdata.age,
        sex: userdata.sex,tel: userdata.tel,dor: userdata.dor,role: userdata.role},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.send(str)
            }
        })
   });
})

app.use("/mydorInfo",(req,res,next)=>{
    userdata.findOne({ username: loguser },  function (err, userdata) {
        if (err) return handleError(err);
        ejs.renderFile('public/views/manager/perInfo.html', {username: userdata.username,age:userdata.age,
        sex: userdata.sex,tel: userdata.tel,dor: userdata.dor,role: userdata.role},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.send(str)
            }
        })
   });
})

app.use("/readnotice",(req,res,next)=>{
    noticedata.find({}, function (err, noticedata1) {
        if (err) return handleError(err);
        ejs.renderFile('public/views/student/notice.html', {allnotice:noticedata1},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.end(str)
            }
        })
   });
})
app.listen(10706)
