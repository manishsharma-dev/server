var app = angular.module('myapp', ['ngRoute', 'ckeditor', 'ngSanitize','satellizer']);

/*  window.fbAsyncInit = function() {
    FB.init({
      appId      : '2108254499208246',
      cookie     : true,
      xfbml      : true,
      version    : 'v3.1',
	  status     :true
    });
      
    FB.AppEvents.logPageView();   
      
  };
 (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
//share button*/

   
    
/*Google login*/

function onLoadFunction() {
    gapi.client.setApiKey('AIzaSyALLlHDLgEi-leV2XgO0af57cno5ccU3T8');
    gapi.client.load('plus', 'v1', function () { });  
    //localStorage.setItem('closeCount','0');
    localStorage.setItem('closeCount','0');
}
/**/
app.config(function ($routeProvider, $locationProvider) {
    // $routeProvider.t;
    $routeProvider.when('/', {
        templateUrl: 'views/user/userindex.html',
        controller: 'IndexController'
    }).when('/CustomOurStory2/:CustomId', {
        templateUrl: 'views/user/templates/OurStory2.html',
        controller: 'CustomMenu'
    }).when('/FooterMenuTemplate/:CustomId', {
        templateUrl: 'views/user/templates/CustomFooterMenu.html',
        controller: 'CustomMenu'
    }).when('/CustomArtLease/:CustomId', {
        templateUrl: 'views/user/templates/CustomArtForLease.html',
        controller: 'CustomMenu'
    }).when('/example', {
        templateUrl: 'views/user/example.html',
        controller: 'IndexController'
    }).when('/aboutus', {
        templateUrl: 'views/user/about.html',
        controller: 'AboutusController'
    }).when('/searchResult/:Search', {
        templateUrl: 'views/user/Search.html',
        controller: 'SearchController'
    }).when('/Collectible/:CollectibleId', {
        templateUrl: 'views/user/Collectible.html'
    }).when('/MixedMedia', {
        templateUrl: 'views/user/MixedMedia.html'
    }).when('/Painting', {
        templateUrl: 'views/user/Painting.html'
    }).when('/artforlease', {
        templateUrl: 'views/user/artforlease.html',
        controller: 'UserArtforLease'
    }).when('/admin/EventProducts', {
        templateUrl: 'views/admin/EventProduct.html',
        controller: 'EventsProductController'
    }).when('/admin/collectibleproduct', {
        templateUrl: 'views/admin/collectibleProduct.html',
        controller: 'ProductCollectibleController'    
    }).when('/admin/Events', {
        templateUrl: 'views/admin/EventsOffline.html',
        controller: 'EventsController'
    }).when('/admin/EventHeading', {
        templateUrl: 'views/admin/OfflineEventHeading.html',
        controller: 'EventsController'
    }).when('/admin/EventsOnline', {
        templateUrl: 'views/admin/EventsOnline.html',
        controller: 'EventsController'
    }).when('/admin/Wishlist', {
        templateUrl: 'views/admin/Wishlist.html',
        controller: 'AdminWishlistController'
    }).when('/admin/WishlistCurrent', {
        templateUrl: 'views/admin/WishlistCurrent.html',
        controller: 'AdminWishlistController'
    }).when('/artinterior', {
        templateUrl: 'views/user/artinterior.html',
        controller: "UserCorporateServices"
    }).when('/sellingThroughUs', {
        templateUrl: 'views/user/sellingThroughUs.html',
        controller: 'UserSellingthroughusController'
    }).when('/Digital', {
        templateUrl: 'views/user/Digital.html'
    }).when('/PrintMaking', {
        templateUrl: 'views/user/PrintMaking.html'
    }).when('/SculpturesandInstallations', {
        templateUrl: 'views/user/SculpturesandInstallations.html'
    }).when('/Dummy', {
        templateUrl: 'views/user/dummy.html'
    }).when('/blog', {
        templateUrl: 'views/user/blog.html',
        controller: 'FrontBlogController'
    }).when('/admin/slider', {
        templateUrl: 'views/admin/slider.html',
        controller: 'sliderController'
    }).when('/admin/Event', {
        templateUrl: 'views/admin/eventAdmin.html',
        controller: 'popupController'
    }).when('/admin/login', {
        templateUrl: 'views/admin/LoginPopAdmin.html',
        controller: 'popupController'
    }).when('/contact', {
        templateUrl: 'views/user/contact.html',
        controller: 'UserContactController'
    }).when('/admin/contactus', {
        templateUrl: 'views/admin/contactusAdmin.html',
        controller: 'ContactController'
    }).when('/admin/artist', {
        templateUrl: 'views/admin/artist.html',
        controller: 'ArtistController'
    }).when('/admin/DeletedArtist', {
        templateUrl: 'views/admin/DeletedArtist.html',
            controller: 'ArtistController'
        }).when('/admin/contact', {
        templateUrl: 'views/admin/Contactinfo.html',
        controller: 'ContactController'
    }).when('/admin/email', {
        templateUrl: 'views/admin/mailconfiguration.html',
        controller: 'MailController'
    }).when('/admin/Addemail', {
        templateUrl: 'views/admin/AddAdminEmail.html',
        controller: 'NewsletterEmailController'
    }).when('/drawing', {
        templateUrl: 'views/user/drawing.html',
        controller: 'BindProductController'
    }).when('/Product-detail/:ProductId/:URL', {
        templateUrl: 'views/user/detail.html',
        controller: 'BindProductController'
    }).when('/Product-detail/Collectible/:ProductId/:URL', {
        templateUrl: 'views/user/detail.html',
        controller:'BindCollectibleProductController'
    }).when('/Gallery/:tableName/:C_Id/:URL', {
        templateUrl: 'views/user/drawing.html',
        controller: 'BindProductController'
    }).when('/wishlist', {
        templateUrl: 'views/user/wishlist.html',
        controller: 'WishlistController'
    }).when('/Product-detail/:ProductId/:Event_Id/:URL', {
        templateUrl: 'views/user/detail.html',
        controller: 'BindProductController'
    }).when('/artistlist', {
        templateUrl: 'views/user/artistlist.html',
        controller: 'UserArtistController'
    }).when('/artist-profile/:artistId/:PageURL', {
        templateUrl: 'views/user/artist-profile.html',
        controller: 'UserArtistController'
    }).when('/admin', {
        templateUrl: 'views/admin/adminLogin.html',
        controller: 'Logincontorller'
    }).when('/admin/sellingthroughusadmin', {
        templateUrl: "views/admin/sellingthroughusadmin.html",
        controller: "SellingthroughusController"
    }).when('/admin/menu', {
        templateUrl: 'views/admin/Menu.html',
        controller: 'MenuController'
    }).when('/admin/footer', {
        templateUrl: 'views/admin/adminFooter.html',
        controller: 'footerController'
    }).when('/Theme1/:FooterId/:PageURL', {
        templateUrl: 'views/user/templates/FooterTemplete1.html',
        controller: 'BindFooterController'
    }).when('/Theme2/:FooterId/:PageURL', {
        templateUrl: 'views/user/templates/FooterTemplete2.html',
        controller: 'BindFooterController'
    }).when('/admin/category', {
        templateUrl: 'views/admin/category.html',
        controller: 'categoryController'
    }).when('/admin/genre', {
        templateUrl: 'views/admin/genre.html',
        controller: 'GenreController'
    }).when('/admin/Dashboard', {
        templateUrl: 'views/admin/main.html',
        controller: 'DashboardController'
    }).when('/admin/CorporateServicesAdmin', {
        templateUrl: 'views/admin/CorporateAdminMain.html',
        controller: 'CorporateServices'
    }).when('/admin/price', {
        templateUrl: 'views/admin/usdprice.html',
        controller: 'PriceController'
    }).when('/admin/newsletter', {
        templateUrl: 'views/admin/NewsletterAdmin.html',
        controller: 'NewsletterController'
    }).when('/admin/medium', {
        templateUrl: 'views/admin/medium.html',
        controller: 'MediumController'
    }).when('/admin/blog', {
        templateUrl: 'views/admin/adminBlog.html',
        controller: 'BlogsController'
    }).when('/admin/AboutusHeader', {
        templateUrl: 'views/admin/AboutusHeader.html',
        controller: 'AboutusHeaderController'
    }).when('/admin/OurStory', {
        templateUrl: 'views/admin/aboutUsContent.html',
        controller: 'AboutMeController'
    }).when('/user/signin', {
        templateUrl: 'views/user/signin.html'
    }).when('/user/signup', {
        templateUrl: 'views/user/signup.html'
    }).when('/admin/Testmonial', {
        templateUrl: 'views/admin/Testmonial.html',
        controller: 'TestimonialController'
    }).when('/admin/product', {
        templateUrl: 'views/admin/product.html',
        controller: 'ProductController'
    }).when('/admin/DeletedProduct', {
        templateUrl: 'views/admin/DeletedProduct.html',
        controller: 'ProductController'
    }).when('/admin/collectibles', {
        templateUrl: 'views/admin/collectibles.html',
        controller: 'CollectibleController'
    }).when('/admin/trending', {
        templateUrl: 'views/admin/trending.html',
        controller: 'trendingController'
    }).when('/content', {
        templateUrl: 'views/user/footerContentTemplate.html',
        controller: 'CustomPageController'
    }).when('/views/user/Termscondition', {
        templateUrl: 'views/user/templates/TermsCondition.html',
        controller: 'CustomPageController'
    }).when("/views/user/Disclaimer", {
        templateUrl: 'views/user/templates/TermsCondition.html',
        controller: 'CustomPageController'
    }).when('/views/user/Authenticity', {
        templateUrl: 'views/user/templates/TermsCondition.html',
        controller: 'CustomPageController'
    }).when('/views/user/:pageid', {
        templateUrl: 'views/user/templates/FooterTemplete1.html',
        controller: 'CustomPageController'
    }).when('/views/user/contentF2/:pageid', {
        templateUrl: 'views/user/templates/FooterTemplete1.html',
        controller: 'CustomPageController'
    }).when('/admin/Team', {
        templateUrl: 'views/admin/Team.html',
        controller: 'TeamController'
    }).when('/views/user/contentF3/:pageid', {
        templateUrl: 'views/user/templates/FooterTemplete1.html',
        controller: 'CustomPageController'
    }).when("/RetunsAndBuybacks", {
        templateUrl: "views/user/returns.html",
        controller: "UserReturnsController"
    }).when("/ExhibitionDetails/:ExhibitionId/:URL", {
        templateUrl: "views/user/Exhibition.html",
        controller: "UserEventsController"
    }).when('/ExhibitionList', {
        templateUrl: "views/user/ExhibitionList.html",
        controller: "UserEventsController"
    }).when('/OnlineShows', {
        templateUrl: "views/user/shows.html",
        controller: "UserEventsController"
    }).when('/ShowDetails', {
        templateUrl: "views/user/showdetails.html"
    }).when('/admin/ReturnsAdmin', {
        templateUrl: "views/admin/ReturnsAdmin.html",
        controller: "ReturnsController"
    }).when('/AboutMe', {
        templateUrl: "views/user/Aboutme.html",
        controller: "AboutUserController"
    }).when('/admin/discovermedium', {
        templateUrl: 'views/admin/discovermedium.html',
        controller: 'DiscoverController'
    }).when('/admin/artforleaseadmin', {
        templateUrl: "views/admin/Artforlease.html",
        controller: "ArtforLease"
    }).when('/Productbyprice', {
        //templateUrl: 'views/user/Productbyprice.html',
        templateUrl: 'views/user/drawing.html',
        controller: 'ProductbypriceController'
    }).when('/NewArrival', {
        //templateUrl: 'views/user/Productbydate.html',
        templateUrl: 'views/user/drawing.html',
        controller: 'ProductbydateController'
    }).when('/admin/collectiblehome', {
        templateUrl: 'views/admin/collectiblehome.html',
        controller: 'DCollectibleController'
    }).when('/admin/help',{
		templateUrl:'views/admin/help.html'
	}).when('/admin/EventRedirection',{
        templateUrl: 'views/admin/EventRedirection.html',
        controller:'EventRedirectionController'
    }).otherwise({
        templateUrl:"views/user/404.html"
    });
    $locationProvider.html5Mode(true);
});

