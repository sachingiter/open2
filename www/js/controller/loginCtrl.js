open2.controller('loginCtrl', function ($scope, $rootScope, $http, $state, fbservice, firebaseservices, $ionicLoading, $ionicBackdrop) {

  // $scope.user = {};
  // $scope.user.mail = "prash_jain92@mailinator.com";
  // $scope.user.pass = "123456";

  // // $scope.user.mail = "";
  // // $scope.user.pass = "";


  // $scope.login = function() {
  //   console.log("inside login");
  //    Indicator.show();
  //   var data = {
  //     "email_id": $scope.user.mail,
  //     "password": $scope.user.pass,
  //     "device_token": localStorageService.get('device_token'),
  //     "platform": localStorageService.get('platform')
  //   }
  //   console.log("Login params : " + JSON.stringify(data));
  //   Api.post('ws/userSignin', data).then(function(response) {
  //     console.log("inside success : " + JSON.stringify(response));
  //     console.log("inside success 1 : " + response.data.is_success);
  //     if (response.data.is_success || response.data.is_success == true) {
  //        Indicator.hide();
  //       $rootScope.userId = response.data.user_id;
  //        localStorageService.set('user_id', $rootScope.userId);
  //       $state.go('feed');
  //     }else {
  //       Indicator.hide();
  //     }
  //     // $scope.users = []
  //   }, function(error) {
  //      Indicator.hide();
  //     console.log("on error : " + JSON.stringify(error));
  //   });

  //   // var headers = {
  //   //   'Content-Type': 'application/json',
  //   // };

  //   // $http({
  //   //     method: 'POST',
  //   //     url: 'https://equalnote.pd.cisinlive.com/ws/userSignin',
  //   //     headers: headers,
  //   //     data: data
  //   //   })
  //   //   .then(function(data) {
  //   //     console.log('inside success  : ' + JSON.stringify(data));
  //   //     $state.go('feed');
  //   //    // return deferred.resolve(data)
  //   //   }, function(data) {
  //   //     console.log('aaaaaaaaaaa  : ' + JSON.stringify(data));
  //   //     //return deferred.reject(data)
  //   //   })
  // }

  // $scope.signUp = function() {
  //   $state.go('signUp');
  // }

  // $scope.forget = function() {
  //    $state.go('forget');
  // }

    $scope.login = function () {
       // $ionicLoading.show({ template: "Facebook login initiated" });
        try {
            $ionicBackdrop.retain();
            fbservice.fbLogin().then(function (succes) {
                $ionicBackdrop.release();
               // alert(JSON.stringify(succes));
                // $ionicLoading.show({ template: "Logged in with facebook" });
                $ionicLoading.show(
                  {
                     template: '<ion-spinner icon="circles" class="spinner-calm"></ion-spinner>'
                });
                firebaseservices.loginFacebookFirebase(succes).then(function (firebaseUser) {
                    $ionicLoading.hide();
                  //  alert(JSON.stringify(firebaseUser));
                    localStorage.setItem('UserId', firebaseUser.uid);
                    localStorage.setItem('UserLoggedIn', 'true');
                    localStorage.setItem('myDetails', JSON.stringify({ email: firebaseUser.email, first_name: firebaseUser.displayName, picture: { data: { url: firebaseUser.photoURL } } }));
                    // alert(JSON.stringify(success));
                    $state.go("menu");
                }, function (er) {
                    // alert(JSON.stringify(er));
                    alert('Error in firebase login')

                })
                //}, function (er) {
                //    $ionicLoading.hide();
                //    alert(er);
                //    alert(JSON.stringify(er))
                //    alert('error occured after facebook login');
                //})

            }, function (fail) {
                alert('Error ocurred while facebook login initiated')
                // alert(JSON.stringify(fail));
                // alert(fail);
            })
        } catch (er) {

            alert(er);
        }
  
  }



});
