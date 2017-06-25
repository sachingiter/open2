open2.controller('policyCtrl', function ($scope, $rootScope, $http, $state, firebaseservices) {
    $scope.data = {};
    firebaseservices.getDataFromNodeValue('AppConfig/PolicyText').then(function (res) {
        $scope.data.policyText = res;
      //  alert(res);
    }, function (er) {

    })
  // $scope.user = {};
  // $scope.user.mail = "prash_jain92@mailinator.com";
  // $scope.user.pass = "123456";


});
