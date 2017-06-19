open2.controller('pictureCtrl', function ($scope, $rootScope,firebaseservices, $http,$stateParams, $state, $cordovaSocialSharing, $cordovaCamera, cordovacameraservice) {

  // $scope.user = {};
  $scope.imageURL = "";
  // $scope.user.mail = "prash_jain92@mailinator.com";
  // $scope.user.pass = "123456";
    //document.addEventListener('deviceready', function () {
    //    navigator.customCamera.getPicture(filename, function success(fileUri) {
    //        alert("File location: " + fileUri);
    //    }, function failure(error) {
    //        alert(error);
    //    }, {
    //        quality: 80,
    //        targetWidth: 120,
    //        targetHeight: 120
    //    });

    //}, false)
     $scope.shareLink = function(){
      console.log("Share link");
      $cordovaSocialSharing
    .share("Please install Open2 app", null, null, "https://www.google.co.in/") // Share via native share sheet
    .then(function(result) {
      // Success!
      console.log("result is : " + result);
    }, function(err) {
      // An error occured. Show a message to the user
      console.log("error is : " + err);
    });
    }

    $scope.init = function(){
      
        cordovacameraservice.captureImage().then(function (suc) {
            $scope.imageURL = 'data:image/jpeg;base64,' + suc;
            $scope.selectedImage();
       
        }, function (er) {


        })
    }
   
   
    $scope.selectedImage = function () {
      console.log('called selected image');
        var data = JSON.parse($stateParams.data);
        data.eventPhoto = $scope.imageURL;
        
        firebaseservices.addDataToFirebase(data, 'Events').then(function (res) {
            // $scope.currentPageIndex--;
            $rootScope.watchPosition(res)
            $state.go('menu');
        })
    }
 // $scope.init();

});
