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
        room: String,
        role: {type: String, require: true},
    }
const userdata = mongoose.model('user', schema1);
// const user1 = new userdata({ username: 'admin' , password:'001' , sex:'female' , tel:'123456',role:'manager'});
// user1.save();

const schema2={
    notice: String,
    editor: String,
    valid: String
}
const noticedata = mongoose.model('notice', schema2);
// const notice1 = new noticedata({ notice: '明后天天气晴朗，天台将会开放，同学们可于明后两日在天台按秩序晒被子' , editor:'qwe' , valid:'有效'});
// notice1.save();

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
//用户登录
app.post("/login",function(req,res,next){
    loguser=String(req.body.username);
    logpassword=String(req.body.password);
    logrole=String(req.body.role);
    next();
})
app.use('/login', function (req, res, next){
    userdata.findOne({ username: loguser },  function (err, userdata) {
        if (err) return handleError(err);
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
            ejs.renderFile('public/views/result.html', {info:"用户名、密码或身份选择错误，请重新登录"},function(err, str){
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

//用户注册
app.post("/reg",(req,res,next)=>{
    console.log(req.body)
    reguser=req.body.username;
    regpassword=req.body.password;
    regage=parseFloat(req.body.age);
    regsex=req.body.sex;
    regtel=parseFloat(req.body.tel);
    regdor=req.body.dors;
    regroom=req.body.room;
    regrole=req.body.role
    loguser=reguser
    const userreg = new userdata({ username: reguser , password:regpassword , age:regage , sex:regsex , 
                                    tel:regtel, dor:regdor, room:regroom, role:regrole});
    userreg.save();

    // res.send(req.query)
    if(regrole=="manager"){
        ejs.renderFile('public/views/manager/home.html', function(err, str){
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
        ejs.renderFile('public/views/student/home.html', function(err, str){
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

//管理员查看所有寝室信息
app.use("/allDorInfo",(req,res,next)=>{
    userdata.find({}, function (err, userdata1) {
        ejs.renderFile('public/views/manager/allDorInfo.html', {searchdorinfo:userdata1},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.end(str)
            }
        });
    })
})

//按寝室楼幢号搜索
var searchDor=""
app.post("/dorsearch",function(req,res,next){
    searchDor=String(req.body.dorser);
    next();
})
app.use("/dorsearch",(req,res,next)=>{
    if (searchDor==""){
        userdata.find({}, function (err, userdata1) {
            ejs.renderFile('public/views/manager/allDorInfo.html', {searchdorinfo:userdata1},function(err, str){
                // str => 输出渲染后的 HTML 字符串
                if(err){console.log(err)}
                else{
                    res.setHeader('Content-Type', 'text/html');
                    res.end(str)
                }
            });
        })
    }else{
        userdata.find({dor:searchDor}, function (err, userdata1) {
            ejs.renderFile('public/views/manager/allDorInfo.html', {searchdorinfo:userdata1},function(err, str){
                // str => 输出渲染后的 HTML 字符串
                if(err){console.log(err)}
                else{
                    res.setHeader('Content-Type', 'text/html');
                    res.end(str)
                }
            });
        })
    }
})

//按房间号搜索
var searchRoom=""
app.post("/roomsearch",function(req,res,next){
    searchRoom=String(req.body.room);
    next();
})
app.use("/roomsearch",(req,res,next)=>{
    if (searchRoom==""){
        userdata.find({}, function (err, userdata1) {
            ejs.renderFile('public/views/manager/allDorInfo.html', {searchdorinfo:userdata1},function(err, str){
                // str => 输出渲染后的 HTML 字符串
                if(err){console.log(err)}
                else{
                    res.setHeader('Content-Type', 'text/html');
                    res.end(str)
                }
            });
        })
    }else{
        userdata.find({room:searchRoom}, function (err, userdata1) {
            ejs.renderFile('public/views/manager/allDorInfo.html', {searchdorinfo:userdata1},function(err, str){
                // str => 输出渲染后的 HTML 字符串
                if(err){console.log(err)}
                else{
                    res.setHeader('Content-Type', 'text/html');
                    res.end(str)
                }
            });
        })
    }
})

//管理员发布公告
app.post("/notice",(req,res,next)=>{
    console.log(req.body)
    adnotice=req.body.notice;
    adeditor=req.body.editor;
    const addnotice = new noticedata({ notice:adnotice , editor:adeditor, valid:'有效'});
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

//管理员查看个人信息
app.use("/perinfo",(req,res,next)=>{
    userdata.findOne({ username: loguser },  function (err, userdata) {
        if (err) return handleError(err);
        ejs.renderFile('public/views/manager/perInfo.html', {username: userdata.username, age:userdata.age,
        sex: userdata.sex,tel: userdata.tel,dor: userdata.dor,room: userdata.room,role: userdata.role},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.send(str)
            }
        })
   });
})

//管理员查看公告
app.use("/managernotice",(req,res,next)=>{
    noticedata.find({}, function (err, noticedata1) {
        if (err) return handleError(err);
        ejs.renderFile('public/views/manager/notice.html', {allnotice:noticedata1},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.end(str)
            }
        })
   });
})

//管理员修改公告状态
app.post("/valid",function(req,res,next){
    // console.log(req.query)
    alterid=String(req.query.id);
    next();
})
app.use("/valid",function(req,res,next){
    noticedata.findOne({ _id: alterid },  function (err, noticedata1) {
        if (err) return console.log(err);
        if(noticedata1.valid=='有效'){
            noticedata.updateOne({ _id: alterid }, {valid: "无效"} ,function (err, noticedata2) {
                if (err) return console.log(err);
                // console.log('修改成功') 
                noticedata.find({}, function (err, noticedata1) {
                    if (err) return console.log(err);
                    ejs.renderFile('public/views/manager/notice.html', {allnotice:noticedata1},function(err, str){
                        // str => 输出渲染后的 HTML 字符串
                        if(err){console.log(err)}
                        else{
                            res.setHeader('Content-Type', 'text/html');
                            res.end(str)
                        }
                    })
               });
            }); 
        }else{
            noticedata.updateOne({ _id: alterid }, {valid: "有效"} ,function (err, noticedata2) {
                if (err) return console.log(err);
                // console.log('修改成功') 
            }); 
            noticedata.find({}, function (err, noticedata1) {
                if (err) return console.log(err);
                ejs.renderFile('public/views/manager/notice.html', {allnotice:noticedata1},function(err, str){
                    // str => 输出渲染后的 HTML 字符串
                    if(err){console.log(err)}
                    else{
                        res.setHeader('Content-Type', 'text/html');
                        res.end(str)
                    }
                })
           });
        }
    });
})

//管理员删除公告操作
app.post("/delete",function(req,res,next){
    // console.log(req.query)
    alterid=String(req.query.id);
    next();
})
app.use("/delete",function(req,res,next){
    noticedata.deleteOne({ _id: alterid },  function (err, noticedata1) {
        if (err) return console.log(err);
        noticedata.find({}, function (err, noticedata1) {
            if (err) return console.log(err);
            ejs.renderFile('public/views/manager/notice.html', {allnotice:noticedata1},function(err, str){
                // str => 输出渲染后的 HTML 字符串
                if(err){console.log(err)}
                else{
                    res.setHeader('Content-Type', 'text/html');
                    res.end(str)
                }
            })
        });
    }); 
})

//学生查看个人信息
app.use("/stuinfo",(req,res,next)=>{
    userdata.findOne({ username: loguser },  function (err, userdata) {
        if (err) return handleError(err);
        ejs.renderFile('public/views/student/perInfo.html', {username: userdata.username,age:userdata.age,
        sex: userdata.sex,tel: userdata.tel,dor: userdata.dor,room: userdata.room,role: userdata.role},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.send(str)
            }
        })
   });
})

//学生查看住在同一个寝室的人员信息
app.use("/mydorInfo",(req,res,next)=>{
    userdata.findOne({ username: loguser },  function (err, userdata0){
        if (err) return handleError(err);
        logdor=userdata0.dor
        logroom=userdata0.room
        userdata.find({dor: logdor, room: logroom}, function (err, userdata1) {
            if (err) return handleError(err);
            ejs.renderFile('public/views/student/dorInfo.html', {dorinfo:userdata1},function(err, str){
                    // str => 输出渲染后的 HTML 字符串
                    if(err){console.log(err)}
                    else{
                        res.setHeader('Content-Type', 'text/html');
                        res.send(str)
                    }
                })
        })
    })
})

//学生查看寝室公告
app.use("/readnotice",(req,res,next)=>{
    noticedata.find({valid:"有效"}, function (err, noticedata1) {
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

//登出
app.use("/logout",(req,res,next)=>{
    logname=""
    logpassword=""
    logrole=""
        ejs.renderFile('public/views/result.html' ,{info:"已登出，请重新输入登录信息"},function(err, str){
            // str => 输出渲染后的 HTML 字符串
            if(err){console.log(err)}
            else{
                res.setHeader('Content-Type', 'text/html');
                res.end(str)
            }
        })
})
app.listen(10706)
