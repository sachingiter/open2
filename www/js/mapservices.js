//Generic service for calling API
angular.module('mapservices.factory', []).factory('mapservices', ['$http', '$q','$cordovaGeolocation', function ($http, $q, $cordovaGeolocation) {
   
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    };
   
    return {
        getLocationName: function (request) {
            var deferred = $q.defer();
           
            plugin.google.maps.Geocoder.geocode(request, function (results) {
                deferred.resolve(results[0])
                console.log("Location *********** :: " + JSON.stringify(results[0]));
              
            }, function (er) {deferred.reject(er) });
            return deferred.promise;
        },
        createMap: function (id, position,name) {
            
            var defer = $q.defer();
            document.addEventListener("deviceready", function () {
                console.log("inside createMap");
                var div = document.getElementById(id);
                if (!angular.isUndefined(map))
                {
                    map.clear();
                }
                
                // Initialize the map view
                map = plugin.google.maps.Map.getMap(div, {
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
                        'latLng': position,
                        'tilt': 30,
                        'zoom': 15,
                        'bearing': 50
                    }
                });
                map.addEventListener(plugin.google.maps.event.MAP_READY, function () {


                //map.addMarker({
                //    position: position, //{ lat: 37.422359, lng: -122.084344 },
                //    title: name,
                //    snippet: "Community",
                //    animation: plugin.google.maps.Animation.BOUNCE
                //}, function (marker) { });
                defer.resolve(map);

                });
                // Wait until the map is ready status.
               // map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
            }, false);
            return defer.promise;
        },
        addMarker: function (id, position, name, markerIcon) {
           // alert(markerIcon)
            //console.log(map)
            map.addMarker({
                position: position, //{ lat: 37.422359, lng: -122.084344 },
                title: name,
                snippet: "Open2",
                markerName: markerIcon,
                animation: plugin.google.maps.Animation.BOUNCE,
                'icon': {
                    'url': markerIcon,
                }
            }, function (marker) {
                marker.addEventListener(plugin.google.maps.event.MARKER_CLICK, function () {
                    //alert("Marker is clicked");
                 console.log(marker.get("markerName"))
                });
            });
            
                // Show the info window
                //marker.showInfoWindow();

                // Catch the click event
               
        },
        returnObj: function () {
            return map;
        },
        getLatLong: function () {
            var deferred = $q.defer();
            document.addEventListener("deviceready", function () {
               var option = { timeout: 10000, enableHighAccuracy: false, maximumAge: 0};
                $cordovaGeolocation
   .getCurrentPosition(option)
   .then(function (position) {
       deferred.resolve(position);
       console.log('success');
       console.log(position);

   }, function (err) {
       // error
       console.log('err');
       console.log(err);

       deferred.reject(err);
   });

            }, false);
            return deferred.promise;
        },
        distanceBetweenTwoLatLong: function (lat1, lon1, lat2, lon2, distanceIn) {
          
           
                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(lat2 - lat1);  // deg2rad below
                var dLon = deg2rad(lon2 - lon1);
                var a =
                  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km
                if (distanceIn == 'mi') {
                    d=d * 1.60934;
                    return d;
                }
                else {
                    return d;
                }
                
            

           
        },
        mapClikable: function (value,id) {
            if(map[id] != undefined){
                map[id].setClickable(value);    
            }
            
        },

        //     map.setClickable(value);
        // },
       
    };
}]);
