
open2.controller('menu1Ctrl', function ($scope, $state, $rootScope, $ionicModal, mapservices, $cordovaSocialSharing, $cordovaFlashlight) {
   

      $scope.isShown = true;
    $scope.isShown1 = false;
    $scope.backTemplates = true;
    $scope.profileShow = false;
    $scope.select = {};
    $scope.select.selectedText = 0;
    $scope.bg_text = "Experience Details";
    $scope.backArrow = false;
    $scope.messageTemplates = [{text:"I'm here!",id:1}, {text:"Sorry, cant't make it!",id:2}, {text:"On my way!",id:3}, {text:"On your way?",id:4}];
    $scope.events = [];
     $ionicPlatform.ready(function () {
      /*************   Making Firebase instance ***********************/
      var firebaseRef = firebase.database().ref();

      /*************   Making  ***********************/

     })


   
   




})