app.service("ProductService", function ($http, $rootScope) {
    $rootScope.datag = {};
    $rootScope.dataOnLoad = {};
    this.PageLoad_variable = $rootScope.dataOnLoad;
    this.Data = $rootScope.datag;
    this.getData = function () {
        console.log("Data updated : " + JSON.stringify(this.Data));
        return Data;
    };
    this.AssignValue = function (v) {
        //console.log("Assign value"+JSON.stringify(v));
        Data = v;
        notify();
    };
    $rootScope.$on('dataLoadedService', function (event, data) {      
        AssignValue(data);
        console.log("Inside service");

    });

    this.PostData = function (data) {
        var w = this;
        $http.post('/api/postCategories', data).then(function (response) {
            console.log("Inside Post data" + response);
            w.GetCategories();
        });
    };
    this.GetdatawithParm = function (data) {
        var GP = this;
        $http.post("/api/GetWitParm", data).then(function (response) {
            //GP.setData("Emailcount", response.data);
           
            if ((response.data[0] != undefined) && (response.data[0].returnType == "GetSecurityQuestion")) {
                GP.setData("SecurityQuestion", response.data);
            }

             else if ((response.data[0] != undefined) && (response.data[0].returnType == "ExistEmail")) {
                GP.setData(response.data[0].returnType, response.data)
             }
             else if ((response.data[0] != undefined) && (response.data[0].returnType == "AdminEmail")) {
                 GP.setData(response.data[0].returnType, response.data)
             }
//            else if ((response.data[0] != undefined) && (response.data[0].returnType == "EmailEmpty")) {
//                GP.setData(response.data[0].returnType, response.data)
//                
//            }
            else if ((response.data[0] != undefined) && (response.data[0].returnType == "Wishlist")) {
                GP.setData(response.data[0].returnType, response.data)
            }
            else if ((response.data[0] != undefined) && (response.data[0].returnType == "Empty")) {
                GP.setData(response.data[0].returnType, response.data)
            }
            else if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "Empty")) {
                GP.setData(response.data[0][0].returnType, response.data)
            }
            else if ((response.data[0] != undefined) && (response.data[0].returnType == "OurStoryCustomList")) {
                GP.setData(response.data[0].returnType, response.data)
            }
            else if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "GlobalSearch")) {
                GP.setData(response.data[0][0].returnType, response.data)
            }
            else if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "ArtistProfileDetail")) {
                GP.setData(response.data[0][0].returnType, response.data)
            }
            else if ((response.data[0] != undefined) && (response.data[0].returnType == "NewsLetterList")) {
                GP.setData(response.data[0].returnType, response.data)
            }
            //else if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "ProductDetail")) {
            //    GP.setData(response.data[0][0].returnType, response.data)
            //}
            else if ((response.data[0] != undefined) && (response.data[0].returnType == "UserDetail")) {
                GP.setData(response.data[0].returnType, response.data)
            }
            //else if ((response.data[0] != undefined) && (response.data[0].returnType == "ProductGallary")) {
            //    GP.setData(response.data[0].returnType, response.data);
            //}
            else if ((response.data[0] != undefined) && (response.data[0].returnType == "ProductList")) {
                GP.setData(response.data[0].returnType, response.data)
            }
            else if ((response.data[0] != undefined) && (response.data[0].returnType == "FooterSingleRecord")) {
                GP.setData(response.data[0].returnType, response.data);
            }
            else { }
            GP.GetCategories();
        });
       
    }

    this.Update = function (data) {
        var U = this;
        $http.put('/api/putCategories', data).then(function (response) {
            console.log("Inside put data");
            U.GetCategories();
        });
    };

    this.Delete = function (data) {
        var Del = this;
        $http.put('/api/DeleteCategories', data).then(function (response) {
            Del.GetCategories();
        });
    };

    this.GetCategories = function () {
        var p = this;
        loadingStarted();
        $http.get("./api/getCategories").then(function (response) {
           // console.log("Inside get categories");
            p.AssignValue(response.data);
        });
    };



    this.setData = function (arg, value) {
        var SD = this;       
       
        switch (arg) {
            //case 'Emailcount':
            //    console.log("Email count service");
            //    // console.log("value.."+JSON.stringify(value));
            //    if (value.recordset == undefined) {
            //        return;
            //    }
            //    Data.emailcount = value.recordset[0].TotalCount;
            //    break; 
            case 'Empty':
                if (value.length > 0) {
                    Data.EmptyRecord = value;
                }
                else {
                    return
                }
                break;
            case 'ExistEmail':
                if(value.length>0){
                    Data.GetValidEmail=value;
                }
                else{
                    return;
                }
           
            case 'SecurityQuestion':
                if (value.length > 0) {
                    Data.SecurityQuestion = value;
                }
                else {
                    return
                }
                break;

            case 'Wishlist':
                if (value.length > 0) {
                    Data.WishD = value;
                }
                else {
                    Data.WishD = [];
                }
            case 'AdminEmail':
                if (value.length > 0) {
                    Data.AdminData = value;
                }
                else {
                    Data.AdminData = [];
                }
                break;
            case 'OurStoryCustomList':
                if (value.length > 0) {
                    Data.CustomOurStory = value;
                }
                else {
                    return
                }
                break;

            case 'ArtistProfileDetail':
                if (value.length > 0) {
                    
                    Data.Artist = value;
                }
                else {
                    return
                }

                break;
            case 'UserDetail':
                if (value.length > 0) {
                    Data.UserD = value;
                }
                else {
                    Data.UserD = [];
                }
                break;
            case 'FooterSingleRecord':
                if (value.length > 0) {
                    Data.GetFooterSingleRecordD = value;
                }
                else {
                    return;
                }
                break;
            case 'NewsLetterList':
                if (value.length > 0) {
                    Data.NewsL = value;
                }
                else {
                    Data.NewsL = [];
                }

                break;
            case 'ProductList':
                if (value.length > 0) {
                    Data.ProductL = value;
                }
                else {
                    Data.ProductL = [];
                }
                break;

            case 'GlobalSearch':
                if (value.length > 0) {
                    Data.GlobalSearch = value;
                }
                else {
                    return
                }
                break;
            //case 'ProductGallary':
            //    if (value.length > 0) {
            //        Data.ProductGallaryD = value;
            //    }
            //    else {
            //        return
            //    }
            //    break;

            //case 'ProductDetail':
            //    if (value.length > 0) {
            //        if (Data == undefined) {
            //            Data = [];
            //        }
            //        Data.ProductD = value;
            //    }
            //    else {
            //        return;
            //    }
        }
        notify();

    };

    var notify = function () {
        $rootScope.$broadcast("dataLoaded", Data);
     //   alert("data Loaded Called...")
    }
    var loadingStarted = function () {
        $rootScope.$broadcast("loadingData", "true");
    }

    var notifyService = function () {
        $rootScope.$broadcast("dataLoadedService", this.Data);
        console.log("Firing event");
    }

    return this;
});

