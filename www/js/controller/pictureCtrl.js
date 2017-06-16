open2.controller('pictureCtrl', function ($scope, $rootScope, $http, $state, $cordovaSocialSharing, $cordovaCamera) {

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

        CameraPreview.startCamera({ x: 40, y: 80, width: 300, height: 300, camera: CameraPreview.CAMERA_DIRECTION.BACK, toBack: false, previewDrag: false, tapPhoto: true });
    }
   
    $scope.takePicture = function () {
        CameraPreview.takePicture({ width: 300, height: 300, quality: 85 }, function (imgData) {
            $scope.imageURL = 'data:image/jpeg;base64,' + imgData[0];


            CameraPreview.hide();


        });
    }
  $scope.init();

});
