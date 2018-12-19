app.controller('CreateDynamicMenu', function ($scope, $http, $rootScope, $timeout, ProductService, $routeParams) {
    $rootScope.TotalWishListnumber = 0;
    $scope.GetHeaderRecord = function () {
        try{
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.loading = false;
            $scope.UlMenuBind = data.TopPulishMenu[0];
            $scope.BindMenulist = data.TopPulishMenu[0];         
            $scope.tempJSON = $scope.UlMenuBind;
            $scope.menuJSON = [];
            /*------ First populate the root level elements by checking for parent id = 0 --*/
            $scope.trsh = [];
            for (elem in $scope.tempJSON) {

                x = $scope.tempJSON[elem];										//x is a temp variable
                x.children = [];
                if (x.ParentId == 0) {											//checking parentId == 0
                    $scope.menuJSON.push(x);									//add element to final menu json						//remove element from original data to prevent duplicate iteration
                }

            }

            /*----- Now populate next level elements and add them as children to the root level nodes -----*/

            for (sub_elem in $scope.tempJSON) {

                y = $scope.tempJSON[sub_elem];									//y is a temp variable
                y.children = [];

                if (y.ParentId == 0) {
                    continue;
                }

                for (tempRef in $scope.menuJSON) {								//nested loop for iterating over original data and root level elements
                    v = $scope.menuJSON[tempRef];

                    if (y.ParentId == v.Id) {
                        $scope.menuJSON[tempRef].children.push(y);
                    }
                   
                }
            }


            /*------ Now populate child elements of child elements of root level elements ------*/

            for (sub_elem_sub in $scope.tempJSON) {

                z = $scope.tempJSON[sub_elem_sub];								//z is a temp variable

                if (z.ParentId == 0) {
                    continue;
                }

                for (tempSubRef in $scope.menuJSON) {

                    w = $scope.menuJSON[tempSubRef];							//w is a temp variable - 3 levels of iteration required

                    for (childSubRef in w.children) {

                        d = w.children[childSubRef];						//d is a temp variable	

                        if (z.ParentId == d.Id) {
                            $scope.menuJSON[tempSubRef].children[childSubRef].children.push(z);
                        }
                    }
                }
                
            }

        });
        }
        catch(ex){
            console.log(ex.message);
    }
    };
    $scope.GetHeaderRecord();
    $scope.PopTrue = function () {
        try{
        $scope.forgot = false;
        $scope.forgotpass = true;
        $scope.acc = false;
        $rootScope.Pop = true;
        $scope.log = false;
        $scope.popsign = false;
        }
        catch(ex){
            console.log(ex.message);
    }
    };
    $scope.wisehlistUser = localStorage.getItem("Authenticatekey");
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
});

app.controller('CustomMenu', function ($scope, $http, $timeout, ProductService, $routeParams,$sce) {
    var Bfsgetmediumdata = [];
    $scope.medbtn = true;
    $scope.getCustomOurStory = function () {
        try{
        if ($routeParams.CustomId != undefined) {
            var BfsOurStoryJson = {
                ID: $routeParams.CustomId,
                postType: "GetOurStoryCustomRecord"
            }
            //ProductService.GetdatawithParm(BfsOurStoryJson);
            //$scope.$on('dataLoaded', function (event, data) {
            $http.post("/api/GetWitParm", BfsOurStoryJson).then(function (response) {
                if ((response.data[0] != undefined) && (response.data[0].returnType == "OurStoryCustomList")) {
                    $scope.Custom_OurStory = response.data;
                    $scope.Title = response.data[0].Menutitle;
                    $scope.imagepath = response.data[0].otherImage;
                    $scope.Description = response.data[0].ContentDescription;
                    $scope.EmptyPage = false;
                 
                   }
                else {
                    $scope.EmptyPage = true;
                }
            });
        }
        }
        catch(ex){
            console.log(ex.message);
    }
    };

    $scope.GetRecord = function () {
        try{
            $scope.getCustomOurStory();  
        }
        catch(ex){
            console.log(ex.message);
    }
    };

    $scope.GetRecord();

    $scope.showLogin = function () {
        try{
        $scope.pop = true;
        }
        catch(ex){
            console.log(ex.message);
    }
    };
    $scope.to_HTML=function(html_code)
    {
        return $sce.trustAsHtml(html_code);
    }

});