app.directive('zoom', function () {
    function link(scope, element, attrs) {
        var $ = angular.element;
        var original = $(element[0].querySelector('.original'));
        var originalImg = original.find('img');
        var zoomed = $(element[0].querySelector('.zoomed'));
        var zoomedImg = zoomed.find('img');

        var mark = $('<div></div>')
            .addClass('mark')
            .css('position', 'absolute')
            .css('height', scope.markHeight + 'px')
            .css('width', scope.markWidth + 'px')

        $(element).append(mark);

        element
            .on('mouseenter', function (evt) {
                mark.removeClass('hide');

                var offset = calculateOffset(evt);
                moveMark(offset.X, offset.Y);
            })
            .on('mouseleave', function (evt) {
                mark.addClass('hide');
            })
            .on('mousemove', function (evt) {
                var offset = calculateOffset(evt);
                moveMark(offset.X, offset.Y);
            });

        scope.$on('mark:moved', function (event, data) {
            updateZoomed.apply(this, data);
        });

        function moveMark(offsetX, offsetY) {
            var dx = scope.markWidth,
                dy = scope.markHeight,
                x = offsetX - dx / 2,
                y = offsetY - dy / 2;

            mark
                .css('left', x + 'px')
                .css('top', y + 'px');

            scope.$broadcast('mark:moved', [
                x, y, dx, dy, originalImg[0].height, originalImg[0].width
            ]);
        }

        function updateZoomed(originalX, originalY, originalDx, originalDy, originalHeight, originalWidth) {
            var zoomLvl = scope.zoomLvl;
            scope.$apply(function () {
                zoomed
                    .css('height', zoomLvl * originalDy + 'px')
                    .css('width', zoomLvl * originalDx + 'px');
                zoomedImg
                    .attr('src', scope.src)
                    .css('height', zoomLvl * originalHeight + 'px')
                    .css('width', zoomLvl * originalWidth + 'px')
                    .css('left', -zoomLvl * originalX + 'px')
                    .css('top', -zoomLvl * originalY + 'px');
            });
        }

        var rect;
        function calculateOffset(mouseEvent) {
            rect = rect || mouseEvent.target.getBoundingClientRect();
            var offsetX = mouseEvent.clientX - rect.left;
            var offsetY = mouseEvent.clientY - rect.top;

            return {
                X: offsetX,
                Y: offsetY
            }
        }

        attrs.$observe('ngSrc', function (data) {
            scope.src = attrs.ngSrc;
        }, true);


        attrs.$observe('zoomLvl', function (data) {
            scope.zoomLvl = data;;
        }, true);
    }

    return {
        restrict: 'EA',
        scope: {
            markHeight: '@markHeight',
            markWidth: '@markWidth',
            src: '@src',
            zoomLvl: "@zoomLvl"
        },
        template: [
            '<div class="original">',
            '<img ng-src="{{src}}"/>',
            '</div>',
            '<div class="zoomed">',
            '<img/>',
            '</div>'
        ].join(''),
        link: link
    };
});

