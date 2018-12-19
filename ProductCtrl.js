//category Controller
app.controller('categoryController', function ($scope, $timeout, $http, ProductService, $rootScope, $location) {
    $rootScope.SessionEmail = localStorage.getItem("AdminEmailSession");
    $scope.CheckAdminLogin = function () {
        if ($rootScope.SessionEmail == '' || $rootScope.SessionEmail == undefined) {
            $location.path("/admin/");
            alert("You have to login before accessing the page");
        }
    }
    $scope.CheckAdminLogin();
    var categoryData = [];
    $scope.catbtn = true;
    $scope.selectedId = [];
    $scope.categoryData = [];

    $scope.getCategoryList = function () {
        try{
            ProductService.GetCategories();
            $scope.$on('dataLoaded', function (event, data) {
                $scope.categoryData = data.category[0];
                $scope.PublishCategoryData = data.Publishcategory[0];
            });
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.getCategoryList();
   $scope.Reset=function(){
       try{
        var r = confirm("Are you sure to clear all fields");
        if (r == true) {
    $scope.addcategory="";
    $scope.metadescription="";
    $scope.metakeyword="";
    $scope.metatitle="";
    $scope.URL="";
    $scope.PageTitle="";
    $scope.catbtn = true;
            }
        
       }
       catch(ex){
			console.log(ex.message);
		}
}
    //delte category
    $scope.deleteCategory = function (category) {
        try{
        var BfsDeletecategory = {
            Id: category.ID,
            postType: 'DeleteCategory'
        }
        var r = confirm("Are you sure you want to permanently delete this item");
        if (r == true) {
            ProductService.Delete(BfsDeletecategory);
            $scope.msgclass = 'text-success';           
            $timeout(function () { $scope.message = ''; }, 1500);
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    // Add category data
    $scope.onlyCharacter = /^[a-zA-Z0-9-]*$/;
    $scope.add_category = function () {
try{
    if ($scope.metakeyword == undefined || $scope.metakeyword == "") {
            $scope.metakeyword = "";
        }
		if ($scope.metadescription == undefined || $scope.metadescription == "") {
            $scope.metadescription = "";
        }
		if ($scope.URL == undefined || $scope.URL == "") {
            $scope.URL = "";
        }
    if ($scope.PageTitle == undefined || $scope.PageTitle == "") {
            $scope.PageTitle = "";
        }
    if ($scope.AltTags == undefined || $scope.AltTags == "") {
            $scope.AltTags = "";
        }
    if ($scope.addcategory == undefined || $scope.addcategory== "") {
            $scope.addcategory = "";
        }
        for (var i = 0; i < $scope.categoryData.length; i++) {
            if ($scope.addcategory == $scope.categoryData[i].category_name) {
                alert("A category with same name exists");
                return;
            }
        }       
            var Bfscategory = {
                categoryName: $scope.addcategory,
                Metadescription:$scope.metadescription,
				Metakeyword:$scope.metakeyword,
				Metatitle:$scope.metatitle,
                URL:$scope.URL,
                PageTitle:$scope.PageTitle,
                postType: 'Category'
            }
            ProductService.PostData(Bfscategory);
            $scope.catbtn = true;
            $scope.addcategory = "";
            $scope.metadescription="";
            $scope.metakeyword="";
            $scope.metatitle="";
            $scope.URL="";
            $scope.PageTitle="";
            $scope.msgclass = 'text-success';
            alert("New Category has been Added Successfully");
            $timeout(function () { $scope.message = ''; }, 1500); 
}
        catch(ex){
            console.log(ex.message);
        }
    };

    // update Cateogry
    $scope.update_category = function () {
        try{
            if ($scope.metakeyword == undefined || $scope.metakeyword == "") {
            $scope.metakeyword = "";
        }
		if ($scope.metadescription == undefined || $scope.metadescription == "") {
            $scope.metadescription = "";
        }
		if ($scope.metatitle == undefined || $scope.metatitle == "") {
            $scope.metatitle = "";
        }
		if($scope.addcategory==undefined || $scope.addcategory==""){
           $scope.addcategory="";
           }
        var BfsUpdatecategory = {
            categoryName: $scope.addcategory,
            Metadescription:$scope.metadescription,
            Metakeyword:$scope.metakeyword,
            Metatitle:$scope.metatitle,
            URL:$scope.URL,
            PageTitle:$scope.PageTitle,
            Id: $scope.categoryId,
            postType: 'UpdateCategory'
        }
        ProductService.Update(BfsUpdatecategory);
        $scope.msgclass = 'text-success';
        alert("Category has been updated Successfully");
        $timeout(function () { $scope.message = ''; }, 1500);
        $scope.addcategory = "";
        $scope.metadescription="";
			$scope.metakeyword="";
			$scope.metatitle="";
            $scope.URL="";
            $scope.PageTitle="";
            $scope.AltTags="";    
        $scope.catbtn = true;
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    //fill control value on edit button in table
    $scope.editDataCategory = function (categ) {
        $scope.addcategory = categ.category_name;
        $scope.metadescription=categ.MetaDescription;
		$scope.metakeyword=categ.MetaKeyword;
		$scope.metatitle=categ.MetaTitle;
        $scope.URL=categ.URL;
        $scope.PageTitle=categ.PageTitle;
        $scope.categoryId = categ.ID;
        $scope.catbtn = false;


    };
    /*publish function*/
    $scope.Publish = function (addcategory, val) {
        try{
        if ($scope.PublishCategoryData.length < 12)
            {
        var Bfsaddcategory = {
            publishId: addcategory,
            Publish: 'CategoryName',
            PublishStatus: 1,
            postType: 'PublishRecord'
        };
        ProductService.Update(Bfsaddcategory);
        if (val == 0) {
            alert("Record published successfully");
        }
        }
        else {
            alert("You can publish only 12 records");
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.Toggle = function () {
        try{
        if ($scope.selectedAll) {
            $scope.selectedAll = false;
        } else {
            $scope.selectedAll = true;
        }
        angular.forEach($scope.categoryData, function (Cat) {
            if (Cat.PublishStatus == 0) {
                Cat.Selected = $scope.selectedAll;
            }
        });
        }
        catch(ex){
            console.log(ex.message)
            
        }
    }

    $scope.publishSelected = function () {
        try{
        $scope.selectedId = [];
        angular.forEach($scope.categoryData, function (Cat) {
            if (Cat.Selected == true) {
                $scope.selectedId.push(Cat.ID);
            }
            else if ((Cat.Selected == false)) {
                for (i = 0; i < $scope.selectedId.length; i++) {
                    if ($scope.selectedId[i] == Cat.ID) {
                        $scope.selectedId[i] = $scope.selectedId[i + 1];
                        $scope.selectedId.length = $scope.selectedId.length - 1;
                    }
                }
                //$scope.selectedId.pop(trend.ID); 
            }
        });
        if (12 < ($scope.selectedId.length + $scope.PublishCategoryData.length)) {
            alert("You can publish maximum 12 records");
            return;
        }
        if ($scope.selectedId.length == 0) {
            alert("Sorry no records to publish");
            return;
        }
        for (i = 0; i < $scope.selectedId.length; i++) {
            $scope.Publish($scope.selectedId[i], '2');
        }

        
        alert("Record(s) published successfully");
        $scope.selectedAll = false;
    }    
    catch(ex){
        console.log(ex.message);
    }
    }
});

//MediumController
app.controller('MediumController', function ($scope, $http, $timeout, ProductService, $rootScope, $location) {
    $rootScope.SessionEmail = localStorage.getItem("AdminEmailSession");
    $scope.CheckAdminLogin = function () {
        if ($rootScope.SessionEmail == '' || $rootScope.SessionEmail == undefined) {
            $location.path("/admin/");
            alert("You have to login before accessing the page");
        }
    }
    $scope.CheckAdminLogin();
    var Bfsgetmediumdata = [];
    $scope.onlyCharacter = /^[a-zA-Z0-9-]*$/;
    $scope.medbtn = true;
    $scope.selectedId = [];
    $scope.Bfsgetmediumdata = [];
    $scope.Getmedium = function () {
        try{
            ProductService.GetCategories();
            $scope.$on('dataLoaded', function (event, data) {
                $scope.Bfsgetmediumdata = data.Medium[0];
                $scope.BfsPublishedgetmediumdata = data.PublishMedium[0];
            });
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.Getmedium();
$scope.Reset=function(){
    try{
        var r = confirm("Are you sure to clear all fields");
        if (r == true) {
    $scope.addMedium="";
    $scope.metadescription="";
    $scope.metakeyword="";
    $scope.metatitle="";
    $scope.URL="";
    $scope.PageTitle="";
    $scope.AltTags="";         
    $scope.medbtn = true;
        }
        
}
    catch(ex){
            console.log(ex.message);
        }
}
    $scope.AddMedium = function () {
try{
    if ($scope.metakeyword == undefined || $scope.metakeyword == "") {
            $scope.metakeyword = "";
        }
		if ($scope.metadescription == undefined || $scope.metadescription == "") {
            $scope.metadescription = "";
        }
		if ($scope.URL == undefined || $scope.URL == "") {
            $scope.URL = "";
        }
    if ($scope.PageTitle == undefined || $scope.PageTitle == "") {
            $scope.PageTitle = "";
        }
    if ($scope.AltTags == undefined || $scope.AltTags == "") {
            $scope.AltTags = "";
        }
    if ($scope.addMedium == undefined || $scope.addMedium== "") {
            $scope.addMedium = "";
        }
    
        for (var i = 0; i < $scope.Bfsgetmediumdata.length; i++) {
            if ($scope.addMedium == $scope.Bfsgetmediumdata[i].medium_name) {
                alert("A medium with same name already exists");
                return;
            }
        }
            var BfsMedium = {
                Mediumname: $scope.addMedium,
                Metadescription:$scope.metadescription,
				Metakeyword:$scope.metakeyword,
				Metatitle:$scope.metatitle,
                URL:$scope.URL,
                PageTitle:$scope.PageTitle,
                AltTags:$scope.AltTags,
                postType: 'Medium'
            }
            ProductService.PostData(BfsMedium);
            // $scope.msgclass = 'text-success';
            // $scope.message = "New Medium has been Added Successfully...";
            // $timeout(function () { $scope.message = ''; }, 1500);
            alert("Record  Added successfully");
                $scope.addMedium = "";
                $scope.metadescription="";
                $scope.metakeyword="";
                $scope.metatitle="";
                $scope.URL="";
                $scope.PageTitle="";
                $scope.AltTags="";
}
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.editDatamidum = function (midumdata) {
        try{
        $scope.midiumId = midumdata.ID;
        $scope.addMedium = midumdata.medium_name;
        $scope.metadescription=midumdata.MetaDescription;
		$scope.metakeyword=midumdata.MetaKeyword;
		$scope.metatitle=midumdata.MetaTitle;
        $scope.URL=midumdata.URL;
        $scope.PageTitle=midumdata.PageTitle; 
        $scope.AltTags=midumdata.AltTags;      
        $scope.medbtn = false;
        }
        catch(ex){
			console.log(ex.message);
		}
    }

    $scope.Updatemidum = function () {
        try{
         if ($scope.metakeyword == undefined || $scope.metakeyword == "") {
            $scope.metakeyword = "";
        }
		if ($scope.metadescription == undefined || $scope.metadescription == "") {
            $scope.metadescription = "";
        }
		if ($scope.metatitle == undefined || $scope.metatitle == "") {
            $scope.metatitle = "";
        }
		if($scope.addMedium==undefined || $scope.addMedium==""){
           $scope.addMedium="";
           }    
        var BfsUpdateMedium = {
            Name: $scope.addMedium,
            Metadescription:$scope.metadescription,
            Metakeyword:$scope.metakeyword,
            Metatitle:$scope.metatitle,
            URL:$scope.URL,
            PageTitle:$scope.PageTitle,
            AltTags:$scope.AltTags,
            Id: $scope.midiumId,
            postType: 'UpdateMedium'
        }
        var r = confirm("Record has been updated");
        if (r == true) {
            ProductService.Update(BfsUpdateMedium);
            // $scope.msgclass = 'text-success';
            // $scope.message = "Medium has been Updated Successfully...";
            // $timeout(function () { $scope.message = ''; }, 1500);		
            $scope.medbtn = true;
            $scope.addMedium = "";
            $scope.metadescription="";
            $scope.metakeyword="";
            $scope.metatitle="";
            $scope.URL="";
            $scope.PageTitle="";
            $scope.AltTags="";
            $scope.midiumId = "";
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.Deletemidium = function (deletemedum) {
        try{
        var BfsDeleteMedium = {
            Id: deletemedum.ID,
            postType: 'DeleteMedium'
        }
        var r = confirm("Are you sure you want to permanently delete this item?");
        if (r == true) {
            ProductService.Delete(BfsDeleteMedium);
            // $scope.msgclass = 'text-success';
            // $scope.message = "Medium has been deleted Successfully...";
            // $timeout(function () { $scope.message = ''; }, 1500);
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    /*publish function*/
    $scope.Publish = function (addmedium, val) {
        try{
        if ($scope.BfsPublishedgetmediumdata.length < 12)
            {
        var Bfsaddmedium = {
            publishId: addmedium,
            Publish: 'MediumName',
            PublishStatus: 1,
            postType: 'PublishRecord'
        };

        ProductService.Update(Bfsaddmedium);
        if (val == 0) {

            alert("Record published successfully");
                 }
        }
        else {
            alert("You can publish only 12 records");
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.Toggle = function () {
        try{
        if ($scope.selectedAll) {
            $scope.selectedAll = false;
        } else {
            $scope.selectedAll = true;
        }
        angular.forEach($scope.Bfsgetmediumdata, function (Med) {
            if (Med.PublishStatus == 0) {
                Med.Selected = $scope.selectedAll;
            }
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    }

    $scope.publishSelected = function () {
        try{
        $scope.selectedId = [];
        angular.forEach($scope.Bfsgetmediumdata, function (Med) {
            if (Med.Selected == true) {
                $scope.selectedId.push(Med.ID);
            }
            else if ((Med.Selected == false)) {
                for (i = 0; i < $scope.selectedId.length; i++) {
                    if ($scope.selectedId[i] == Med.ID) {
                        $scope.selectedId[i] = $scope.selectedId[i + 1];
                        $scope.selectedId.length = $scope.selectedId.length - 1;
                    }
                }
                //$scope.selectedId.pop(trend.ID); 
            }
        });
        if(12 < ($scope.selectedId.length + $scope.BfsPublishedgetmediumdata.length))
        {
            alert("You can publish maximum 12 records");
            return;
        }
        if ($scope.selectedId.length == 0) {
            alert("Sorry no records to publish");
            return;
        }

        for (i = 0; i < $scope.selectedId.length; i++) {
            $scope.Publish($scope.selectedId[i], '2');
        }
        alert("Record(s) published successfully");
        $scope.selectedAll = false;
    }
        catch(ex){
			console.log(ex.message);
		}
    }
    

});

//Genre Controller
app.controller('GenreController', function ($scope, $http, $timeout, ProductService, $rootScope, $location) {
    $rootScope.SessionEmail = localStorage.getItem("AdminEmailSession");
    $scope.CheckAdminLogin = function () {
        if ($rootScope.SessionEmail == '' || $rootScope.SessionEmail == undefined) {
            $location.path("/admin/");
            alert("You have to login before accessing the page");
        }
    }
    $scope.CheckAdminLogin();
    $scope.genbtn = true;
    $scope.onlyCharacter = /^[a-zA-Z0-9-]*$/;
    $scope.selectedId = [];
    $scope.BfsgetGenradata = [];
    $scope.fetchGenre = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BfsgetGenradata = data.Genera[0];
            $scope.BfsgetPublishGenradata = data.PublishGenera[0];
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.fetchGenre();
$scope.Reset=function(){
    try{
        var r = confirm("Are you sure to clear all fields");
        if (r == true) {
    $scope.addgenre="";
    $scope.metadescription="";
    $scope.metakeyword="";
    $scope.metatitle="";
    $scope.URL="";
    $scope.PageTitle="";
    $scope.genbtn = true;
        }
        
}
    catch(ex){
            console.log(ex.message);
        }
}
    $scope.add_genre = function () {
try{
    if ($scope.metakeyword == undefined || $scope.metakeyword == "") {
            $scope.metakeyword = "";
        }
		if ($scope.metadescription == undefined || $scope.metadescription == "") {
            $scope.metadescription = "";
        }
		if ($scope.URL == undefined || $scope.URL == "") {
            $scope.URL = "";
        }
    if ($scope.PageTitle == undefined || $scope.PageTitle == "") {
            $scope.PageTitle = "";
        }
    if ($scope.AltTags == undefined || $scope.AltTags == "") {
            $scope.AltTags = "";
        }
    if ($scope.addgenre == undefined || $scope.addgenre== "") {
            $scope.addgenre = "";
        }
        for (var i = 0; i < $scope.BfsgetGenradata.length; i++) {
            if ($scope.addgenre == $scope.BfsgetGenradata[i].genre_name) {
                alert("A medium with same name already exists");
                return;
            }

        }
            var BfsGenera = {
                genreName: $scope.addgenre,
                Metadescription:$scope.metadescription,
				Metakeyword:$scope.metakeyword,
				Metatitle:$scope.metatitle,
                URL:$scope.URL,
                PageTitle:$scope.PageTitle,
                postType: 'Genera'
            }

            ProductService.PostData(BfsGenera);
            var r = confirm("Record  Added successfully");
            if (r == true) {
                $scope.addgenre = "";
                $scope.metadescription="";
                $scope.metakeyword="";
                $scope.metatitle="";
                $scope.URL="";
                $scope.PageTitle="";
                // $scope.msgclass = 'text-success';
                // $scope.message = "New Genera has been Added Successfully...";
                // $timeout(function () { $scope.message = ''; }, 1500);
            }
}
        catch(ex){
			console.log(ex.message);
		}
    };

    //Fill genre data
    $scope.editDataGenre = function (gene) {
        try{
        $scope.addgenre = gene.genre_name;
        $scope.metadescription=gene.MetaDescription;
		$scope.metakeyword=gene.MetaKeyword;
		$scope.metatitle=gene.MetaTitle;
        $scope.URL=gene.URL;
        $scope.PageTitle=gene.PageTitle;     
        $scope.genreId = gene.ID;
        $scope.genbtn = false;
        }
        catch(ex){
			console.log(ex.message);
		}

    };
    //delete genre
    $scope.deleteGenre = function (genre) {
        try{
        var BfsDeleteGenre = {
            Id: genre.ID,
            postType: 'DeleteGenera'
        }
        var r = confirm("Are you sure you want to permanently delete this item?");
        if (r == true) {
            ProductService.Delete(BfsDeleteGenre);
            // $scope.msgclass = 'text-success';
            // $scope.message = "Genera has been deleted Successfully...";
            // $timeout(function () { $scope.message = ''; }, 1500);
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    //Update Genre
    $scope.update_genre = function () {
        try{
        var BfsUpdateGenera = {
            Name: $scope.addgenre,
            Metadescription:$scope.metadescription,
            Metakeyword:$scope.metakeyword,
            Metatitle:$scope.metatitle,
            URL:$scope.URL,
            PageTitle:$scope.PageTitle,
            Id: $scope.genreId,
            postType: 'UpdateGenera'
        }
        ProductService.Update(BfsUpdateGenera);
        var r = confirm("Record has been updated");
        if (r == true) {
            $scope.addgenre = "";
            $scope.metadescription="";
            $scope.metakeyword="";
            $scope.metatitle="";
            $scope.URL="";
            $scope.PageTitle="";
            $scope.genreId = "";
        }
        // $scope.msgclass = 'text-success';
        // $scope.message = "Genera has been Updated Successfully...";
        // $timeout(function () { $scope.message = ''; }, 1500);
        $scope.genbtn = true;
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    /*publish function*/
    $scope.Publish = function (addGenere, val) {
        try{
        if ($scope.BfsgetPublishGenradata.length < 12) {
        var BfsaddGenere = {
            publishId: addGenere,
            Publish: 'GenreName',
            PublishStatus: 1,
            postType: 'PublishRecord'
        };
        ProductService.Update(BfsaddGenere);
        if (val == 0) {
            alert("Record published successfully");

        }
        }
        else {
            alert("You can publish only 12 records");
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.Toggle = function () {
        try{
        if ($scope.selectedAll) {
            $scope.selectedAll = false;
        } else {
            $scope.selectedAll = true;
        }
        angular.forEach($scope.BfsgetGenradata, function (Gen) {
            if (Gen.PublishStatus == 0) {
                Gen.Selected = $scope.selectedAll;
            }
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    }

    $scope.publishSelected = function () {
        try{
        $scope.selectedId = [];
        angular.forEach($scope.BfsgetGenradata, function (Gen) {
            if (Gen.Selected == true) {
                $scope.selectedId.push(Gen.ID);
            }
            else if ((Gen.Selected == false)) {
                for (i = 0; i < $scope.selectedId.length; i++) {
                    if ($scope.selectedId[i] == Gen.ID) {
                        $scope.selectedId[i] = $scope.selectedId[i + 1];
                        $scope.selectedId.length = $scope.selectedId.length - 1;
                    }
                }
                //$scope.selectedId.pop(trend.ID); 
            }
        });
        if (12 < ($scope.selectedId.length + $scope.BfsgetPublishGenradata.length)) {
            alert("You can publish maximum 12 records");
            return;
        }
        if ($scope.selectedId.length == 0) {
            alert("Sorry no records to publish");
            return;
        }
        for (i = 0; i < $scope.selectedId.length; i++) {
            $scope.Publish($scope.selectedId[i], '2');
        }
        alert("Record(s) published successfully");
        $scope.selectedAll = false;
    }
        catch(ex){
			console.log(ex.message);
		}
    }
    
});

//Collectible Controller
app.controller('CollectibleController', function ($scope, $http, $timeout, ProductService, $rootScope, $location) {
    $rootScope.SessionEmail = localStorage.getItem("AdminEmailSession");
    $scope.CheckAdminLogin = function () {
        if ($rootScope.SessionEmail == '' || $rootScope.SessionEmail == undefined) {
            $location.path("/admin/");
            alert("You have to login before accessing the page");
        }
    }
    $scope.CheckAdminLogin();
    $scope.collbtn = true;
    $scope.onlyCharacter = /^[a-zA-Z0-9-]*$/;
    $scope.selectedId = [];
    $scope.BfsCollectibleList = [];
    $scope.fetchcollectible = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BfsCollectibleList = data.collectible[0];
            $scope.BfsPublishCollectibleList = data.Publishcollectible[0];
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.fetchcollectible();
$scope.Reset=function(){
    try{
        var r = confirm("Are you sure to clear all fields");
        if (r == true) {
    $scope.collectibleName="";
    $scope.metadescription="";
    $scope.metakeyword="";
    $scope.metatitle="";
    $scope.URL="";
    $scope.PageTitle="";
    $scope.AltTags="";        
     $scope.collbtn = true;
        }
        
}
    catch(ex){
            console.log(ex.message);
        }
}    
    $scope.add_collectible = function () {
try{
    if ($scope.metakeyword == undefined || $scope.metakeyword == "") {
            $scope.metakeyword = "";
        }
		if ($scope.metadescription == undefined || $scope.metadescription == "") {
            $scope.metadescription = "";
        }
		if ($scope.URL == undefined || $scope.URL == "") {
            $scope.URL = "";
        }
    if ($scope.PageTitle == undefined || $scope.PageTitle == "") {
            $scope.PageTitle = "";
        }
    if ($scope.AltTags == undefined || $scope.AltTags == "") {
            $scope.AltTags = "";
        }
    if ($scope.collectibleName == undefined || $scope.collectibleName== "") {
            $scope.collectibleName = "";
        }
        for (var i = 0; i < $scope.BfsCollectibleList.length; i++) {
            if ($scope.collectibleName == $scope.BfsCollectibleList[i].collectible_name) {
                alert("A Collectible with same name already exists");
                return;
            }

        }
            var BfsCollectible = {
                Name: $scope.collectibleName,
                Metadescription:$scope.metadescription,
				Metakeyword:$scope.metakeyword,
				Metatitle:$scope.metatitle,
                URL:$scope.URL,
                AltTags:$scope.AltTags,
                PageTitle:$scope.PageTitle,
                postType: 'Collectible'
            }
            ProductService.PostData(BfsCollectible);
            var r = confirm("Record  Added successfully");
            if (r == true) {
                $scope.collectibleName = "";
                $scope.metadescription="";
                $scope.metakeyword="";
                $scope.metatitle="";
                $scope.URL="";
                $scope.PageTitle="";
                $scope.AltTags="";
                // $scope.msgclass = 'text-success';
                // $scope.message = "New Collectible has been Added Successfully...";
                // $timeout(function () { $scope.message = ''; }, 1500);
            }
}
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.editcollectibles = function (collect) {
        try{
        $scope.collectibleName = collect.collectible_name;
        $scope.metadescription=collect.MetaDescription;
		$scope.metakeyword=collect.MetaKeyword;
		$scope.metatitle=collect.MetaTitle;
        $scope.URL=collect.URL;
        $scope.PageTitle=collect.PageTitle;
        $scope.AltTags=collect.AltTags;    
        $scope.collectibleid = collect.ID;
        $scope.collbtn = false;
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.update_collectible = function () {
        try{
        var BfsUpdateCollectible = {
            Name: $scope.collectibleName,
            Metadescription:$scope.metadescription,
            Metakeyword:$scope.metakeyword,
            Metatitle:$scope.metatitle,
            URL:$scope.URL,
            PageTitle:$scope.PageTitle,
            AltTags:$scope.AltTags,
            Id: $scope.collectibleid,
            postType: 'UpdateCollectible'
        }
        ProductService.Update(BfsUpdateCollectible);
        var r = confirm("Record has been updated");
        if (r == true) {
            $scope.collectibleName = "";
            $scope.metadescription="";
            $scope.metakeyword="";
            $scope.metatitle="";
            $scope.URL="";
            $scope.PageTitle="";
            $scope.AltTags="";
            $scope.collectibleid = "";
            // $scope.msgclass = 'text-success';
            // $scope.message = "Collectible has been Updated Successfully...";
            // $timeout(function () { $scope.message = ''; }, 1500);
            $scope.collbtn = true;
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.delete_collectible = function (collectible) {
        try{
        var BfsDeleteCollectible = {
            Id: collectible.ID,
            postType: 'DeleteCollectible'
        }
        var r = confirm("Are you sure you want to permanently delete this item?");
        if (r == true) {
            ProductService.Delete(BfsDeleteCollectible);
            // $scope.msgclass = 'text-success';
            // $scope.message = "Collectible has been deleted Successfully...";
            // $timeout(function () { $scope.message = ''; }, 1500);
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    /*publish function*/
    $scope.Publish = function (addcollectible, val) {
        try{
        if ($scope.BfsPublishCollectibleList.length<12) { 
        var Bfsaddcollectible = {
            publishId: addcollectible,
            Publish: 'CollectibleName',
            PublishStatus: 1,
            postType: 'PublishRecord'
        };
        ProductService.Update(Bfsaddcollectible);
        if (val == 0) {
            alert("Record published successfully");

        }
        }
        else {
            alert("You can publish only 12 records");
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.Toggle = function () {
        try{
        if ($scope.selectedAll) {
            $scope.selectedAll = false;
        } else {
            $scope.selectedAll = true;
        }
        angular.forEach($scope.BfsCollectibleList, function (Coll) {
            if (Coll.PublishStatus == 0) {
                Coll.Selected = $scope.selectedAll;
            }
        });
        }
        catch(ex){
			console.log(ex.message);
		}

    }

    $scope.publishSelected = function () {
        try{
        $scope.selectedId = [];
        angular.forEach($scope.BfsCollectibleList, function (Coll) {
            if (Coll.Selected == true) {
                $scope.selectedId.push(Coll.ID);
            }
            else if ((Coll.Selected == false)) {
                for (i = 0; i < $scope.selectedId.length; i++) {
                    if ($scope.selectedId[i] == Coll.ID) {
                        $scope.selectedId[i] = $scope.selectedId[i + 1];
                        $scope.selectedId.length = $scope.selectedId.length - 1;
                    }
                }
                //$scope.selectedId.pop(trend.ID); 
            }
        });
        if (12 < ($scope.selectedId.length + $scope.BfsPublishCollectibleList.length)) {
            alert("You can publish maximum 12 records");
            return;
        }
        if ($scope.selectedId.length == 0) {
            alert("Sorry no records to publish");
            return;
        }
        for (i = 0; i < $scope.selectedId.length; i++) {
            $scope.Publish($scope.selectedId[i], '2');
        }
        alert("Record(s) published successfully");
        $scope.selectedAll = false;
    }
        catch(ex){
			console.log(ex.message);
		}
    }
    
});

app.controller("ProductController", function ($scope, $http, ProductService, fileUpload, $timeout,$rootScope, $location,$filter) {
	$scope.Category="";
	$scope.Medium = "";
    $scope.Genre = "";
	$scope.Artist="";
    $rootScope.SessionEmail = localStorage.getItem("AdminEmailSession");
    $scope.CheckAdminLogin = function () {
        if ($rootScope.SessionEmail == '' || $rootScope.SessionEmail == undefined) {
            $location.path("/admin/");
            alert("You have to login before accessing the page");
        }
    }
	
    $scope.CheckAdminLogin();
    var BfsgetGenradata = [];
    var categoryData = [];
    var Bfsgetmediumdata = [];
    $scope.selectedId = [];
    $scope.prdbtn = true;
    $scope.groupedItems = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.gap = 5;
    $scope.chkStatusR=false;
    $scope.uploadFile = function (BfsProductDetails) {
        fileUpload.uploadFileToUrl(BfsProductDetails);
    };
    /*This is used to Get Data for Dropdown value*/
    $scope.getProductCategory = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.categoryData = data.Publishcategory[0];
            $scope.Bfsgetmediumdata = data.PublishMedium[0];
            $scope.BfsgetGenradata = data.PublishGenera[0];
            $scope.BfsCollectibleList = data.Publishcollectible[0];
            $scope.BfsArtistList = data.PublishArtistList[0];
            $scope.BFSProductList = data.Product[0];
            $scope.DeletedProduct = data.DeletedProduct[0];
            $scope.TotalData = data.Product[0].length;
            $scope.TotalData1=$scope.BFSProductList;
            $scope.TotalDeletedData = data.DeletedProduct[0].length;
            $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
            $scope.TotalDeletedPages = Math.ceil($scope.TotalDeletedData / $scope.itemsPerPage);
            $scope.groupToPages();
            $scope.groupDeletedPages();
            $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
            $scope.Deletedrange($scope.TotalDeletedPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.getProductCategory();
    /*validation*/
    $scope.onlynumbers = /^\d+(\.\d{1,2})?$/;
    $scope.onlyCharacter = /^[a-zA-Z0-9-]*$/;
    //Add Product Data
    $scope.addProduct = function () {
        try{
        if ($scope.imageFile == undefined ||$scope.imageFile.length<=0)
        {
            alert("Please add Thumbnail image of product");
            return;
        }
        if ($scope.Other_Images == undefined ||$scope.Other_Images.length<=0)
        {
            alert("Please add product other image of product");
            return;
        }
        if ($scope.remark == undefined) {
            $scope.remark = "";
        }
        if ($scope.productYear == undefined || $scope.productYear == "") {
            $scope.productYear = "";
        }
        if ($scope.Other_Images == undefined ||$scope.Other_Images.length<=0)
        {
            $scope.Other_Images = "";
        }
        
        if ($scope.depth == undefined || $scope.depth == "") {
            $scope.depth = "";
        }
        if ($scope.metakeyword == undefined || $scope.metakeyword == "") {
            $scope.metakeyword = "";
        }
		if ($scope.metadescription == undefined || $scope.metadescription == "") {
            $scope.metadescription = "";
        }
		if ($scope.metatitle == undefined || $scope.metatitle == "") {
            $scope.metatitle = "";
        }
        if ($scope.Price == undefined || $scope.Price == "") {
            $scope.Price = 0;
        }
        if ($scope.PriceOnRequest == undefined || $scope.PriceOnRequest == "") {
            $scope.PriceOnRequest = "";
        }    
       
        var SNo = 0;
        
        if ($scope.Other_Images.length <= 5) {

            var BfsProductData = {
                File: $scope.imageFile,
                OtherView: $scope.Other_Images,
                UploadUrl: "api/file",
                ProductName: $scope.productName,
                SerialNo: SNo,
                CategoryId: $scope.Category,
                GeneraId: $scope.Genre,
                MediumId: $scope.Medium,
                CollectibleId: $scope.Collectibles,
                ArtistId: $scope.Artist,
                NewArtist: "",
                ProductType:"",
                ProductPrice: $scope.Price,
                Remarks: $scope.remark,
                ProductYear: $scope.productYear,
                Height: $scope.Height,
                Weight: $scope.Width,
                depth: $scope.depth,
                DollerPrice: $scope.PriceDoller,
                PriceOnRequest:$scope.PriceOnRequest,
                chkStatusPrice:$scope.chkStatusPrice,
				Metadescription:$scope.metadescription,
				Metakeyword:$scope.metakeyword,
				Metatitle:$scope.metatitle,
                URL:$scope.URL,
                PageTitle:$scope.PageTitle,
                AltTags:$scope.AltTags,
                ActionType: 'New',
                Id: 0,
                Updatetype: 'AddContent',
                addType: 'Product'
            };
            var r = confirm("Record  Added successfully");
            if (r == true) {
                $scope.uploadFile(BfsProductData);

                $scope.productName = "";
                $scope.Category ="" ;
                $scope.Medium ="" ;
                $scope.Genre = "";
                $scope.Collectibles = 0;
                $scope.Artist ="" ;
                $scope.productYear = "";
                $scope.Height = "";
                $scope.Width = "";
                $scope.depth = "";
                $scope.Price = "";
                $scope.PriceOnRequest="";
                $scope.chkStatusPrice="";
                $scope.PriceDoller = "";
				$scope.metadescription="";
				$scope.metakeyword="";
				$scope.metatitle="";
                $scope.URL="";
                $scope.PageTitle="";
                $scope.AltTags="";
                $scope.imageFile = "";
                $scope.remark = "";
                $("input[type='file']").val("");
                $scope.getProductCategory();
            }
        }
        else {
            alert("You can add maximum 5 product other images")
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    //Publish Product
    $scope.publish = function (product, val) {
        try{
        var BfsPublishProduct = {
            publishId: product,
            Publish: 'Product',
            PublishStatus: 1,
            postType: 'PublishRecord'
        };


        ProductService.Update(BfsPublishProduct);

        if (val == 0) {
            alert("Record published successfully");
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    //Delete Product
    $scope.DeleteProduct = function (product) {
        try{
        var BfsProductId = {
            Id: product.ID,
            postType: 'DeleteProduct'
        };
        var r = confirm("Are you sure you want to permanently delete this item?");
        if (r == true) {
            ProductService.Delete(BfsProductId);
            // $scope.msgclass = 'text-success';
            // $scope.message = "Product has been deleted Successfully...";
            // $timeout(function () { $scope.message = ''; }, 1500);
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    //Clear Control
    $scope.Clear = function () {
        try{
        var r = confirm("Are you sure to clear all fields");
        if (r == true) {
			$scope.prdbtn = true;
            $scope.productName = "";
            $scope.Category = "";
            $scope.Medium ="" ;
            $scope.Genre = "";
            $scope.Collectibles = 0;
            $scope.Artist = "";
            $scope.productYear = "";
            $scope.Height = "";
            $scope.Width = "";
            $scope.Price = "";
            $scope.PriceOnRequest="";
            $scope.chkStatusPrice="";
            $scope.PriceDoller = "";
			$scope.depth="";
			$scope.metadescription="";
			$scope.metakeyword="";
			$scope.metatitle="";
            $scope.URL="";
            $scope.PageTitle="";
            $scope.AltTags="";
            $scope.imageFile = "";
            $scope.remark = "";
            $("input[type='file']").val("");
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    //Select ByDefault
    $scope.Default = function () {
        $scope.Category = "";
        $scope.Medium ="" ;
        $scope.Genre = "";
        $scope.Collectibles = 0;
        $scope.Artist ="" ;
    };
    $scope.Default();
    /* Get data in input fields */
    $scope.EditProduct = function (product) {
        $scope.Productid = product.ID;
        $scope.productName = product.ProductName;
        $scope.Category = product.CategoryId;
        $scope.Genre = product.GenreId;
        $scope.Medium = product.MediumId;
        $scope.Collectibles = product.CollectibleId;
        $scope.Artist = product.ArtistId;
        $scope.Price = product.ProductPrice;
        $scope.PriceOnRequest=product.PriceOnRequest;
        $scope.chkStatusPrice=product.chkStatusPrice;
        $scope.showHidetext();
        $scope.remark = product.ProductRemarks;
		$scope.metadescription=product.MetaDescription;
		$scope.metakeyword=product.MetaKeyword;
		$scope.metatitle=product.MetaTitle;
        $scope.URL=product.URL;
        $scope.PageTitle=product.PageTitle;
        $scope.AltTags=product.AltTags;
		if(product.YearOfPainting=="" || product.YearOfPainting==undefined){
			product.YearOfPainting="";
		}
		else{
		  $scope.productYear = product.YearOfPainting;	
		} 
        if(product.PriceOnRequest=="" || product.PriceOnRequest==undefined){
            product.PriceOnRequest="";
        }
        $scope.Height = product.ProductHeight;
        $scope.Width = product.ProductWidth;
        $scope.depth = product.productDepth;
        $scope.prdbtn = false;

    };
    /*Update product data */
    $scope.UpdateProductFile = function () {
        try{
        // alert("Function Called");
        if (($scope.remark == undefined) || ($scope.remark == "")) {
            $scope.remark = "";
        }
        if (($scope.depth == undefined) || ($scope.depth == "")) {
            $scope.depth = "";
        }
        if ($scope.Other_Images == undefined ||$scope.Other_Images=="" ||$scope.Other_Images.length<=0 )
        {
            $scope.Other_Images = "";
        }
        if ($scope.imageFile == undefined ||$scope.imageFile.length<=0)
        {
            $scope.imageFile = "";
        }
        if ($scope.productYear == undefined || $scope.productYear == "") {
            $scope.productYear = ""
        }
		if ($scope.metakeyword == undefined || $scope.metakeyword == "") {
            $scope.metakeyword = "";
        }
		if ($scope.metadescription == undefined || $scope.metadescription == "") {
            $scope.metadescription = "";
        }
		if ($scope.metatitle == undefined || $scope.metatitle == "") {
            $scope.metatitle = "";
        }
        if ($scope.Price == undefined || $scope.Price == "") {
            $scope.Price = 0;
        }
        if ($scope.PriceOnRequest == undefined || $scope.PriceOnRequest == "") {
            $scope.PriceOnRequest = "";
        }    
		
        if ($scope.Other_Images.length <= 5) {
            var BFSupdateData = {
                File: $scope.imageFile,
                OtherView: $scope.Other_Images,
                UploadUrl: "api/file",
                ProductName: $scope.productName,
                CategoryId: $scope.Category,
                GeneraId: $scope.Genre,
                MediumId: $scope.Medium,
                CollectibleId: $scope.Collectibles,
                ArtistId: $scope.Artist,
                NewArtist: "",
                ProductType:"",
                ProductPrice: $scope.Price,
                Remarks: $scope.remark,
                ProductYear: $scope.productYear,
                Height: $scope.Height,
                Weight: $scope.Width,
                depth: $scope.depth,
                DollerPrice: $scope.PriceDoller,
                PriceOnRequest:$scope.PriceOnRequest,
                chkStatusPrice:$scope.chkStatusPrice,
				Metadescription:$scope.metadescription,
				Metakeyword:$scope.metakeyword,
				Metatitle:$scope.metatitle,
                URL:$scope.URL,
                PageTitle:$scope.PageTitle,
                AltTags:$scope.AltTags,
                Id: $scope.Productid,
                ActionType: 'Update',
                Updatetype: 'ContentUpdate',
                addType: 'Product'
            };
            $scope.uploadFile(BFSupdateData);
            alert("Record updated successfully");
            $scope.getProductCategory();
            $scope.prdbtn = true;
            $scope.productName = "";
            $scope.Category = "";
            $scope.Medium ="" ;
            $scope.Genre = "";
            $scope.Collectibles = 0;
            $scope.Artist ="" ;
            $scope.productYear = "";
            $scope.Height = "";
            $scope.Width = "";
            $scope.depth = "";
            $scope.Price = "";
            $scope.PriceOnRequest="";
            $scope.chkStatusPrice="";
            $scope.PriceDoller = "";
			$scope.metadescription="";
			$scope.metakeyword="";
			$scope.metatitle="";
            $scope.URL="";
            $scope.PageTitle="";
            $scope.AltTags="";
            $scope.remark = "";
            $("input[type='file']").val("");
        }
		
        else {
            alert("You can add maximum 5 product other images");
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    /* multiple publish function*/
    $scope.publishSelected = function () {
        try{
        angular.forEach($scope.BFSProductList, function (product) {
            if (product.Selected == true) {
                $scope.selectedId.push(product.ID);
            }
            else if ((product.Selected == false)) {
                for (i = 0; i < $scope.selectedId.length; i++) {
                    if ($scope.selectedId[i] == product.ID) {
                        $scope.selectedId[i] = $scope.selectedId[i + 1];
                        $scope.selectedId.length = $scope.selectedId.length - 1;
                    }
                }
                //$scope.selectedId.pop(trend.ID); 
            }
        });
        for (i = 0; i < $scope.selectedId.length; i++) {
            $scope.publish($scope.selectedId[i], '2');
        }
        alert("Record(s) published successfully");
        $scope.selectedAll = false;
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    /*single publish*/
    $scope.Toggle = function () {
        try{
        if ($scope.selectedAll) {
            $scope.selectedAll = false;
        } else {
            $scope.selectedAll = true;
        }
        angular.forEach($scope.pagedItems[$scope.currentPage], function (product) {
            product.Selected = $scope.selectedAll;
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.CheckSize = function (imageFile1) {
        try{
        if ((imageFile1.files["0"].size / 1024) > 150) {
            $scope.imagemessage = "Image size too large(should be less than 150 KB)";

        }
        else {
            $scope.imagemessage = "";
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.ActivateDeleted = function (DelProduct) {
        try{
        var Activateproduct = {
            ID: DelProduct.ID,
            Activate: 'Product',
            postType: 'ActivateDeleted'
        }
        ProductService.Update(Activateproduct);
        alert("Product Activated");
        $scope.getProductCategory();
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.ChangeStatus = function (product, val) {
try{
        var ChangedStatus = {
            ID: product,
            status: val,
            TableType:'BFSProduct',
            postType: 'ChangeStatus'
        }


        ProductService.Update(ChangedStatus);
        alert("Status changed");
        $scope.getProductCategory();
}
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.ChangeRights = function (product, val) {
        try{
        var ChangedRights = {
            ID: product,
            status: val,
            TableType:'BFSProduct',
            postType: 'ChangeRights'
        }
        ProductService.Update(ChangedRights);
        alert("Exclusive rights status changed");
        $scope.getProductCategory();
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.groupToPages = function () {
        try{
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.BFSProductList.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.BFSProductList[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.BFSProductList[i]);
            }
        }
        /*$scope.categoryName = $scope.BFSProductList[0].category_name;*/
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.groupDeletedPages = function () {
        try{
        $scope.pagedDeletedItems = [];

        for (var i = 0; i < $scope.TotalDeletedData; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedDeletedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.DeletedProduct[i]];
            } else {
                $scope.pagedDeletedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.DeletedProduct[i]);
            }
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.range = function (size, start, end) {
        try{
        $scope.ret = [];


        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.ret.push(i);
            }
        }

        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.ret.push(i);
            }
        }
        return $scope.ret;
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.Deletedrange = function (size, start, end) {
        try{
        $scope.delret = [];


        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.delret.push(i);
            }
        }

        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.delret.push(i);
            }
        }
        return $scope.delret;
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.prevPage = function () {
        try{
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.nextPage = function () {
        try{
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.nextDelPage = function () {
        try{
        if ($scope.currentPage < $scope.pagedDeletedItems.length - 1) {
            $scope.currentPage++;
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.FirstPage = function () {
        try{
        $scope.currentPage = 0;
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.LastPage = function () {
        try{
        $scope.currentPage = $scope.TotalPages - 1;
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.LastDelPage = function () {
        try{
        $scope.currentPage = $scope.TotalDeletedPages - 1;
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.setPage = function () {
        try{
        $scope.currentPage = this.n;
        }
        catch(ex){
			console.log(ex.message);
		}
    };

    $scope.changeTotalItem = function () {
        try{
        $scope.itemsPerPage = $scope.ItemsPerPage;
        $scope.getProductCategory();
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.showHidetext=function()
    {
        try{
      if ($scope.chkStatusPrice) {          
          $scope.showhidetext = true;
          $scope.chkStatusR=true;
      }
else {
    $scope.showhidetext = false; 
    $scope.chkStatusR=false;
    }  
        }
     catch(ex){
        console.log(ex.message);
        }
    }
    $scope.customfilter=function(filter){
        try{
        $scope.BFSProductList = $filter('filter')($scope.TotalData1,$scope.search);
       console.log($scope.TotalData);
             $scope.TotalData = $scope.BFSProductList.length;
            $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
            $scope.groupToPages();
            $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
        }
        catch(ex){
            console.log(ex.message);
        }
    }
});

//Bind Product Controller
app.controller("BindProductController", function ($scope, $http, ProductService, $routeParams, $sce, $location, $rootScope, $timeout, $filter,$window) {
    $scope.artErrorMessage="";
	$scope.img1 = false;
    $scope.img2 = true;
    $scope.img3 = true;
    $scope.img4 = true;
    $scope.img5 = true;
    $scope._ProductId = "";
    $scope._AuthenticateEmail = "";
    $scope.emptyType = true;
    $scope.showImages1 = function () {
        $scope.img3 = true;
        $scope.img1 = false;
        $scope.img2 = true;
        $scope.img4 = true;
        $scope.img5 = true;
    };
    $scope.showImages3 = function () {
        $scope.img3 = false;
        $scope.img1 = true;
        $scope.img2 = true;
        $scope.img4 = true;
        $scope.img5 = true;
    };
    $scope.showImages2 = function () {
        $scope.img3 = true;
        $scope.img1 = true;
        $scope.img2 = false;
        $scope.img4 = true;
        $scope.img5 = true;
    };
    $scope.showImages4 = function () {
        $scope.img3 = true;
        $scope.img1 = true;
        $scope.img2 = true;
        $scope.img4 = false;
        $scope.img5 = true;
    };
    $scope.showImages5 = function () {
        $scope.img3 = true;
        $scope.img1 = true;
        $scope.img2 = true;
        $scope.img4 = true;
        $scope.img5 = false;
    };
    $scope.uploadFile = function (BfsProduct) {
        fileUpload.uploadFileToUrl(BfsProduct);

    };
    $scope.page2 = true;
    $scope.BindMenulist = [];// table bind
    $scope.UlMenuBind = [];  //Ul Bind
    $scope.Parmanet_hide = true;
    $scope.Menubtn = true;
    $scope.HierarchybtnAdd = true;
    $scope.fileRead = [];
    $scope.menuJSON = [];
    $scope.emaildId = "";
    $scope.itemsPerPage = 12;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.currentDeletedPage = 0;
    $scope.gap = 5;
    $scope.SelectedFilter = "";
    $rootScope.galleryFlag = 1;
    
	$scope.getProductCategory = function () {
        try{
        if ($routeParams.tableName != undefined && $routeParams.C_Id != undefined) {
            if (localStorage.getItem("EmailSession") != null) {
                $scope.emaildId = localStorage.getItem("EmailSession");
            }
            else {
                $scope.emaildId = "";
            }
        
            var BfsProductJson = {
                ID: $routeParams.C_Id,
                tblname: $routeParams.tableName,
                EmailId: $scope.emaildId,                
                postType: "GetProdcutGallary"
            }
            $http.post("/api/GetWitParm", BfsProductJson).then(function (response) {
                $rootScope.event_id="";
                $rootScope.dynamicPageTitle="";
				$rootScope.MetaDescription="";
				$rootScope.MetaTitle="";
				$rootScope.MetaKeyword="";
                if ((response.data[0] != undefined) && (response.data[0].returnType == "ProductGallary")) {
                    $scope.ProductData = response.data;	
                    
                    $rootScope.dynamicPageTitle=$scope.ProductData[0].category_name;
                    $rootScope.MetaDescription=$scope.ProductData[0].MetaDescription;
                   $rootScope.MetaTitle=$scope.ProductData[0].MetaTitle;
				   $rootScope.MetaKeyword=$scope.ProductData[0].MetaKeyword;
 
                   if ($scope.SelectedFilter == "1")
                    {
                        $scope.ProductData = $filter('orderBy')($scope.ProductData, 'ProductName');
                    }
                    else if ($scope.SelectedFilter == "2") {
                        $scope.ProductData = $filter('orderBy')($scope.ProductData, '-ProductName');
                    }
                    else if ($scope.SelectedFilter == "3") {
                        $scope.ProductData = $filter('orderBy')($scope.ProductData, 'ProductPrice');
                    }
                    else if ($scope.SelectedFilter == "4") {
                        $scope.ProductData = $filter('orderBy')($scope.ProductData, '-ProductPrice');
                    }
                    else {
                        $scope.ProductData = $scope.ProductData;
                    }
                    $scope.emptyType = false;
                    $scope.TotalData = response.data.length;
                    $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
                    $scope.groupToPages();
                    $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
                    GetWishlistRecord();
                }
                else {
                    $scope.artErrorMessage="Sorry! No products found.";
                }
				$scope.countrycode();
            });
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.getProductCategory();
 
	$scope.getprice = function () {
			try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BfsPrice = data.DataPrice[0][0].dollar;
			$scope.bindProductGalleryHtml();
        });
			}
			catch(ex){
				console.log(ex.message);
			}
    };
    
    //$scope.getprice();
	//$scope.BfsCountryCode;
$scope.countrycode=function(){
        $http.get('https://ipapi.co/json/').then(function (response) {
            if (response.data != undefined) {
                GeoJson = response.data;
                $rootScope.BfsCountryCode = GeoJson.country;

                //alert(countryName);				
            }
			$scope.getprice();
        });
}	  

	$scope.bindProductGalleryHtml = function(){
		try{
		$scope.productgalleryS="";
		$scope.productgalleryS+='<script type="text/javascript"> $("#Carouselprodg").carousel({interval: 4000,cycle: true,  pause: "false"  }); </script>';
		$scope.productgalleryS+='<div class="col-md-12 col-xs-12 col-sm-12 hidden-xs less form-group">';
		$scope.productgalleryS+='<div id="Carouselprodg" class="carousel slide">';
		$scope.productgalleryS+='<div class="carousel-inner">';
		for(var i=0;i<$scope.ProductGallary.length; i++){
			if(i==0){
				$scope.productgalleryS+='<div class="item active">';
				$scope.productgalleryS+='<div class="col-sm-12 col-xs-12 less">';
				for(var j=0; j<$scope.ProductGallary[i].length; j++){
					if($scope.ProductGallary[i][j].ID !=$scope.currentProduct){
				$scope.productgalleryS+='<div class="col-md-3 col-sm-3 col-xs-12  tile-gap">';
				$scope.productgalleryS+='<div class="col-sm-12 wiselistImage less" ng-mouseover="FocusDEvent($event)" ng-mouseleave="mouseDleave($event)">';
                        if($scope.ProductGallary[i][j].ProductType=='GeneralProduct'){
		            $scope.productgalleryS+='<a ng-href="#/Product-detail/'+$scope.ProductGallary[i][j].ID+"/"+$scope.ProductGallary[i][j].URL+'" href="#/Product-detail/'+$scope.ProductGallary[i][j].ID+"/"+$scope.ProductGallary[i][j].URL+'">';
                        }
                        else{
                           $scope.productgalleryS+='<a ng-href="#/Product-detail/'+$scope.ProductGallary[i][j].ID+"/"+$scope.Evt_id+"/"+$scope.ProductGallary[i][j].URL+'" href="#/Product-detail/'+$scope.ProductGallary[i][j].ID+"/"+$scope.Evt_id+"/"+$scope.ProductGallary[i][j].URL+'">'; 
                        }
					$scope.productgalleryS+='<div class="content-wrap">';
					$scope.productgalleryS+='<div class="wishimage">';
					$scope.productgalleryS+='<img src="../../uploads/'+$scope.ProductGallary[i][j].ImagePath+'" class="mainimage" alt="'+$scope.ProductGallary[i][j].AltTags+'">';
					$scope.productgalleryS+='</div>';
					$scope.productgalleryS+='<div class="desc-list col-sm-12 spacing">';
					$scope.productgalleryS+='<div class="title col-sm-12 col-xs-12 less" title="'+$scope.ProductGallary[i][j].ProductName+'">';
					$scope.productgalleryS+='<div class="col-sm-9 less" style="float:left;text-align:left;">'+ $filter('limitTo')($scope.ProductGallary[i][j].ProductName,15)+ '</div>';
					$scope.productgalleryS+='<div class="col-sm-3 less" style="float:right">';
					if($scope.ProductGallary[i][j].AvailableStatus==true){
        $scope.productgalleryS+='<img src="../../images/green.png" style="height:16px; width:16px; float:right; margin-top:1px;" title="Available" />';
      }
      else{
        $scope.productgalleryS+='<img src="../../images/red.png" style="height:16px; width:16px; float:right; margin-top:1px;"  title="Sold" />';
      }            
	               $scope.productgalleryS+='</div>';
					$scope.productgalleryS+='</div>';
					$scope.productgalleryS+='<div class="painter col-sm-12 col-xs-12 less">';
					$scope.productgalleryS+='<div class="artist-name col-sm-7 less" style="float:left;text-align:left" title="'+$scope.ProductGallary[i][j].FullName+'">';
					$scope.productgalleryS+=$filter('limitTo')($scope.ProductGallary[i][j].FullName,15);
					$scope.productgalleryS+='</div>';
                        if($scope.ProductGallary[i][j].chkStatusPrice==0){
					$scope.productgalleryS+='<div class="price col-sm-5 less" style="float:right;">';
					if($rootScope.BfsCountryCode=='IN'){
					$scope.productgalleryS+='&#8377;&nbsp&nbsp;' +$scope.ProductGallary[i][j].ProductPrice;
					}
					else {
	           $scope.productgalleryS+='&#36&nbsp&nbsp;'+$filter('number')($scope.ProductGallary[i][j].ProductPrice/$scope.BfsPrice,0);
	}
					$scope.productgalleryS+='</div>';
                        }
                        else{
                 $scope.productgalleryS+='<div class="price col-sm-5 less reqbtn1" style="float:right;">';
                $scope.productgalleryS+='<span>'+$scope.ProductGallary[i][j].PriceOnRequest
                $scope.productgalleryS+='</span>'
                            $scope.productgalleryS+='</div>';  
                        }
					$scope.productgalleryS+='</div>';
					$scope.productgalleryS+='</div>';
					$scope.productgalleryS+='</div></a></div></div>';
					}
				}
				$scope.productgalleryS+='</div></div>';
			}
			else{
				$scope.productgalleryS+='<div class="item">';
				$scope.productgalleryS+='<div class="col-sm-12 col-xs-12 less">';
				for(var z=0;z<$scope.ProductGallary[i].length;z++){
					if($scope.ProductGallary[i][z].ID !=$scope.currentProduct){
						$scope.productgalleryS+='<div class="col-md-3 col-sm-3 col-xs-12  tile-gap">';
						$scope.productgalleryS+='<div class="col-sm-12 wiselistImage less" ng-mouseover="FocusDEvent($event)" ng-mouseleave="mouseDleave($event)">';
                        
						if($scope.ProductGallary[i][z].ProductType=='GeneralProduct'){
		            $scope.productgalleryS+='<a ng-href="#/Product-detail/'+$scope.ProductGallary[i][z].ID+"/"+$scope.ProductGallary[i][z].URL+'" href="#/Product-detail/'+$scope.ProductGallary[i][z].ID+"/"+$scope.ProductGallary[i][z].URL+'">';
                        }
                        else{
                           $scope.productgalleryS+='<a ng-href="#/Product-detail/'+$scope.ProductGallary[i][z].ID+"/"+$scope.Evt_id+"/"+$scope.ProductGallary[i][z].URL+'" href="#/Product-detail/'+$scope.ProductGallary[i][z].ID+"/"+$scope.Evt_id+"/"+$scope.ProductGallary[i][z].URL+'">'; 
                        }
                        
						$scope.productgalleryS+='<div class="content-wrap">';
						$scope.productgalleryS+='<div class="wishimage">';
						$scope.productgalleryS+='<img src="../../uploads/'+$scope.ProductGallary[i][z].ImagePath+'" class="mainimage" alt="'+$scope.ProductGallary[i][z].AltTags+'">';
						$scope.productgalleryS+='</div>';
						$scope.productgalleryS+='<div class="desc-list col-sm-12 spacing">';
						$scope.productgalleryS+='<div class="title col-sm-12 col-xs-12 less" title="'+$scope.ProductGallary[i][z].ProductName+'">';
						$scope.productgalleryS+='<div class="col-sm-9 less" style="float:left;text-align:left;">'+ $filter('limitTo')($scope.ProductGallary[i][z].ProductName,15)+ '</div>';
						$scope.productgalleryS+='<div class="col-sm-3 less" style="float:right">';
						if($scope.ProductGallary[i][z].AvailableStatus==true){
        $scope.productgalleryS+='<img src="../../images/green.png" style="height:16px; width:16px; float:right; margin-top:1px;" title="Available" />';
      }
      else{
        $scope.productgalleryS+='<img src="../../images/red.png" style="height:16px; width:16px; float:right; margin-top:1px;"  title="Sold" />';
      }
	$scope.productgalleryS+='</div>';
	$scope.productgalleryS+='</div>';
	$scope.productgalleryS+='<div class="painter col-sm-12 col-xs-12 less">';
	$scope.productgalleryS+='<div class="artist-name col-sm-7 less" style="float:left;text-align:left" title="'+$scope.ProductGallary[i][z].Fullname+'">';
	$scope.productgalleryS+=$filter('limitTo')($scope.ProductGallary[i][z].FullName,15);
	$scope.productgalleryS+='</div>'
     if($scope.ProductGallary[i][z].chkStatusPrice==0){                    
	$scope.productgalleryS+='<div class="price col-sm-5" style="float:right;">';
	if($rootScope.BfsCountryCode=='IN'){
		$scope.productgalleryS+='&#8377&nbsp&nbsp;' +$scope.ProductGallary[i][z].ProductPrice;
		}
	else {
	$scope.productgalleryS+='&#36&nbsp&nbsp;'+$filter('number')($scope.ProductGallary[i][z].ProductPrice/$scope.BfsPrice,0);
	}
	$scope.productgalleryS+='</div>';
     }
    else{
 $scope.productgalleryS+='<div class="price col-sm-5 less reqbtn1" style="float:right;">';
$scope.productgalleryS+='<span>'+$scope.ProductGallary[i][z].PriceOnRequest
$scope.productgalleryS+='</span>'
            $scope.productgalleryS+='</div>';  
        }
	$scope.productgalleryS+='</div>';
	$scope.productgalleryS+='</div>';
	$scope.productgalleryS+='</div>';
	$scope.productgalleryS+='</a>';									
	$scope.productgalleryS+='</div>';
	$scope.productgalleryS+='</div>';
						
					}
					
				}
				$scope.productgalleryS+='</div>';
				$scope.productgalleryS+='</div>';
			}
		}
		$scope.productgalleryS+='</div>';
		$scope.productgalleryS+='<center><ol class="carousel-indicators left-dots left-dots1">';
		for(var k=0; k<$scope.ProductGallary.length; k++){
			if(k==0){
     $scope.productgalleryS+='<li data-target="#Carouselprodg" data-slide-to="'+ k +'" class="active" ></li>';
        }
            else {
  $scope.productgalleryS+='<li data-target="#Carouselprodg" data-slide-to="'+ k +'" class="inactive" ></li>';
                 }
		}
		$scope.productgalleryS+='</ol></center>';
		$scope.productgalleryS+='</div></div>';
		}
		catch(ex){
		console.log(ex.message);
		}
}
    
    var GetWishlistRecord = function () {
        try{
        if (localStorage.getItem("EmailSession") != null) {
            var WishlistJson = {
                AuthenticateEmaild: localStorage.getItem("EmailSession"),
                postType: 'getAllWishlist'
            }

            $http.post("/api/GetWitParm", WishlistJson).then(function (response) {
                if ((response.data[0] != undefined) && (response.data[0].returnType == "Wishlist")) {
                    $scope.Wishlist_RecordD = response.data;
                    $scope.UserName = localStorage.getItem("Authenticatekey");
                    $rootScope.TotalWishListnumber = response.data.length;
                }
                else {
                    $rootScope.TotalWishListnumber = 0;
                }
            });

        }
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    
    GetWishlistRecord();    
    
    $scope.groupToPages = function () {
        try{
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.TotalData; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.ProductData[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.ProductData[i]);
            }
        }
        $scope.categoryName = $scope.ProductData[0].category_name;
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.range = function (size, start, end) {
        try{
        $scope.ret = [];
        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.ret.push(i);
            }
        }
        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.ret.push(i);
            }
        }
        return $scope.ret;
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.prevPage = function () {
        try{
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $window.scrollTo(0, 0);
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.nextPage = function () {
        try{
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
        $window.scrollTo(0, 0);
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.setPage = function () {
        try{
        $scope.currentPage = this.n;
        $window.scrollTo(0, 0);
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    
    /*Dynamic Routing Get data with ID*/
    $scope.BindNewsContent = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BFSEmailInfo = data.EmailInfo[0];
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.BindNewsContent();
    $scope.LoginEmail = localStorage.getItem("EmailSession");
    $scope.GetUser = function () {
        try{
        if ($scope.LoginEmail != '') {
            var BfsUserDetails = {
                EmailId: $scope.LoginEmail,
                postType: "UserDetails"
            }
              ProductService.GetdatawithParm(BfsUserDetails);
            $scope.$on('dataLoaded', function (event, data) {
                $scope.loading = false;
                if (data.UserD != undefined) {
                    $scope.UserDetails = data.UserD;
                        }                        
                     });
            
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    if ($scope.LoginEmail != undefined) {
        $scope.GetUser();
    }
    $scope.SetEmptyType = function () {
        try{
        $scope.emptyType = true;
        $scope.EmptyMessage = "Sorry! No product available on this page";
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.GetDataOnId = function () {
        try{
        $scope.ProductDetails = [];
        $scope.MobileProductGallary = [];
        $scope.ProductGallary = [];
        $scope.Evt_id=$routeParams.Event_Id;    
        var GeoJson = {};
        if (localStorage.getItem("Authenticatekey") != null) {
            $scope.AuthEmail = localStorage.getItem("EmailSession");
        }
        else {
            $scope.AuthEmail = "";
        }
        if($rootScope.event_id==undefined || $rootScope.event_id=='')
            {
                $rootScope.event_id="";
            }
            if($scope.Evt_id==undefined || $scope.Evt_id==null){
                $scope.Evt_id="";
            }
        
        if ($routeParams.ProductId != '') {
            var BfsProductDetails = {
                ID: $routeParams.ProductId,
                AuthEmail: $scope.AuthEmail,
                event_id: $scope.Evt_id,
                postType: "ProductDetails"
            }
            $rootScope.dynamicPageTitle="";
           $rootScope.MetaDescription="";
           $rootScope.MetaTitle="";
           $rootScope.MetaKeyword="";
            $http.post("/api/GetWitParm", BfsProductDetails).then(function (response) {
                if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "ProductDetail")) {
                    $scope.ProductDetails = response.data[0];
                    $rootScope.dynamicPageTitle=$scope.ProductDetails[0].PageTitle;
                    $rootScope.MetaDescription=$scope.ProductDetails[0].MetaDescription;
                   $rootScope.MetaTitle=$scope.ProductDetails[0].MetaTitle;
                     $rootScope.MetaKeyword=$scope.ProductDetails[0].MetaKeyword;
                    $scope.ProductType = $scope.ProductDetails[0].ProductType;
                    $scope.currentProduct = $routeParams.ProductId;

                    //Small device Slider Object
                    if ($scope.ProductType == "GeneralProduct")
                        {
                        $scope.MobileProductGallary = response.data[1];
                        $scope.ProductGallary = MultiImageSlider_Array(response.data[1]);
                                                                                                
                    }
                    else if ($scope.ProductType == "EventProduct")
                    {
                        $scope.MobileProductGallary = response.data[1];
                        $scope.ProductGallary = MultiImageSlider_Array(response.data[1]);
                                                                                                
                    }
   
                                                                
                    //large screen slider object                    
                    //$scope.ProductGallary = MultiImageSlider_Array(response.data[1]);
                    for (var i = 0; i < $scope.ProductDetails.length; i++) {
                       
                        $scope.ProductDetails[i].image1 = '../../uploads/' + $scope.ProductDetails[i].Image1;
                        $scope.ProductDetails[i].image2 = '../../uploads/' + $scope.ProductDetails[i].Image2;
                        $scope.ProductDetails[i].image3 = '../../uploads/' + $scope.ProductDetails[i].Image3;
                        $scope.ProductDetails[i].image4 = '../../uploads/' + $scope.ProductDetails[i].Image4;
                        $scope.ProductDetails[i].image5 = '../../uploads/' + $scope.ProductDetails[i].Image5;
                                                                                                
                    }
                    
                    $scope.emptyType = false;
                              }
                else {
                    $timeout(function () { $scope.SetEmptyType(); }, 5000);
                }
                $scope.countrycode();
                $scope.producturl = "";
                $scope.productname = "";
                $scope.productimage = "";
                $scope.productremark = "";
                $scope.productTitle = "";

                $scope.producturl = 'https://colorscorridor.com/Product-detail/' + $scope.ProductDetails[0].ID + '/' + $scope.ProductDetails[0].URL;
                $scope.productname = $scope.ProductDetails[0].category_name;
                $scope.productimage = 'https://colorscorridor.com/uploads/'+$scope.ProductDetails[0].Image1;
                $scope.productremark = $scope.ProductDetails[0].ProductRemarks;
                $scope.productTitle = $scope.ProductDetails[0].ProductName; 
  
            });
           
        }         
            
    }        
    catch(ex){
    console.log(ex.message);
     }
    };

 $scope.OverrideOGMetaToShare=function(overrideLink, overrideTitle, overrideDescription, overrideImage) {
        FB.ui({
            method: 'share_open_graph',
            action_type: 'og.likes',
            action_properties: JSON.stringify({
                object: {
                    'og:url': overrideLink,
                    'og:title': overrideTitle,
                    'og:description': overrideDescription,
                    'og:image': overrideImage
                }
            })
        },
            function (response) {
                // Action after response
            });
    }


$scope.share=function()
{
    $scope.OverrideOGMetaToShare($scope.producturl,
        $scope.productTitle,
        $scope.productremark,
        $scope.productimage);

    return false;
    }

    if ($routeParams.ProductId != undefined) {
        $scope.GetDataOnId();
        $scope._ProductId = $routeParams.ProductId;
        if (localStorage.getItem("EmailSession") != null) {
            $scope._AuthenticateEmail = localStorage.getItem("EmailSession");
        }

    }
    if (localStorage.getItem("EmailSession") != null) {
        $scope._AuthenticateEmail = localStorage.getItem("EmailSession");
		$scope.PersonId=localStorage.getItem("PersonId");
    }
  /*$scope.share = function(){      
    var facebookPost={  
      access_token: '513040689175139',
      ID:$scope.ProductDetails[0].ID,
      ArtistURL:$scope.ProductDetails[0].ArtistURL,
      AvailableStatus:$scope.ProductDetails[0].AvailableStatus,
      FirstName:$scope.ProductDetails[0].FirstName,
      lastName:$scope.ProductDetails[0].lastName,
      MetaDescription:$scope.ProductDetails[0].MetaDescription,
      MetaKeyword:$scope.ProductDetails[0].MetaKeyword,
      MetaTitle:$scope.ProductDetails[0].MetaTitle,
      ProductName:$scope.ProductDetails[0].ProductName,
      ProductPrice:$scope.ProductDetails[0].ProductPrice,
      ProductRemarks:$scope.ProductDetails[0].ProductRemarks
  
  };
  $http.post("./facebook",facebookPost).then(function (response) {
       var responseData = response.data;  
                                          
  });
  }*/
    $scope._AddWishlist = function (ProductId,number) {
        try{
       // $scope.ProductDataonID(ProductId);
        if (ProductId != '' && $scope._AuthenticateEmail) {
            var WishlistJSON = {
                ProductId: ProductId,
                AuthenticateEmail: $scope._AuthenticateEmail,
				PersonId:$scope.PersonId,
                postType: 'AddWishlist'
            };
            $http.post("/api/postCategories",WishlistJSON).then(function (response) {
                if(response.data.categoryrowaffacted.length>0){
					if (number == 1)
                {
                     $scope.GetDataOnId();
            //alert("Product added to wishlist");
            }
            else{
                $scope.getProductCategory();
            }
				}
                console.log(response);
            });
            //ProductService.PostData(WishlistJSON);
            //$scope.GetDataOnId();
            //$scope.getProductCategory();
            
            

        }
        else {
            //alert("Please login before adding product to wishlist");
            var r = confirm("Please login before adding product to wishlist");
            if (r == true) {
                $rootScope.Pop = true;
            }
            else {

            }
        }
        // $scope.wishlistAddedMsg = true;
        }
        catch(ex){
			console.log(ex.message);
		}
        
    };
    $scope.sortColumn = "sort";
    
    $scope.DeleteWishlist = function (DelWishlist,number) {
        try{
$scope.AuthenticateUserEmailId = localStorage.getItem("EmailSession");		
var BfsDeleteWish = {
            AuthenticateUserEmailId:$scope.AuthenticateUserEmailId,
            Id: DelWishlist,
            postType: 'DeleteWishlist'
        } 
	$http.put("/api/DeleteCategories", BfsDeleteWish).then(function(response){
		if(response.data.rowsAffected.length>0){
				 if (number == 1)
                {
                     $scope.GetDataOnId();
            //alert("Product added to wishlist");
            }
            else{
                $scope.getProductCategory();
            }
            
			}
			//console.log(response);
	});
           
            
		}
	catch(ex){
			console.log(ex.message);
		}
        

        
}
    /*$scope.DeleteWishlist = function (DelWishlist) {
        $scope.AuthenticateUserEmailId = localStorage.getItem("EmailSession");
        var BfsDeleteWish = {
            AuthenticateUserEmailId:$scope.AuthenticateUserEmailId,
            Id: DelWishlist,
            postType: 'DeleteWishlist'
        }  
        
            //ProductService.Delete(BfsDeleteWish);
            //$scope.getProductCategory();
            //$scope.GetDataOnId();
        //if (number == 0)
                //{
                     //$scope.GetDataOnId();
            //alert("Product added to wishlist");
            //}
            //else{
               // $scope.getProductCategory();
            //}

    };*/
    //this foucs event function is called in Product List page
    // $scope.FocusEvent = function (object) {
        // //console.log(Object);
        // $obj = $(object.target);
        // object.currentTarget.children[1].children["0"].childNodes[3].className = 'desc-list col-sm-12 spacing  stripbg';
    // };
    // $scope.mouseleave = function (object) {
        // //console.log(Object);
        // $obj = $(object.target);
        // object.currentTarget.children[1].children["0"].childNodes[3].className = 'desc-list col-sm-12 spacing';
    // };
    
    //this foucs event function is called in Product Details page
    
    $scope.FocusDEvent = function (object) {
        try{
        //console.log(Object);
        $obj = $(object.target);
        object.currentTarget.children[0].children["0"].childNodes[3].className = 'desc-list col-sm-12 spacing  stripbg';
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.mouseDleave = function (object) {
        try{
        //console.log(Object);
        $obj = $(object.target);
        object.currentTarget.children[0].children["0"].childNodes[3].className = 'desc-list col-sm-12 spacing';
        }
        catch(ex){
			console.log(ex.message);
		}
    };
	$scope.GetPriceLoad = function(){
		$http.get('https://ipapi.co/json/').then(function (response) {
            if (response.data != undefined) {
                GeoJson = response.data;
                $rootScope.BfsCountryCode = GeoJson.country;

                //alert(countryName);				
            }
        });
	}
	$scope.GetPriceLoad();    
    $scope.sendEnquiryProduct=function(Product){
        $rootScope.ProductList = [];
        try{
        $scope.AuthEmail = localStorage.getItem("EmailSession");
        
            if(Product.ProductType!='CollectibleProduct'){
                var BfsProductDetails = {
                ID: Product.ID,
                AuthEmail: $scope.AuthEmail,
                event_id:"",
                postType: "ProductDetails"
            }
                }
            else if(Product.ProductType=='CollectibleProduct'){
                var BfsProductDetails = {
                ID: Product.ID,
                AuthEmail: $scope.AuthEmail,
                postType: "CollectibleProductDetails"
            }
            }
            $http.post("/api/GetWitParm", BfsProductDetails).then(function (response) {
                
                if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "ProductDetail" || response.data[0][0].returnType == 'CollectibleProductDetail')) {
                    $scope.ProductDetails = response.data[0];
                $rootScope.ProductList[0] = $scope.ProductDetails;
                    
                }
                
                if ($rootScope.ProductList[0].length>0) {
                    //console.log($rootScope.ProductList);
                    $rootScope.ContactCall = 1;
                    $location.path("/contact");
                   
                }
            });
        }
        catch(ex){
            console.log(ex.message);
        }
    }
            
            
});

/*add usd exchange rate*/
app.controller('PriceController', function ($scope, ProductService, $timeout, $rootScope, $location) {
    $rootScope.SessionEmail = localStorage.getItem("AdminEmailSession");
    $scope.CheckAdminLogin = function () {
        if ($rootScope.SessionEmail == '' || $rootScope.SessionEmail == undefined) {
            $location.path("/admin/");
            alert("You have to login before accessing the page");
        }
    }
    $scope.CheckAdminLogin();
    $scope.pricebtn = true;
    /*get the data*/
    $scope.getprice = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BfsPrice = data.DataPrice[0];
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.getprice();
    //Fill price data
    $scope.priceControl = function (price) {
        try{
        $scope.indian = price.dollar;
        $scope.priceid = price.ID;
        $scope.pricebtn = false;
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    /*add price*/
    $scope.dollarprice = function () {
        try{
        if ($scope.BfsPrice.length < 1) {
            var Exchange = {
                pricedollar: $scope.indian,
                ActionType: 'New',
                postType: 'AddPrice',
                Id: 0
            };
            var r = confirm("Record  Added successfully");
            if (r == true) {
                ProductService.PostData(Exchange);
                $scope.indian = ""
            }
        }
        else {
            alert("Sorry! you can't add more than 1 records");
            $scope.indian = "";
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    /*update price*/
    $scope.updateprice = function () {
        try{
        var BfsUpdatePrice = {
            pricedollar: $scope.indian,
            Id: $scope.priceid,
            ActionType: 'Update',
            postType: 'UpdatePrice'
        }
        var r = confirm("Record has been updated");
        if (r == true) {
            ProductService.Update(BfsUpdatePrice);
            $scope.getprice();
            $scope.indian = "";

        }
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    /*delete*/
    $scope.deletePrice = function (Pricedata) {
        try{
        var BfsDeletePrice = {
            Id: Pricedata.ID,
            postType: 'DeletePrice'
        }
        var r = confirm("Are you sure you want to permanent Delete this record?");
        if (r == true) {
            ProductService.Delete(BfsDeletePrice);

        }
    }
        catch(ex){
			console.log(ex.message);
		}

    }
    $scope.sendEnquiryProduct=function(Product){
        $rootScope.ProductList = [];
        try{
        $scope.AuthEmail = localStorage.getItem("EmailSession");
        var BfsProductDetails = {
                ID: Product.ID,
                AuthEmail: $scope.AuthEmail,
                event_id:"",
                postType: "ProductDetails"
            }
            $http.post("/api/GetWitParm", BfsProductDetails).then(function (response) {
                
                if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "ProductDetail")) {
                    $scope.ProductDetails = response.data[0];
                $rootScope.ProductList[0] = $scope.ProductDetails;
                    
                }
                
                if ($rootScope.ProductList[0].length>0) {
                    //console.log($rootScope.ProductList);
                    $rootScope.ContactCall = 1;
                    $location.path("/contact");
                   
                }
            });
        }
        catch(ex){
            console.log(ex.message);
        }
    }
    
});

//Wishlist Recordset
app.controller("WishlistController", function ($scope, ProductService, $http, $rootScope, $location) {
    $scope.wisehlistUser = localStorage.getItem("Authenticatekey");
    var GetWishlistRecord = function () {
        try{
        if (localStorage.getItem("EmailSession") != null) {
            var WishlistJson = {
                AuthenticateEmaild: localStorage.getItem("EmailSession"),
                postType: 'getAllWishlist'
            }

            $http.post("/api/GetWitParm", WishlistJson).then(function (response) {
                $rootScope.event_id="";
                $rootScope.dynamicPageTitle="Wishlist";
                if ((response.data[0] != undefined) && (response.data[0].returnType == "Wishlist")) {
                    $scope.Wishlist_RecordD = response.data;
                    $scope.UserName = localStorage.getItem("Authenticatekey");                    
                    $scope.emptyType = false;
                }
                else {
                    $scope.emptyType = true;
                }
            });
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    GetWishlistRecord();
    $scope.AuthenticateUserEmailId = localStorage.getItem("EmailSession");
    $scope.DeleteWishlist = function (DelWishlist) {
        try{
        var BfsDeleteWish = {
            AuthenticateUserEmailId: $scope.AuthenticateUserEmailId,
            Id: DelWishlist.ID,
            postType: 'DeleteWishlist'
        }

            ProductService.Delete(BfsDeleteWish);
            GetWishlistRecord();
        }
        catch(ex){
			console.log(ex.message);
		}

    };
        $scope.enquireSelected = function () {
            try{
        $rootScope.ProductList = [];
        $rootScope.SelectedWishlist = [];
        angular.forEach($scope.Wishlist_RecordD, function (wish) {
            if (wish.Selected == true) {
                $scope.SelectedWishlist.push(wish);
            }
            else if ((wish.Selected == false)) {
                for (i = 0; i < $scope.SelectedWishlist.length; i++) {
                    if ($scope.SelectedWishlist[i] == wish.ID) {
                        $scope.SelectedWishlist[i] = $scope.SelectedWishlist[i + 1];
                        $scope.SelectedWishlist.length = $scope.SelectedWishlist.length - 1;
                    }
                }
                //$scope.selectedId.pop(trend.ID); 
            }
        });
        if ($scope.SelectedWishlist.length < 1)
        {
            alert("Please choose a product before submitting your enquiry");
            return;
        }
        var k = 0;
        var count = 0;
        $scope.AuthEmail = localStorage.getItem("EmailSession");
        for (var i = 0; i < $scope.SelectedWishlist.length; i++) {
			 if($scope.SelectedWishlist[i].ProductType=='GeneralProduct' || $scope.SelectedWishlist[i].ProductType=='EventProduct'){
            var BfsProductDetails = {
                ID: $scope.SelectedWishlist[i].ID,
                AuthEmail: $scope.AuthEmail,
                event_id:"",				
                postType: "ProductDetails"
            }
			}
			 else if($scope.SelectedWishlist[i].ProductType=='CollectibleProduct'){
                var BfsProductDetails = {
                ID: $scope.SelectedWishlist[i].ID,
                AuthEmail: $scope.AuthEmail,
                postType: "CollectibleProductDetails"
            }
            }
            $http.post("/api/GetWitParm", BfsProductDetails).then(function (response) {
                if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "ProductDetail" || response.data[0][0].returnType == 'CollectibleProductDetail')) {
                    $scope.ProductDetails = response.data[0];
                    $rootScope.ProductList[k] = $scope.ProductDetails;
                    k++;
                }
                count++;
                if (count >= $scope.SelectedWishlist.length) {
                    //console.log($rootScope.ProductList);
                    $rootScope.ContactCall = 1;
                    $location.path("/contact");
                   
                }
            });
            
        }
            }
            catch(ex){
			console.log(ex.message);
		}
    }
});

//Admin Wishlist
app.controller("AdminWishlistController", function ($scope, ProductService, $http, $rootScope, $location) {
    $rootScope.SessionEmail = localStorage.getItem("AdminEmailSession");
    $scope.CheckAdminLogin = function () {
        if ($rootScope.SessionEmail == '' || $rootScope.SessionEmail == undefined) {
            $location.path("/admin/");
            alert("You have to login before accessing the page");
        }
    }
    $scope.CheckAdminLogin();
    $scope.itemsPerPage = 10;
    $scope.currentPage = 0;
    $scope.gap = 5;
    $scope.GetWishList = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.CurrentWishlist = data.CurrentWishList[0];
            $scope.AllWishList = data.AllWishList[0];
            $scope.TotalData = data.AllWishList[0].length;
            $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
            $scope.groupPages();
            $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
            $scope.formatMail();
        });
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.GetWishList();
    $scope.groupPages = function () {
        try{
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.TotalData; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.AllWishList[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.AllWishList[i]);
            }
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.range = function (size, start, end) {
        try{
        $scope.ret = [];


        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.ret.push(i);
            }
        }

        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.ret.push(i);
            }
        }
        return $scope.ret;
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.prevPage = function () {
        try{
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.nextPage = function () {
        try{
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.FirstPage = function () {
        try{
        $scope.currentPage = 0;
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.LastPage = function () {
        try{
        $scope.currentPage = $scope.TotalPages - 1;
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    $scope.setPage = function () {
        try{
        $scope.currentPage = this.n;
        }
        catch(ex){
			console.log(ex.message);
		}
    };
    $scope.sendMail = function () {
        try{
        alert("Function called after 1 minute");
        }
        catch(ex){
			console.log(ex.message);
		}
    }
    var innerHTML = "";
    $scope.formatMail = function () {
        try{
        innerHTML = "<table><tr><th>Sr. no</th><th>Name</th><th>Phone Number</th><th>Email</th><th>Product Name</th><th>Product ID</th>";
        innerHTML += "<th>Category</th><th>Genre</th><th>Medium</th></tr>";
        for (var i = 0; i < $scope.CurrentWishlist.length;i++){
            innerHTML += "<tr><td>" + $scope.CurrentWishlist[i].Name + "</td><td>" + $scope.CurrentWishlist[i].PhoneNumber + "</td>";
            innerHTML += "<td>" + $scope.CurrentWishlist[i].Email + "</td><td>" + $scope.CurrentWishlist[i].ProductName + "</td>";
            innerHTML += "<td>" + $scope.CurrentWishlist[i].SerialNo + "</td><td>" + $scope.CurrentWishlist[i].category_name + "</td>";
            innerHTML += "<td>" + $scope.CurrentWishlist[i].medium_name + "</td><td>" + $scope.CurrentWishlist[i].genre_name + "</td>";
            innerHTML +="</tr>"
        }
        innerHTML += "</table>";
        console.log(innerHTML);

    }
         catch(ex){
			console.log(ex.message);
		}
    }
   
    
});
//Search Controller
app.controller("SearchController", function ($scope, ProductService, $window, $http, $routeParams,$timeout,$rootScope) {
    $scope.emptySearch = true;
    $scope.groupedItems = [];
    $scope.itemsPerPage = 12;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.currentArtistPage = 0;
    $scope.currentEventPage = 0;
    $scope.gap = 5;
    if (localStorage.getItem("Authenticatekey") != null) {
        $scope.AuthEmail = localStorage.getItem("EmailSession");
		$scope._AuthenticateEmail=localStorage.getItem("EmailSession");
		$scope.PersonId=localStorage.getItem("PersonId");
    }
    else {
        $scope.AuthEmail = "";
    }
	$scope.AddSearchWishlist=function(ProductId){
        try{
		if (ProductId != '' && $scope._AuthenticateEmail) {
			var WishlistJSON = {
                ProductId: ProductId,
                AuthenticateEmail: $scope._AuthenticateEmail,
				PersonId:$scope.PersonId,
                postType: 'AddWishlist'
            };
			$http.post("/api/postCategories",WishlistJSON).then(function (response) {
				if(response.data.categoryrowaffacted.length>0){
					SearchResult();
				}
				console.log(response);
			});
		}
		else {
            //alert("Please login before adding product to wishlist");
            var r = confirm("Please login before adding product to wishlist");
            if (r == true) {
                $rootScope.Pop = true;
            }
            else {

            }
        }
        }
       catch(ex){
			console.log(ex.message);
		} 
	}
	$scope.DeleteSearchWishlist=function(DelSWishlist){
		$scope.AuthenticateUserEmailId = localStorage.getItem("EmailSession");
		try{
        var BfsDeleteWish = {
            AuthenticateUserEmailId:$scope.AuthenticateUserEmailId,
            Id: DelSWishlist,
            postType: 'DeleteWishlist'
        }  
		$http.put("/api/DeleteCategories", BfsDeleteWish).then(function(response){
			if(response.data.rowsAffected.length>0){
				SearchResult();
			}
			console.log(response);
			
		});
		}
		catch(ex){
			console.log(ex.message);
		}
	}
    var SearchResult = function () {
        $scope.SearchString = $routeParams.Search;
        if ($routeParams.Search != undefined) {
            var BFSSearh = {
                SearchContent: $routeParams.Search,
                AuthEmail: $scope.AuthEmail
            };

            $http.post("/api/GlobalSearch", BFSSearh).then(function (response) {
                if (response.data[0].returnType != "Empty" || response.data[1].length>0 || response.data[2].length>0) {
                    $rootScope.dynamicPageTitle=$routeParams.Search;
                    if (response.data["0"] != "") {
                        
                        $scope.BfsArtist = response.data["0"];
                        $scope.Artistflag = false;
                        $scope.TotalArtistdata = response.data[0].length;
                        $scope.TotalArtistPages = Math.ceil($scope.TotalArtistdata / $scope.itemsPerPage);
                        $scope.groupArtist();
                        $scope.Artistrange($scope.TotalArtistPages, $scope.currentArtistPage, ($scope.currentArtistPage + $scope.gap));
                    }
                    else {
                        $scope.BfsArtist = "";
                        $scope.Artistflag = true;
                    }
                    if (response.data["1"] != "") {
                        $scope.BfsProduct = response.data[1];
                        $scope.Productflag = false;
                        $scope.Totalproductdata = response.data[1].length;
                        $scope.TotalPages = Math.ceil($scope.Totalproductdata / $scope.itemsPerPage);
                        $scope.groupProduct();
                        $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
                    }
                    else {
                        $scope.BfsProduct = "";
                        $scope.Productflag = true;
                    }
                    if (response.data["2"] != "") {
                        $scope.BFSEvent = response.data[2];
                        $scope.EventFlag = false;
                        $scope.TotalEventData = response.data[2].length;
                        $scope.TotalEventPages = Math.ceil($scope.TotalEventData / $scope.itemsPerPage);
                        $scope.groupEvent();
                        $scope.EventRange = ($scope.TotalEventPages, $scope.currentEventPage, ($scope.currentEventPage + $scope.gap))
                    }
                    else {
                        $scope.BFSEvent = "";
                        $scope.EventFlag = true;
                    }
                    $scope.emptySearch = false;
                }
                else {
                    $timeout(function () { $scope.SetEmptyType(); }, 3000);
                   
                }

            });
        }

    }
    SearchResult();
    $scope.SetEmptyType = function () {
        try{
        $scope.emptySearch = true;
        $scope.EmptyMessage = "Sorry ! No result found";
        }
        catch(ex){
            console.log(ex.message);
        }
    }
    //product Pagination
    $scope.groupProduct = function () {
        try{
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.Totalproductdata; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.BfsProduct[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.BfsProduct[i]);
            }
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    }
    $scope.range = function (size, start, end) {
        try{
        $scope.ret = [];


        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.ret.push(i);
            }
        }

        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.ret.push(i);
            }
        }
        return $scope.ret;
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.prevPage = function () {
        try{
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.nextPage = function () {
        try{
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.setPage = function () {
        try{
        $scope.currentPage = this.n;
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    //$scope.prevPage = function () {
    //    if ($scope.currentPage > 0) {
    //        $scope.currentPage--;
    //    }
    //};
    //ProductPagination

    //Artist Pagination
    $scope.groupArtist = function () {
        try{
        $scope.pagedArtistItems = [];

        for (var i = 0; i < $scope.TotalArtistdata; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedArtistItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.BfsArtist[i]];
            } else {
                $scope.pagedArtistItems[Math.floor(i / $scope.itemsPerPage)].push($scope.BfsArtist[i]);
            }
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    }
    $scope.Artistrange = function (size, start, end) {
        try{
        $scope.Artret = [];


        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.Artret.push(i);
            }
        }

        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.Artret.push(i);
            }
        }
        return $scope.Artret;
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.prevArtistPage = function () {
        try{
        if ($scope.currentArtistPage > 0) {
            $scope.currentArtistPage--;
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.nextArtistPage = function () {
        try{
        if ($scope.currentArtistPage < $scope.pagedArtistItems.length - 1) {
            $scope.currentArtistPage++;
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.setArtistPage = function () {
        try{
        $scope.currentArtistPage = this.n;
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    //$scope.prevArtistPage = function () {
    //    if ($scope.currentArtistPage > 0) {
    //        $scope.currentArtistPage--;
    //    }
    //};
    //Artist Pagination

    //Event Pagination
    $scope.groupEvent = function () {
        try{
        $scope.pagedEventItems = [];

        for (var i = 0; i < $scope.TotalEventData; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedEventItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.BFSEvent[i]];
            } else {
                $scope.pagedEventItems[Math.floor(i / $scope.itemsPerPage)].push($scope.BFSEvent[i]);
            }
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    }
    $scope.EventRange = function (size, start, end) {
        try{
        $scope.Eventret = [];


        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.Eventret.push(i);
            }
        }

        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.Eventret.push(i);
            }
        }
        return $scope.Eventret;
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.prevEventPage = function () {
        try{
        if ($scope.currentEventPage > 0) {
            $scope.currentEventPage--;
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.nextEventPage = function () {
        try{
        if ($scope.currentEventPage < $scope.pagedEventItems.length - 1) {
            $scope.currentEventPage++;
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.setEventPage = function () {
        try{
        $scope.currentEventPage = this.n;
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    
    //Event Pagination
    $scope.FocusEvent = function (object) {
        try{
        //console.log(Object);
        $obj = $(object.target);
        object.currentTarget.children[1].children["0"].childNodes[3].className = 'desc-list col-sm-12 spacing  stripbg';
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.mouseleave = function (object) {
        try{
        //console.log(Object);
        $obj = $(object.target);
        object.currentTarget.children[1].children["0"].childNodes[3].className = 'desc-list col-sm-12 spacing';
        }
        catch(ex){
            console.log(ex.message);
        }
    };
	$scope.GetPriceLoad = function(){
		$http.get('https://ipapi.co/json/').then(function (response) {
            if (response.data != undefined) {
                GeoJson = response.data;
                $rootScope.BfsCountryCode = GeoJson.country;

                //alert(countryName);				
            }
        });
	}
	$scope.GetPriceLoad();
	$scope.getprice = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BfsPrice = data.DataPrice[0][0].dollar;
        });
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.getprice();
});

app.controller("ProductbypriceController", function ($scope, ProductService, $http, $filter, $rootScope,$window,$location) {

    $scope.title = 'Price';
    $scope.page2 = true;
    $scope.groupedItems = [];
    $scope.itemsPerPage = 12;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.gap = 5;
    $rootScope.galleryFlag = 2;
    $scope.BfsProductByPrice = [];
    $scope.artErrorMessage="";
    //$scope.getProductByPrice = function () {
    //    ProductService.GetCategories();
    //    $scope.$on('dataLoaded', function (event, data) {
    //        $scope.BfsProductByPrice = data.ProductByPrice[0];
    //        $scope.TotalData = data.ProductByPrice[0].length;
    //        $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
    //        $scope.groupToPages();
    //        $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
    //    });
    //};
    //$scope.getProductByPrice();
	if (localStorage.getItem("EmailSession") != null) {
        $scope._AuthenticateEmail = localStorage.getItem("EmailSession");
		$scope.PersonId=localStorage.getItem("PersonId");
    }
    $scope.SelectedPrice = "";
    $scope.getprice = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BfsPrice = data.DataPrice[0][0].dollar;
        });
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.getprice();
    $http.get('https://ipapi.co/json/').then(function (response) {
        if (response.data != undefined) {
            GeoJson = response.data;
            $rootScope.BfsCountryCode = GeoJson.country;

            //alert(countryName);				
        }
    });
	$scope._AddWishlist = function (ProductId,number) {
        try{
	if (ProductId != '' && $scope._AuthenticateEmail) {
		var WishlistJSON = {
                ProductId: ProductId,
                AuthenticateEmail: $scope._AuthenticateEmail,
				PersonId:$scope.PersonId,
                postType: 'AddWishlist'
            };
			$http.post("/api/postCategories",WishlistJSON).then(function (response) {
				if(response.data.categoryrowaffacted.length>0){
					$scope.GetProductbyRange();
				}
				console.log(response);
			});
	}
	else {
            //alert("Please login before adding product to wishlist");
            var r = confirm("Please login before adding product to wishlist");
            if (r == true) {
                $rootScope.Pop = true;
            }
            else {

            }
        }
        }
        catch(ex){
            console.log(ex.message);
        }
}
$scope.DeleteWishlist = function (DelWishlist) {
$scope.AuthenticateUserEmailId = localStorage.getItem("EmailSession");
		try{
var BfsDeleteWish = {
            AuthenticateUserEmailId:$scope.AuthenticateUserEmailId,
            Id: DelWishlist,
            postType: 'DeleteWishlist'
        } 
	$http.put("/api/DeleteCategories", BfsDeleteWish).then(function(response){
		if(response.data.rowsAffected.length>0){
				$scope.GetProductbyRange();
			}
			console.log(response);
	});
		}
	catch(ex){
			console.log(ex.message);
		}
}
    $scope.GetProductbyRange = function () {
        try{
        var PriceRange = {
            selectedRange: $scope.SelectedPrice,
			AuthenticateEmaild: localStorage.getItem("EmailSession"),
            postType: "PricedProduct"
        }
        $http.post("/api/GetWitParm", PriceRange).then(function (response) {
            $rootScope.event_id="";
            $rootScope.dynamicPageTitle="Colors Corridor Art Gallery";
            $rootScope.MetaDescription="Looking for an affordable arts by some famous award winning artists.Colors Corridor art gallery will allow to sort by price, category and medium and artist.Buy Affordable art by selecting your own price range.";
            $rootScope.MetaTitle="Filter Collections By Price Tags |  Colors Corridor Art Gallery";
            $rootScope.MetaKeyword="Art for sale, affordable art, painting online sale,indian painting for sale,handmade painting price, paintings for sale,best art at affordable price,buy paintings as per  your budget,best painting for your money,painting price list,filter paintings by price tags, best diwali gift";
            if ((response.data[0] != undefined) && (response.data[0].returnType == "PricedProduct")) {
                $scope.BfsProductByPrice = response.data;
                $scope.BfsPriceList = $scope.BfsProductByPrice;
                $scope.emptyType = false;
                $scope.artErrorMessage="";
                $scope.TotalData = $scope.BfsProductByPrice.length;
                $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
                $scope.groupToPages();
                $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
            }
            else {
                $scope.BfsProductByPrice = response.data;
                $scope.BfsPriceList = $scope.BfsProductByPrice;
                $scope.TotalData = 0;
                $scope.emptyType = true;
                $scope.artErrorMessage="Sorry! there is no product available in selected price range.";
                $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
                $scope.groupToPages();
                $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
            }
        });
        }
        catch(ex){
            console.log(ex.message);
        }
    }

    $scope.GetProductbyRange();
    $scope.GetProductbyDollar = function () {
        try{
        $scope.BfsProductByPrice = $scope.BfsPriceList;
        $scope.BfsProductByPriceD = [];
        if ($scope.SelectedPriceDollar == '1') {
            var j = 0;
            for(var i=0;i<$scope.BfsProductByPrice.length;i++)
            {
                if (($scope.BfsProductByPrice[i].ProductPrice / $scope.BfsPrice) < 800 && ($scope.BfsProductByPrice[i].ProductPrice / $scope.BfsPrice) >= 0)
                {
                    $scope.BfsProductByPriceD[j] = $scope.BfsProductByPrice[i];
                    j++
                }
                
            }
        }

        else if($scope.SelectedPriceDollar == '2')
        {
            var j = 0;
            for (var i = 0; i < $scope.BfsProductByPrice.length; i++) {
                if (($scope.BfsProductByPrice[i].ProductPrice / $scope.BfsPrice) < 1600 && ($scope.BfsProductByPrice[i].ProductPrice / $scope.BfsPrice) >= 800) {
                    $scope.BfsProductByPriceD[j] = $scope.BfsProductByPrice[i];
                    j++
                }

            }
        }
        else if ($scope.SelectedPriceDollar == '3') {
            var j = 0;
            for (var i = 0; i < $scope.BfsProductByPrice.length; i++) {
                if (($scope.BfsProductByPrice[i].ProductPrice / $scope.BfsPrice) < 2400 && ($scope.BfsProductByPrice[i].ProductPrice / $scope.BfsPrice) >= 1600) {
                    $scope.BfsProductByPriceD[j] = $scope.BfsProductByPrice[i];
                    j++
                }

            }
        }
        else if ($scope.SelectedPriceDollar == '4') {
            var j = 0;
            for (var i = 0; i < $scope.BfsProductByPrice.length; i++) {
                if (($scope.BfsProductByPrice[i].ProductPrice / $scope.BfsPrice) >= 2400) {
                    $scope.BfsProductByPriceD[j] = $scope.BfsProductByPrice[i];
                    j++;
                }

            }
        }
      
            $scope.BfsProductByPrice = $scope.BfsProductByPriceD;
          
        $scope.TotalData = $scope.BfsProductByPrice.length;
        $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
        $scope.groupToPages();
        $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
        }
        catch(ex){
            console.log(ex.message);
        }
        
    }

    $scope.groupToPages = function () {
        try{
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.TotalData; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.BfsProductByPrice[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.BfsProductByPrice[i]);
            }
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.range = function (size, start, end) {
        try{
        $scope.ret = [];


        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.ret.push(i);
            }
        }

        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.ret.push(i);
            }
        }
        return $scope.ret;
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.prevPage = function () {
        try{
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $window.scrollTo(0, 0);
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.nextPage = function () {
        try{
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
        $window.scrollTo(0, 0);
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.FirstPage = function () {
        try{
        $scope.currentPage = 0;
        $window.scrollTo(0, 0);
        }
        catch(ex){
            console.log(ex.message);
        }
    }
    $scope.LastPage = function () {
        try{
        $scope.currentPage = $scope.TotalPages - 1;
        $window.scrollTo(0, 0);
        }
        catch(ex){
            console.log(ex.message);
        }
    }

    $scope.setPage = function () {
        try{
        $scope.currentPage = this.n;
        $window.scrollTo(0, 0);
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.changeTotalItem = function () {
        try{
        $scope.itemsPerPage = $scope.ItemsPerPage;
        $scope.getProductCategory();
        }
        catch(ex){
            console.log(ex.message);
        }
    }
/*    $scope.FocusEvent = function (object) {
        try{
        //console.log(Object);
        $obj = $(object.target);
        object.currentTarget.children[1].children["0"].childNodes[3].className = 'desc-list col-sm-12 spacing  stripbg';
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.mouseleave = function (object) {
        try{
        //console.log(Object);
        $obj = $(object.target);
        object.currentTarget.children[1].children["0"].childNodes[3].className = 'desc-list col-sm-12 spacing';
        }
        catch(ex){
            console.log(ex.message);
        }
    };*/
	$scope.GetPriceLoad = function(){
		$http.get('https://ipapi.co/json/').then(function (response) {
            if (response.data != undefined) {
                GeoJson = response.data;
                $rootScope.BfsCountryCode = GeoJson.country;

                //alert(countryName);				
            }
        });
	}
	$scope.GetPriceLoad();
	$scope.getprice = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BfsPrice = data.DataPrice[0][0].dollar;
        });
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.getprice();
    $scope.sendEnquiryProduct=function(Product){
        $rootScope.ProductList = [];
        try{
        $scope.AuthEmail = localStorage.getItem("EmailSession");
        var BfsProductDetails = {
                ID: Product.ID,
                AuthEmail: $scope.AuthEmail,
                event_id:"",
                postType: "ProductDetails"
            }
            $http.post("/api/GetWitParm", BfsProductDetails).then(function (response) {
                
                if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "ProductDetail")) {
                    $scope.ProductDetails = response.data[0];
                $rootScope.ProductList[0] = $scope.ProductDetails;
                    
                }
                
                if ($rootScope.ProductList[0].length>0) {
                    //console.log($rootScope.ProductList);
                    $rootScope.ContactCall = 1;
                    $location.path("/contact");
                   
                }
            });
        }
        catch(ex){
            console.log(ex.message);
        }
    }
});
app.controller("ProductbydateController", function ($scope, ProductService, $http, $filter, $rootScope,$location) {
    $scope.title = 'New Arrival';
    $scope.page2 = true;
    $scope.groupedItems = [];
    $scope.itemsPerPage = 12;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.gap = 5;
    $scope.BfsProductBydate = [];
    $rootScope.galleryFlag = 3;
    $scope.groupToPages = function () {
        try{
        $scope.pagedItems = [];
if (localStorage.getItem("EmailSession") != null) {
        $scope._AuthenticateEmail = localStorage.getItem("EmailSession");
		$scope.PersonId=localStorage.getItem("PersonId");
    }
        for (var i = 0; i < $scope.TotalData; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.BfsProductBydate[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.BfsProductBydate[i]);
            }
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.range = function (size, start, end) {
        try{
        $scope.ret = [];
        if (size < $scope.gap) {
            for (var i = 0; i < (size) ; i++) {
                $scope.ret.push(i);
            }
        }

        else {
            if (size < end) {
                end = size;
                start = size - $scope.gap;
            }
            for (var i = start; i < end; i++) {
                $scope.ret.push(i);
            }
        }
        return $scope.ret;
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.prevPage = function () {
        try{
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.nextPage = function () {
        try{
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.FirstPage = function () {
        try{
        $scope.currentPage = 0;
        }
        catch(ex){
            console.log(ex.message);
        }
    }
    $scope.LastPage = function () {
        try{
        $scope.currentPage = $scope.TotalPages - 1;
        }
        catch(ex){
            console.log(ex.message);
        }
    }

    $scope.setPage = function () {
        try{
        $scope.currentPage = this.n;
        }
        catch(ex){
            console.log(ex.message);
        }
    };

    $scope.changeTotalItem = function () {
        try{
        $scope.itemsPerPage = $scope.ItemsPerPage;
        $scope.getProductCategory();
        }
        catch(ex){
            console.log(ex.message);
        }
    }
$scope.getProductCategory=function(){
	try{
	
	var NewArrivalJson = {
                AuthenticateEmaild: localStorage.getItem("EmailSession"),
                postType: 'getAllNewArrival'
            }
			$http.post("/api/GetWitParm", NewArrivalJson).then(function (response) {
                $rootScope.event_id="";
                $rootScope.dynamicPageTitle="Buy New Arrival Arts of Colors Corridor Art Gallery";
                $rootScope.MetaDescription="Colors Corridor Art Gallery adds new  paintings every month. Check the latest collection of paintings of famous artists and buy them at affordable price as per your budget";
                $rootScope.MetaTitle="Buy New Arrival Arts of Colors Corridor Art Gallery";
                $rootScope.MetaKeyword="new arrival art, new arrival drawing,contemporary art, affordable art,original art, unique diwali gift, art on rent,new arrival art for sale, new arrival art at affordable price, new arrival paintings,new arrival water colors paintings, new arrival oil paintings";
				if(response.data[0]!=undefined && response.data.length>0){
				$scope.BfsProductBydate = response.data;
            if ($scope.SelectedFilter == "1") {
                $scope.BfsProductBydate = $filter('orderBy')($scope.BfsProductBydate, 'ProductName');
            }
            else if ($scope.SelectedFilter == "2") {
                $scope.BfsProductBydate = $filter('orderBy')($scope.BfsProductBydate, '-ProductName');
            }
            else if ($scope.SelectedFilter == "3") {
                $scope.BfsProductBydate = $filter('orderBy')($scope.BfsProductBydate, 'ProductPrice');
            }
            else if ($scope.SelectedFilter == "4") {
                $scope.BfsProductBydate = $filter('orderBy')($scope.BfsProductBydate, '-ProductPrice');
            }
            else {
                $scope.BfsProductBydate = $scope.BfsProductBydate;
            }
            $scope.TotalData = $scope.BfsProductBydate.length;
            $scope.TotalPages = Math.ceil($scope.TotalData / $scope.itemsPerPage);
            $scope.groupToPages();
            $scope.range($scope.TotalPages, $scope.currentPage, ($scope.currentPage + $scope.gap));
			}
			});
	
	}
	catch(ex)
	{
		console.log(ex.message);
	}
}
 $scope.getProductCategory();
    $scope._AddWishlist = function (ProductId,number) {
        try{
	if (ProductId != '' && $scope._AuthenticateEmail) {
		var WishlistJSON = {
                ProductId: ProductId,
                AuthenticateEmail: $scope._AuthenticateEmail,
				PersonId:$scope.PersonId,
                postType: 'AddWishlist'
            };
			$http.post("/api/postCategories",WishlistJSON).then(function (response) {
				if(response.data.categoryrowaffacted.length>0){
					$scope.getProductCategory();
				}
				console.log(response);
			});
	}
	else {
            //alert("Please login before adding product to wishlist");
            var r = confirm("Please login before adding product to wishlist");
            if (r == true) {
                $rootScope.Pop = true;
            }
            else {

            }
        }
        }
catch(ex){
            console.log(ex.message);
        }
}
$scope.DeleteWishlist = function (DelWishlist) {
$scope.AuthenticateUserEmailId = localStorage.getItem("EmailSession");
		try{
var BfsDeleteWish = {
            AuthenticateUserEmailId:$scope.AuthenticateUserEmailId,
            Id: DelWishlist,
            postType: 'DeleteWishlist'
        } 
	$http.put("/api/DeleteCategories", BfsDeleteWish).then(function(response){
		if(response.data.rowsAffected.length>0){
				$scope.getProductCategory();
			}
			console.log(response);
	});
		}
	catch(ex){
			console.log(ex.message);
		}
}
$scope.GetPriceLoad = function(){
		$http.get('https://ipapi.co/json/').then(function (response) {
            if (response.data != undefined) {
                GeoJson = response.data;
                $rootScope.BfsCountryCode = GeoJson.country;

                //alert(countryName);				
            }
        });
	}
	$scope.GetPriceLoad();
	$scope.getprice = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BfsPrice = data.DataPrice[0][0].dollar;
        });
        }
        catch(ex){
            console.log(ex.message);
        }
    };
    $scope.getprice();
    $scope.sendEnquiryProduct=function(Product){
        $rootScope.ProductList = [];
        try{
        $scope.AuthEmail = localStorage.getItem("EmailSession");
        var BfsProductDetails = {
                ID: Product.ID,
                AuthEmail: $scope.AuthEmail,
                event_id:"",
                postType: "ProductDetails"
            }
            $http.post("/api/GetWitParm", BfsProductDetails).then(function (response) {
                
                if ((response.data[0][0] != undefined) && (response.data[0][0].returnType == "ProductDetail")) {
                    $scope.ProductDetails = response.data[0];
                $rootScope.ProductList[0] = $scope.ProductDetails;
                    
                }
                
                if ($rootScope.ProductList[0].length>0) {
                    //console.log($rootScope.ProductList);
                    $rootScope.ContactCall = 1;
                    $location.path("/contact");
                   
                }
            });
        }
        catch(ex){
            console.log(ex.message);
        }
    }
});

