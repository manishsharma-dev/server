var express = require('express');
var nodeapp = express();
var bodyParser = require('body-parser');
var config = require("./DBconfig");
var sql = require("mssql");
var path = require('path');
var fs = require('fs');
var os = require("os");
var multer = require('multer');
var empty=require("is-empty");
var nodemailer = require('nodemailer');
var directoryPath = __dirname;
var nodemailer = require('nodemailer');
var cron = require('node-cron');
var request=require('request');
var currentdate=new Date();
var schedular=require('./public/js/Schedular');
cron.schedule('0 17 */2 * *', function(){
    console.log('running a task every two minutes');
    request('http://35.154.190.119/api/getCategories', function (error, response, body) {
        schedular.sentMail(response.body);
    });
});
var logger = fs.createWriteStream('error.log', {
  flags: 'a' 
})
function dateFormat (date){
      var day=date.getDate();
        var month=date.getMonth()+1;
        var year=date.getFullYear();
        var hh=date.getHours();
        var mm=date.getMinutes();
        var ss=date.getSeconds();
        var fullDateTime=day+'-'+month+'-'+year+' '+hh+':'+mm+':'+ss;
        return fullDateTime;
    
}
var MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638'
}

function checkMagicNumbers(magic) {
    if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif) return true
}

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
sql.close(function () {
    console.log("Closed ");
});
//const pool= new sql.ConnectionPool(config);
nodeapp.use(bodyParser.json());
nodeapp.use(bodyParser.urlencoded({ extended: true }));
nodeapp.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'null');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//facebook share
nodeapp.post('/facebook', function(req,res) {
 var url = 'https://graph.facebook.com/me/feed';
 var params = {
  access_token: req.session.access_token,
  ID: req.body.ID,
  ArtistURL:req.body.ArtistURL,
  AvailableStatus:req.body.AvailableStatus,
  FirstName:req.body.FirstName,
  lastName:req.body.lastName,
  MetaDescription:req.body.MetaDescription,
  MetaKeyword:req.body.MetaKeyword,
  MetaTitle:req.body.MetaTitle,
  ProductName:req.body.ProductName,
  ProductPrice:req.body.ProductPrice,
  ProductRemarks:req.body. ProductRemarks,
  
 };
 request.post({url: url,qs: params}, function(err, resp, body) {
  if (err) {
   console.error(err)
    return;
  }
  body = JSON.parse(body);
  if (body.error) {
   var error = body.error.message;
    console.error("Error returned from facebook: "+ body.error.message);
    if (body.error.code == 341) {
    error = "You have reached the post limit for facebook. Please wait for 24 hours before posting again to facebook." 
   console.error(error);
    }
    res.send(error);
  }
  var return_ids = body.id.split('_');
  var user_id = return_ids[0];
  var post_id = return_ids[1];
  var post_url = "https://www.facebook.com/"+user_id+"/posts/"+post_id;
  res.send(post_url);
 });
});


