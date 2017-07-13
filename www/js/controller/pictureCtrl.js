open2.controller('pictureCtrl', function ($scope, $rootScope, firebaseservices, $http, $ionicPlatform, $stateParams, $ionicLoading, $state, $cordovaSocialSharing, $cordovaCamera, $window) {

  // $scope.user = {};
    $ionicPlatform.ready(function () {
        $scope.imageURL = "";
        $scope.dat = {};
        $scope.dat.take_picture = true;
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
        $scope.shareLink = function () {
            console.log("Share link");
            $cordovaSocialSharing
                .share("Please install Open2 app", null, null, "https://www.google.co.in/") // Share via native share sheet
                .then(function (result) {
                    // Success!
                    console.log("result is : " + result);
                }, function (err) {
                    // An error occured. Show a message to the user
                    console.log("error is : " + err);
                });
        }

        $scope.init = function () {

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
        setTimeout(function () {
         $ionicLoading.hide();
        $scope.init();
        }, 1000)


        $scope.selectedImage = function () {

            CameraPreview.takePicture({ width: 3, height: 350, quality: 50 }, function (base64PictureData) {
                /* code here */
                console.log("inside takePicture");





                var imageSrcData = 'data:image/jpeg;base64,' + base64PictureData;
                console.log("inside takePicture imageSrcData");
                $scope.imageURL = imageSrcData;
                $scope.dat.take_picture = false;
                CameraPreview.stopCamera();
                // console.log("imageSrcData  :imageSrcData :  " + imageSrcData);

                // CameraPreview.stopCamera();


            });

            

        }
        $scope.retakePhoto = function () {
            $scope.dat.take_picture = true;
            $scope.init();
        }
        $scope.skipPhoto = function () {
            $scope.imageURL = 'img/open2logo.jpg';
            $scope.next();
        }

        $scope.next = function () {
            //alert();

            var data = JSON.parse($stateParams.data);
            console.log(data);
            data.eventPhoto = $scope.imageURL;

           
          
            $rootScope.recreateMap();
             // setTimeout(function () {

            firebaseservices.addDataToFirebase(data, 'Events').then(function (res) {
                // $scope.currentPageIndex--;
                console.log(res);
               var data1={};
               data1[res]={isEventLive:true};
               //res.key:{}
               firebaseservices.setDataToNode('Users/'+ localStorage.getItem('UserId')+'/CreatedEvents',data1)
                // $rootScope.watchPosition(res);
                $ionicLoading.hide();
                $state.go('menu');
            })
             // }, 1000);
        }
        // $scope.init();
    });
});