app.directive('customOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeFunc);
        }
    };
});


app.directive('bigMenu', function () {
    return {
        restrict: 'A',
        scope: { menuitems: '=' },
        template: '<li ng-repeat="item in menuitems">{{item.MenuName}}<ul ng-if="item.hasChildren"><ng-repeat="subitems in item.children"</ul></li>'
    }
});

app.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

app.filter("trust", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);

app.filter('trusted1', ['$sce', function ($sce) {
    var div = document.createElement('div');
    return function (text) {
        div.innerHTML = text;
        return $sce.trustAsHtml(div.textContent);
    };
}])



var MultiImageSlider_Array = function (arrayobject) {
    SuperArry = [];
    SubArry = [];
    count = 1;

    for (var i = 0; i < arrayobject.length; i++) {
        if (count < 5) {
            SubArry.push(arrayobject[i]);
            count++;
        }
        else {
            count = 1;
            i--;
            SuperArry.push(SubArry);
            SubArry = [];
        }
    }
    if (SubArry.length > 0) {
        SuperArry.push(SubArry);
    }
    return SuperArry;
};

app.factory('PagerService', function () {
    var service = {};

    service.GetPager = GetPager;

    return service;

    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
});

app.directive('validFile', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attrs, ngModel) {
            //change event is fired when file is selected
            el.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                });

            });

        }
    }
});
app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
app.directive('homSlider', function () {
    return {
        require: 'ngRepeat',
        template: ''
    };
});
app.filter('range', function () {
    return function (input, min, max) {
        min = parseInt(min);
        max = parseInt(max);
        for (var i = min; i <= max; i++)
            input.push(i);
        return input;
    };
});
app.filter('capitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
    }
});
app.directive('myMap', function () {
    // directive link function
    var link = function (scope, element, attrs) {
        var map, infoWindow;
        var markers = [];

        // map config
        var mapOptions = {
            center: new google.maps.LatLng(28.524250, 77.193494),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: true,
            gestureHandling: 'greedy'
        };

        // init the map
        function initMap() {
            if (map === void 0) {
                map = new google.maps.Map(element[0], mapOptions);
            }
        }

        // place a marker
        function setMarker(map, position, title, content) {
            var marker;
            var markerOptions = {
                position: position,
                map: map,
                title: title,
                icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            };

            marker = new google.maps.Marker(markerOptions);
            markers.push(marker); // add marker to array

            google.maps.event.addListener(marker, 'click', function () {
                // close window if not undefined
                if (infoWindow !== void 0) {
                    infoWindow.close();
                }
                // create new window
                var infoWindowOptions = {
                    content: content
                };
                infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                infoWindow.open(map, marker);
            });
        }

        // show the map and place some markers
        initMap();

        setMarker(map, new google.maps.LatLng(28.524250, 77.193494), 'Colors Corridor','Colors Corridor');
       
    };

    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
        link: link
    };
});