nodeapp.post('/api/file', function (req, res) {
    try{
    var filesname = "";
    // var upload = multer({
    // storage: storage
    // }).array('userFile')
    var Other_file="";
    var filesname = "";
    var cardDetail="";
    var profilepic = "";
    var image3 = "";
    var image4 = "";
    var upload = multer({
        storage: storage
    }).fields([{ name: "userFile" }, { name: "image2" },{name:"card"},{ name: "ProductOther" }, { name: "image3" }, { name: "image4" }])
    upload(req, res, function (err) {

        if (req.files.userFile != undefined) {
            if (req.files.userFile.length > 0) {
                for (var i = 0; i < req.files.userFile.length; i++) {
                    var bitmap = fs.readFileSync('./public/uploads/' + req.files.userFile[i].filename).toString('hex', 0, 4)
                    if (!checkMagicNumbers(bitmap)) {
                        fs.unlinkSync('./public/uploads/' + req.files.userFile[0].filename)  //Save Data in Folder
                        res.end('Invalid file');
                    }
                    else {
                        filesname += req.files.userFile[i].filename + ","
                    }
                }
                filesname = filesname.slice(0, -1);

            }
        }
        if (req.files.ProductOther != undefined) {
            if (req.files.ProductOther.length > 0) {
                for (var i = 0; i < req.files.ProductOther.length; i++) {
					
                    var bitmap = fs.readFileSync('./public/uploads/' + req.files.ProductOther[i].filename).toString('hex', 0, 4)
                    if (!checkMagicNumbers(bitmap)) {
                        fs.unlinkSync('./public/uploads/' + req.files.ProductOther[0].filename)  //Save Data in Folder
                        res.end('Invalid file')
                    }
                    else {
                        Other_file += req.files.ProductOther[i].filename + ","
                    }
                }  
                Other_file=Other_file.slice(0,-1);
            }
        }

        if (req.files.image2 != undefined) {
            if (req.files.image2.length > 0) {
                for (var i = 0; i < req.files.image2.length; i++) {
                    var bitmap = fs.readFileSync('./public/uploads/' + req.files.image2[i].filename).toString('hex', 0, 4)
                    if (!checkMagicNumbers(bitmap)) {
                        fs.unlinkSync('./public/uploads/' + req.files.image2[0].filename)  //Save Data in Folder
                        res.end('Invalid file')
                    }
                    else {
                        profilepic += req.files.image2[i].filename + ","
                    }
                }
                profilepic = profilepic.slice(0, -1);
            }
        }

        if (req.files.image3 != undefined) {
            if (req.files.image3.length > 0) {
                for (var i = 0; i < req.files.image3.length; i++) {
                    var bitmap = fs.readFileSync('./public/uploads/' + req.files.image3[i].filename).toString('hex', 0, 4)
                    if (!checkMagicNumbers(bitmap)) {
                        fs.unlinkSync('./public/uploads/' + req.files.image3[0].filename)  //Save Data in Folder
                        res.end('Invalid file')
                    }
                    else {
                        image3 += req.files.image3[i].filename + ","
                    }
                }
                image3 = image3.slice(0, -1);
            }
        }

        if (req.files.image4 != undefined) {
            if (req.files.image4.length > 0) {
                for (var i = 0; i < req.files.image4.length; i++) {
                    var bitmap = fs.readFileSync('./public/uploads/' + req.files.image4[i].filename).toString('hex', 0, 4)
                    if (!checkMagicNumbers(bitmap)) {
                        fs.unlinkSync('./public/uploads/' + req.files.image4[0].filename)  //Save Data in Folder
                        res.end('Invalid file')
                    }
                    else {
                        image4 += req.files.image4[i].filename + ","
                    }
                }
                image4 = image4.slice(0, -1);
            }
        }
        if (req.files.card != undefined) {
            if (req.files.card.length > 0) {
                for (var i = 0; i < req.files.card.length; i++) {
                    var bitmap = fs.readFileSync('./public/uploads/' + req.files.card[i].filename).toString('hex', 0, 4)
                    fs.unlinkSync('./public/uploads/' + req.files.card[0].filename)  //Save Data in Folder
                    cardDetail += req.files.card[i].filename + ","
                    }
                }
            cardDetail = cardDetail.slice(0, -1);
            }
        
        switch (req.body.switchType) {
            case "sliders":
         var currentdate=new Date();        
    console.log("\r\n"+"Slider Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");
                const pool_Slider = new sql.ConnectionPool(config, err => {
                    pool_Slider.request()
                         .input('EventType',sql.NVarChar(255),req.body.EventType)
                        .input('EventId',sql.Int,req.body.EventId)
                        .input('LinkType',sql.NVarChar(255),req.body.LinkType)
                        .input('SlideType', sql.NVarChar(255), req.body.slideType)
                        .input('ArtistId', sql.Int, req.body.ArtistId)
                        .input('ProductID', sql.Int, req.body.ProductID)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('Ide', sql.Int, req.body.Id)
                        .input('Caption', sql.NVarChar(255), req.body.imgcaption)
                        .input('VideoUrl', sql.NVarChar(255), req.body.Videourl)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spInsertSliderDetails', (err, result) => { 
                        var currentdate=new Date();
    console.log("\r\n"+"Sliders:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    console.log("\r\n"+"Sliders:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;
            case "UserProfilePicture":
             var currentdate=new Date();    
logger.write("\r\n"+"UserProfilePicture Body is"+dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");       
                const pool_UserProfileImage =new sql.ConnectionPool(config, err => {
                    pool_UserProfileImage.request()
                    .input('UEmail',sql.NVarChar(255),req.body.UEmail)
                    .input('ImagePath', sql.NVarChar(255), filesname)
                    .execute('spChangeProfilePicture',(err,result)=>
                    {
                  
logger.write("\r\n"+"UserProfilePicture:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"UserProfilePicture:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
                });
            break;     


            case "contact":
            var currentdate=new Date();    
   logger.write("\r\n"+"Contact Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");
                const pool_contact = new sql.ConnectionPool(config, err => {
                    pool_contact.request()
                        .input('Heading', sql.NVarChar(255), req.body.heading)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('SubHeading', sql.NVarChar(255), req.body.subheading)
                        .input('Title', sql.NVarChar(255), req.body.title)
                        .input('Ide', sql.Int, req.body.Id)
                        .input('Owner', sql.NVarChar(255), req.body.name)
                        .input('PinCode', sql.NVarChar(255), req.body.pincode)
                        .input('StreetAddress', sql.NVarChar(255), req.body.address)
                        .input('City', sql.NVarChar(255), req.body.city)
                        .input('State', sql.NVarChar(255), req.body.state)
                        .input('PhoneNumber', sql.NVarChar(255), req.body.phoneno)
                        .input('Email', sql.NVarChar(255), req.body.email)
                        .input('Longitude', sql.NVarChar(255), req.body.longitude)
                        .input('Latitude', sql.NVarChar(255), req.body.latitude)
                        .input('Mapapi', sql.NVarChar(sql.max), req.body.mapapi)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spAddContactDetails', (err, result) => {
                         /*console.log("Result is" +JSON.stringify(result));
                         console.log("error is:-"+ JSON.stringify(err));*/  
                       
logger.write("\r\n"+"contact:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"contact:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

    case "EventHeading":
    var currentdate=new Date();
  const pool_EventHeading=new  sql.ConnectionPool(config,err=>{
 logger.write("\r\n"+"EventHeading Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");
      console.log("Image is:-"+JSON.stringify(filesname));
      pool_EventHeading.request()
                    .input('ID',sql.Int, req.body.ID)
                    .input('ImagePath', sql.NVarChar(255), filesname)
                    .input('Heading',sql.NVarChar(255), req.body.Heading)
                    .input('Description',sql.NVarChar(sql.max), req.body.Description)
                    .input('EventType',sql.NVarChar(255), req.body.EventType)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags) 
                    .input('EventType',sql.NVarChar(255),req.body.EventType) 
                    .input('ActionType',sql.NVarChar(255), req.body.ActionType)
                     .execute('spAddEventHeading',(err,result)=>{
                postgetjson.categoryrowaffacted = result.recordsets;
               // res.send(postgetjson);		

logger.write("\r\n"+"EventHeading:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"EventHeading:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                });

                });
                break;
            case "Events": 
 var currentdate=new Date(); 
                console.log("Body is" + JSON.stringify(req.body));
 logger.write("\r\n"+"Events Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");
                     const pool_event = new sql.ConnectionPool(config, err => {
                    pool_event.request()
                        .input('ID',sql.Int,req.body.ID)
                        .input('Event', sql.NVarChar(255), req.body.Event)
                        .input('EventName', sql.NVarChar(255), req.body.EventName)
                        .input('Description', sql.NVarChar(sql.max), req.body.Description)
                        .input('Venue', sql.NVarChar(sql.max), req.body.Venue)
                        .input('Products',sql.NVarChar(255),req.body.Products)
                        .input('Timings', sql.NVarChar(255), req.body.Timings)                       
                        .input('BannerImage', sql.NVarChar(255), filesname) 
                        .input('StartDate', sql.NVarChar(255), req.body.StartDate)
                        .input('EndDate', sql.NVarChar(255), req.body.EndDate)
                        .input('AddInfo',sql.NVarChar(255),req.body.AddInfo)
                        .input('Quotes',sql.NVarChar(sql.max),req.body.Quotes)
                        .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
						.input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
						.input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                        .input('URL',sql.NVarChar(sql.max),req.body.URL)
                        .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                        .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags) 
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        //.input('Updatetype',sql.NVarChar(255),req.body.Updatetype)
                        .execute('sp_NewInsertEvents', (err, result) => {
                        console.log("Result is" +JSON.stringify(result));
                        console.log("error is:-"+ JSON.stringify(err));

logger.write("\r\n"+"Events:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Events:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

            case "event":
var currentdate=new Date();                
logger.write("\r\n"+"Event Popup Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");
console.log("Image is:-"+ JSON.stringify(filesname));
                const pool_popup = new sql.ConnectionPool(config, err => {
                    pool_popup.request()
                    .input('Ide',sql.Int,req.body.ID)
                    .input('PopUpType', sql.NVarChar(255), req.body.Type)
                    .input('Title', sql.NVarChar(255), req.body.Title)
                    .input('ImagePath', sql.NVarChar(255), filesname) 
                    .input('EventId', sql.Int, req.body.EventId)
                    .input('EventType', sql.NVarChar(255), req.body.EventType)
                    .input('Sub_heading',sql.NVarChar(255),req.body.Sub_heading)
                    .input('StartDate',sql.NVarChar(sql.max),req.body.StartDate)
                    .input('StartMonth',sql.NVarChar(255),req.body.StartMonth)                       
                    .input('StartYear', sql.NVarChar(255),req.body.StartYear) 
                    .input('EndDate', sql.NVarChar(255), req.body.EndDate)
                    .input('EndMonth', sql.NVarChar(255), req.body.EndMonth)
                    .input('EndYear', sql.NVarChar(255), req.body.EndYear)
                    .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .input('UpdateType', sql.NVarChar(255), req.body.Updatetype)
                    .execute('spAddPopUp', (err, result) => {
 
logger.write("\r\n"+"Event Popup:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Event Popup:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");

                     });
                  });
               break;
            case 'Sell':
         var currentdate=new Date();
logger.write("\r\n"+"Selling through us Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");            
                console.log(filesname);
                const pool_sell = new sql.ConnectionPool(config, err => {
                    pool_sell.request()
                        .input('Ide', sql.Int, req.body.Id)
                        .input('Description', sql.NVarChar(sql.max), req.body.Description)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spAddSelling', (err, result) => {
 logger.write("\r\n"+"Selling through us:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Selling through us:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

            case 'Corporate':
 var currentdate=new Date();
logger.write("\r\n"+"Corporate Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");                 
                const pool_Corporate = new sql.ConnectionPool(config, err => {
                    pool_Corporate.request()
                        .input('HeadingType', sql.NVarChar(255), req.body.HeadingType)
                        .input('Sub_Heading', sql.NVarChar(255), req.body.Heading)
                        .input('Ide', sql.Int, req.body.Id)
                        .input('Description', sql.NVarChar(sql.max), req.body.Description)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spAddCorporate', (err, result) => {
logger.write("\r\n"+"Corporate:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Corporate:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        })
                });
                break;

  case 'AddCustomMenu':
var currentdate=new Date();
logger.write("\r\n"+"AddCustomMenu Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");     
  console.log("1st image is:-"+JSON.stringify(filesname));
  console.log("2nd image is:-"+JSON.stringify(Other_file));
                const pool_CustomMenu = new sql.ConnectionPool(config, err => {
                    pool_CustomMenu.request()
                        .input('Id', sql.Int, req.body.Id)
                        .input('MenuLabel', sql.NVarChar(255), req.body.Menu_Label)                        
                        .input('PageTitle', sql.NVarChar(255), req.body.Page_Title)                          
                        .input('RouteId', sql.Int, req.body.Route_Id)                        
                        .input('BgImage', sql.NVarChar(255), filesname)                        
                        .input('OtherImg', sql.NVarChar(255), profilepic)
                        .input('Content', sql.NVarChar(sql.max), req.body.Content)                       
                        .input('ParentId', sql.Int, req.body.Parent_Id)                       
                        .input('MenuLevel', sql.Int, req.body.Level)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)                       
                        .execute('sp_insertCustomMenu', (err, result) => {
 logger.write("\r\n"+"AddCustomMenu:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"AddCustomMenu:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                            
})
});
break;


            case 'Returns':
var currentdate=new Date();
logger.write("\r\n"+"Returns Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");                    
                const pool_Returns = new sql.ConnectionPool(config, err => {
                    pool_Returns.request()
                        .input('Ide', sql.Int, req.body.Id)
                        .input('Description', sql.NVarChar(sql.max), req.body.Description)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spAddReturns', (err, result) => {
  logger.write("\r\n"+"Returns:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Returns:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
   
                        });
                });
                break;

            case "discover":
var currentdate=new Date();
logger.write("\r\n"+"discover Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");       
                const pool_Discover = new sql.ConnectionPool(config, err => {
                    pool_Discover.request()
                        .input('Title', sql.NVarChar(255), req.body.Title)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('SelectedMedium', sql.NVarChar(255), req.body.MediumType)
                        .input('Ide', sql.Int, req.body.Id)
                        .input('TextImage', sql.NVarChar(255), req.body.TextImg)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('updateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spAddDiscoverMedium', (err, result) => {
  logger.write("\r\n"+"discover:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"discover:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

case "Product":
          console.log(Other_file);
var otherimg0 = "", otherimg1 = "", otherimg2 = "", otherimg3 = "", otherimg4 = "";
if (Other_file != "") {
                  
    var split_Record = Other_file.split(",");
    if (split_Record.length != undefined) {
        if (split_Record[0] != "") {
            otherimg0 = split_Record[0];
        }
        else{
            otherimg0 = "";
        }
        if (split_Record[1] != "") {
            otherimg1 = split_Record[1];
        }
        else{
            otherimg1 = "";
        }
        if (split_Record[2] != "") {
            otherimg2=split_Record[2];
        }
        else{
            otherimg2 = "";
        }
        if (split_Record[3] != "") {
            otherimg3 = split_Record[3];
        }
        else{
            otherimg3 = "";
        }
        if (split_Record[4] != "") {
            otherimg4 = split_Record[4];
        }
        else{
            otherimg4 = "";
        }
    }                    
}

var currentdate=new Date();
                req.body.chkStatusPrice=(req.body.chkStatusPrice=='true')                		
                const pool_Product = new sql.ConnectionPool(config, err => {
                    pool_Product.request()
                        .input('Name', sql.NVarChar(255), req.body.ProName)
                        .input('SerialNo', sql.NVarChar(255), req.body.SerialNo)
                        .input('CategoryId', sql.Int, req.body.CategoryId)
                        .input('MediumId', sql.Int, req.body.MediumId)
                        .input('GeneraId', sql.Int, req.body.GeneraId)
                        .input('CollectibleId', sql.Int, req.body.CollectibleId)
                        .input('ArtistId', sql.Int, req.body.ArtistId)
                        .input('NewArtist',sql.NVarChar(sql.max),req.body.NewArtist)
                        .input('ProductType',sql.NVarChar(sql.max),req.body.ProductType)
                        .input('YearOfPainting', sql.NVarChar(255), req.body.ProductYear)
                        .input('Height', sql.NVarChar(255), req.body.Height)
                        .input('Width', sql.NVarChar(255), req.body.Width)
                        .input('Depth',sql.NVarChar(255), req.body.depth)
                        .input('Price', sql.Int, req.body.Price)
                        .input('PriceOnRequest',sql.NVarChar(255),req.body.PriceOnRequest)
                        .input('chkStatusPrice' ,sql.Bit(1),req.body.chkStatusPrice)
                        .input('MainImage', sql.NVarChar(255), filesname)
						.input('image1', sql.NVarChar(255), otherimg0)
						.input('image2', sql.NVarChar(255), otherimg1)
						.input('image3', sql.NVarChar(255), otherimg2)
						.input('image4', sql.NVarChar(255), otherimg3)
						.input('image5', sql.NVarChar(255), otherimg4)
                        .input('Height', sql.NVarChar(255), req.body.height)
                        .input('Width', sql.NVarChar(255), req.body.width)
                        /*.input('DollerPrice', sql.NVarChar(255), req.body.DollerPrice)*/
                        .input('Remarks', sql.NVarChar(sql.max), req.body.Remarks)
						.input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
						.input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
						.input('MetaTitle',sql.NVarChar(255),req.body.Metatitle)
                        .input('URL',sql.NVarChar(sql.max),req.body.URL)
                        .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                        .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                        .input('Id', sql.Int, req.body.Id)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spInsertProduct', (err, result) => {  
console.log("\r\n"+"Product:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
console.log("\r\n"+"Product:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;
case "CollectibleProduct":
          console.log(Other_file);
var otherimg0 = "", otherimg1 = "", otherimg2 = "", otherimg3 = "", otherimg4 = "";
if (Other_file != "") {
                  
    var split_Record = Other_file.split(",");
    if (split_Record.length != undefined) {
        if (split_Record[0] != "") {
            otherimg0 = split_Record[0];
        }
        else{
            otherimg0 = "";
        }
        if (split_Record[1] != "") {
            otherimg1 = split_Record[1];
        }
        else{
            otherimg1 = "";
        }
        if (split_Record[2] != "") {
            otherimg2=split_Record[2];
        }
        else{
            otherimg2 = "";
        }
        if (split_Record[3] != "") {
            otherimg3 = split_Record[3];
        }
        else{
            otherimg3 = "";
        }
        if (split_Record[4] != "") {
            otherimg4 = split_Record[4];
        }
        else{
            otherimg4 = "";
        }
    }                    
}

var currentdate=new Date();
                req.body.chkStatusPrice=(req.body.chkStatusPrice=='true')
                		console.log(otherimg0)
						console.log(otherimg1)
						console.log(otherimg2)
						console.log(otherimg3)
						console.log(otherimg4)
                const pool_CollectibleProduct = new sql.ConnectionPool(config, err => {
                    pool_CollectibleProduct.request()
                        .input('Name', sql.NVarChar(255), req.body.ProName)
                        .input('SerialNo', sql.NVarChar(255), req.body.SerialNo)
                        .input('CategoryId', sql.Int, req.body.CategoryId)
                        .input('MediumId', sql.Int, req.body.MediumId)
                        .input('GeneraId', sql.Int, req.body.GeneraId)
                        .input('CollectibleId', sql.Int, req.body.CollectibleId)
                        .input('ArtistId', sql.Int, req.body.ArtistId)
                        .input('NewArtist',sql.NVarChar(sql.max),req.body.NewArtist)
                        .input('ProductType',sql.NVarChar(sql.max),req.body.ProductType)
                        .input('YearOfPainting', sql.NVarChar(255), req.body.ProductYear)
                        .input('Height', sql.NVarChar(255), req.body.Height)
                        .input('Width', sql.NVarChar(255), req.body.Width)
                        .input('Depth',sql.NVarChar(255), req.body.depth)
                        .input('Price', sql.Int, req.body.Price)
                        .input('PriceOnRequest',sql.NVarChar(255),req.body.PriceOnRequest)
                        .input('chkStatusPrice' ,sql.Bit(1),req.body.chkStatusPrice)
                        .input('MainImage', sql.NVarChar(255), filesname)
						.input('image1', sql.NVarChar(255), otherimg0)
						.input('image2', sql.NVarChar(255), otherimg1)
						.input('image3', sql.NVarChar(255), otherimg2)
						.input('image4', sql.NVarChar(255), otherimg3)
						.input('image5', sql.NVarChar(255), otherimg4)
                        .input('Height', sql.NVarChar(255), req.body.height)
                        .input('Width', sql.NVarChar(255), req.body.width)
                        .input('Remarks', sql.NVarChar(sql.max), req.body.Remarks)
						.input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
						.input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
						.input('MetaTitle',sql.NVarChar(255),req.body.Metatitle)
                        .input('URL',sql.NVarChar(sql.max),req.body.URL)
                        .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                        .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                        .input('Id', sql.Int, req.body.Id)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spInsertCollectibleProduct', (err, result) => {  
                      console.log("\r\n"+"collectibleProduct:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
console.log("\r\n"+"collectibleProduct:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;
            case "Artist":
  var currentdate=new Date();
logger.write("\r\n"+"Artist Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");
            console.log("Filesname-"+JSON.stringify(filesname));
            console.log("profilepic-"+JSON.stringify(profilepic));
                const pool_Artist = new sql.ConnectionPool(config, err => {
                    pool_Artist.request()
                        .input('Fname', sql.NVarChar(255), req.body.FistName)
                        .input('Lname', sql.NVarChar(255), req.body.LastName)
                        .input('GalleryType', sql.NVarChar(255), req.body.GalleryType)
                        .input('imagepath', sql.NVarChar(255), filesname)
                        .input('ArtistPic', sql.NVarChar(255), profilepic)
                        .input('StartYear', sql.NVarChar(255), req.body.StartedService)
                        .input('Exitdate', sql.NVarChar(255), req.body.ExitDate)
                        .input('URL', sql.NVarChar(255), req.body.URL)
                        .input('Description', sql.NVarChar(sql.max), req.body.Description)
						.input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
						.input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
						.input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                        .input('PageURL',sql.NVarChar(sql.max),req.body.PageURL)
                        .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                        .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                        .input('Id', sql.Int, req.body.Id)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('updateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spInsertArtistMaster', (err, result) => {
   logger.write("\r\n"+"Artist:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Artist:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

            case "collectible":
    var currentdate=new Date();
logger.write("\r\n"+"collectible Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");         
                const pool_Collectible = new sql.ConnectionPool(config, err => {
                    pool_Collectible.request()

                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('SelectedCollectible', sql.NVarChar(255), req.body.CollectibleType)
                        .input('Ide', sql.Int, req.body.Id)
                        .input('TextImage', sql.NVarChar(255), req.body.TextImg)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('updateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('AddDiscoverCollectible', (err, result) => {
   logger.write("\r\n"+"collectible:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"collectible:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

            case "Team":
     var currentdate=new Date();
logger.write("\r\n"+"Team Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");   
            console.log("File" + JSON.stringify(filesname));
                console.log("Team API Called" + JSON.stringify(req.body));
                const pool_Team = new sql.ConnectionPool(config, err => {
                    //console.log("Team API Error..."+err);                   
                    pool_Team.request()
                        .input('Name', sql.NVarChar(255), req.body.Name)
                        .input('Descriptin', sql.NVarChar(sql.max), req.body.Description)
                        .input('ImageName', sql.NVarChar(255), filesname)
                        .input('Id', sql.Int, req.body.Id)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spInsertTeamDetails', (err, result) => {
logger.write("\r\n"+"Team:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Team:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

            case "aboutus":
    var currentdate=new Date();            
      logger.write("\r\n"+"aboutus Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");
                const pool_about = new sql.ConnectionPool(config, err => {
                    pool_about.request()
                        .input('Title', sql.NVarChar(255), req.body.Title)
                        .input('Content', sql.NVarChar(sql.max), req.body.Content)
                        .input('ImageName', sql.NVarChar(255), filesname)
                         .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
						.input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
						.input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                        .input('URL',sql.NVarChar(sql.max),req.body.URL)
                        .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                        .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                        .input('Ide', sql.Int, req.body.Id)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spAddContent', (err, result) => {
  logger.write("\r\n"+"aboutus:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"aboutus:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;
			case "newsletter":
	var currentdate=new Date();            
      logger.write("\r\n"+"newsletter Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");
			console.log("Attached file list....."+filesname);
			const pool_newsletter = new sql.ConnectionPool(config, err => {

                    pool_newsletter.request()
                        .input('Title', sql.NVarChar(255), req.body.Title)
                        .input('Subject', sql.NVarChar(sql.max), req.body.subject)
						.input('Description', sql.NVarChar(sql.max), req.body.Content)
						.input('SelectedEmail', sql.NVarChar(sql.max), req.body.SelectedEmails)
						.input('Layout', sql.NVarChar(sql.max), req.body.layout)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('ID', sql.Int, req.body.Id)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('updateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('SPAddNewsletter', (err, result) => {
    logger.write("\r\n"+"newsletter:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"newsletter:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
            break;			

            case "FooterRecord":
    var currentdate=new Date();            
      logger.write("\r\n"+"FooterRecord Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");            
                const pool_Footer = new sql.ConnectionPool(config, err => {
                    pool_Footer.request()
                        .input('Id', sql.Int, req.body.Id)
                        .input('FooterName', sql.NVarChar(255), req.body.Name)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('FooterURL', sql.NVarChar(255), req.body.URL)
                        .input('Title', sql.NVarChar(255), req.body.Title)
                        .input('Description', sql.NVarChar(sql.MAX), req.body.Description)
                        .input('URLType', sql.NVarChar(255), req.body.URLType)
                        .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
						.input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
						.input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                        .input('PageURL',sql.NVarChar(sql.max),req.body.PageURL)
                        .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                        .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.UpdateType)
                        .execute('spInsertFooter', (err, result) => {
 logger.write("\r\n"+"FooterRecord:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"FooterRecord:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

            case "Blog":
    var currentdate=new Date();            
      console.log("\r\n"+"Blog Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");             
                const pool_Blog = new sql.ConnectionPool(config, err => {
                    pool_Blog.request()
                        .input('ID', sql.Int, req.body.Id)
                        .input('Title', sql.NVarChar(255), req.body.BlogTitle)
                        .input('Quotes', sql.NVarChar(255), req.body.Quote)
                        .input('QuoteWriter', sql.NVarChar(255), req.body.QuoteFrom)
                        .input('Imagepath', sql.NVarChar(255), filesname)
                        .input('Description', sql.NVarChar(sql.max), req.body.Blogdescription)              .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
						.input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
						.input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                        .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                        .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)          
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spInsertBlogDetails', (err, result) => {
   console.log("\r\n"+"Blog:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
console.log("\r\n"+"Blog:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

            case "AboutUsHeader":
var currentdate=new Date();            
      logger.write("\r\n"+"AboutUsHeader Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");                      
                const pool_AboutUsHeader = new sql.ConnectionPool(config, err => {
                    pool_AboutUsHeader.request()
                        .input('Ide', sql.NVarChar(255), req.body.Id)
                        .input('Heading', sql.NVarChar(255), req.body.Heading)
                        .input('Sub_heading', sql.NVarChar(255), req.body.Sub_heading)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.Content)
                        .execute('SpAddAboutHeader', (err, result) => {
logger.write("\r\n"+"AboutUsHeader:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"AboutUsHeader:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

            case 'Arts':
var currentdate=new Date();            
      logger.write("\r\n"+"Arts Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");                     
                const pool_Arts = new sql.ConnectionPool(config, err => {
                    pool_Arts.request()
                        .input('Heading', sql.NVarChar(255), req.body.Heading)
                        .input('Ide', sql.Int, req.body.Id)
                        .input('Description', sql.NVarChar(sql.max), req.body.Description)
                        .input('ImagePath', sql.NVarChar(255), filesname)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spAddArts', (err, result) => {
 logger.write("\r\n"+"Arts:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Arts:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        })
                });
                break;
            case "trend":
         var currentdate=new Date();            
      logger.write("\r\n"+"trend Body is:-" +dateFormat(currentdate) + JSON.stringify(req.body)+"\r\n");             
                const pool_updateTrend = new sql.ConnectionPool(config, err => {
                    pool_updateTrend.request()
                        .input('ID', sql.Int, req.body.Id)
                        .input('TrendingType', sql.NVarChar(255), req.body.TrendingType)
                        .input('Title', sql.NVarChar(255), req.body.TrendingTitle)
                        .input('ArtistId', sql.Int, req.body.ArtistId)
                        .input('ProductId', sql.Int, req.body.ProductId)
                        .input('EventId', sql.Int, req.body.EventId)
                        .input('Text', sql.NVarChar(255), req.body.Trendingtext)
                        .input('EventType', sql.NVarChar(255), req.body.EventType)
                        .input('Image', sql.NVarChar(255), filesname)
                        .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                        .input('UpdateType', sql.NVarChar(255), req.body.ContentUpdate)
                        .execute('spInsertTrendingDetails', (err, result) => {
  console.log("\r\n"+"trend:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); console.log("\r\n"+"trend:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                });
                break;

        }
        console.log(req.files.length)
        if (req.files.length > 0) {
            res.end('Files have been uploaded');

        }
        else {
            res.end('File has been uploaded');
        }
    });
    }
    catch(ex){
        console.log(ex.message);
    }

});

//API is used to get all cateogories records
var getjson = {};
nodeapp.get("/api/getCategories", function (req, res, next) {
    try{
    const pool = new sql.ConnectionPool(config, err => {
        console.log("API called.....");   
    pool.request()
       .execute('spGetAllWishList', (err, result) => {
        getjson.AllWishList = result.recordsets;
        var currentdate=new Date(); 
logger.write("\r\n"+"GetAllWishList:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"GetAllWishList:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
});   
pool.request()
       .execute('spGetCurrentWishlist', (err, result) => {
           getjson.CurrentWishList = result.recordsets;
    var currentdate=new Date(); 
logger.write("\r\n"+"GetCurrentWishList:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"GetCurrentWishList:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
});
        pool.request()
           .execute('spGetOfflineEvents', (err, result) => {
               getjson.OfflineEvents = result.recordsets;
            var currentdate=new Date(); 
logger.write("\r\n"+"Getoffline:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Getoffline:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
            });
        pool.request()
            .execute('spGetOfflineHeading', (err, result) => {
            getjson.OfflineHeading = result.recordsets;
            var currentdate=new Date(); 
logger.write("\r\n"+"GetOfflineHeading:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"GetOfflineHeading:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
});
        pool.request()
                    .execute('spGetPubOfflineEvent', (err, result) => {
                    getjson.OfflinePublishedHeading = result.recordsets;
            var currentdate=new Date(); 
 logger.write("\r\n"+"GetPubOfflineEvent:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"GetPubOfflineEvent:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
        });
        pool.request()
            .execute('spGetPublishMenu', (err, result) => {
            getjson.TopPulishMenu = result.recordsets;
            var currentdate=new Date(); 
  logger.write("\r\n"+"GetPublishMenu:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"GetPublishMenu:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");            
        });  
    pool.request()
            .execute('GetPublishActivatedEvent', (err, result) => {
            getjson.PublishedRdEvent = result.recordsets;
            var currentdate=new Date(); 
 logger.write("\r\n"+"Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
        });    
       pool.request()
            .execute('sp_GetPublishEventList', (err, result) => {
            getjson.ExhibitionList = result.recordsets;
           var currentdate=new Date(); 
 logger.write("\r\n"+"GetPublishEventList:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"GetPublishEventList:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
        });
        /*pool.request()
            .execute('spGetOnlineEvents', (err, result) => {
            getjson.OnlineEvents = result.recordsets;
            var currentdate=new Date(); 
   logger.write("\r\n"+"GetOnlineEvents:- Result is:-" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
logger.write("\r\n"+"GetOnlineEvents:- Error is:-" +dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");       
            });
        pool.request()
            .execute('spGetPublishOnlineEvents', (err, result) => {
            getjson.PublishOnlineEvents = result.recordsets;
            var currentdate=new Date(); 
    logger.write("\r\n"+"GetPublishOnlineEvents :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishOnlineEvents:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
        }); */
        pool.request()
             .execute('spGetEventForSlider', (err, result) => {
                 getjson.EventForSlider = result.recordsets;
            var currentdate=new Date(); 
    var currentdate=new Date(); 
    logger.write("\r\n"+"GetEventForSlider :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetEventForSlider:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
        });
        // pool.request()
             // .execute('spGetProductByDate', (err, result) => {
                 // getjson.ProductByDate = result.recordsets;        
        // });
        pool.request()
            .execute('spGetCategory', (err, result) => {
            getjson.category = result.recordsets;
           var currentdate=new Date(); 
    logger.write("\r\n"+"GetCategory :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetCategory:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            });

        pool.request()
            .execute('spGetDetails', (err, result) => {
            getjson.GetDetails = result.recordsets;
       var currentdate=new Date(); 
    logger.write("\r\n"+"GetDetails :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            });
		pool.request()
            .execute('SPGetNewsletter', (err, result) => {
                getjson.NewsletterContent = result.recordsets;
        var currentdate=new Date(); 
    logger.write("\r\n"+"GetNewsletter :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetNewsletter:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
            });	
        pool.request()
            .execute('spGetEmailConfiguration', (err, result) => {
                getjson.EmailInfo = result.recordsets;
  var currentdate=new Date(); 
    logger.write("\r\n"+"GetEmailConfiguration :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetEmailConfiguration:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            });	
        pool.request()
            .execute('spGetPublishCategory', (err, result) => {
                getjson.Publishcategory = result.recordsets;
var currentdate=new Date(); 
    logger.write("\r\n"+"GetPublishCategory :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishCategory:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            });
        pool.request()
            .execute('sp_GetCustomMenuRoute', (err, result) => {
            getjson.CustomRoutes = result.recordsets;
 var currentdate=new Date(); 
    logger.write("\r\n"+"GetCustomMenuRoute :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetCustomMenuRoute:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            });

        pool.request()
            .execute('spGetDisCollect', (err, result) => {
                getjson.DiscoverCollectible = result.recordsets;
 var currentdate=new Date(); 
    logger.write("\r\n"+"GetDisCollect :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetDisCollect:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");   
            });
        pool.request()
            .execute('spGetSelling', (err, result) => {
                getjson.Sell = result.recordsets;
   var currentdate=new Date(); 
    logger.write("\r\n"+"GetSelling :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetSelling:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
            });
        pool.request()
            .execute('spPublishSelling', (err, result) => {
                getjson.publishSell = result.recordsets;
     var currentdate=new Date(); 
    logger.write("\r\n"+"PublishSelling :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PublishSelling:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
            });
        pool.request()
            .execute('spGetContactDetails', (err, result) => {
                getjson.ContactusContent = result.recordsets;
    var currentdate=new Date(); 
    logger.write("\r\n"+"GetContactDetails :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetContactDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");   
            });
			pool.request()
            .execute('spGetPublishContactDetails', (err, result) => {
                getjson.ContactusPublishContent = result.recordsets;
    var currentdate=new Date(); 
    logger.write("\r\n"+"GetPublishContactDetails :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishContactDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");       
            });
        pool.request()
            .execute('getDiscoverMedium', (err, result) => {
                getjson.DiscoverMedium = result.recordsets;
 var currentdate=new Date(); 
    logger.write("\r\n"+"getDiscoverMedium :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"getDiscoverMedium:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");    
            });

        // pool.request()       
        // .execute('sp_GetProduct',(err,result)=>{
        // getjson.ProductList = result.recordsets;                            
        // });
        pool.request()
            .execute('spPublishLoginPopUp', (err, result) => {
            getjson.PublishLoginPopUp = result.recordsets;
  var currentdate=new Date(); 
    logger.write("\r\n"+"PublishLoginPopUp :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PublishLoginPopUp:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");   
            });
        pool.request()
            .execute('spGetNoPublish', (err, result) => {
                getjson.Publishfooter = result.recordsets;
 var currentdate=new Date(); 
    logger.write("\r\n"+"GetNoPublish :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetNoPublish:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");         
            });
        pool.request()
            .execute('spGetArts', (err, result) => {
            getjson.Arts = result.recordsets;
  var currentdate=new Date(); 
    logger.write("\r\n"+"spGetArts :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"spGetArts:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");    
            });
        pool.request()
            .execute('spGetPublishArts', (err, result) => {
                getjson.PublishArts = result.recordsets;
   var currentdate=new Date(); 
    logger.write("\r\n"+"GetPublishArts :-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishArts:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");      
            });
        pool.request()
            .execute('spGetReturns', (err, result) => {
            getjson.Returns = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetReturns:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetReturns:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
            });
        pool.request()
            .execute('spGetPublishReturns', (err, result) => {
                getjson.PublishReturns = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishReturns:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishReturns:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");               
            });
        pool.request()
    .execute('sp_GetProductDetails', (err, result) => {
            getjson.Product = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetProductDetails:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetProductDetails:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");          
        });
        pool.request()
            .execute('spGetEventproduct', (err, result) => {
                getjson.EventProduct = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetEventproduct:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetEventproduct:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");   
});
pool.request()
            .execute('spGetCollectibleproduct', (err, result) => {
                getjson.collProduct = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");   
});        
        pool.request()
                    .execute('spGetPublishedEventproduct', (err, result) => {
                        getjson.PublishedEventProduct = result.recordsets;
            var currentdate=new Date(); 
  logger.write("\r\n"+"GetPublishedEventproduct:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishedEventproduct:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");      
        });
        pool.request()
            .execute('sp_GetPublishArtist', (err, result) => {
            getjson.PublishArtistList = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishArtist:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishArtist:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");         
            });
        pool.request()
            .execute('spGetArtistProfile', (err, result) => {
            getjson.ArtistProfile = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"GetArtistProfile:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetArtistProfile:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");         
            });
        pool.request()
                    .execute('spGetDeletedArtist', (err, result) => {
                        getjson.DeletedArtist = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetDeletedArtist:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetDeletedArtist:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");    
                });
        pool.request()
        .execute('spGetDeletedProduct', (err, result) => {
        getjson.DeletedProduct = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"GetDeletedProduct:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetDeletedProduct:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");       
        });
             pool.request()
            .execute('spGetCorporate', (err, result) => {
                getjson.Corporate = result.recordsets;
      var currentdate=new Date();         
    logger.write("\r\n"+"GetCorporate:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetCorporate:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");   
            });
        pool.request()
            .execute('spPublishCorporate', (err, result) => {
            getjson.PublishCorporate = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"PublishCorporate:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PublishCorporate:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");   
            });
        pool.request()
            .execute('spGetPublishMedium', (err, result) => {
            getjson.PublishMedium = result.recordsets;
var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishMedium:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishMedium:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");    
            });
        pool.request()
            .execute('spGetMedium', (err, result) => {
                getjson.Medium = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetMedium:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetMedium:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
            });
        pool.request()
            .execute('spGetPublishGenre', (err, result) => {
            getjson.PublishGenera = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishGenre:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishGenre:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");     
            });
        pool.request()
            .execute('spGetGenre', (err, result) => {
            getjson.Genera = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetGenre:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetGenre:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");    
            });
        pool.request()
            .execute('spGetPublishedAboutHeader', (err, result) => {
                getjson.PublishAboutHeader = result.recordsets;
 var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishedAboutHeader:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishedAboutHeader:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");     
            });
        pool.request()
            .execute('spGetAboutHeader', (err, result) => {
            getjson.AboutHeader = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetAboutHeader:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetAboutHeader:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
            });

        pool.request()
           .execute('spGetMenuDetails', (err, result) => {
            getjson.TopMenu = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"GetMenuDetails:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetMenuDetails:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
            });
        
        pool.request()
            .execute('spGetPublishCollectible', (err, result) => {
            getjson.Publishcollectible = result.recordsets;
var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishCollectible:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishCollectible:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            });
        pool.request()
            .execute('spGetCollectible', (err, result) => {
            getjson.collectible = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetCollectible:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetCollectible:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");      
            });
        pool.request()
            .execute('spGetTestimonialList', (err, result) => {
            getjson.Testimonial = result.recordsets;
 var currentdate=new Date();         
    logger.write("\r\n"+"GetTestimonialList:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetTestimonialList:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
            });
        pool.request()
            .execute('spGetPublishedTestimonialList', (err, result) => {
            getjson.PublishTestimonial = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishedTestimonialList:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishedTestimonialList:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");          
            });
        pool.request()
            .execute('spGetPublishedSlider', (err, result) => {
            getjson.publishSlider = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishedSlider:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishedSlider:-error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");         
            });
        pool.request()
            .execute('spGetSlider', (err, result) => {
            getjson.Slider = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"GetSlider:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetSlider:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
            });
        pool.request()
            .execute('spPublishedMedium', (err, result) => {
            getjson.PublishedDiscoverMedium = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"PublishedMedium:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PublishedMedium:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");            
            });
        pool.request()
            .execute('spPublishedCollectible', (err, result) => {
                getjson.PublishedDiscoverCollectible = result.recordsets;
        var currentdate=new Date();         
    logger.write("\r\n"+"PublishedCollectible:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PublishedCollectible:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");              
            });
        pool.request()
            .execute('getDiscoverMedium', (err, result) => {
            getjson.DiscoverMedium = result.recordsets;
         var currentdate=new Date();         
    logger.write("\r\n"+"getDiscoverMedium:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"getDiscoverMedium:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");     
            });
        // pool.request()       
        // .execute('sp_GetOurStory',(err,result)=>{
        // getjson.OurStory = result.recordsets;                      
        // });
        pool.request()
            .execute('spGetDisCollect', (err, result) => {
            getjson.DiscoverCollectible = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetDisCollect:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetDisCollect:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");      
            });

        pool.request()
            .execute('spGetFooter', (err, result) => {
            getjson.Footer = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetFooter:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetFooter:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
            });

        pool.request()
            .execute('sp_GetActiveFooter', (err, result) => {
            getjson.ActiveFooter = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"GetActiveFooter:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetActiveFooter:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");       
            });
        pool.request()
            .execute('spGetNoPublish', (err, result) => {
            getjson.Publishfooter = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetNoPublish:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetNoPublish:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");              
            });
        pool.request()
            .execute('spGetPublishBlog', (err, result) => {
            getjson.PublishedBlog = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishBlog:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishBlog:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");              
        });
        pool.request()
            .execute('spGetBlog', (err, result) => {
            getjson.Blog = result.recordsets;
     var currentdate=new Date();         
    logger.write("\r\n"+"GetBlog:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetBlog:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");     
            });
        pool.request()
            .execute('spGetContent', (err, result) => {
            getjson.AboutusContent = result.recordsets;
     var currentdate=new Date();         
    logger.write("\r\n"+"GetContent:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetContent:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");       
            });
        pool.request()
            .execute('spGetPublishContent', (err, result) => {
            getjson.PublishAboutusContent = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishContent:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishContent:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");       
            });

        pool.request()
            .execute('getContactUS', (err, result) => {
            getjson.ContactUsData = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"getContactUS:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"getContactUS:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");          
            });
        pool.request()
            .execute('spGetpublishedTrend', (err, result) => {
            getjson.PublishTrending = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetpublishedTrend:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetpublishedTrend:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");              
            });
        pool.request()
            .execute('spGetExchangeRate', (err, result) => {
            getjson.DataPrice = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetExchangeRate:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetExchangeRate:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");       
            });
        pool.request()
            .execute('spGetEmail', (err, result) => {
            getjson.DataEmail = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetEmail:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetEmail:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");     
            });
        pool.request()
            .execute('spGetTrending', (err, result) => {
            getjson.Trending = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetTrending:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetTrending:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");      
            });
        pool.request()
            .execute('spGetEventPopUp', (err, result) => {
            getjson.EventData = result.recordsets;
   var currentdate=new Date();         
    logger.write("\r\n"+"GetEventPopUp:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetEventPopUp:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");              
            });

        pool.request()
            .execute('spPublishEventPopUp', (err, result) => {
                getjson.PublishEventData = result.recordsets;
 var currentdate=new Date();         
    logger.write("\r\n"+"PublishEventPopUp:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PublishEventPopUp:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");    
        });

        pool.request()
            .execute('spGetLoginPopUp', (err, result) => {				
            getjson.LoginData = result.recordsets;
  var currentdate=new Date();         
    logger.write("\r\n"+"GetLoginPopUp:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetLoginPopUp:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
            });
        pool.request()
            .execute('spGetPublishTeam', (err, result) => {
            getjson.publishTeam = result.recordsets;
    var currentdate=new Date();         
    logger.write("\r\n"+"GetPublishTeam:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetPublishTeam:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");             
            });
        pool.request()
            .execute('spGetTeam', (err, result) => {
            getjson.Team = result.recordsets;
var currentdate=new Date();         
    logger.write("\r\n"+"GetTeam:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetTeam:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");                
            });
        pool.request()
            .execute('spGetRegisterUser', (err, result) => {
            getjson.RegisterUser = result.recordsets;
              res.send(getjson);
   var currentdate=new Date();         
    logger.write("\r\n"+"GetRegisterUser:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetRegisterUser:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");  
            });
        
pool.request()
            .execute('GetActivatedEvent', (err, result) => {
                getjson.Redirection = result.recordsets;
   var currentdate=new Date(); 
    logger.write("\r\n"+"Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
            });
    });
    }
    catch(ex){
        console.log(ex.message);
    }

});

//API is used to get output with parameter

            nodeapp.post("/api/GetWitParm", function (req, res, next) {
                try{
                switch (req.body.postType) {
                    case "CheckEmaildExit":
          
                        const pool_CheckEmailAuthenication = new sql.ConnectionPool(config, err => {
                            pool_CheckEmailAuthenication.request()
                                .input('EmailId', sql.NVarChar(255), req.body.AuthenticateEmaild)
                                .execute('spCheckEmailExit', (err, result) => {
 var currentdate=new Date();         
    logger.write("\r\n"+"CheckEmaildExit:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"CheckEmaildExit:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");  
                               // console.log("output....."+result.recordset[0].TotalCount);
                                if(result==undefined || result.recordset[0].TotalCount <1){
									if(result==undefined){
									 result=[];	
									}
									else{
                                   result.recordset[0]="Empty";
                                    result.recordset[0]="EmailEmpty";
                                    }
                                }
                                else{
                                    result.recordset[0].returnType="ExistEmail";
                                }
                                res.send(result.recordset);
                                        
                }); 
            });
break;
    case "EventTypeoption":
                        const pool_CheckEventTypeoption = new sql.ConnectionPool(config, err => {
                            pool_CheckEventTypeoption.request()
                                .input('EventType', sql.NVarChar(255), req.body.EventType)
                                .execute('spGetEventForLookUp', (err, result) => {
                                console.log("Result is"+JSON.stringify(result));
                                console.log("Error is"+JSON.stringify(err));
                                if(result==undefined || result.recordset[0].TotalCount <1){
									if(result==undefined){
									 result=[];	
									}
									else{
                                   result.recordset[0]="Empty";
                                    result.recordset[0]="EmailEmpty";
                                    }
                                }
                                else{
                                    result.recordset[0].returnType="ExistEvent";
                                }
                                res.send(result.recordset);
                                        
                }); 
            });
break;  
case "TrendEventTypeoption":
                        const pool_TrendEventTypeoption= new sql.ConnectionPool(config, err => {
                            pool_TrendEventTypeoption.request()
                                .input('EventType', sql.NVarChar(255), req.body.EventType)
                                .execute('spGetEventForLookUp', (err, result) => {
                                console.log("Result is"+JSON.stringify(result));
                                console.log("Error is"+JSON.stringify(err));
                                if(result==undefined || result.recordset[0].TotalCount <1){
									if(result==undefined){
									 result=[];	
									}
									else{
                                   result.recordset[0]="Empty";
                                    result.recordset[0]="EmailEmpty";
                                    }
                                }
                                else{
                                    result.recordset[0].returnType="ExistTrendEvent";
                                }
                                res.send(result.recordset);
                                        
                }); 
            });
break;  
case "SliderEventTypeoption":
                        const pool_SliderEventTypeoption= new sql.ConnectionPool(config, err => {
                            pool_SliderEventTypeoption.request()
                                .input('EventType', sql.NVarChar(255), req.body.EventType)
                                .execute('spGetEventForLookUp', (err, result) => {
                                console.log("Result is"+JSON.stringify(result));
                                console.log("Error is"+JSON.stringify(err));
                                if(result==undefined || result.recordset[0].TotalCount <1){
									if(result==undefined){
									 result=[];	
									}
									else{
                                   result.recordset[0]="Empty";
                                    result.recordset[0]="SliderEmpty";
                                    }
                                }
                                else{
                                    result.recordset[0].returnType="ExistSliderEvent";
                                }
                                res.send(result.recordset);
                                        
                }); 
            });
break; 
                           
 case "CheckAdmin":
          
                 const pool_CheckAdmin = new sql.ConnectionPool(config, err => {
                    pool_CheckAdmin.request()
                    .input('email', sql.NVarChar(255), req.body.EmailId)
                    .input('pwd', sql.NVarChar(255), req.body.pwd)
                    .execute('spGetSingleAdmin', (err, result) => {
  var currentdate=new Date();         
    logger.write("\r\n"+"CheckAdmin:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"CheckAdmin:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        if(result==undefined || empty(result.recordset[0])){
							if(result==undefined){
								result=[];
							}else{
								result.recordset[0]={};
                        result.recordset[0].returnType="Empty";
                        result.recordset[0].taskStatus="AdminEmpty";
							}
                        }
                             else{
                                 result.recordset[0].returnType="AdminEmail";
                               }  
                        res.send(result.recordset);
                                        
                        }); 
                      });
                        break;
 case "FetchAdmin":
          
	const pool_FetchAdmin = new sql.ConnectionPool(config, err => {
		pool_FetchAdmin.request()
			.input('email', sql.NVarChar(255), req.body.EmailId)
			.execute('spGetSingleAdminDetails', (err, result) => {
             var currentdate=new Date();     
     logger.write("\r\n"+"FetchAdmin:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"FetchAdmin:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
				if(result==undefined || empty(result.recordset[0])){
					if(result==undefined){
						reult=[];
					}
					else{
						result.recordset[0]={};
				result.recordset[0].returnType="Empty";
				result.recordset[0].taskStatus="AdminDetailsEmpty";
					}
				
			 
					}
			else{
				result.recordset[0].returnType="AdminDetailEmail";
			}  
				res.send(result.recordset);
					
                        }); 
                        });
                        break;
 case "getAllWishlist": 
const pool_WiselistDetails = new sql.ConnectionPool(config, err => {
    pool_WiselistDetails.request()
        .input('AuthenticateUserWiselist', sql.NVarChar(255), req.body.AuthenticateEmaild)
        .execute('sp_GetAllProductByUser', (err, result) => {
         var currentdate=new Date();     
 logger.write("\r\n"+"getAllWishlist:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"getAllWishlist:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            if(result==undefined || empty(result.recordset[0])){
				if(result==undefined){
					result=[];
				}else{
					result.recordset[0]={};
result.recordset[0].returnType="Empty";
result.recordset[0].taskStatus="WishlistEmpty";
				}
            
}
else
{
            result.recordset[0].returnType="Wishlist";        
}
res.send(result.recordset);
});
});
break;
case "getAllNewArrival":
const pool_NewArrivallist=new sql.ConnectionPool(config, err=>{
	pool_NewArrivallist.request()
	.input('EmailId', sql.NVarChar(255), req.body.AuthenticateEmaild)
	        .execute('spGetProductByDate', (err, result) => {
         var currentdate=new Date();     
   logger.write("\r\n"+"getAllNewArrival:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"getAllNewArrival:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            if(result==undefined || empty(result.recordset[0])){
				if(result==undefined){
					result=[];
				}else{
					result.recordset[0]={};
result.recordset[0].returnType="Empty";
result.recordset[0].taskStatus="NewArrivalEmpty";
				}            
}
else
{
   result.recordset[0].returnType="NewArrival";        
}
console.log("Result for get by date"+JSON.stringify(result));
res.send(result.recordset);
});
	
});
break;
case "Get_EventDetails":
	const pool_EventsDetails = new sql.ConnectionPool(config, err => {    
		pool_EventsDetails.request()        
			.input('Id', sql.Int, req.body.ID) 
		.input('Email' , sql.NVarChar(255), req.body.Email)
			.execute('spGetPublishOfflineEvents', (err, result) => {  
    var currentdate=new Date();     
   logger.write("\r\n"+"Get_EventDetails:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Get_EventDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
				console.log("Event Details ...."+JSON.stringify(result)); 
if(result==undefined || empty(result.recordsets[0][0])){
	if(result==undefined){
		result=[];
	}else{
		result.recordsets[0]={};
    result.recordsets[0].returnType="Empty";
    result.recordsets[0].taskStatus="ExhibitionEmpty"; 
	}
                     
}
// else{
    // res.send(result.recordsets);                       
// }
res.send(result.recordsets); 
});
});             
break;
case "GlobalSearch":
console.log("Result is-" + JSON.stringify(req.body));
const pool_GlobalSearch = new sql.ConnectionPool(config, err=> {
    pool_GlobalSearch.request()
        .input('Search', sql.NVarChar(255), req.body.SearchContent)
        .execute('sp_GlobalSearch', (err, result) => {
  var currentdate=new Date();     
   logger.write("\r\n"+"GlobalSearch:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GlobalSearch:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
            if(result==undefined || empty(result.recordsets[0][0])){
				if(result==undefined){
					result=[];
				}else{
				result.recordsets[0]={};
            result.recordsets[0].returnType="Empty";
            result.recordsets[0].taskStatus="GlobalSearchEmpty";
				}
            
}
else{
    result.recordsets[0][0].returnType="GlobalSearch";        
}
                  
res.send(result.recordsets);
});
});
break;



case "GetOurStoryCustomRecord":
const pool_CustomOurStoryList = new sql.ConnectionPool(config, err => {
    pool_CustomOurStoryList.request()
        .input('Id', sql.Int, req.body.ID)
        .execute('spGetCustomOurStory', (err, result) => {
var currentdate=new Date();     
   logger.write("\r\n"+"GetOurStoryCustomRecord:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetOurStoryCustomRecord:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
            if(result==undefined || empty(result.recordsets[0])){
				if(result==undefined){
					result=[];
				}else{
					result.recordsets[0]={};
             result.recordsets[0].returnType="Empty";
             result.recordsets[0].taskStatus="PageReturnEmpty";
				}
             
            }
           else{
         result.recordset[0].returnType = "OurStoryCustomList";    
}
res.send(result.recordset);

});
});
break;
		case "NewsLetterById":	
		
		const pool_NewsLetterbyId = new sql.ConnectionPool(config, err => {
                pool_NewsLetterbyId.request()
				.input('Id',sql.Int,req.body.ID)
				.execute('spGetNewsLetterById',(err,result)=> {
    var currentdate=new Date();     
   logger.write("\r\n"+"NewsLetterById:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"NewsLetterById:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
					if (result==undefined || result.rowsAffected[0] <1) {
						if(result==undefined){
							result=[];
						}else{
							result.recordset[0].returnType = "NewsLetterList";
                            res.send(result.recordset);
						}
                            
                        }
                        // else {
                            // res.send(result.recordset);
                        // }
res.send(result.recordset);
                       
				});
		});	
		break;
			
        case "ProductByArtist":
            const pool_ProductList = new sql.ConnectionPool(config, err => {
                pool_ProductList.request()
                .input('ID', sql.Int, req.body.ID)                
                    .execute('spGetProductByID', (err, result) => {
 var currentdate=new Date();     
   logger.write("\r\n"+"ProductByArtist:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"ProductByArtist:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        if (result==undefined|| empty(result.rowsAffected[0])) {
							if(result==undefined){
								result=[];
								
                            res.send(result);
							}
							else{
                         result.recordset[0]={};
                             result.recordset[0].returnType = "Empty";
                            res.send(result.recordset);
                        }
						}
                            else {
                            result.recordset[0].returnType = "ProductList";
                            res.send(result.recordset);
                        }
                            
                       
                    });
            });
            break;
        case "GetProdcutGallary":
            const pool_ProductGallary = new sql.ConnectionPool(config, err => {
                pool_ProductGallary.request()
                    .input('Id', sql.Int, req.body.ID)
                    .input('tableName', sql.NVarChar(255), req.body.tblname)
                    .input('EmailId', sql.NVarChar(255), req.body.EmailId)
                    .execute('sp_GetProduct', (err, result) => {
  var currentdate=new Date();     
   logger.write("\r\n"+"GetProdcutGallary:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetProdcutGallary:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        if(result==undefined || empty(result.recordset[0])){
							if(result==undefined){
								result=[];
							}else{
								result.recordset[0]={};
                    result.recordset[0].returnType="Empty";
                    result.recordset[0].taskStatus="ProductGalleryEmpty";
							}
                    
}
else{
        result.recordset[0].returnType = "ProductGallary";
}
   res.send(result.recordset);
                    });
            });
            break;
        case "ArtistProfile":
            const pool_ArtistProfile = new sql.ConnectionPool(config, err => {
                pool_ArtistProfile.request()
                    .input('Id', sql.Int, req.body.ID)
                    .execute('sp_GetArtistProfile', (err, result) => {
  var currentdate=new Date();     
   logger.write("\r\n"+"ArtistProfile:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"ArtistProfile:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        console.log("result is:-"+JSON.stringify(result))
                        if(result==undefined || empty(result.recordset[0])){
							if(result==undefined){
								result=[];
							}else{
								result.recordset[0]={};
                         result.recordset[0].returnType="Empty";
                         result.recordset[0].taskStatus="ArtistDetailsEmpty";
							}
                         
        }
else{
    result.recordset[0].returnType = "ArtistProfileDetail";
}
                        res.send(result.recordsets);
                    });
            });
            break;
        case "UserDetails":
            const pool_User = new sql.ConnectionPool(config, err => {
                pool_User.request()
                    .input('EmailId', sql.NVarChar(255), req.body.EmailId)
                    .execute('spGetUserDetails', (err, result) => {
  var currentdate=new Date();     
   logger.write("\r\n"+"UserDetails:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UserDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
            if(result==undefined || empty(result.recordset[0]))
            {
				if(result==undefined){
					result=[];
				}else{
					result.recordset[0]={};
                result.recordset[0].returnType="Empty";
                result.recordset[0].taskStatus="UserDetailsEmpty";
				}
                
            }
            else{
                result.recordset[0].returnType = "UserDetail";
            }
            res.send(result.recordset);
                    });
            });
            break;
case "PricedProduct":
            const pool_Pricedproduct = new sql.ConnectionPool(config, err => {
                pool_Pricedproduct.request()
                    .input('selectedRange', sql.NVarChar(255), req.body.selectedRange)
					.input('EmailId', sql.NVarChar(255), req.body.AuthenticateEmaild)
                    .execute('spGetProductByPrice', (err, result) => {
   var currentdate=new Date();     
   logger.write("\r\n"+"PricedProduct:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PricedProduct:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        if(result==undefined || empty(result.recordset[0]))
            {
				if(result==undefined){
					result=[];
				}else{
					result.recordset[0]={};
            result.recordset[0].returnType="Empty";
            result.recordset[0].taskStatus="ProductEmpty";
				}
                
            }
            else{
                result.recordset[0].returnType = "PricedProduct";
            }
            res.send(result.recordset);
            });
            });
            break;
            case "GetSecurityQuestion":
            const pool_UserQuestion = new sql.ConnectionPool(config, err => {
                pool_UserQuestion.request()
                    .input('EmailId', sql.NVarChar(255), req.body.EmailId)
                    .execute('spGetSecurityQuestion', (err, result) => {
  var currentdate=new Date();     
   logger.write("\r\n"+"GetSecurityQuestion:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetSecurityQuestion:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        if(result==undefined || empty(result.recordset[0]))
            {
				if(result==undefined){
					result=[];
				}else{
					result.recordset[0]={};
            result.recordset[0].returnType="Empty";
            result.recordset[0].taskStatus="UserQuestionEmpty";
				}
                
            }
            else{
                result.recordset[0].returnType = "GetSecurityQuestion";
            }
            res.send(result.recordset);
            });
            });
            break;

        case "ProductDetails":
            console.log("body is:-"+JSON.stringify(req.body));
            const pool_ProductDetails = new sql.ConnectionPool(config, err => {
                pool_ProductDetails.request()
                    .input('Authenticate_Email',sql.NVarChar(255),req.body.AuthEmail)
                    .input('Id', sql.Int, req.body.ID)
                    .input('event_id',sql.NVarChar(255),req.body.event_id)
				    /*.input('ProductType',sql.NVarChar(255),req.body.ProductType)*/
                    .execute('sp_GetSingleProduct', (err, result) => {
  var currentdate=new Date();     
   logger.write("\r\n"+"ProductDetails:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"ProductDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                if(result==undefined || empty(result.recordset[0])){
					if(result==undefined){
						result=[];
						console.log("Result is:-" +result);
					}
                    else{
						result.recordset[0]={};
        result.recordset[0].returnType="Empty";
        result.recordset[0].taskStatus="ProductGalleryEmpty";
		console.log("Result is:-" +result);
					}
                    
        
         }
        else{
            result.recordsets[0][0].returnType = "ProductDetail";

            
        }console.log("result is-"+JSON.stringify(result));
                    res.send(result.recordsets);
                    });
            });
            break;
case "CollectibleProductDetails":
            console.log("body is:-"+JSON.stringify(req.body));
            const pool_CollectibleProductDetails = new sql.ConnectionPool(config, err => {
                pool_CollectibleProductDetails.request()
                    .input('Authenticate_Email',sql.NVarChar(255),req.body.AuthEmail)
                    .input('Id', sql.Int, req.body.ID)
				  /*  .input('ProductType',sql.NVarChar(255),req.body.ProductType)*/
                    .execute('sp_GetSingleCollectibleProduct', (err, result) => {
  var currentdate=new Date();     
   logger.write("\r\n"+"Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                if(result==undefined || empty(result.recordset[0])){
					if(result==undefined){
						result=[];
						console.log("Result is:-" +result);
					}
                    else{
						result.recordset[0]={};
        result.recordset[0].returnType="Empty";
        result.recordset[0].taskStatus="ProductGalleryEmpty";
		console.log("Result is:-" +result);
					}
                    
        
         }
        else{
            result.recordsets[0][0].returnType = "CollectibleProductDetail";

            
        }console.log("result is-"+JSON.stringify(result));
                    res.send(result.recordsets);
                    });
            });
            break;
        case "GetFooterSingleRecord":
            const pool_FooterSingleRecord = new sql.ConnectionPool(config, err => {
                pool_FooterSingleRecord.request()
                    .input('Id', sql.Int, req.body.ID)
                    .execute('spGetSingleRecord', (err, result) => {
 var currentdate=new Date();     
   logger.write("\r\n"+"GetFooterSingleRecord:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GetFooterSingleRecord:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
						if(result==undefined || empty(result.recordset[0])){
							if(result==undefined){
								result=[];
							}else{
							result.recordset[0]={};
                            result.recordset[0].returnType="Empty";
							result.recordset[0].taskStatus ="FooterSingleRecordEmpty";
							}
						}
							else{
								
                        result.recordset[0].returnType = "FooterSingleRecord";
							}
                        res.send(result.recordset);
                    });
            });
            break;


    }
                }
                catch(ex)
                    {
                        console.log(ex.message);
                    }
});


//API is used to Add all Categories data in DB
var postgetjson = {};
nodeapp.post("/api/postCategories", function (req, res, next) {
    //Category
    try{

    switch (req.body.postType) {
        case "AddWishlist":
            console.log("Data is:-"+JSON.stringify(req.body));
            const pool_AddWishlist = new sql.ConnectionPool(config, err => {
            pool_AddWishlist.request()
                .input('AuthenticateEmail', sql.NVarChar(255), req.body.AuthenticateEmail)
                .input('wishlistitem', sql.Int, req.body.ProductId)
				.input('PersonId',sql.NVarChar(255),req.body.PersonId)               
                .execute('sp_AddWishlist', (err, result) => {
                postgetjson.categoryrowaffacted = result.rowsAffected;
            res.send(postgetjson);
    var currentdate=new Date();     
   logger.write("\r\n"+"AddWishlist:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"AddWishlist:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");  
           
});
});
break;

        case "Category":
            const pool_Category = new sql.ConnectionPool(config, err => {
                pool_Category.request()
                    .input('category_name', sql.NVarChar(255), req.body.categoryName)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription) 
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)                    
                    .execute('spCategory', (err, result) => {
                    postgetjson.categoryrowaffacted = result.recordsets;
                        res.send(postgetjson);
    var currentdate=new Date();     
   logger.write("\r\n"+"Category:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Category:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");  
        
                    });
            });
break;



        case "AddPrice":
            
            const pool_Price = new sql.ConnectionPool(config, err => {
                pool_Price.request()
                    .input('dollar', sql.NVarChar(255), req.body.pricedollar)
                    .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spAddExchangeRate', (err, result) => {
                     postgetjson.pricerowaffacted = result.recordsets;                        
                        res.send(postgetjson);
    var currentdate=new Date();                 
     logger.write("\r\n"+"AddPrice:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"AddPrice:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");  
                    });
            });
            break;
case "AddEmail":
           
            const pool_mail = new sql.ConnectionPool(config, err => {
                pool_mail.request()
                    .input('Email', sql.NVarChar(255), req.body.Email)
                    .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spAddEmail', (err, result) => {
  var currentdate=new Date();                 
     logger.write("\r\n"+"AddEmail:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"AddEmail:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");  
                        postgetjson.Emailrowaffacted = result.recordsets;
                        
                        res.send(postgetjson);
                    });
            });
            break;
case "AddNewEmail":
            console.log("data is "+JSON.stringify(req.body));
            const pool_Email = new sql.ConnectionPool(config, err => {
                pool_Email.request()
                    .input('UserEmail', sql.NVarChar(255), req.body.usermail)
					.input('UserPassword', sql.NVarChar(255), req.body.upassword)
					.input('ToEmail', sql.NVarChar(255), req.body.tomail)
                    .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spEmailConfiguration', (err, result) => {
	 var currentdate=new Date();                 
     logger.write("\r\n"+"AddNewEmail:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"AddNewEmail:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
					 postgetjson.emailrowaffacted = result.recordsets;
					 
                        res.send(postgetjson);
                    });
            });
            break;
        case "Medium":
            const pool_Medium = new sql.ConnectionPool(config, err => {
                pool_Medium.request()
                    .input('medium_name', sql.NVarChar(255), req.body.Mediumname)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription) 
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags) 
                    .execute('spInsertMedium', (err, result) => {
                    postgetjson.categoryrowaffacted = result.recordsets;
                        res.send(postgetjson);
   var currentdate=new Date();                 
     logger.write("\r\n"+"Medium:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Medium:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");     
                    });
            });
            break;

        case "Genera":
            const pool_Genera = new sql.ConnectionPool(config, err => {
                pool_Genera.request()
                    .input('genre_name', sql.NVarChar(255), req.body.genreName)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription) 
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle) 
                    .execute('spGenre', (err, result) => {        
                        postgetjson.categoryrowaffacted = result.recordsets;
                        res.send(postgetjson);
 var currentdate=new Date();                 
     logger.write("\r\n"+"Genera:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Genera:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");      
                    });
            });
            break;
        //Contact us form
        case "ContactUs":
            const pool_ContactUS = new sql.ConnectionPool(config, err => {
                pool_ContactUS.request()
                    .input('Fname', sql.NVarChar(255), req.body.Fname)
                    .input('Lname', sql.NVarChar(255), req.body.LName)
                    .input('phone_no', sql.NVarChar(255), req.body.Phone)
                    .input('email', sql.NVarChar(255), req.body.Email)
                    .input('Message', sql.NVarChar(sql.max), req.body.Message)
                    .execute('spAddContactUs', (err, result) => {
 var currentdate=new Date();                 
     logger.write("\r\n"+"ContactUs:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"ContactUs:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        postgetjson.categoryrowaffacted = result.recordsets;
                        res.send(postgetjson);
                        
                    });

            });
            break;
        //Change password from user side    
        case "UpdatePassword":
            const pool_ChangePassword = new sql.ConnectionPool(config, err => {
                pool_ChangePassword.request()
                    .input('Email', sql.NVarChar(255), req.body.Email)
                    .input('Password', sql.NVarChar(255), req.body.NewPassword)
                    .execute('spChangePassword', (err, result) => {
var currentdate=new Date();                 
     logger.write("\r\n"+"UpdatePassword:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdatePassword:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
                        
                    })
            });

            break;
        //update user through user side
        case "Updateuser":
            const pool_UpdateUsers = new sql.ConnectionPool(config, err => {
                pool_UpdateUsers.request()
                    .input('FirstName', sql.NVarChar(255), req.body.FirstName)
                    .input('LastName', sql.NVarChar(255), req.body.LastName)
                    .input('Email', sql.NVarChar(255), req.body.Email)
                    .input('PhoneNumber', sql.NVarChar(255), req.body.PhoneNumber)
                    .execute('spUpdateUserbyEmail', (err, result) => {
 var currentdate=new Date();                 
     logger.write("\r\n"+"Updateuser:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Updateuser:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
                       
                    });
            });
            break;

        case "Collectible":
            const pool_Collectible = new sql.ConnectionPool(config, err => {
                pool_Collectible.request()
                    .input('collectible_name', sql.NVarChar(255), req.body.Name)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription) 
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                    .execute('spAddCollectible', (err, result) => {
  var currentdate=new Date();                 
     logger.write("\r\n"+"Collectible:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Collectible:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        postgetjson.categoryrowaffacted = result.recordsets;
                        res.send(postgetjson);
                    });
            });
            break;
        case "Testimonial":
            const pool_Testimonial = new sql.ConnectionPool(config, err => {
                pool_Testimonial.request()
                    .input('TestimonialDes', sql.NVarChar(sql.max), req.body.TestimonialDes)
                    .input('AuthorName', sql.NVarChar(sql.max), req.body.AuthorName)
                    .execute('spInsertTestimonial', (err, result) => {
var currentdate=new Date();                 
     logger.write("\r\n"+"Testimonial:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Testimonial:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        postgetjson.categoryrowaffacted = result.recordsets;
                        res.send(postgetjson);
                    });
            });


            break;
case "EventRedirection":
            try{
            console.log("Body is"+JSON.stringify(req.body));
            const pool_EventRedirection = new sql.ConnectionPool(config, err => {
                pool_EventRedirection.request()
                    .input('ID',sql.Int,req.body.ID)
                    .input('EventType', sql.NVarChar(255), req.body.EventType)
                    .input('Event_id', sql.Int, req.body.Event_id)
                     .input('StartDate', sql.NVarChar(255), req.body.StartDate)
                     .input('EndDate', sql.NVarChar(255), req.body.EndDate)
                     .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .execute('InsertActivatedEvent', (err, result) => {
                        var currentdate=new Date();                 
     logger.write("\r\n"+"Event Redirection:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    console.log("\r\n"+"Event Redirection:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        postgetjson.Eventrowaffacted = result.recordsets;
                        res.send(postgetjson);
                    });
            });

                    }
            catch(ex){
                console.log(ex.message);
            }
            break;            
        case "Footer":
            const pool_Footer = new sql.ConnectionPool(config, err => {
                pool_Footer.request()
                    .input('FooterName', sql.NVarChar(255), req.body.Name)
                    .input('FooterURL', sql.NVarChar(255), req.body.TargetURl)
                    .input('Title', sql.NVarChar(255), req.body.Title)
                    .input('Description', sql.NText, req.body.Description)
                    .input('URLType', sql.NVarChar(255), req.body.FooterType)
                     .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('PageURL',sql.NVarChar(sql.max),req.body.PageURL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                    .execute('spInsertFooter', (err, result) => {
  var currentdate=new Date();                 
     logger.write("\r\n"+"Footer:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Footer:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        postgetjson.Footerrowaffacted = result.rowsAffected;
                        
                        res.send(postgetjson);
                    });
            });
            break;
        case "UserRegistration":
            const pool_UserRegistration = new sql.ConnectionPool(config, err => {
                pool_UserRegistration.request()
                    .input('Fname', sql.NVarChar(255), req.body.FirstName)
                    .input('Lname', sql.NVarChar(255), req.body.LastName)
                    .input('phone_no', sql.NVarChar(255), req.body.PhoneNo)
                    .input('email', sql.NVarChar(255), req.body.Email)
                    .input('SecurityQuestion', sql.NVarChar(255), req.body.SecurityQuestion)
                    .input('SecurityAnswer', sql.NVarChar(255), req.body.SecurityAnswer)
                    .input('pwd', sql.NVarChar(255), req.body.Password)
                    .input('SecurityQuestion',sql.NVarChar(255),req.body.SecurityQuestion)
                    .input('SecurityAnswer',sql.NVarChar(255),req.body.SecurityAnswer)
                    .execute('spInsertMaster', (err, result) => {
 var currentdate=new Date();                 
     logger.write("\r\n"+"UserRegistration:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UserRegistration:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        
                        postgetjson.UserRegistrationrowaffacted = result.recordsets;
                        res.send(postgetjson);
                    
                    });
            });
            break;
case "SubscribeUser":
            const pool_SubscribeUser=new sql.ConnectionPool(config,err=>{
                pool_SubscribeUser.request()
                 .input('Fname', sql.NVarChar(255), req.body.FirstName)
                    .input('Lname', sql.NVarChar(255), req.body.LastName)
                    .input('phone_no', sql.NVarChar(255), req.body.PhoneNo)
                    .input('email', sql.NVarChar(255), req.body.subscribemail)
                    .input('SecurityQuestion', sql.NVarChar(255), req.body.SecurityQuestion)
                    .input('SecurityAnswer', sql.NVarChar(255), req.body.SecurityAnswer)
                    .input('pwd', sql.NVarChar(255), req.body.Password)
                    .input('SecurityQuestion',sql.NVarChar(255),req.body.SecurityQuestion)
                    .input('SecurityAnswer',sql.NVarChar(255),req.body.SecurityAnswer)
                .execute('spInsertMaster', (err, result) => {
 var currentdate=new Date();                 
     logger.write("\r\n"+"SubscribeUser:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"SubscribeUser:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        
                        postgetjson.SubscribeUserrowaffacted = result.recordsets;
                        res.send(postgetjson);
                    
                    });
            })
            break;
case "CheckUserAuthentication":
            const pool_CheckUserAuthenication = new sql.ConnectionPool(config, err => {
                pool_CheckUserAuthenication.request()
                    .input('Email', sql.NVarChar(255), req.body.Email)
                    .input('Password', sql.NVarChar(255), req.body.Password)
                    .execute('spExternalUserLogin', (err, result) => {
 var currentdate=new Date();                 
     logger.write("\r\n"+"CheckUserAuthentication:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"CheckUserAuthentication:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        postgetjson.categoryrowaffacted = result.recordsets;
                        res.send(postgetjson);
                    });
            });
            break;
case "addDetails":
                const pool_Details=new  sql.ConnectionPool(config,err=>{
                    pool_Details.request()
                    .input('Name',sql.NVarChar(255), req.body.Name)
                    .input('email',sql.NVarChar(255), req.body.Email)
                    .input('phone_no',sql.NVarChar(255), req.body.Phone)
                    .input('Company',sql.NVarChar(255), req.body.Company)
                 .execute('spAddDetails',(err,result)=>{
 var currentdate=new Date();                 
    logger.write("\r\n"+"addDetails:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"addDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                     postgetjson.categoryrowaffacted = result.recordsets;
                res.send(postgetjson);		

            });
            });



}
    }
    catch(ex){
        console.log(ex.message)
    }
});


//API is used to Update Data in DB
var putgetjson = {};
nodeapp.put("/api/putCategories", function (req, res, next) {
    //Category
try{
    switch (req.body.postType) {
        case "UpdatePreCreatedMenu":
            console.log("Body is:-"+JSON.stringify(req.body))
            const pool_UpdatePreCreatedMenu = new sql.ConnectionPool(config, err => {
                pool_UpdatePreCreatedMenu.request()
                .input('MenuName', sql.NVarChar(255), req.body.MenuName)
                 .input('ParentId', sql.Int, req.body.RouteId)
                .input('MenuId', sql.Int, req.body.Id)
                .execute('sp_UpdatePreCreated', (err, result) => {   
                res.send(result);
 var currentdate=new Date();                 
    logger.write("\r\n"+"UpdatePreCreatedMenu:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdatePreCreatedMenu:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");      
    });
});
break;

        case "ActivateDeleted":
                const pool_ActivatedDeleted= new sql.ConnectionPool(config, err => {
                    pool_ActivatedDeleted.request()
                    .input('ID',sql.Int,req.body.ID)
                    .input('Activate',sql.NVarChar(255),req.body.Activate)
                    .execute('spActivate',(err,result)=>{
 var currentdate=new Date();                 
    logger.write("\r\n"+"ActivateDeleted:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"ActivateDeleted:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
        });
        
                        break;
    
        case "ChangeStatus":
                const pool_ChangeStatus= new sql.ConnectionPool(config, err => {
                    pool_ChangeStatus.request()
                    .input('ID',sql.Int,req.body.ID)
                    .input('Status',sql.Bit,req.body.status)
                    .input('TableType',sql.NVarChar(255),req.body.TableType)
                    .execute('spChangeStatus',(err,result)=>{
      logger.write("\r\n"+"Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
        break;
          case "ChangeRights":
          console.log("error-"+JSON.stringify(req.body));
                const pool_ChangeRights= new sql.ConnectionPool(config, err => {
                    pool_ChangeRights.request()
                    .input('ID',sql.Int,req.body.ID)
                    .input('TableType',sql.NVarChar(255),req.body.TableType)
                    .input('Status',sql.Bit,req.body.status)
                    .execute('spChangeRights',(err,result)=>{
  var currentdate=new Date();                 
    logger.write("\r\n"+"ChangeRights:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"ChangeRights:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
        });
        });
        break;
        case "UpdateCategory":
            const pool_UpdateCategory = new sql.ConnectionPool(config, err => {
                pool_UpdateCategory.request()
                    .input('category_name', sql.NVarChar(255), req.body.categoryName)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spUpdateCategory', (err, result) => {
  var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateCategory:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateCategory:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        //putgetjson.categoryrowaffacted = result.recordsets;
                        res.send("Update");
                    });
            });
            break;

        case "UpdatePrice":
            const pool_UpdatePrice = new sql.ConnectionPool(config, err => {
                pool_UpdatePrice.request()
                    .input('dollar', sql.NVarChar(255), req.body.pricedollar)
                    .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spAddExchangeRate', (err, result) => {
                   res.send("Update");
  var currentdate=new Date();                 
    logger.write("\r\n"+"UpdatePrice:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdatePrice:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                    });
            });
            break;
case "Updatmail":
            const pool_UpdateEmaildata = new sql.ConnectionPool(config, err => {
                pool_UpdateEmaildata.request()
                    .input('Email', sql.NVarChar(255), req.body.Email)
                    .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spAddEmail', (err, result) => {         
                        res.send("Update");
  var currentdate=new Date();                 
    logger.write("\r\n"+"Updatmail:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Updatmail:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");      
                    });
            });
break;
case "UpdateEmail":
            const pool_UpdateEmail = new sql.ConnectionPool(config, err => {
                pool_UpdateEmail.request()
                    .input('UserEmail', sql.NVarChar(255), req.body.usermail)
					.input('UserPassword', sql.NVarChar(255), req.body.upassword)
					.input('ToEmail', sql.NVarChar(255), req.body.tomail)
                    .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .input('Id', sql.Int, req.body.Id)
                    .input('ActionType', sql.NVarChar(255), req.body.ActionType)
                    .execute('spEmailConfiguration', (err, result) => {
                    var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateEmail:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateEmail:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                        
                    });
            });
            break;
        case "PublishRecord":
            console.log("Publish Record..." + JSON.stringify(req.body));
            const pool_updatePublish = new sql.ConnectionPool(config, err => {
                pool_updatePublish.request()
                    .input('Id', sql.Int, req.body.publishId)
                    .input('tableRecordPublish', sql.NVarChar(255), req.body.Publish)
                    .input('PublishTrue', sql.Int, req.body.PublishStatus)
                    .execute('spPublish', (err, result) => {
                    putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
   var currentdate=new Date(); 
                    console.log("Result is" +JSON.stringify(result));
                     console.log("Error is" +JSON.stringify(err));
    logger.write("\r\n"+"PublishRecord:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PublishRecord:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");        
                    });
            });
            break;
        case "UpdateMedium":
            const pool_UpdateMedium = new sql.ConnectionPool(config, err => {
                pool_UpdateMedium.request()
                    .input('medium_name', sql.NVarChar(255), req.body.Name)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription) 
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spUpdateMedium', (err, result) => {
  var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateMedium:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateMedium:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");  
                        res.send("a");
                    });
            });
            break;

        case "UpdateGenera":
            const pool_UpdateGenera = new sql.ConnectionPool(config, err => {
                pool_UpdateGenera.request()
                    .input('genre_name', sql.NVarChar(255), req.body.Name)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription) 
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spUpdateGenre', (err, result) => {
                    logger.write("Result is" +JSON.stringify(result)) 
                    res.send(putgetjson);
   var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateGenera:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateGenera:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");         
                    });
            });
            break;

        case "UpdateCollectible":
            const pool_UpdateCollectible = new sql.ConnectionPool(config, err => {
                pool_UpdateCollectible.request()
                    .input('collectible_name', sql.NVarChar(255), req.body.Name)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription) 
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('URL',sql.NVarChar(sql.max),req.body.URL)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spUpdateCollectibles', (err, result) => {
                    putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
   var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateCollectible:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateCollectible:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");     
                    });
            });
            break;

        case "UpdateFooter":
            console.log("update Footer API Called...");
            const pool_UpdateFooter = new sql.ConnectionPool(config, err => {
                pool_UpdateFooter.request()
                    .input('FooterName', sql.NVarChar(255), req.body.Name)
                    .input('Id', sql.Int, req.body.Id)
                    .input('FooterTitle', sql.NVarChar(255), req.body.Title)
                    .input('Description', sql.NText, req.body.Description)
                    .execute('spUpdateFooter', (err, result) => {
                //  putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(result);
   var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateFooter:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateFooter:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");       
                    });
            });
            break;

        case "UpdateTestimonial":
            const pool_UpdateTestimonial = new sql.ConnectionPool(config, err => {
                pool_UpdateTestimonial.request()
                    .input('TestimonialDes', sql.NVarChar(sql.max), req.body.TestimonialDes)
                    .input('Id', sql.Int, req.body.Id)
                    .input('AuthorName', sql.NVarChar(sql.max), req.body.AuthoName)
                    .input('TestimonialStatus', sql.NVarChar(255), req.body.TestimonialStatus)
                    .execute('spUpdateTestimonial', (err, result) => {                        
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
  var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateTestimonial:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateTestimonial:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                    });
            });
            break;

        case "UpdateAboutUs":
            const pool_UpdateAboutUs = new sql.ConnectionPool(config, err => {
                pool_UpdateAboutUs.request()
                    .input('Title', sql.NVarChar(255), req.body.contentTitle)
                    .input('ID', sql.Int, req.body.Id)
                    .input('Content', sql.NVarChar(255), req.body.contentData)
                    .execute('spUpdateContent', (err, result) => {                    
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
 var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateAboutUs:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateAboutUs:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                    });
            });
            break;

       /* case "UpdateBlog":
            const pool_UpdateBlog = new sql.ConnectionPool(config, err => {
                pool_UpdateBlog.request()
                    .input('Title', sql.NVarChar(255), req.body.BlogTitle)
                    .input('Quotes', sql.NVarChar(255), req.body.Quote)
                    .input('QuoteWriter', sql.NVarChar(255), req.body.QuoteFrom)
                    .input('Imagepath', sql.NVarChar(255), req.body.Image)
                    .input('Description', sql.NVarChar(255), req.body.Blogdescription)
                    .input('MetaDescription', sql.NVarChar(sql.max),req.body.Metadescription)
                    .input('MetaKeyword', sql.NVarChar(sql.max),req.body.Metakeyword)
                    .input('MetaTitle',sql.NVarChar(sql.max),req.body.Metatitle)
                    .input('PageTitle',sql.NVarChar(sql.max),req.body.PageTitle)
                    .input('AltTags',sql.NVarChar(sql.max),req.body.AltTags)   
                    .input('PublishedDate', sql.Date, req.body.publisheddate)
                    .input('ID', sql.Int, req.body.id)
                    .execute('spUpdateBlog', (err, result) => {                    
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
 var currentdate=new Date();                 
    console.log("\r\n"+"UpdateBlog:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    console.log("\r\n"+"UpdateBlog:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n"); 
                    });
            });
            break;*/

        case "PublishFooter":
            console.log("Publish Footer is called..");
            const pool_updatePublish1 = new sql.ConnectionPool(config, err => {
                pool_updatePublish1.request()
                    .input('Id', sql.Int, req.body.FooterId)
                    .execute('spPublish', (err, result) => {
                    putgetjson.categoryrowaffacted = result.recordsets;                        
                        res.send(putgetjson);
 var currentdate=new Date();                 
    logger.write("\r\n"+"PublishFooter:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"PublishFooter:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;

        //forget and update user
        case "UpdateForgotPassword":
            console.log("Update Forgot password fired..");
            console.log(req.body);
            const pool_UpdateForgotPwd = new sql.ConnectionPool(config, err => {
                pool_UpdateForgotPwd.request()
                    .input('EmaildId', sql.NVarChar(255), req.body.Email)
                    .input('NewPassword', sql.NVarChar(255), req.body.NewPassword)
                    .execute('spUpdateforgotPassword', (err, result) => {
                        putgetjson.categoryrowaffacted = result.recordset;                        
                        res.send(putgetjson);
 var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateForgotPassword:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateForgotPassword:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        //Change password from user side    
        case "UpdatePassword":
            const pool_ChangePassword = new sql.ConnectionPool(config, err => {
                pool_ChangePassword.request()
                    .input('Email', sql.NVarChar(255), req.body.Email)
                    .input('Password', sql.NVarChar(255), req.body.NewPassword)
                    .execute('spChangePassword', (err, result) => {                    
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
 var currentdate=new Date();                 
    logger.write("\r\n"+"UpdatePassword:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdatePassword:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        
                    })
            });

                        break;
case "UpdateAdminPwd":
            const pool_ChangeAdminPassword = new sql.ConnectionPool(config, err => {
                pool_ChangeAdminPassword.request()
                    .input('Email', sql.NVarChar(255), req.body.EmailId)
                    .input('Password', sql.NVarChar(255), req.body.pwd)
                    .execute('spChangeAdminPassword', (err, result) => {
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
 var currentdate=new Date();                 
    logger.write("\r\n"+"UpdateAdminPwd:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"UpdateAdminPwd:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        })
                        });

                        break;
        case "Updateuser1":
            const pool_UpdateUsers = new sql.ConnectionPool(config, err => {
                pool_UpdateUsers.request()
                    .input('FirstName', sql.NVarChar(255), req.body.FirstName)
                    .input('LastName', sql.NVarChar(255), req.body.LastName)
                    .input('Email', sql.NVarChar(255), req.body.Email)
                    .input('PhoneNumber', sql.NVarChar(255), req.body.PhoneNumber)
                    .execute('spUpdateUserbyEmail', (err, result) => {
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
 var currentdate=new Date();                 
    logger.write("\r\n"+"Updateuser1:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Updateuser1:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;

        case "Updateuser":
            const pool_UpdateUser = new sql.ConnectionPool(config, err => {
                pool_UpdateUser.request()
                    .input('ID', sql.Int, req.body.UId)
                    .input('FirstName', sql.NVarChar(255), req.body.Fname)
                    .input('LastName', sql.NVarChar(255), req.body.Lname)
                    .input('Email', sql.NVarChar(255), req.body.UEmail)
                    .input('PhoneNumber', sql.NVarChar(255), req.body.UPhone)
                    .input('Password', sql.NVarChar(255), req.body.UPassword)
                    .execute('spUpdateUser', (err, result) => {
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
var currentdate=new Date();                 
    logger.write("\r\n"+"Updateuser:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Updateuser:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
                        break;
            /*case "EventHeading":			
            const pool_UpdateEventHeading = new sql.ConnectionPool(config, err => {
                pool_UpdateEventHeading.request()
                     .input('ID',sql.Int, req.body.ID)          
                    .input('Heading',sql.NVarChar(255), req.body.Heading)
                    .input('Description',sql.NVarChar(sql.max), req.body.Description)
                    .input('EventType',sql.NVarChar(255), req.body.EventType)
                    .input('ActionType',sql.NVarChar(255), req.body.ActionType)
                     .execute('spAddEventHeading',(err,result)=>{
                         putgetjson.categoryrowaffacted = result.recordsets;
            console.log("result is "+JSON.stringify(result));
            console.log("error is "+JSON.stringify(err));
                        res.send(putgetjson);
                        });
                        });
                        break;*/
    }
}
    catch(ex){
        console.log(ex.message);
    }
});

//API is used to Delete Data in DB
var Deletejson = {};
nodeapp.put("/api/DeleteCategories", function (req, res, next) {
try{
    console.log("Delete Api Called.. ");
    switch (req.body.postType) {
        case "DeleteCategory":
            const pool_DeleteCategory = new sql.ConnectionPool(config, err => {
                pool_DeleteCategory.request()
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spDeleteCategory', (err, result) => {
                        res.send();
                   var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteCategory:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteCategory:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
break;
        case "DeleteEventHeading":
            const pool_DeleteEventHeading = new sql.ConnectionPool(config, err => {
                pool_DeleteEventHeading.request()
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spDeleteEventHeading', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteEventHeading:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteEventHeading:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                    });
break;
            case "DeleteRdEvent":
            const pool_DeleteRdEvent = new sql.ConnectionPool(config, err => {
                pool_DeleteRdEvent.request()
                    .input('Id', sql.Int, req.body.Id)
                    .execute('deleteActivatedEvent', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    console.log("\r\n"+"Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    console.log("\r\n"+"Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        });
                    });
break;
       case "DeleteUser":
             const pool_DeleteUser = new sql.ConnectionPool(config, err => {
                 pool_DeleteUser.request()
                     .input('ID', sql.Int, req.body.ID)
                     .execute('spDeleteUserDetails', (err, result) => {
                         res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteUser:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteUser:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
       });
       });
       break;
       case "DelEvents":
            const pool_Events= new sql.ConnectionPool(config, err=>{
                pool_Events.request()
                   .input('ID',sql.Int,req.body.Id)
                    .execute('spDeleteEvent',(err,result)=>{
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DelEvents:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelEvents:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;

      case "DelDetails":
        const pool_delDetails= new sql.ConnectionPool(config, err => {
            pool_delDetails.request()
               .input('ID', sql.Int, req.body.Id)
                    .execute('spDelDetail', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DelDetails:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
      });

      break;
          case "DelSell":
            const pool_delSell = new sql.ConnectionPool(config, err => {
                pool_delSell.request()
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spDelSelling', (err, result) => {
  var currentdate=new Date();                 
    logger.write("\r\n"+"DelSell:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelSell:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
      });
      break;    
        case "DeleteWishlist":
            console.log("body is:-"+JSON.stringify(req.body));
            const pool_DeleteWishlist = new sql.ConnectionPool(config, err => {
                pool_DeleteWishlist.request()
                    .input('ID', sql.Int, req.body.Id)
                    .input('AuthenticateUserEmailId',sql.NVarChar(255),req.body.AuthenticateUserEmailId)
                    .execute('sp_deleteWishlist', (err, result) => {                       
						res.send(result);
    var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteWishlist:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteWishlist:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
			case "Deletemail":
            const pool_delemail = new sql.ConnectionPool(config, err => {
                pool_delemail.request()
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spDeleteEmail', (err, result) => {
  var currentdate=new Date();                 
    logger.write("\r\n"+"Deletemail:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Deletemail:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteEmail":
            const pool_delmail = new sql.ConnectionPool(config, err => {
                pool_delmail.request()
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spDelEmailConfiguration', (err, result) => {
    var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteEmail:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteEmail:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeletePrice":
            const pool_DeletePrice = new sql.ConnectionPool(config, err => {
                pool_DeletePrice.request()
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spDelExchangeRate', (err, result) => {
                        res.send();
    var currentdate=new Date();                 
    logger.write("\r\n"+"DeletePrice:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeletePrice:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
        case "DelReturns":
            const pool_delReturns = new sql.ConnectionPool(config, err => {
                pool_delReturns.request()
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spDelReturns', (err, result) => {
     var currentdate=new Date();                 
    logger.write("\r\n"+"DelReturns:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelReturns:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteArtist":
            const pool_DeleteArtist = new sql.ConnectionPool(config, err => {
                pool_DeleteArtist.request()
                    .input('Id', sql.Int, req.body.Id)
                    .execute('sp_DeleteArtist', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteArtist:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteArtist:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
			case "DeleteMenuDetails":
            const pool_DeleteMenuDetails = new sql.ConnectionPool(config, err => {
                pool_DeleteMenuDetails.request()
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spDeleteMenu', (err, result) => {
                       
            res.send(result);
   var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteMenuDetails:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteMenuDetails:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        //res.status(200).send("success");
                    });
            });
            break;
        case "DelCorporate":
            const pool_delCorporate = new sql.ConnectionPool(config, err => {
                pool_delCorporate.request()
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spDelCorporate', (err, result) => {
       var currentdate=new Date();                 
    logger.write("\r\n"+"DelCorporate:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelCorporate:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteProduct":
            console.log("Delete Product API Called..." + JSON.stringify(req.body));
            const pool_DeleteProduct = new sql.ConnectionPool(config, err => {
                pool_DeleteProduct.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('sp_DeleteProduct', (err, result) => {
                        res.send();
    var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteProduct:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteProduct:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        // case "DeleteFooter":
        // const pool_DeleteFooter = new sql.ConnectionPool(config, err => {
        // pool_DeleteFooter.request()
        // .input('Id', sql.Int, req.body.Id)
        // .execute('spDeleteFooter', (err, result) => {

        // res.send();
        // });
        // });
        // break;
        case "DeleteColproduct":
            console.log("Delete Product API Called..." + JSON.stringify(req.body));
            const pool_DeleteColproduct = new sql.ConnectionPool(config, err => {
                pool_DeleteColproduct.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('sp_DeleteColproduct', (err, result) => {
                        res.send();
    var currentdate=new Date();                 
    console.log("\r\n"+"Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    console.log("\r\n"+"Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;    
        case "DelArts":
            const pool_delArts = new sql.ConnectionPool(config, err => {
                pool_delArts.request()
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spDelArts', (err, result) => {
  var currentdate=new Date();                 
    logger.write("\r\n"+"DelArts:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelArts:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DelSlider":
            const pool_dSlider = new sql.ConnectionPool(config, err => {
                pool_dSlider.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteSlider', (err, result) => {
                        res.send();
    var currentdate=new Date();                 
    logger.write("\r\n"+"DelSlider:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelSlider:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DelAboutHeader":
            const pool_delAboutHeader = new sql.ConnectionPool(config, err => {
                pool_delAboutHeader.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDelAboutHeader', (err, result) => {
                        res.send();
    var currentdate=new Date();                 
    logger.write("\r\n"+"DelAboutHeader:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelAboutHeader:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
		case "DelNewsConntent":
            const pool_delnews = new sql.ConnectionPool(config, err => {
                pool_delnews.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('SPDeleteNewsletter', (err, result) => {
                        res.send();
   var currentdate=new Date();                 
    logger.write("\r\n"+"DelNewsConntent:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelNewsConntent:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;	
        case "DelAbtConntent":
            const pool_delconent = new sql.ConnectionPool(config, err => {
                pool_delconent.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteContent', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DelAbtConntent:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelAbtConntent:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;

        case "DelTrends":
            const pool_delTrend = new sql.ConnectionPool(config, err => {
                pool_delTrend.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteTrending', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DelTrends:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelTrends:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DelEvent":
            const pool_delEvent = new sql.ConnectionPool(config, err => {
                pool_delEvent.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDelPopUp', (err, result) => {
                        res.send();
  var currentdate=new Date();                 
    logger.write("\r\n"+"DelEvent:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelEvent:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "Delcollectible":
            const pool_delcollect = new sql.ConnectionPool(config, err => {
                pool_delcollect.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDelCollect', (err, result) => {
                        res.send();
  var currentdate=new Date();                 
    logger.write("\r\n"+"Delcollectible:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"Delcollectible:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DelDiscover":
            const pool_delDiscover = new sql.ConnectionPool(config, err => {
                pool_delDiscover.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteDiscover', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DelDiscover:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelDiscover:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteMedium":
            const pool_DeleteMedium = new sql.ConnectionPool(config, err => {
                pool_DeleteMedium.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteMedium', (err, result) => {
                        res.send();
  var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteMedium:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteMedium:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteGenera":
            const pool_DeleteGenera = new sql.ConnectionPool(config, err => {
                pool_DeleteGenera.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteGenre', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteGenera:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteGenera:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteCollectible":
            const pool_DeleteCollectible = new sql.ConnectionPool(config, err => {
                pool_DeleteCollectible.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteCollectible ', (err, result) => {
                        res.send();
  var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteCollectible:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteCollectible:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DelContactquery":
            const pool_DeleteContact = new sql.ConnectionPool(config, err => {
                pool_DeleteContact.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDelContactUs', (err, result) => {
                        res.send();
  var currentdate=new Date();                 
    logger.write("\r\n"+"DelContactquery:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelContactquery:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteTestimonial":
            const pool_DeleteTestimonial = new sql.ConnectionPool(config, err => {
                pool_DeleteTestimonial.request()
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spDeleteTestimonial', (err, result) => {
                        putgetjson.categoryrowaffacted = result.recordsets;
                        res.send(putgetjson);
   var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteTestimonial:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteTestimonial:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteAboutUs":
            const pool_DeleteAboutUs = new sql.ConnectionPool(config, err => {
                pool_DeleteAboutUs.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteContent ', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteAboutUs:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteAboutUs:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteFooter":
            const pool_DeleteFooter = new sql.ConnectionPool(config, err => {
                pool_DeleteFooter.request()
                    .input('Id', sql.Int, req.body.Id)
                    .execute('spDeleteFooter', (err, result) => {
                        res.send();
 var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteFooter:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteFooter:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
        case "DeleteBlog":
            const pool_DeleteBlog = new sql.ConnectionPool(config, err => {
                pool_DeleteBlog.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('spDeleteBlog ', (err, result) => {
                        res.send();
    var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteBlog:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteBlog:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;

        case "DelContactinfo":
            const pool_delcontact = new sql.ConnectionPool(config, err => {
                pool_delcontact.request()
                    .input('ID', sql.Int, req.body.Id)
                    .execute('spDelContactDetails', (err, result) => {
  var currentdate=new Date();                 
    logger.write("\r\n"+"DelContactinfo:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DelContactinfo:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;

        case "DeleteTeam":
            const pool_DeleteTeam = new sql.ConnectionPool(config, err => {
                pool_DeleteTeam.request()
                    .input('ID', sql.NVarChar(255), req.body.Id)
                    .execute('DeleteTeam', (err, result) => {
                        res.send();
  var currentdate=new Date();                 
    logger.write("\r\n"+"DeleteTeam:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"DeleteTeam:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                    });
            });
            break;
    };
}
    catch(ex){
        console.log(ex.message);
    }


});
            nodeapp.post("/api/GlobalSearch",function(req,res){
                try{
                const pool_GlobalSearch = new sql.ConnectionPool(config, err => {
                    pool_GlobalSearch.request()
                        .input('Search', sql.NVarChar(255), req.body.SearchContent)
                        .input('AuthEmail', sql.NVarChar(255), req.body.AuthEmail)
                        .execute('sp_GlobalSearch', (err, result) => {
var currentdate=new Date();                 
    logger.write("\r\n"+"GlobalSearch:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    logger.write("\r\n"+"GlobalSearch:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
                        if((empty(result.recordsets[0][0])) && (empty(result.recordsets[1][0])))  
                {                            
                    result.recordsets[0]={};                
                    result.recordsets[0].returnType="Empty";    
                    result.recordsets[1].returnType="Empty";    
                    result.recordsets[0].taskStatus="GlobalSearchEmpty";            
                }            
            else{
                       result.recordsets[0].returnType="GlobalSearchResult";                  
                }
                res.send(result.recordsets);
            });
            
            }); 
                }
                catch(ex){
                    console.log(ex.message);
                }
            });


//            nodeapp.post("/api/GlobalSearch",function(req,res){ 
//                console.log("Body is-"+ JSON.stringify(req.body));
//                const pool_GlobalSearch = new sql.ConnectionPool(config, err => {
//                    pool_GlobalSearch.request()
//                        .input('Search', sql.NVarChar(255), req.body.SearchContent)
//                        .execute('sp_GlobalSearch', (err, result) => {
//                            console.log("Result is-"+ JSON.stringify(result));
//                            if(empty(result.recordsets[0][0]))
//                            {
//                            result.recordsets[0]={};
//                result.recordsets[0].returnType="Empty";
//                result.recordsets[0].taskStatus="GlobalSearchEmpty";
//            }
//            else{
//res.send(result.recordsets);
//}
                          
//            });
//            });
//            });

//nodeapp.post("/Login", function (req, res, next) {
//    // closeSQL();
//    sql.connect(config).then(pool => {
//        return pool.request()
//            .input('email', sql.NVarChar(255), req.body.EmailId)
//            .input('pwd', sql.NVarChar(255), req.body.pwd)
//            .execute('spGetSingleAdmin')
//    }).then(result => {
//        console.log(result);
//        res.send(result);
//    }).catch(err => {
//        console.log(err);
//    });

//});

nodeapp.post("/CheckAuthentication", function (req, res, next) {
    try{
    console.log("Check Authentication Fired...");
    sql.close(function () {
        // console.log("Closed ");
    });
    sql.connect(config).then(pool => {
        return pool.request()
            .input('Email', sql.NVarChar(255), req.body.Email)
            .input('Password', sql.NVarChar(255), req.body.Password)
            .execute('spExternalUserLogin')
    }).then(result => {
        res.send(result);
var currentdate=new Date();                 
    logger.write("\r\n"+"CheckAuthentication:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n"); 
    
                     
    }).catch(err => {
        console.log(err);
    logger.write("\r\n"+"CheckAuthentication:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
      
    });
    }
    catch(ex){
                    console.log(ex.message);
                }
});
/*Newsletter send code */
nodeapp.post("/SendEmail",function(req,res,next){
    try{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: req.body.UserEmail,
    pass: req.body.UserPassword
  }
});
var mailOptions = {
  from: req.body.UserEmail,
  to: req.body.SelectedEmail,
  subject:req.body.Subject ,
  html: req.body.TextMessage
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
	  console.log('Mail options '+mailOptions);
 var currentdate=new Date();                 
    logger.write("\r\n"+"Email of Newsletter sent:-Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n");  
    console.log(error);
  } else {
    console.log('Email of Newsletter sent: ' + info.response);
    logger.write("\r\n"+"Email of Newsletter sent:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
      
  }
});	
    }
    catch(ex){
                    console.log(ex.message);
                }
});

                        
/*Email send code */
nodeapp.post("/ReceiveEmail",function(req,res,next){
    try{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: req.body.UserEmail,
    pass: req.body.UserPassword
  }
});
var mailOptions = {
  from: req.body.UserEmail,
  to: req.body.ToEmail,
  subject: req.body.subject,
  html: req.body.TextMessage
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    logger.write("\r\n"+"Email of Newsletter sent:-Error is:-"+dateFormat(currentdate)+ JSON.stringify(error)+"\r\n");  
      
  } else {
    console.log('Email sent: ' + info.response);
  }
});	
    }
    catch(ex){
                    console.log(ex.message);
                }
});
//User Registration
//    nodeapp.post("/AddUserRegistration",function(req,res,next){
//  //  closeSQL();
//    sql.connect(config).then(pool=>{
//       return pool.request()
//        .input('Fname',sql.NVarChar(255), req.body.FirstName)
//        .input('Lname',sql.NVarChar(255), req.body.LastName)
//        .input('phone_no',sql.NVarChar(255), req.body.PhoneNo)
//        .input('email',sql.NVarChar(255), req.body.Email)
//        .input('pwd',sql.NVarChar(255), req.body.Password)
//        .execute('spInsertMaster')
//    }).then(result=>{       
//        res.send(result);
//    }).catch(err=>{
//        console.log(err);
//    });   
//    });

//    nodeapp.get("/GetRegistreduser",function(req,res,next){
//  //  closeSQL();
//    sql.connect(config).then(pool=>{
//       return pool.request()       
//        .execute('spGetRegisterUser')
//    }).then(result=>{       
//        res.send(result);
//    }).catch(err=>{
//        console.log(err);
//    });   
//    });
//Menu API
nodeapp.post("/AddMenu", function (req, res, next) {
    try{
    //  closeSQL();
    sql.connect(config).then(pool => {
        return pool.request()
            .input('MenuName', sql.NVarChar(255), req.body.Name)
            .input('MenuURL', sql.NVarChar(255), req.body.URL)
            .input('ParentId', sql.Int, req.body.ParentId)
            .input('Level', sql.Int, req.body.Level)
            .execute('spInsertMenu')
    }).then(result => {
        res.send(result);
var currentdate=new Date();        
logger.write("\r\n"+"AddMenu:- Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n");
    }).catch(err => {
        console.log(err);
logger.write("\r\n"+"AddMenu:- Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
    });
    }
    catch(ex){
                    console.log(ex.message);
                }
});
nodeapp.get("/getMenu", function (req, res, next) {
    try{
    //closeSQL();
    sql.connect(config).then(pool => {
        return pool.request()
            .execute('spGetMenuDetails')
    }).then(result => {
        res.send(result);
var currentdate=new Date();        
logger.write("\r\n"+"getMenu:- Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n");
    }).catch(err => {
        console.log(err);
 logger.write("\r\n"+"getMenu:- Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
    });
    }
    catch(ex){
                    console.log(ex.message);
                }
});
nodeapp.put("/Update", function (req, res, next) {
    try{
    //  closeSQL();
    sql.connect(config).then(pool => {
        return pool.request()
            .input('MenuName', sql.NVarChar(255), req.body.MenuName)
            .input('MenuUrl', sql.NVarChar(255), req.body.MenuURL)
            .input('Id', sql.Int, req.body.Id)
            .execute('spUpdateMenu')
    }).then(result => {
        res.send(result);
  var currentdate=new Date();        
logger.write("\r\n"+"Update:- Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n");
    }).catch(err => {
        console.log(err);
 logger.write("\r\n"+"Update:- Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
    });
    }
    catch(ex){
                    console.log(ex.message);
                }
});
nodeapp.put("/DeteteMenu", function (req, res, next) {
    try{
    //    closeSQL();
    sql.connect(config).then(pool => {
        return pool.request()
            .input('Id', sql.Int, req.body.Id)
            .execute('spDeletemenu')
    }).then(result => {
        res.send(result);
 var currentdate=new Date();        
logger.write("\r\n"+"DeteteMenu:- Result is" +dateFormat(currentdate)+JSON.stringify(result)+"\r\n");
    }).catch(err => {
        console.log(err);
logger.write("\r\n"+"DeteteMenu:- Error is:-"+dateFormat(currentdate)+ JSON.stringify(err)+"\r\n");
    });
    }
    catch(ex){
                    console.log(ex.message);
                }
});

nodeapp.use(express.static('public'));

nodeapp.use((req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

nodeapp.listen(8002, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server started');
    }
});