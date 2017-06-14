
open2.controller('menuCtrl', function ($scope, $rootScope,$ionicLoading,firebase,$firebaseObject, $http,$ionicPlatform, $state,$cordovaSocialSharing,$cordovaFlashlight, mapservices, firebaseservices, $ionicModal) {

    // $scope.user = {};
    // $scope.user.mail = "prash_jain92@mailinator.com";
    // $scope.user.pass = "123456";
    $scope.isShown = true;
    $scope.isShown1 = false;
    $scope.events = [];
    $ionicPlatform.ready(function () {
        var firebaseRef = firebase.database().ref();
        var geoFire = new GeoFire(firebaseRef.child('EventsLocation/'));
        var geoQuery;
    var myLat = 37.0902;
    var myLng = 95.7129;
    $scope.isEventAvailable;
    $scope.map;
    $scope.mapHeight = {"top":"52px","bottom":"0px" };
    
    setInterval(function () {
        $scope.getEventAvailable();
    }, 30000)
    $scope.getEventAvailable = function () {
        firebaseservices.getDataWhereEqualTo("Events", localStorage.getItem('UserId'), 'CreatedBy').then(function (res) {
            angular.forEach(res, function (value, key) {
                if (!value.isExpired) {
                    console.log($scope.isEventAvailable)
                    $scope.isEventAvailable = value;
                    if ($scope.isEventAvailable.expireTime <= new Date().getTime()) {
                        firebaseservices.updateData('Events', $scope.isEventAvailable.key, { isExpired: true });
                        $scope.currentPageIndex = 0;
                        $scope.mapHeight = { "top": "52px", "bottom": "0px" };
                        $scope.currentPage = $scope.pages[$scope.currentPageIndex]
                    }
                    else {
                        $scope.mapHeight = { "top": "52px", "bottom": "65px" };
                        $scope.currentPageIndex = 3;
                        $scope.currentPage = $scope.pages[$scope.currentPageIndex]
                    }
                }
            })
        })
    }
    $scope.getEventAvailable();
    //setTimeout(function () {
    //    var d = document.getElementsByTagName('ion-content')[0];
    //    d.className += " has-header";
    //}, 2000)
    
    //setTimeout(function () {
    //   var map= mapservices.returnObj()
    //    map.addMarker({
    //        position:{ lat: 37.422359, lng: -122.084344 },
    //        title: "absdf",
    //        snippet: "Open2",
    //        markerName: "gdasfd",
    //        animation: plugin.google.maps.Animation.BOUNCE,
    //        'icon': {
    //            'url': "./img/s3.png",
    //        }
    //    }, function (marker) {
    //        marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
    //            //alert("Marker is clicked");
    //            console.log(marker.get("markerName"))
    //        });
    //    });

    //}, 10000)
    $scope.currentPageIndex = 0;
    $scope.pages = ['menu','location','chooseEvents','createdEvents'];
    $scope.currentPage = 'menu';
    $ionicModal.fromTemplateUrl('views/navmodal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });
    if (ionic.Platform.isWebView()) {

    $ionicLoading.show();
    }
    else {
        $scope.currentPage = 'createdEvents';
    }
    mapservices.getLatLong().then(function (position) {
        console.log('postioncalled');
        console.log(position);
       
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
       
     //   console.log($scope.events);
        $scope.myLatitude=position.coords.latitude;
        $scope.myLongitude = position.coords.longitude;
       
        $scope.createMap(myLat, myLng);
        //firebaseservices.getDataBasedOnLocation([myLat, myLng], 50).then(function (res) {
        //    $scope.events
        //})
        //   $scope.distanceCalculation = mapservices.distanceBetweenTwoLatLong(myLat, myLng, $scope.taskDetails.Latitude, $scope.taskDetails.Longitude, 'mi').toFixed(2);
       
    }, function (er) {
        $scope.createMap(myLat, myLng);
    });

    $scope.createMap = function (lat, lng) {
        document.addEventListener("deviceready", function () {
            var div = document.getElementById('map');
            //if (!angular.isUndefined(map))
            //{
            //    map.clear();
            //}
                
            // Initialize the map view
            $scope.map = plugin.google.maps.Map.getMap(div, {
                'controls': {
                    'compass': true,
                    'myLocationButton': true, // you can specify this option, but app asks permission when it launches.
                    'indoorPicker': true,
                    'zoom': true
                },
                'gestures': {
                    'scroll': true,
                    'tilt': true,
                    'rotate': true,
                    'zoom': true
                },
                'camera': {
                    'latLng': { lat: lat, lng: lng },
                    'tilt': 30,
                    'zoom': 15,
                    'bearing': 50
                }
            });
            $scope.map.addEventListener(plugin.google.maps.event.MAP_READY, function () {
                $ionicLoading.hide();
                geoQuery = geoFire.query({
                    center: [lat, lng],
                    radius: 20
                });

                geoQuery.on("key_entered", function (key, location, distance) {
                    console.log(key + " entered query at " + location + " (" + distance + " km from center)");
                    firebaseObj = firebaseRef.child('Events/' + key);
                    var obj = $firebaseObject(firebaseObj)
                    obj.$loaded(function (res) {
                        // console.log("++++++++++++++++++++++=keyentered+++++++++++++++=");
                        //console.log(res);
                         $scope.events.push(res);
                        //deferred.resolve(events);
                         $scope.addMarker(res);

                    }, function () {

                    })
                    //    // events.push(obj)
                    //   // return deferred.promise;
                });
                geoQuery.on("key_exited", function (key, location, distance) {
                    console.log(key + " exited query to " + location + " (" + distance + " km from center)");
                    //  console.log(task)
                    //angular.forEach(events, function (i, j) {
                    //    if (i.$id == key) {
                    ////        events.splice(j, 1);
                    //    }
                    //})
                    //deferred.resolve(events);
                });

            });
        }, false);
      
    }
    $scope.addMarker = function (res) {
        $scope.map.addMarker({
            // position: position, //{ lat: 37.422359, lng: -122.084344 },
            position: { lat: res.Latitude, lng: res.Longitude },
            title: res.eventDetail,
            snippet: "Open2",
            markerName: res.eventDetail,
            animation: plugin.google.maps.Animation.BOUNCE,
            'icon': {
                'url': res.photoUrl,
            }
        }, function (marker) {
            if (res.eventDetail != 'location') {
            marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                //alert("Marker is clicked");
                $scope.openModalAccept.show();
                $scope.map.setClickable(false);
                console.log(marker.get("markerName"))
            });

            }
        });
    }
    $scope.eventImages = [{ 'imgSrc': './img/s1.png', 'text': ' Open jam session' }, { 'imgSrc': './img/s2.png', 'text': 'Open board game fun' },
    { 'imgSrc': './img/s3.png', 'text': 'Open dog walk / play' }, { 'imgSrc': './img/s4.png', 'text': 'Open area exploring' },
    { 'imgSrc': './img/s5.png', 'text': 'Open B.Y.O food & drink' }, { 'imgSrc': './img/s6.png', 'text': 'Open idea sharing' },
    { 'imgSrc': './img/s7.png', 'text': 'Open jog ' }, { 'imgSrc': './img/s8.png', 'text': 'Open basketball' },
    { 'imgSrc': './img/s9.png', 'text': 'Open bike ride' }, { 'imgSrc': './img/s10.png', 'text': 'Open art' },
    { 'imgSrc': './img/s11.png', 'text': 'Open soccer' }, { 'imgSrc': './img/s12.png', 'text': 'Open coffe or tea' }]
   
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
            $scope.notSelectedEvent = false;

        }
        if ($scope.currentPageIndex == 3) {
           // $scope.currentPageIndex--;
            $scope.currentPage = $scope.pages[$scope.currentPageIndex]
            $scope.mapHeight = { "top": "52px", "bottom": "65px" };
            $state.go('picture');
            firebaseservices.getDataFromNodeValue('AppConfig/ExpireTime').then(function (suc) {

                var date=new Date().getTime();
               var expDate=suc*60*1000+date;
               firebaseservices.addDataToFirebase({ photoUrl: $scope.selectedImage, eventDetail: $scope.eventText, Latitude: $scope.myLatitude, Longitude: $scope.myLongitude, expireTime: expDate, isExpired: false,CreatedBy:localStorage.getItem('UserId'),CreatedTime:date }, 'Events').then(function (res) {
               // $scope.currentPageIndex--;
                $state.go('picture')
            })
            },function(er){
            
            })
            
        }
        if ($scope.currentPageIndex == 1) {
            $scope.map.addMarker({ Latitude: $scope.myLatitude, Longitude: $scope.myLongitude, eventDetail: 'location', photoUrl:'./img/destinationpin.png' });
        }
    }
    $scope.openModal = function () {
        $scope.isShown1 = true;
        $scope.map.setClickable(false);
        $scope.openModalCross.show();
    }
    $scope.closeModal = function () {
        $scope.openModalCross.hide();
        $scope.map.setClickable(true);
        $scope.isShown1 = false
    }

    $scope.onAddressSelection = function (location) {

        //Do something
        var a = location.address_components;
        $scope.myLatitude = location.geometry.location.lat();
        $scope.myLongitude = location.geometry.location.lng();
    };
   
    $scope.backPage = function () {
        $scope.notSelectedEvent = true;
        $scope.currentPageIndex--;
        $scope.currentPage = $scope.pages[$scope.currentPageIndex];
      
    }
   
         $ionicModal.fromTemplateUrl('templates/popup1.html', {
        scope: $scope
         }).then(
    function (modal) {
        $scope.openModalCross = modal;

    });
    $ionicModal.fromTemplateUrl('templates/acceptEvent.html', {
        scope: $scope
    }).then(
    function (modal) {
        $scope.openModalAccept = modal;

    });
    //setTimeout(function () {
    //    $ionicLoading.hide();
    //$scope.openModalAccept.show();
    //}, 5000)
    $scope.joinEvent = function () {
        $scope.currentPageIndex=3;
       // $scope.notSelectedEvent = true;
        //  mapservices.mapClikable(false)
        $scope.map.setClickable(true);
        $scope.openModalAccept.hide();
        $scope.mapHeight = { "top": "52px", "bottom": "65px" };
        $scope.currentPage = $scope.pages[$scope.currentPageIndex];
    }
      //sharelink
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
        //flash
    $scope.flash = function () {
        $cordovaFlashlight.available().then(function (availability) {
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
    }

    $scope.feedback = function () {
        $state.go('feedback');
    }

    $scope.notification = function () {
        $state.go('notification');
    }

    })

}).directive('openModal', function ($ionicModal, firebase) {
    return {
        restrict: 'AE',
        scope:{map:"=map"},
        link: function (scope, elem, attr) {
            scope.openModal = function () {
                if (!ionic.Platform.isWebView()) {

                } else {

                    scope.map.setClickable(false)
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

                } else {

                    scope.map.setClickable(true)
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
