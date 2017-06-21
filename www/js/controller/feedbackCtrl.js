open2.controller('feedBackCtrl', function ($scope, $rootScope, $http, $state, firebaseservices) {

  // $scope.user = {};
  // $scope.user.mail = "prash_jain92@mailinator.com";
  // $scope.user.pass = "123456";
    $scope.data = {};
    $scope.sendMessage = function (data) {
        var mail = JSON.parse(localStorage.getItem('myDetails'));
       // alert();
        firebaseservices.addDataToArray('UserNotifications/' + localStorage.getItem('UserId'), { senderMailId: data.senderMail, text: data.text })
        $state.go('menu')
    }
});
