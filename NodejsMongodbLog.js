const express = require("express")
const app = express()
const mongoose = require('mongoose');
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
app.get("/input",(req,res)=>{
    res.send(req.query)
    console.log(req.query)
    const kitty = new mydata({ name: req.query.first,health: req.query.second });
    kitty.save()
})
app.listen(10706)
