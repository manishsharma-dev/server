app.controller("UserRegistration", function ($scope, $http, $rootScope, ProductService, $window, $timeout, $location,$interval) 
               {
    $scope.successdiv = false;
    $scope.pass_msg = false;
    $scope.checkSecurity = 0;
    //localStorage.setItem("Authenticatekey","");
    $scope.loading = false;
    $scope.accessToken = "";
    $scope.close = true;
    $scope.x=true;
    $scope.subEmail="";
    $scope.ifSubscribed=false;
    //$scope.close = false;
    //$timeout(function (){$scope.close =false;$scope.SignIn=true;}, 30000);
    //$timeout(function () { $scope.ShowloginPop(); }, 30000);
        
    $scope.RegisteredUser = function () 
    {
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
        $scope.BfsRegisterUserdetails = data.RegisterUser[0];
        if((localStorage.getItem('subscribedUser')=='' ||  localStorage.getItem('subscribedUser')==undefined)){
                $scope.ifSubscribed=true;
        }
        else{
            $scope.ifSubscribed=false;

        }
       });

    };
    $scope.RegisteredUser();
    $scope.GetUserforForgotPassword = null;
    $scope.$on('loadingData', function (event, data) 
               {
        $scope.loading = true;
    });
    //Login Pop-up 
    $scope.totalLoginCount = 0;
    $scope.getLoginPop = function () 
    {

        //$scope.totalLoginCount++;
        $timeout(function () { $scope.ShowloginPop(); }, 30000);
         
        /*if ($scope.totalLoginCount ==50)
        {
            $scope.ShowloginPop();
        }*/
        
    }
    
    /*$scope.closePopupt=function(){
         $scope.totalCloseCount++;
        if ($scope.totalCloseCount >= 2) 
        {
            $scope.popout = true;
        }
        else{
            $scope.totalCloseCount++;
        }
    }*/
    $scope.ShowloginPop = function () 
    {
        $rootScope.totalCloseCount=localStorage.getItem('closeCount');
        if($rootScope.totalCloseCount<2){
        $scope.close = false;
        $timeout(function () { $scope.ShowloginPop();}, 45000);  
        if ($rootScope.LoginPop==0)
        {
            
            $rootScope.LoginPop++;
        }
        }
        else{
            $scope.close=true;
        }
    }
    $scope.CloseLoginPopUp = function () 
    {
        $scope.close = true;        
            $rootScope.totalCloseCount++;
        localStorage.setItem('closeCount',$rootScope.totalCloseCount);
            $timeout(function () { $scope.ShowloginPop();}, 45000);   
    }
    //Login pop-up

    //Event Pop-up
    $rootScope.totalClose = 0;
    $scope.popout = true;
    $scope.ClosePop = function () 
    {
        $scope.popout = true;
        $rootScope.totalClose++;
        if ($rootScope.totalClose > 2) 
        {
            $timeout.cancel(mytimeout);
           // $rootScope.Pop = false;
        }
    }
    $rootScope.Pop = false;
    $scope.popout = true;
    $rootScope.totalTime = 0;

    $scope.CountTime = function () 
    {
        
        $rootScope.totalTime += 1;
        mytimeout = $timeout($scope.CountTime, 3000);
    }
    $scope.getEventPop = function () 
    {
        $rootScope.totalTime += 1;
        mytimeout = $timeout(function () { $scope.getEventPop(); }, 1000);
        //mytimeout = $timeout($scope.CountTime, 60000);
        if ($rootScope.totalTime == 10) {
            $scope.ShowEventPop();
        }
            }
    $scope.ShowEventPop = function () {
        if ($rootScope.EventPop == 0)
            {
            $scope.popout = false;
            $rootScope.EventPop++;
        }
        else {

        }
    }
    $scope.getEventPop();
    //Event Pop-up
    $scope.CheckUser = function () 
    {
        if (localStorage.getItem("Authenticatekey") == null) 
        {
            $scope.SignIn = true;
            $scope.Welcometag = true;
            //$scope.close = false;
            $scope.getLoginPop();
        }
        else 
        {
            $scope.close = true;
            $rootScope.LoginUser = localStorage.getItem("Authenticatekey");
            $scope.SignIn = false;
            $scope.Welcometag = false;
            //$scope.close=false;

        }

    }
    $scope.CheckUser();
    $scope.checkLoginState = function () {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }
    $scope.Logout = function () {
        var rs = confirm("Please confirm if you want to log out.");
        if(rs==true){
        if ($scope.accessToken != '') {
            FB.logout(function (response) {
                // user is now logged out
            });
        };
        localStorage.clear();
        //localStorage.setItem("Authenticatekey",null);
        $scope.SignIn = true;
        $window.location = '/';
        $location.path("/")
        $scope.Welcometag = true;

        }

    };

    //field validations       
    $scope.emailPattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    $scope.onlyNumbers = /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/;
    $scope.onlyName = /^([ \u00c0-\u01ffa-zA-Z'])+$/;
    $scope.InputType1 = 'password';
    $scope.InputType = 'password';
    $scope.passPattern = /^(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/;
    $scope.HideShowAnswer = function () {
        if ($scope.InputType1 == 'password')
            $scope.InputType1 = 'text';
        else
            $scope.InputType1 = 'password';

    }


    $scope.HideShowPassword = function () {
        if ($scope.InputType == 'password')
            $scope.InputType = 'text';
        else
            $scope.InputType = 'password';

    };
    $scope.contentData = [];
    $scope.LoginAfterRegistration = false;
    $scope.UserRegistration = function () {
		if($scope.Email!="" && $scope.Email!=undefined)
		{
         for (var i = 0; i < $scope.BfsRegisterUserdetails.length; i++) {
            if($scope.BfsRegisterUserdetails[i].Email==$scope.Email)
            {
                $scope.errormsg = "This email Id is already registered. Please register using a different email Id or go to �Forget Password� option.";
              return;
            }
		 }
        }
		else{
			$scope.Email="";
		}
	if($scope.PWD!="" && $scope.PWD!=undefined)
		{
        if ($scope.CONPWD != $scope.PWD) {
            $scope.passmsg = "Both password entries must match";
			return;
        }
}
          
        
        
            if ($scope.LName == undefined || $scope.LName == " ")
            {
                $scope.LName = "";
            }
            if ($scope.PhoneNo == undefined || $scope.PhoneNo == " ")
            {
                $scope.PhoneNo = "";
            }
            if ($scope.PWD == undefined || $scope.PWD == " ")
            {
                $scope.PWD = "";
            }
            if ($scope.SecurityQuestion == undefined || $scope.SecurityQuestion == " ")
            {
                $scope.SecurityQuestion = "";
            }
            if ($scope.SecurityAnswer == undefined || $scope.SecurityAnswer== " ")
            {
                $scope.SecurityAnswer = "";
            }

            var BfsUserRegistration = {
                FirstName: $scope.FName,
                LastName: $scope.LName,
                PhoneNo: $scope.PhoneNo,
                Image: $scope.Image,
                Email: $scope.Email,
                Password: $scope.PWD,
                SecurityQuestion: $scope.SecurityQuestion,
                SecurityAnswer: $scope.SecurityAnswer,
                postType: 'UserRegistration'
            };

            ProductService.PostData(BfsUserRegistration);

            $scope.FName = "";
            $scope.LName = "";
            $scope.PhoneNo = "";
            $scope.Image = "";
            $scope.Email = "";
            $scope.PWD = "";
            $scope.CONPWD = "";
            $scope.SecurityAnswer = "";
            $scope.SecurityQuestion = "";
            $scope.successdiv = true;
            $scope.success = "Registered Successfully; Please  ";
            $scope.LoginAfterRegistration = true;
       
    };

    $scope.FBlogin = function () {
        FB.login(function (response) 
                 {
            if (response.authResponse) {
                FB.api('/me','GET', { fields: 'id,email,first_name,last_name' }, function (response) {
                    console.log("NAME IS:-" + response.name + '.');
                    console.log("Full data is:-" + JSON.stringify(response));
					console.log("email user is:-" +JSON.stringify(response));
                    $scope.accessToken = FB.getAuthResponse().accessToken;
                    console.log($scope.accessToken);
                    $scope.FName=response.first_name;
                    $scope.LName=response.last_name;
                    $scope.Email=response.email;
                    $scope.UserRegistration();
                    localStorage.setItem("Authenticatekey", response.first_name);
                    localStorage.setItem("AuthenticateLast", response.last_name);
                    localStorage.setItem("EmailSession", response.email);
                    localStorage.setItem("ProfilePicUrl", "http://graph.facebook.com/" + response.id + "/picture?type=normal");
                    localStorage.setItem("UserType", "Foreign");
                    $window.location = "/";
               
});

            }
            else {
                console.log("user did not complete login process");
            }
			
        },{
			scope:'email',
			return_scopes: true
		});

        $scope.close = true;
        $rootScope.LoginUser = localStorage.getItem("Authenticatekey");
        $scope.emailofuser = localStorage.getItem("EmailSession");
        $scope.ProfilePic = localStorage.getItem("ProfilePicUrl");
        $scope.SignIn = false;
        $scope.Welcometag = false;

    }
    $scope.CheckuserFlag = 0;
    $scope.Emailleave = function () {
        if ($scope.Email != "") {

            var BfsCheck_Avilability = {
                AuthenticateEmaild: $scope.Email,
                postType: 'CheckEmaildExit'
            };
            ProductService.GetdatawithParm(BfsCheck_Avilability);

            $scope.$on('dataLoaded', function (event, data) {
                $scope.loading = false;
                if (data.GetValidEmail != undefined) {
                    if (data.GetValidEmail[0].TotalCount > 0) {
                        $scope.errormsg = "This email Id is already registered. Please register using a different email Id or go to 'Forget Password' option.";
                        $scope.CheckuserFlag = 1;
                    }
                    else {
                        $scope.errormsg = "";
                    }
                }
                else {
                   // $scope.errormsg = "";
                }

            });

        }
    };

    $scope.RegistrationLogin = function () {
        var BfsCheckUserAuthenication = {
            Email: $scope.uemail,
            Password: $scope.upwd
        };

        $http.post("./CheckAuthentication", BfsCheckUserAuthenication).then(function (response) {
            var responseData = response.data;

            if (response.data.recordset.length > 0) {
                localStorage.setItem("Authenticatekey", response.data.recordset["0"].FirstName);
                localStorage.setItem("EmailSession", response.data.recordset["0"].email);
				localStorage.setItem("PersonId",response.data.recordset["0"].id);
                localStorage.setItem("UserType", "Local");

                $window.location = "/";

            }
            else {
                $scope.signinerrormsg = "Incorrect email ID/password. Please try again";

                //$timeout(function () { $scope.errormsg = ''; }, 3000);

            }
			$scope.uemail="";
	        $scope.upwd=""; 
        });
        
    };
	

    $scope.GetSecurityQuestion = function () {
        $scope.checkSecurity = 0;
        if ($scope.ForgotEmail != "") {
            var BfsSecurityQuestion = {
                EmailId: $scope.ForgotEmail,				
                postType: 'GetSecurityQuestion'
            };
            ProductService.GetdatawithParm(BfsSecurityQuestion);
            $scope.$on('dataLoaded', function (event, data) {
                $scope.loading = false;
                if(data.SecurityQuestion["0"].Password=="" || data.SecurityQuestion["0"].Password==undefined)
				{
					$scope.Question="You are login from gmail or facebook"
					$scope.x=false;
				}
				else{
                if ((data.SecurityQuestion!=undefined) && ( data.SecurityQuestion.length > 0)) {
                    $scope.Question = data.SecurityQuestion["0"].SecurityQuestion;
                    $scope.GetUserforForgotPassword = data.SecurityQuestion;
                    $scope.checkSecurity=1;
					$scope.x=true;
                }
                else {
                    if ($scope.checkSecurity == 0) {
                        $scope.Question = "Please enter correct Email Id";
                    }
                }
				
					
				}
            });
        }
		
        
    };


    $scope.getQuestion = function () {
        var getrecord = $scope.SecurityQuestion;


    };

    $scope.UpdatePassword = function () {
        if ($scope.NewPassword != $scope.ConfirmPassword) {
            alert("Both password entries must match");
        }
        else {
            var BfsDetails = {
                Email:$scope.ForgotEmail,
                NewPassword: $scope.NewPassword,
                postType: 'UpdateForgotPassword'
            };
            ProductService.Update(BfsDetails);
            $scope.NewPassword = "";
            $scope.ConfirmPassword = "";
            $scope.pass_msg = true;
        }
    };

    $scope.CheckAnswer = function () {
        
            var BfsUserDetails = {
                EmailId: $scope.ForgotEmail,
				//Password: $scope.upwd,
                postType: "UserDetails"
            }
			
           
            $http.post("/api/GetWitParm", BfsUserDetails).then(function (response) {
                if ((response.data[0] != undefined) && (response.data[0].returnType == "UserDetail")) {
                    $scope.UserDetails = response.data;
                    $scope.Check();
					
                }
                //$scope.ForgotEmail = "";
                //$scope.Answerset = "";
            });      
    };

    $scope.Check = function () {
        if($scope.UserDetails[0].SecurityAnswer!=$scope.Answerset)
        {
            $scope.forgoterrormsg = "Security answer is Incorrect.";
        }
        else {
            $scope.forgotdone = true;
            $scope.forgotpass = true;
        }
    }
    /*get data of  login popup*/

    $scope.BindEvent = function () {
        ProductService.GetCategories();
        $scope.$on('dataLoaded', function (event, data) {
            $scope.BFSLoginData = data.PublishLoginPopUp[0];
			$scope.BFSEventData=data.PublishEventData[0];
        });
    };
    $scope.BindEvent();
   

    $scope.GLogin = function () {
        var params = {
    'clientid': '79357095796-jmmlbbg4uv3ec3voqqc5oguk16b88eam.apps.googleusercontent.com',
            'cookiepolicy': 'single_host_origin',
            'callback': function (result) {
                if (result['status']['signed_in']) {
                    var request = gapi.client.plus.people.get(
                        {
                            'userId': 'me'
                        }
                  );
                    request.execute(function (resp) {
                        $scope.$apply(function () {
                            /*console.log(resp.displayName);
                            console.log(resp.emails[0].value);*/

                            var fields = resp.displayName.split(' ');
                            localStorage.setItem("Authenticatekey", fields[0]);
                            localStorage.setItem("AuthenticateLast", fields[1]);
                            localStorage.setItem("EmailSession", resp.emails[0].value);
                            localStorage.setItem("ProfilePicUrl", resp.image.url);
                            localStorage.setItem("UserType", "Foreign");
                            $scope.FName=fields[0];
                            $scope.LName=fields[1];
                            $scope.Email=resp.emails[0].value;
                            $scope.UserRegistration();
                            $window.location = "/";
                        });
                    });
                }

            },
            'approvalprompt': 'force',
            'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read '
        }
        gapi.auth.signIn(params);

    };

    /*Google login*/
    $scope.PopFalse = function () {
        $rootScope.Pop = false;
		$scope.acc=false;
		$scope.log=false;
		$scope.popsign=false;
		$scope.forgot=false;
		$scope.uemail="";
	        $scope.upwd=""; 
		
    };

    $scope.PopTrue = function () {
        $scope.forgot = false;
        $scope.forgotpass = true;
        $scope.acc = false;
        $rootScope.Pop = true;
        $scope.log = false;
        $scope.popsign = false;
        $rootScope.fullcontent = false;
		$scope.uemail="";
	        $scope.upwd="";
    };

    $scope.forgotPassword = function () {
        $scope.forgot=true;
        $scope.acc=true;
        $scope.forgotpass = false;
        $scope.forgotdone = false;
		$scope.uemail="";
	        $scope.upwd=""; 
        //$rootScope.Pop=false;
    }
    
    $scope.subscribe=function()
    {
        if ($scope.Fname == undefined || $scope.Fname == " ")
            {
                $scope.Fname = "";
            }
        if ($scope.LName == undefined || $scope.LName == " ")
            {
                $scope.LName = "";
            }
            if ($scope.PhoneNo == undefined || $scope.PhoneNo == " ")
            {
                $scope.PhoneNo = "";
            }
            if ($scope.PWD == undefined || $scope.PWD == " ")
            {
                $scope.PWD = "";
            }
            if ($scope.SecurityQuestion == undefined || $scope.SecurityQuestion == " ")
            {
                $scope.SecurityQuestion = "";
            }
            if ($scope.SecurityAnswer == undefined || $scope.SecurityAnswer== " ")
            {
                $scope.SecurityAnswer = "";
            }
    var SubscribeUser=
        {    
    FirstName: $scope.FName,
    LastName: $scope.LName,
    PhoneNo: $scope.PhoneNo,
    Image: $scope.Image,
    subscribemail:$scope.subEmail,
    Password: $scope.PWD,
    SecurityQuestion: $scope.SecurityQuestion,
    SecurityAnswer: $scope.SecurityAnswer,        
    //usertype:$scope.usertype,    
    postType: 'SubscribeUser'    
    }
    ProductService.PostData(SubscribeUser); 
    localStorage.setItem("subscribedUser",$scope.subEmail);
       $window.location = "/";
          $scope.FName = "";
            $scope.LName = "";
            $scope.PhoneNo = "";
            $scope.Image = "";
            $scope.subEmail="";
            $scope.PWD = "";
            $scope.CONPWD = "";
            $scope.SecurityAnswer = "";
            $scope.SecurityQuestion = "";
        
    }
});