app.service('fileUpload', function ($http,$rootScope) {
    this.uploadFileToUrl = function (ParamHere) {
        // console.log(JSON.stringify(ParamHere))
        switch (ParamHere.addType) {
            case 'Blog':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('BlogTitle', ParamHere.Title);
                fd.append('Quote', ParamHere.Quotes);
                fd.append('QuoteFrom', ParamHere.QuotesFrom);
                fd.append('Blogdescription', ParamHere.Description);
                fd.append("Metadescription", ParamHere.Metadescription);
				fd.append("Metakeyword", ParamHere.Metakeyword);
				fd.append("Metatitle", ParamHere.Metatitle);
                fd.append("PageTitle",ParamHere.PageTitle);
                fd.append("AltTags",ParamHere.AltTags);
                fd.append('publisheddate', ParamHere.PublishDate);
                fd.append("ActionType", ParamHere.ActionType)
                fd.append("Id", ParamHere.blogid)
                fd.append("ContentUpdate", ParamHere.updatetype)
                fd.append('switchType', 'Blog');

                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })

                    .success(function () {
                    })

                    .error(function () {
                    });
                break;

            case 'UserProfilePicture':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('UEmail', ParamHere.Email);
                fd.append('switchType', 'UserProfilePicture');

                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                 .success(function () {
                     $rootScope.ifUploaded = 1;
                     $rootScope.waiting();
                    })
                 .error(function () {
                    });
                break;
            case 'CustomMenu':
                var fd = new FormData();
                if (ParamHere.BgImage != undefined) {
                    var items = ParamHere.BgImage.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.BgImage[i], ParamHere.BgImage[i].name);
                    }
                }
                if (ParamHere.OtherImage != undefined) {
                    var items = ParamHere.OtherImage.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('image2', ParamHere.OtherImage[i], ParamHere.OtherImage[i].name);
                    }
                }
                fd.append('Id', parseInt(ParamHere.Id));
                fd.append('Menu_Label', ParamHere.MenuLabel);
                fd.append('Page_Title', ParamHere.PageTitle);
                fd.append('Route_Id', ParamHere.RouteId);
                fd.append("Content", ParamHere.Content);
                fd.append('Parent_Id', ParamHere.ParentId);
                fd.append('Level', ParamHere.Level);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append('switchType', 'AddCustomMenu');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .success(function (){
                        $rootScope.GetMenu();
                    })

                        .error(function (){}
                        );
                break;
            case 'Footer':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('Id', ParamHere.Id);
                fd.append('Name', ParamHere.Name);
                fd.append('URL', ParamHere.URL);
                fd.append('Title', ParamHere.Title);
                fd.append('Description', ParamHere.Description);
                fd.append("URLType", ParamHere.URLType);
                fd.append("Metadescription", ParamHere.Metadescription);
				fd.append("Metakeyword", ParamHere.Metakeyword);
				fd.append("Metatitle", ParamHere.Metatitle);
                fd.append("PageURL",ParamHere.PageURL);
                fd.append("PageTitle",ParamHere.PageTitle);
                fd.append("AltTags",ParamHere.AltTags);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("UpdateType", ParamHere.UpdateType);
                fd.append('switchType', 'FooterRecord');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })

                    .success(function () {
                    })

                    .error(function () {
                    });
                break;
            case 'Sell':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('Id', ParamHere.Id);
                fd.append('Description', ParamHere.Description);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'Sell');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });
                break;
            case 'EventHeading':
                var fd=new FormData();
                if(ParamHere.headerFile !=undefined){
                var items = ParamHere.headerFile.length;
                for (var i = 0; i < items; i++) {
                    fd.append('userFile', ParamHere.headerFile[i], ParamHere.headerFile[i].name);
                  }
                }
                fd.append('ID', ParamHere.ID);
                fd.append("Heading", ParamHere.Heading);
                fd.append("Description", ParamHere.Description);
                fd.append("Metadescription", ParamHere.Metadescription);
				fd.append("Metakeyword", ParamHere.Metakeyword);
				fd.append("Metatitle", ParamHere.Metatitle);
                fd.append("URL",ParamHere.URL);
                fd.append("PageTitle",ParamHere.PageTitle);
                fd.append("AltTags",ParamHere.AltTags);
                fd.append("EventType",ParamHere.EventType);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append('switchType', 'EventHeading');

                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })

                    .success(function () {
                    })

                    .error(function () {
                    });
                
            break;
            case 'Events':
                var fd = new FormData();
                if (ParamHere.HeaderFile != undefined) {
                    var items = ParamHere.HeaderFile.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.HeaderFile[i], ParamHere.HeaderFile[i].name);
                    }
                }
                fd.append('Event', ParamHere.Event);
                fd.append('EventName', ParamHere.EventName);
                fd.append('Description', ParamHere.Description);
                fd.append('Venue', ParamHere.Venue);
                fd.append('ID', ParamHere.ID);
                fd.append('StartDate', ParamHere.StartDate);
                fd.append('EndDate', ParamHere.EndDate);
                fd.append('Timings', ParamHere.Timings);
                fd.append('AddInfo', ParamHere.AddInfo)
                fd.append('Quotes', ParamHere.Quotes)
                fd.append('Products', ParamHere.Products);
                fd.append("Metadescription", ParamHere.Metadescription);
				fd.append("Metakeyword", ParamHere.Metakeyword);
				fd.append("Metatitle", ParamHere.Metatitle);
                fd.append("URL",ParamHere.URL);
                fd.append("PageTitle",ParamHere.PageTitle);
                fd.append("AltTags",ParamHere.AltTags);
                fd.append("ActionType", ParamHere.ActionType);
                //fd.append("updateType", ParamHere.Updatetype);
                fd.append('switchType', 'Events');

                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })

                    .success(function () {
                    })

                    .error(function () {
                    });
                break;
            case 'Product':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                if (ParamHere.OtherView != undefined) {
                    var items = ParamHere.OtherView.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('ProductOther', ParamHere.OtherView[i], ParamHere.OtherView[i].name);
                    }
                }
                fd.append('ProName', ParamHere.ProductName);
                if (ParamHere.SerialNo != undefined) {
                    fd.append('SerialNo', ParamHere.SerialNo);
                }
                fd.append('CategoryId', ParamHere.CategoryId);
                fd.append('MediumId', ParamHere.MediumId);
                fd.append('GeneraId', ParamHere.GeneraId);
                fd.append('CollectibleId', ParamHere.CollectibleId);
                fd.append('ArtistId', ParamHere.ArtistId);
                fd.append('NewArtist', ParamHere.NewArtist)
                fd.append('ProductType', ParamHere.ProductType)
                fd.append('Price', ParamHere.ProductPrice);
                fd.append('PriceOnRequest',ParamHere.PriceOnRequest);
                fd.append('chkStatusPrice',ParamHere.chkStatusPrice);
                fd.append('Remarks', ParamHere.Remarks);
                fd.append('ProductYear', ParamHere.ProductYear);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("height", ParamHere.Height);
                fd.append("width", ParamHere.Weight);
                fd.append("depth", ParamHere.depth);
                /*fd.append("DollerPrice", ParamHere.DollerPrice);*/
				fd.append("Metadescription", ParamHere.Metadescription);
				fd.append("Metakeyword", ParamHere.Metakeyword);
				fd.append("Metatitle", ParamHere.Metatitle);
                fd.append("URL",ParamHere.URL);
                fd.append("PageTitle",ParamHere.PageTitle);
                fd.append("AltTags",ParamHere.AltTags);
                fd.append("Id", ParamHere.Id);
                fd.append("ContentUpdate", ParamHere.Updatetype);
                fd.append('switchType', 'Product');

                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })

                    .success(function () {
                    })

                    .error(function () {
                    });
                break;
 case 'CollectibleProduct':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                if (ParamHere.OtherView != undefined) {
                    var items = ParamHere.OtherView.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('ProductOther', ParamHere.OtherView[i], ParamHere.OtherView[i].name);
                    }
                }
                fd.append('ProName', ParamHere.ProductName);
                if (ParamHere.SerialNo != undefined) {
                    fd.append('SerialNo', ParamHere.SerialNo);
                }
                fd.append('CategoryId', ParamHere.CategoryId);
                fd.append('MediumId', ParamHere.MediumId);
                fd.append('GeneraId', ParamHere.GeneraId);
                fd.append('CollectibleId', ParamHere.CollectibleId);
                fd.append('ArtistId', ParamHere.ArtistId);
                fd.append('NewArtist', ParamHere.NewArtist)
                fd.append('ProductType', ParamHere.ProductType)
                fd.append('Price', ParamHere.ProductPrice);
                fd.append('PriceOnRequest',ParamHere.PriceOnRequest);
                fd.append('chkStatusPrice',ParamHere.chkStatusPrice);
                fd.append('Remarks', ParamHere.Remarks);
                fd.append('ProductYear', ParamHere.ProductYear);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("height", ParamHere.Height);
                fd.append("width", ParamHere.Weight);
                fd.append("depth", ParamHere.depth);
                /*fd.append("DollerPrice", ParamHere.DollerPrice);*/
				fd.append("Metadescription", ParamHere.Metadescription);
				fd.append("Metakeyword", ParamHere.Metakeyword);
				fd.append("Metatitle", ParamHere.Metatitle);
                fd.append("URL",ParamHere.URL);
                fd.append("PageTitle",ParamHere.PageTitle);
                fd.append("AltTags",ParamHere.AltTags);
                fd.append("Id", ParamHere.Id);
                fd.append("ContentUpdate", ParamHere.Updatetype);
                fd.append('switchType', 'CollectibleProduct');

                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })

                    .success(function () {
                    })

                    .error(function () {
                    });
                break;
            case 'Corporate':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('Id', ParamHere.Id)
                fd.append('HeadingType', ParamHere.HeadingType)
                fd.append('Heading', ParamHere.Heading)
                fd.append('Description', ParamHere.Description)
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'Corporate');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });

                break;
            case 'Event':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('ID', ParamHere.ID)
                fd.append('Type', ParamHere.Type)
                fd.append('Title', ParamHere.Title)
                fd.append('EventId', ParamHere.EventId)
                fd.append('EventType', ParamHere.EventType)
                fd.append('Sub_heading', ParamHere.Sub_heading)
                fd.append('StartDate', ParamHere.StartDate)
                fd.append('StartMonth', ParamHere.StartMonth)
                fd.append('StartYear', ParamHere.StartYear)
                fd.append('EndDate', ParamHere.EndDate)
                fd.append('EndMonth', ParamHere.EndMonth)
                fd.append('EndYear', ParamHere.EndYear)
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("Updatetype", ParamHere.updatetype);
                fd.append('switchType', 'event');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });
                break;
            case 'Returns':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('Id', ParamHere.Id);
                fd.append('Description', ParamHere.Description);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'Returns');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });
                break;
            case 'Artist':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }

                if (ParamHere.ArtistProfilePic != undefined) {
                    var items = ParamHere.ArtistProfilePic.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('image2', ParamHere.ArtistProfilePic[i], ParamHere.ArtistProfilePic[i].name);
                    }
                }

                fd.append('FistName', ParamHere.FirstName);
                fd.append('LastName', ParamHere.LastName);
                fd.append('GalleryType', ParamHere.TypeofImage);
                fd.append('URL', ParamHere.URL);
                fd.append('StartedService', ParamHere.StartService);
                fd.append('ExitDate', ParamHere.ExitDate);
                fd.append('Description', ParamHere.Description);
				fd.append('Metadescription', ParamHere.Metadescription);
				fd.append('Metakeyword', ParamHere.Metakeyword);
				fd.append('Metatitle', ParamHere.Metatitle);
                fd.append("PageURL",ParamHere.PageURL);
                fd.append("PageTitle",ParamHere.PageTitle);
                fd.append("AltTags",ParamHere.AltTags);
                fd.append("ActionType", ParamHere.ActionType)				
                fd.append("Id", ParamHere.Id)
                fd.append("ContentUpdate", ParamHere.UpdateType)
                fd.append('switchType', 'Artist');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })

                    .success(function () {
                    })

                    .error(function () {
                    });
                break;

            case 'Team':

                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }

                fd.append('Name', ParamHere.Name);
                fd.append('Description', ParamHere.Description);
                fd.append("ActionType", ParamHere.ActionType)
                fd.append("Id", ParamHere.Id)
                fd.append("ContentUpdate", ParamHere.Updatetype)
                fd.append('switchType', 'Team');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {

                });
                break;
            case 'Trending':

                console.log("Trending Called Successfully......");
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('TrendingTitle', ParamHere.TrendTitle);
                fd.append('Trendingtext', ParamHere.TrendText);
                fd.append('Id', ParamHere.Id);
                fd.append('TrendingType', ParamHere.TrendingType);
                fd.append('ArtistId', ParamHere.ArtistId);
                fd.append('ProductId', ParamHere.ProductId);
                fd.append('EventId', ParamHere.EventId);
                fd.append('EventType', ParamHere.EventType);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'trend');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {

                });
                break;




            case 'Discover':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);

                    }
                }
                fd.append('Id', ParamHere.Id)
                fd.append('Title', ParamHere.Title);
                fd.append('MediumType', ParamHere.MediumType);
                fd.append('TextImg', ParamHere.TextImg);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'discover');


                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });
                break;
            case 'Collectible':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);

                    }
                }
                fd.append('Id', ParamHere.Id)
                //fd.append('Title',ParamHere.Title);						   
                fd.append('CollectibleType', ParamHere.Collectible);
                fd.append('TextImg', ParamHere.TextImg);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'collectible');


                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });
                break;
            case 'Aboutus':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);

                    }
                }
                fd.append('Id', ParamHere.Id)
                fd.append('Title', ParamHere.Title);
                fd.append('Content', ParamHere.Description);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append("Metadescription", ParamHere.Metadescription);
				fd.append("Metakeyword", ParamHere.Metakeyword);
				fd.append("Metatitle", ParamHere.Metatitle);
                fd.append("URL",ParamHere.URL);
                fd.append("PageTitle",ParamHere.PageTitle);
                fd.append("AltTags",ParamHere.AltTags);
                fd.append('switchType', 'aboutus');


                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });
                break;
            case 'Newsletter':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);

                    }
                }
                fd.append('Id', ParamHere.Id)
                fd.append('Title', ParamHere.Title);
                fd.append('subject', ParamHere.Subject);
                fd.append('Content', ParamHere.Description);
                fd.append('SelectedEmails', ParamHere.SelectEmail);
                fd.append('layout', ParamHere.Layout)
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'newsletter');


                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });
                break;
            case 'AboutHeader':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                } fd.append('Id', ParamHere.Id);
                fd.append('Heading', ParamHere.Heading);
                fd.append('Sub_heading', ParamHere.Sub_heading)
                fd.append('ActionType', ParamHere.ActionType);
                fd.append('Content', ParamHere.updatetype);
                fd.append('switchType', 'AboutUsHeader');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })

                    .success(function () {
                    })

                    .error(function () {
                    });
                break;
            case 'Arts':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('Id', ParamHere.Id)
                fd.append('Heading', ParamHere.Heading)
                fd.append('Description', ParamHere.Description)
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'Arts');
                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                });
                break;
            case 'ContactUs':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);

                    }
                }
                fd.append('Id', ParamHere.Id);
                fd.append('heading', ParamHere.Heading);
                fd.append('subheading', ParamHere.SubHeading);
                fd.append('title', ParamHere.Title);
                fd.append('name', ParamHere.Owner);
                fd.append('pincode', ParamHere.PinCode);
                fd.append('address', ParamHere.StreetAddress);
                fd.append('city', ParamHere.City);
                fd.append('state', ParamHere.State);
                fd.append('phoneno', ParamHere.PhoneNo);
                fd.append('email', ParamHere.Email);
                fd.append('longitude', ParamHere.Longitude);
                fd.append('latitude', ParamHere.Latitude);
                fd.append('mapapi', ParamHere.Map);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'contact');


                $http.post(ParamHere.UploadUrl, fd,
                    {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    }).success(function () {

                    }).error(function () {
                    });
                break;

            case 'slider':
                var fd = new FormData();
                if (ParamHere.File != undefined) {
                    var items = ParamHere.File.length;
                    for (var i = 0; i < items; i++) {
                        fd.append('userFile', ParamHere.File[i], ParamHere.File[i].name);
                    }
                }
                fd.append('EventType', ParamHere.EventType)
                fd.append('EventId', ParamHere.EventId)
                fd.append('LinkType', ParamHere.LinkType)
                fd.append('Id', ParamHere.SliderId);
                fd.append('slideType', ParamHere.slidetype);
                fd.append('ArtistId', ParamHere.ArtistId);
                fd.append('ProductID', ParamHere.ProductID);
                fd.append('sliderimage', ParamHere.SliderImage);
                fd.append('imgcaption', ParamHere.ImgCaption);
                fd.append('Videourl', ParamHere.videourl);
                fd.append("ActionType", ParamHere.ActionType);
                fd.append("ContentUpdate", ParamHere.updatetype);
                fd.append('switchType', 'sliders');

                $http.post(ParamHere.UploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {

                }).error(function () {
                    console.log(Error);
                });

                break;

        }
    }
});
