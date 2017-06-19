//Generic service for calling API
angular.module('cordovacameraservice.module', []).factory('cordovacameraservice', ['$http', '$q', '$cordovaCamera', function ($http, $q, $cordovaCamera) {

    return {
       
        getImagePathFromMobile: function () {
            var deferred = $q.defer();
            document.addEventListener('deviceready', function () {
            console.log('called alert');
           
            var defaultOption = {
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.ALLMEDIA
            }
            $cordovaCamera.getPicture(defaultOption).then(function (imageData) {

      
       deferred.resolve(imageData);
            }, function (er) {
                deferred.reject(er);
            });
        }, false);
            return deferred.promise;
        }, captureImage: function () {
            var deferred = $q.defer();
            document.addEventListener('deviceready', function () {
                console.log('called alert');

                var defaultOption = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,

                    targetWidth: 100,
                    targetHeight: 100,
                }
                $cordovaCamera.getPicture(defaultOption).then(function (imageData) {


                    deferred.resolve(imageData);
                }, function (er) {
                    deferred.reject(er);
                });
            }, false);
            return deferred.promise;
        },
        getImageDataUrl: function () {
            var deferred = $q.defer();
            document.addEventListener('deviceready', function () {
                console.log('called alert');

                var defaultOption = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                   
                    targetWidth: 100,
                    targetHeight: 100,
                }
                $cordovaCamera.getPicture(defaultOption).then(function (imageData) {


                    deferred.resolve(imageData);
                }, function (er) {
                    deferred.reject(er);
                });
            }, false);
            return deferred.promise;
        },
        convertImageUriToDataUrl: function(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = 100; // or 'width' if you want a special/scaled size
        canvas.height = 100; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
       // callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}
        
    };
}]);
