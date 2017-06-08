
open2.controller('menuCtrl', function ($scope, $rootScope, $http, $state, mapservices, firebaseservices, $ionicModal) {

    // $scope.user = {};
    // $scope.user.mail = "prash_jain92@mailinator.com";
    // $scope.user.pass = "123456";
    var myLat = 22.7195690;
    var myLng = 75.8577260;


    //setTimeout(function () {
    //    var d = document.getElementsByTagName('ion-content')[0];
    //    d.className += " has-header";
    //}, 2000)
    
    $scope.currentPageIndex = 0;
    $scope.pages = ['menu','location','chooseEvents'];
    $scope.currentPage = 'menu';
    $ionicModal.fromTemplateUrl('views/navmodal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });
    mapservices.getLatLong().then(function (position) {
        console.log('postioncalled');
        console.log(position);
       
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
        firebaseservices.getDataBasedOnLocation([myLat, myLng], 20);
        console.log($scope.events);
        $scope.myLatitude=position.coords.latitude;
        $scope.myLongitude = position.coords.longitude;
        var request = {
            'position': { "lat": position.coords.latitude, "lng": position.coords.longitude }
        };
        //firebaseservices.getDataBasedOnLocation([myLat, myLng], 50).then(function (res) {
        //    $scope.events
        //})
        //   $scope.distanceCalculation = mapservices.distanceBetweenTwoLatLong(myLat, myLng, $scope.taskDetails.Latitude, $scope.taskDetails.Longitude, 'mi').toFixed(2);
        console.log("createMap createMap : ");
        mapservices.createMap('map', { lat: myLat, lng: myLng }, 'abc').then(function (res) {
            // map = res;
            //  mapservices.addMarker(res,)

        }, function (er) {


        });

         mapservices.getLocationName(request).then(function (respo) {

               $scope.currentLocation = respo.thoroughfare + ', ' + respo.locality + ', ' + respo.adminArea;
               console.log("Current Location : " + $scope.currentLocation);

            }, function (er) { });


    });
    //  mapservices.createMap('map', { lat: myLat, lng: myLng })
    // $scope.openModal = function () {
  
    
   
    $scope.eventImages = [{ 'imgSrc': './img/s1.png', 'text': ' Open jam session' }, { 'imgSrc': './img/s2.png', 'text': 'Open board game fun' },
    { 'imgSrc': './img/s3.png', 'text': 'Open dog walk / play' }, { 'imgSrc': './img/s4.png', 'text': 'Open area exploring' },
    { 'imgSrc': './img/s5.png', 'text': 'Open B.Y.O food & drink' }, { 'imgSrc': './img/s6.png', 'text': 'Open idea sharing' },
    { 'imgSrc': './img/s7.png', 'text': 'Open jog ' }, { 'imgSrc': './img/s8.png', 'text': 'Open basketball' },
    { 'imgSrc': './img/s9.png', 'text': 'Open bike ride' }, { 'imgSrc': './img/s10.png', 'text': 'Open art' },
    { 'imgSrc': './img/s11.png', 'text': 'Open soccer' }, { 'imgSrc': './img/s12.png', 'text': 'Open coffe or tea' }]
    //$scope.modalData = $ionicModal.fromTemplate('<div class="selectbox"><div class="container text-center selectbox-inside"><div class="row "><center style="    width: 100%;" ><img src="./img/s3.png" style="width: 30%;height: 100px;" /></center></div><div class="row"><p style="     color: grey;   width: 100%;">open dog walk / play</p></div><div class="imgbox"><a href="#"><img src="./img/s1.png"/></a><a href="#"><img src="./img/s2.png"/></a><a href="#"><img src="./img/s3.png"/></a><a ui-sref="selected"><img src="./img/s4.png"/></a><a href="#"><img src="./img/s5.png"/></a><a href="#"><img src="./img/s6.png"/></a><a href="#"><img src="./img/s7.png"/></a><a href="#"><img src="./img/s8.png"/></a><a href="#"><img src="./img/s9.png"/></a><a href="#"><img src="./img/s10.png"/></a><a href="#"><img src="./img/s11.png"/></a><a href="#"><img src="./img/s12.png"/></a></div></div></div>', {
    //    scope: $scope
    //})
    $scope.notSelectedEvent=true
    $scope.selectedLocation = 'current';
    $scope.eventText = '';
    $scope.selectedImage = '';
    $scope.changeImage = function (index) {
        $scope.eventText = $scope.eventImages[index].text;
        $scope.notSelectedEvent = true
        $scope.selectedImage= $scope.eventImages[index].imgSrc;
    }
  //  mapservices.mapClikable(true)
    $scope.nextPage = function () {
        //if ($scope.currentPageIndex < 2) {

        //
        //}
        $scope.currentPageIndex++;
        $scope.notSelectedEvent = true;
      //  mapservices.mapClikable(false)
        $scope.currentPage = $scope.pages[$scope.currentPageIndex];
        if ($scope.currentPageIndex == 2) {
            console.log("adfasdfsdf 2");
            mapservices.mapClikable(true,'map');
            $scope.notSelectedEvent = false;

        }
        if ($scope.currentPageIndex == 3) {
            console.log("adfasdfsdf 3");
            mapservices.mapClikable(true,'map');
            $scope.currentPageIndex--;
            $scope.currentPage=$scope.pages[$scope.currentPageIndex]
            $state.go('picture');
            firebaseservices.addDataToFirebase({ photoUrl: $scope.selectedImage, eventDetail: $scope.eventText, Latitude: $scope.myLatitude, Longitude: $scope.myLongitude }, 'Events').then(function (res) {
                $scope.currentPageIndex--;
                $state.go('picture')
            })
            
        }
        if ($scope.currentPageIndex == 1) {
            console.log("adfasdfsdf 1");
            mapservices.mapClikable(false,'map');
            mapservices.addMarker('map', { lat: $scope.myLatitude, lng: $scope.myLongitude }, 'Open2', './img/destinationpin.png');
        }
    }
    $scope.onAddressSelection = function (location) {

        //Do something
        var a = location.address_components;
        $scope.lat = location.geometry.location.lat();
        $scope.lng = location.geometry.location.lng();
    };
   
    $scope.backPage = function () {
        $scope.notSelectedEvent = true;
        $scope.currentPageIndex--;
        $scope.currentPage = $scope.pages[$scope.currentPageIndex];
      
    }
   


    $scope.feedback = function () {
        $state.go('feedback');
    }

    $scope.notification = function () {
        $state.go('notification');
    }

}).directive('openModal', function ($ionicModal, mapservices, firebase) {
    return {
        restrict: 'A',
        scope:{},
        link: function (scope, elem, attr) {
            scope.openModal = function () {
                if (!ionic.Platform.isWebView()) {

                } else {

                    mapservices.mapClikable(false,'map')
                }
                scope.modal.show();
            }

            scope.logout = function () {
                firebase.auth().signOut().then(function () {
                    // Sign-out successful.
                     // scope.currentPageIndex = 0;
                     scope.closeModal();
                }, function (error) {
                    // An error happened.
                });
            }




            scope.closeModal = function () {
                if (!ionic.Platform.isWebView()) {
                    console.log("is not WebView");

                } else {
                    console.log("is WebView");
                    mapservices.mapClikable(true,'map')
                }
                scope.modal.hide();
            };
            $ionicModal.fromTemplateUrl('views/navmodal.html', {
                scope: scope
            }).then(function (modal) {
                scope.modal = modal;

            });

            elem.bind('click', function (e) {
                scope.openModal();
            })
        }
    }

}).directive('goToBack', function (mapservices,$state) {
    return {
        restrict:'A',
        scope: { data: '=page' },
        link: function (scope,elem,attr) {
            elem.bind('click', function (e) {
                console.log(scope.data);
                mapservices.mapClikable(true,'map');
                $state.go(scope.data);
            })
        }
    }
});
