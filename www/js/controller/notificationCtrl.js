open2.controller('notificationCtrl', function ($scope, $rootScope, $http, $state, firebaseservices) {
    firebaseservices.getDataFromNodeValue('/Users/' + localStorage.getItem('UserId') + '/NotificationEnabled').then(function (res) {
        $scope.data = res;
    });

    $scope.updateNotification = function (value) {
        var dat = {};
        dat[value] = !$scope.data[value]
        firebaseservices.updateData('/Users/' + localStorage.getItem('UserId'), 'NotificationEnabled', dat).then(function (res) {

        })
    }


  // $scope.user = {};
  // $scope.user.mail = "prash_jain92@mailinator.com";
  // $scope.user.pass = "123456";


});
