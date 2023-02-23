const express=require("express");
const bodyparser=require("body-parser");
const _=require("lodash");
const mongoose=require("mongoose");
const app=express();

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://ankita75057:Anki1230@atlascluster.bjuvwig.mongodb.net/differelistDB",{useNewUrlParser:true});

const homeschema=new mongoose.Schema({
  name:String
});
const homearrays=new mongoose.model("homearrays",homeschema);
const home1=new homearrays({name:"welcome to home"});
const home2=new homearrays({name:"click button"});
const defaultarray=[home1,home2];

const listschema=new mongoose.Schema({
  name:String,
  relatearray:[homeschema]
});
const listarrays=new mongoose.model("listarrays",listschema);


app.get("/",function(req,res){
  homearrays.find({},function(err,found){
    if(found.length==0){
      homearrays.insertMany(defaultarray,function(err){
        if(!err){
          console.log("insertMany");
        }
      });
      res.redirect("/");
    }else {
      res.render("ejslist",{ title:"HOME",list:found});
    }
  });
});

app.get("/:anotherlist",function(req,res){
  const newlist=_.capitalize(req.params.anotherlist);
  listarrays.findOne({name:newlist},function(err,found){
    if(!err){
      if(!found){
        //create new
        const newitem=new listarrays({name:newlist,relatearray:defaultarray});
        newitem.save();
        res.redirect("/"+newlist);
      }else{
        //show
        res.render("ejslist",{title:found.name,list:found.relatearray});
      }
    }
  });
});

app.post("/",function(req,res){   //for adding items
  const newinput=req.body.newinput;
  const buttonvalue=req.body.button;
  const addinput=new homearrays({
    name:newinput
  });

  if(buttonvalue==="HOME"){
    addinput.save();
      res.redirect("/");
  }else{
    listarrays.findOne({name:buttonvalue},function(err,found){
      found.relatearray.push(addinput);
      found.save();
      res.redirect("/"+buttonvalue);
    });
  }

})

app.post("/delete",function(req,res){   //for deleting items
  const checkedinputid=req.body.delinput;
  const hiddeninputvalue=req.body.titlename;
  if(hiddeninputvalue==="HOME"){
    homearrays.findByIdAndRemove(checkedinputid,function(err){
      res.redirect("/");
    });
  }else{
    listarrays.findOneAndUpdate({name:hiddeninputvalue}, {$pull:{relatearray:{_id:checkedinputid} } }, function(err,found){
      if(!err){
        res.redirect("/"+hiddeninputvalue);
      }
    });
  }
});

app.listen(process.env.PORT||3000,function(){
  console.log("working");
});

//create database/schema/collection
//save by insertall (using insertmany)
//show saved elements in server page by passing collection (using find method under app.get)
//show only name (and using foreach loop instead of for in ejs document)
//check collection for insert all only once (using if else under app.get and under find method)
//adding new element and show in server page (by creating new element in app.post)
//by checking the checkbox the element is removed from the database and also remove from server page (by2 steps):-
    //(1.create form and apply post /delete method)
    //(2.using findbyidandremove method under app.post/delete)
//now creating dynamic route for newlist
  //creating new schema for newlist and relate both the schemas
  //for making unique route/newlist (use findone method under app.get/anotherlist)
//for adding new element in newlist (use 2steps):-
  //(1.give button a ejs title value in ejs file)
  //(2.create new element and save it by using findone method under app.post)
//deleting elements in newlist (use 2steps):-
  //(1.give new input tag and input type is hidden and input value is ejs title value)
  //(2.using findoneandupdate method under app.post/delete)
