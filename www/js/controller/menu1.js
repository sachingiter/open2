

open2.controller('menu1Ctrl', function ($scope, $state, $rootScope, $ionicModal, mapservices) {
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
   

})