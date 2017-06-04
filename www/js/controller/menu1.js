
open2.controller('menu1Ctrl', function ($scope, $state, $rootScope, $ionicModal, mapservices, $cordovaSocialSharing, $cordovaFlashlight) {
    $scope.isShown = true;
    $scope.isShown1 = false;

    mapservices.getLatLong().then(function (position) {
        console.log('postioncalled');
        console.log(position);

        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
       
        $scope.myLatitude = position.coords.latitude;
        $scope.myLongitude = position.coords.longitude;
        var request = {
            'position': { "lat": position.coords.latitude, "lng": position.coords.longitude }
        };
        //firebaseservices.getDataBasedOnLocation([myLat, myLng], 50).then(function (res) {
        //    $scope.events
        //})
        //   $scope.distanceCalculation = mapservices.distanceBetweenTwoLatLong(myLat, myLng, $scope.taskDetails.Latitude, $scope.taskDetails.Longitude, 'mi').toFixed(2);
        mapservices.createMap('menu1', { lat: myLat, lng: myLng }, 'abc').then(function (res) {
            // map = res;
            //  mapservices.addMarker(res,)

            //mapservices.getLocationName(request).then(function (respo) {
            //    $scope.currentLocation = respo.locality + ', ' + respo.adminArea;


            //}, function (er) { })
        }, function (er) {


        })
    });



    $ionicModal.fromTemplateUrl('templates/popup1.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.openModalCross = modal;

    });
    $ionicModal.fromTemplateUrl('templates/popup2.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.openModalReport = modal;

    });

    $scope.openModal = function () {
        $scope.isShown1 = true;
        mapservices.mapClikable(false, 'menu1');
        $scope.openModalCross.show();
    }
    $scope.closeModal = function () {
        $scope.openModalCross.hide();
        mapservices.mapClikable(true,'menu1');
        $scope.isShown1 = false
    }
   

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

    $scope.flash = function(){
         $cordovaFlashlight.available().then(function(availability) {
        var avail = availability; // is available
        console.log("Flash available");
             $cordovaFlashlight.toggle()
        .then(function (success) { 
        /* success */ 
         console.log("toggle success");
        },
          function (error) { 
          /* error */ 
           console.log("toggle error");
        });
      }, function () {
        // unavailable
        alert("Flash is not available in your phone.");
      });


  //   $cordovaFlashlight.switchOn()
  //   .then(
  //     function (success) {
  //      /* success */ 
  //      console.log("switchOn success");
  //  },
  //     function (error) { 
  //     /* error */ 
  //     console.log("switchOn error");
  // });

  // $cordovaFlashlight.switchOff()
  //   .then(
  //     function (success) {
  //      /* success */ 
  //       console.log("switchOff success");
  //  },
  //     function (error) {
  //      /* error */ 
  //       console.log("switchOff error");
  //  });



    }

   




})