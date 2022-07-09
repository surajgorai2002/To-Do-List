//for ejs layout <%- include('header'); -%>   
//  header should be in views folder
const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const date= require(__dirname +"/date.js")
const app=express();
app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://admin-suraj:passpass@cluster0.w3bpi5t.mongodb.net/todolistDB",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
// var items=["eats","sleep"];

const itemschema={
  name:String
}
const item =mongoose.model("item",itemschema);
const item1= new item({
  name:" welcome heree"
});
const item2= new item({
  name:" press d to delete "
});
const item3= new item({
  name:" press a to select "
});
const defaultitem=[item1,item2,item3];


const listschema={
  name:String,
  items:[itemschema]
}
const List=mongoose.model("List",listschema); 

app.get("/",function(req,res){
   
    // var day=date.getDate();
    // var currday=today.getDay();
    // var tmp="";
    // if(currday=== 0|| currday===6)
    // tmp="its a wekend";
    // else
    // tmp="its not wekend";
    item.find({},function(err,founditem){
     if(founditem.length == 0)
    {
         item.insertMany(defaultitem ,function(err){
         if(err){
          console.log(err);
         }
        else{
          console.log("successully addede");
        }
         });
         res.redirect("/");
    }
      else{
      res.render('list',{headingtext:"title",newlistitem:founditem});
      }
    })
  
})
app.get("/:customlistname",function(req,res){


  const customListName=_.capitalize(req.params.customlistname);
   
  List.findOne({name:customListName},function(err,foundList){
    if(!err)
    {
      if(!foundList){
         const list =new List({
         name:customListName,
         items:defaultitem
      })
         list.save(); 
          res.redirect("/"+customListName);

      }
      else
      {
           res.render('list',{headingtext:foundList.name , newlistitem:foundList.items});

      }
    }
  });
  
  

});
app.post("/delete",function(req,res){
  var deleteitem=req.body.checkbox;
  const listname=req.body.listname ;
  //console.log(deleteitem);
   if(listname=="title")
   {
    item.findByIdAndRemove(deleteitem,function(err){
    if(err)
    console.log(err);
    else
     console.log("successfully removed");
  });
  res.redirect("/");
   }
   else
   {
    List.findOneAndUpdate({name:listname},{$pull:{items:{_id:deleteitem}}},function(err,foundlist){
      if(!err)
      {
      res.redirect("/"+listname);
      }
    })
   }
  
})
app.post("/",function(req,res){
   var newitemname=  req.body.newitem;
   const listname= req.body.list;
   const newitem= new item({
    name:newitemname
   });
   if(listname=="title"){
        newitem.save();
  //  items.push(item);
  res.redirect("/");
   }
   else
   {
       List.findOne({name:listname},function(err,foundlist){
        foundlist.items.push(newitem);
        foundlist.save();
        res.redirect("/"+listname);
       })
   }
 
})
let port = process.env.PORT;
if (port == null || port == "") {
  port =3000;
}
app.listen(port,function(req,res){
    console.log("started");
})