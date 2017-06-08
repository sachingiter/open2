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

      var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.JPEG,
      allowEdit: true,
      targetWidth: 200,
      targetHeight: 200,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imageURL = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      // error
    });

    }

  $scope.init();

  $scope.menu1 = function(){
    $scope.imageURL = null;
    $state.go('menu1');
  }

});
