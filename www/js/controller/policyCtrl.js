open2.controller('policyCtrl', function ($scope, $rootScope, $http, $state, firebaseservices) {
    $scope.data = {};
    firebaseservices.getDataFromNodeValue('AppConfig/PolicyText').then(function (res) {
        $scope.data.policyText = res;
      //  alert(res);
    }, function (er) {

    })

   $scope.goBack = function(){
   	console.log("localStorage.getItem('UserId') : " + localStorage.getItem('UserId'));
   	var userid = localStorage.getItem('UserId');
   	if(userid !== null && userid !== undefined) {
   		console.log("inside menu")
   		$state.go('menu');
   		   	
   	}else {
   		console.log("inside Login")
   		$state.go('login');
   	}
   }
  // $scope.user = {};
  // $scope.user.mail = "prash_jain92@mailinator.com";
  // $scope.user.pass = "123456";


});
