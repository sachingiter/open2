angular.module('menu1.controllers', [])

.controller('menu1Ctrl', function ($scope, $state, $rootScope, $ionicModal) {
   
    $ionicModal.fromTemplateUrl('views/navmodal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;

    });

    $scope.openModal = function () {
        $scope.modal.show();
    }

})