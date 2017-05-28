//Generic service for calling API
angular.module('fbservice.factory', []).factory('fbservice', ['$http', '$q', '$cordovaFacebook', function ($http, $q, $cordovaFacebook) {



    return {
        fbLogin: function () {
            try {
            var deferred = $q.defer();
            $cordovaFacebook.login(["public_profile", "email", "user_friends"])
   .then(function (success) {
       deferred.resolve(success);
      // alert('success');
       //alert(success);
       //alert(JSON.stringify(success));
   }, function (error) {
       alert(error);
       alert(JSON.stringify(error));
       deferred.reject(error);
   });
            return deferred.promise;


            } catch (er) { alert(er) }
        },
        getLoginStatus: function () {
            var deferred = $q.defer();
            $cordovaFacebook.getLoginStatus()
    .then(function (success) {
        deferred.resolve(success);
        /*
        { authResponse: {
            userID: "12345678912345",
            accessToken: "kgkh3g42kh4g23kh4g2kh34g2kg4k2h4gkh3g4k2h4gk23h4gk2h34gk234gk2h34AndSoOn",
            session_Key: true,
            expiresIn: "5183738",
            sig: "..."
          },
          status: "connected"
        }
        */
    }, function (error) {
        deferred.reject(error);
        // error
    });
            return deferred.promise;
        },
        getAccessTokenFb: function () {
            console.log('getaccesstokenFb called');
            var deferred = $q.defer();
            $cordovaFacebook.getAccessToken().then(function (success) {
        deferred.resolve(success);
    }, function (error) {

        // error
        deferred.reject(error);
    });
            return deferred.promise;
        },
        facebookGraphApiCall: function (userId, fields, permissions) {
            var defered = $q.defer();
            facebookConnectPlugin.api(
               userId + "/?fields="+fields,permissions,
               function (response) {
                   defered.resolve(response);
                   //alert(JSON.stringify(response));
                   // RequestsService.sendData(response);['public_profile', 'email']
                 //  $scope.user = response;
               },
               function (error) {
                   defered.reject(error);
                   alert("Failed: " + error);
               }
           );
            return defered.promise;
        },
    };
}]);
