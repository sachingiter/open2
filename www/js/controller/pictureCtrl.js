open2.controller('pictureCtrl', function ($scope, $rootScope,firebaseservices, $http,$stateParams, $state, $cordovaSocialSharing, $cordovaCamera, $window) {

  // $scope.user = {};
  $scope.imageURL = "";
  $scope.take_picture = true;
  var picureWidth;
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
      
        // cordovacameraservice.captureImage().then(function (suc) {
        //     $scope.imageURL = 'data:image/jpeg;base64,' + suc;
        //     $scope.selectedImage();
       
        // }, function (er) {


        // })
         picureWidth = $window.innerWidth;

        var options = {
            x: 0,
            y: 80,
            width: picureWidth,
            height: 350,
            camera: CameraPreview.CAMERA_DIRECTION.BACK,
            toBack: false,
            tapPhoto: true,
            previewDrag: false
          };
 
        CameraPreview.startCamera(options);


    }

    $scope.init();
   
   
    $scope.selectedImage = function () {

      CameraPreview.takePicture({width:350, height:350, quality: 50},function(base64PictureData){
         /* code here */
         console.log("inside takePicture");

         
         $scope.take_picture = false;


        var imageSrcData = 'data:image/jpeg;base64,' + base64PictureData;
        console.log("inside takePicture imageSrcData");
        $scope.imageURL = imageSrcData;

        // console.log("imageSrcData  :imageSrcData :  " + imageSrcData);

         // CameraPreview.stopCamera();


      });


      
    }

    $scope.next = function(){

      var data = JSON.parse($stateParams.data);
        data.eventPhoto = $scope.imageURL;
        
        firebaseservices.addDataToFirebase(data, 'Events').then(function (res) {
            // $scope.currentPageIndex--;
            CameraPreview.stopCamera();
            $rootScope.watchPosition(res);
            $rootScope.recreateMap();
            $state.go('menu');
        })
    }
 // $scope.init();

});
