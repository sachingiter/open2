open2.controller('menuCtrl', function ($scope, $rootScope, $http, $state, mapservices, firebaseservices, $ionicModal) {

    // $scope.user = {};
    // $scope.user.mail = "prash_jain92@mailinator.com";
    // $scope.user.pass = "123456";
    var myLat = 22.7195690;
    var myLng = 75.8577260;
    mapservices.getLatLong().then(function (position) {
        console.log('postioncalled');
        console.log(position);

        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
        //   $scope.distanceCalculation = mapservices.distanceBetweenTwoLatLong(myLat, myLng, $scope.taskDetails.Latitude, $scope.taskDetails.Longitude, 'mi').toFixed(2);
        mapservices.createMap('map', { lat: myLat, lng: myLng }, 'abc').then(function (res) {
            // map = res;
            //  mapservices.addMarker(res,)

            console.log("createMap createMap : " + $scope.currentLocation);
            
            mapservices.getLocationName(request).then(function (respo) {

               $scope.currentLocation = respo.locality + ', ' + respo.adminArea;
               console.log("Current Location : " + $scope.currentLocation);

            }, function (er) { })

            
        }, function (er) {


        })
    });
    //  mapservices.createMap('map', { lat: myLat, lng: myLng })
    $scope.openModal = function () {
        $scope.modal = $ionicModal.fromTemplate('<ion-modal-view>' +
     ' <ion-header-bar>' +
        '<h1 class = "title">Modal Title</h1>' +
     '</ion-header-bar>' +

     '<ion-content>' +
        '<button class = "button icon icon-left ion-ios-close-outline" ng-click = "closeModal()">Close Modal</button>' +
   '</ion-content>' +

'</ion-modal-view>', {
    scope: $scope,
    animation: 'slide-in-up'
})
        $scope.modal.show();
    }


    $scope.closeModal = function () {
        $scope.modal.hide();
    };


    $scope.feedback = function () {
        $state.go('feedback');
    }

    $scope.notification = function () {
        $state.go('notification');
    }

});
