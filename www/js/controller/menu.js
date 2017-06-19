﻿
open2.controller('menuCtrl', function ($scope, $rootScope,$ionicLoading,firebase,$firebaseObject,$stateParams,$ionicSlideBoxDelegate, $http,$ionicPlatform, $state,$cordovaSocialSharing,$cordovaFlashlight, mapservices, firebaseservices, $ionicModal) {

    // $scope.user = {};
    // $scope.user.mail = "prash_jain92@mailinator.com";
    // $scope.user.pass = "123456";

    $scope.isShown = true;
    $scope.isShown1 = false;
    $scope.backTemplates = true;
    $scope.profileShow = false;
    $scope.bg_text = "Experience Details";
    $scope.backArrow = false;
    $scope.messageTemplates = ["I'm here!", "Sorry, cant't make it!", "On my way!", "On your way?"];
    $scope.events = [];
    $ionicPlatform.ready(function () {
        var firebaseRef = firebase.database().ref();
        var geoFire = new GeoFire(firebaseRef.child('EventsLocation/'));
        var geoQuery;
    var myLat = 37.0902;
    var myLng = 95.7129;
    $scope.execution = true;
    $scope.isEventAvailable;
    $scope.map;
    $scope.mapHeight = {"top":"52px","bottom":"0px" };
    mapservices.getLatLong().then(function (position) {
        console.log('postioncalled');
        console.log(position);

        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
    });
  
    setInterval(function () {
        $scope.getEventAvailable();
    }, 30000)
    $scope.getEventAvailable = function () {
        firebaseservices.getDataWhereEqualTo("Events", localStorage.getItem('UserId'), 'CreatedBy').then(function (res) {
            angular.forEach(res, function (value, key) {
                if (!value.isExpired) {
                     $ionicLoading.hide();
                    console.log("not expired **********");
                    console.log($scope.isEventAvailable)
                    $scope.isEventAvailable = value;
                    if ($scope.isEventAvailable.expireTime <= new Date().getTime()) {
                        firebaseservices.updateData('Events', $scope.isEventAvailable.key, { isExpired: true });
                        $scope.currentPageIndex = 0;
                        firebaseservices.removeDataFromNode('EventsLocation/' + $scope.isEventAvailable.key);
                       // $scope.watchID.clear();
                        navigator.geolocation.clearWatch($scope.watchID);
                        $scope.mapHeight = { "top": "52px", "bottom": "0px" };
                        $scope.currentPage = $scope.pages[$scope.currentPageIndex];
                        $scope.eventOpen = false;
                      //  $scope.createMapAfterCheckingEvents();
                    }
                    else {
                        console.log("expired **********");
                        $scope.mapHeight = { "top": "52px", "bottom": "107px" };
                        $scope.currentPageIndex = 3;
                        if ($scope.execution) {
                            $scope.execution = false;
                        $scope.myEvent = {};
                       // $scope.markerDetails = marker.get("markerDetails");
                        $scope.myEvent.eventImage = value.eventPhoto;
                        $scope.myEvent.key = value.key;
                        $scope.myEvent.eventDetail = value.eventDetail;
                        $scope.myEvent.distance = (mapservices.distanceBetweenTwoLatLong(value.Latitude, value.Longitude, myLat, myLng, 'km')).toFixed(1);
                        $scope.myEvent.timeCreated = ((new Date().getTime() - value.CreatedTime) / (1000 * 60)).toFixed(0);
                        $scope.myEvent.emoji = value.photoUrl.replace('./', '');
                        console.log(value);
                        $rootScope.watchPosition(value.key);
                        firebaseservices.getDataFromNodeValue('Users/' + value.CreatedBy).then(function (suc) {
                            $scope.myEvent.userImage = suc.PhotoUrl;
                            $scope.myEvent.Name = suc.Name;


                        })
                        }   
                        $scope.eventOpen = true;
                        $scope.currentPage = $scope.pages[$scope.currentPageIndex]
                        //$scope.createMapAfterCheckingEvents();
                    }
                } else {
                    $ionicLoading.hide();
                    firebaseservices.getUsersFromFirebaseNode();
                }
            })
        })
    }
    $scope.getEventAvailable();
   
    $scope.currentPageIndex = 0;
    $scope.pages = ['menu','location','chooseEvents','createdEvents'];
    $scope.currentPage = 'menu';
    $ionicModal.fromTemplateUrl('views/navmodal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });
    if (ionic.Platform.isWebView()) {

    $ionicLoading.show({
                      template: '<ion-spinner icon="circles" class="spinner-calm"></ion-spinner>'
                  });
    }
    else {
        setTimeout(function () {

        $scope.openModalAccept.show();
        }, 500)
        $scope.currentPage = 'createdEvents';
        $ionicSlideBoxDelegate.update()
    }
   // $scope.createMapAfterCheckingEvents = function () {

    mapservices.getLatLong().then(function (position) {
        console.log('postioncalled');
        console.log(position);
       
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
       
     //   console.log($scope.events);
        $scope.myLatitude=position.coords.latitude;
        $scope.myLongitude = position.coords.longitude;
       
        $scope.createMap(myLat, myLng);
        var request = {
            'position': { "lat": $scope.myLatitude, "lng": $scope.myLongitude }
        };
        mapservices.getLocationName(request).then(function (respo) {
            console.log(respo);
            if (respo) {
                var subLocatoin = '';
                if (respo.thoroughfare) {
                    subLocatoin = respo.thoroughfare;
                } else if (respo.subLocality) {
                    subLocatoin = respo.subLocality;
                }
                $scope.currentLocation = subLocatoin + ', ' + respo.locality + ', ' + respo.adminArea;
            } else {
                $scope.getLocationName(request);
            }
        }, function (fail) {
        })
        //firebaseservices.getDataBasedOnLocation([myLat, myLng], 50).then(function (res) {
        //    $scope.events
        //})
        //   $scope.distanceCalculation = mapservices.distanceBetweenTwoLatLong(myLat, myLng, $scope.taskDetails.Latitude, $scope.taskDetails.Longitude, 'mi').toFixed(2);
       
    }, function (er) {
        $scope.createMap(myLat, myLng);
    });
    
    $scope.getLocationName = function (request) {
       
        mapservices.getLocationName(request).then(function (respo) {
            if (respo) {

            $scope.currentLocation = respo.thoroughfare + ', ' + respo.locality + ', ' + respo.adminArea;
            } else {
                $scope.getLocationName(request);
            }
        }, function (fail) {
        })
    }
       
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
                
                geoQuery = geoFire.query({
                    center: [lat, lng],
                    radius: 20
                });

                geoQuery.on("key_entered", function (key, location, distance) {
                  //  console.log(key + " entered query at " + location + " (" + distance + " km from center)");
                    firebaseObj = firebaseRef.child('Events/' + key);
                    var obj = $firebaseObject(firebaseObj)
                    obj.$loaded(function (res) {
                        // console.log("++++++++++++++++++++++=keyentered+++++++++++++++=");
                        //console.log(res);
                        if (!res.isExpired ) {
                            var eveData = res;
                            eveData.key = key;
                            $scope.events.push(eveData);
                            if (res.CreatedBy==localStorage.getItem('UserId')) {

                                $scope.addMarker(eveData);
                            }
                            else {
                                $scope.addMarker(eveData);
                            }
                        }
                        //deferred.resolve(events);


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
                geoQuery.on("key_moved", function (key, location, distance) {
                    $scope.map.clear();
                   // alert(typeof location)
                    for (var i = 0; i < $scope.events.length; i++) {
                        if (key == $scope.events[i].key) {
                            $scope.events[i].Latitude = location[0];
                            $scope.events[i].Longitude = location[1];
                        }
                        $scope.addMarker($scope.events[i]);
                    }
                   // alert(key + " moved within query to " + location + " (" + distance + " km from center)");
                });

            });
        }, false);
      
    }
    $rootScope.watchPosition = function (eventid) {
      //  alert(eventid+"frojm watch postion");
        $scope.watchID = navigator.geolocation.watchPosition(function (position) {
                var latPos = position.coords.latitude;
                var lngPos = position.coords.longitude;
              //  alert(eventid);
                firebaseservices.updateData('EventsLocation', eventid + '/l', { 0: latPos, 1: lngPos }).then(function (res) {
                //    alert('success')
                })
            }, function (er) {

                alert(er);
            }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
        }
    $scope.addMarker = function (res) {
        $scope.map.addMarker({
            // position: position, //{ lat: 37.422359, lng: -122.084344 },
            position: { lat: res.Latitude, lng: res.Longitude },
            title: res.eventDetail,
            snippet: "Open2",
           
          
            animation: plugin.google.maps.Animation.BOUNCE,
            'icon': {
                'url': res.photoUrl,
            }
        }, function (marker) {
            marker.set("markerDetails", res);
            if (res.isTapable != 'location' && res.CreatedBy!=localStorage.getItem('UserId')) {
                marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                    //alert("Marker is clicked");
                    $scope.event = {};
                    $scope.markerDetails = marker.get("markerDetails");
                    $scope.event.eventImage = res.eventPhoto;
                    $scope.event.eventDetail = res.eventDetail;
                    $scope.event.distance = (mapservices.distanceBetweenTwoLatLong(res.Latitude, res.Longitude, $scope.myLatitude, $scope.myLongitude, 'km')).toFixed(1);
                    $scope.event.timeCreated = ((new Date().getTime() - res.CreatedTime) / (1000 * 60)).toFixed(0);
                    $scope.event.emoji = res.photoUrl.replace('./', '');
                    $scope.event.key = res.key;
                    console.log(res);
                    firebaseservices.getDataFromNodeValue('Users/' + res.CreatedBy).then(function (suc) {
                        $scope.event.userImage = suc.PhotoUrl;
                        $scope.event.Name = suc.Name;
                        
                        
                    })
                $scope.openModalAccept.show();
                $scope.map.setClickable(false);
                console.log($scope.markerDetails)
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
            console.log("adfasdfsdf 2");
            mapservices.mapClikable(true,'map');
            $scope.notSelectedEvent = false;
            $scope.map.clear();
            $scope.map.setClickable(true);

        }
        if ($scope.currentPageIndex == 3) {

            // $scope.currentPageIndex--;
            $scope.map.setClickable(true);
            $scope.currentPage = $scope.pages[$scope.currentPageIndex]
            $scope.mapHeight = { "top": "52px", "bottom": "107px" };
            // $state.go('picture');
            firebaseservices.getDataFromNodeValue('AppConfig/ExpireTime').then(function (suc) {

                var date=new Date().getTime();
                var expDate = suc * 60 * 1000 + date;

            
                // $scope.currentPageIndex--;
               
                   $state.go('picture', { data: JSON.stringify({ photoUrl: $scope.selectedImage, eventDetail: $scope.eventText, Latitude: $scope.myLatitude, Longitude: $scope.myLongitude, expireTime: expDate, isExpired: false, CreatedBy: localStorage.getItem('UserId'), CreatedTime: date,PeopleJoined:true }) })
        
            },function(er){
            
            })
            
        }
        if ($scope.currentPageIndex == 1) {

            $scope.map.setClickable(false);
            // mapservices.mapClikable(false,'map');
             $scope.map.clear();
             // $scope.map.off();
            $scope.addMarker({ Latitude: $scope.myLatitude, Longitude: $scope.myLongitude, eventDetail: 'location', photoUrl: './img/destinationpin.png' });
           
           
        }
    }
    //var firebaseRef = firebase.database().ref();
    //var geoFire = new GeoFire(firebaseRef.child('EventsLocation/'));
    
    //var geoQuery = geoFire.query({
    //    center: [$scope.myLatitude, $scope.myLongitude],
    //    radius: radiusInKm
    //});

   
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

        if ($scope.currentPageIndex == 1) {
            $scope.map.clear();
            $scope.addMarker({ Latitude: $scope.myLatitude, Longitude: $scope.myLongitude, eventDetail: 'location', photoUrl: './img/destinationpin.png' });
            $scope.map.setClickable(false);
        } else if ($scope.currentPageIndex == 2) {
            $scope.map.clear();
            $scope.map.setClickable(false);

        } else {
            $scope.map.setClickable(true);
            $scope.map.clear();
            for (var i = 0; i < $scope.events.length; i++) {
                $scope.addMarker($scope.events[i]);
            }
            //deferred.resolve(events);

        }
        $scope.currentPage = $scope.pages[$scope.currentPageIndex];

    }
   
         $ionicModal.fromTemplateUrl('templates/popup1.html', {
        scope: $scope
         }).then(
    function (modal) {
        $scope.openModalCross = modal;

    });
         $ionicModal.fromTemplateUrl('views/flashModal.html', {
             scope: $scope
         }).then(
    function (modal) {
        $scope.flashModal = modal;

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
    $scope.joinEvent = function (id) {
        $scope.currentPageIndex=3;
       // $scope.notSelectedEvent = true;
        //  mapservices.mapClikable(false)
        $scope.map.setClickable(true);
        $scope.openModalAccept.hide();
        $scope.mapHeight = { "top": "52px", "bottom": "107px" };
        console.log($scope.markerDetails)
        $scope.currentPage = $scope.pages[$scope.currentPageIndex];
        var data={};
        data[localStorage.getItem('UserId')]=true;

        firebaseservices.setDataToNode('Events/' + id + '/PeopleJoined', data)
    }

    $scope.closeModalAccept = function () {
        $scope.map.setClickable(true);
        $scope.openModalAccept.hide();
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
    $scope.showFlashModal = function () {
        $scope.flashModal.show();
        if (ionic.Platform.isWebView()) {

        $scope.map.setClickable(false);
        }
    }
    $scope.sendMessage = function () {
        if (ionic.Platform.isWebView()) {

            $scope.map.setClickable(false);
        }
        $scope.backTemplates = !$scope.backTemplates; $scope.backArrow = !$scope.backArrow; $scope.bg_text = 'Select a message to send'
    }

    $scope.feedback = function () {
        $state.go('feedback');
    }

    $scope.notification = function () {
        $state.go('notification');
    }
    $scope.showProfile = function () {
       // alert();
        $scope.profileShow = !$scope.profileShow;
        $scope.backArrow = !$scope.backArrow;
        if (ionic.Platform.isWebView()) {

            $scope.map.setClickable(false);
        }
        $scope.bg_text = 'People attending';
        $ionicSlideBoxDelegate.update()
    }
    $scope.firstFooterShow = function () {
        $scope.backTemplates = true; $scope.backArrow = false; $scope.profileShow = false; $scope.bg_text = 'Experience Details';
        if (ionic.Platform.isWebView()) {

            $scope.map.setClickable(true);
        }
    }
    $scope.slideNext = function () {
        $ionicSlideBoxDelegate.next();
    }
    $scope.slidePrevious = function () {
        $ionicSlideBoxDelegate.previous();
    }

    })

}).directive('openModal', function ($ionicModal, firebase, $cordovaSocialSharing) {
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

    scope.shareLink = function(){
          console.log("Share link");
          scope.closeModal();
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




            scope.closeModal = function () {
                if (!ionic.Platform.isWebView()) {
                    console.log("is not WebView");

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
               // mapservices.mapClikable(true);
                $state.go(scope.data);
            })
        }
    }
});
