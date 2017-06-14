// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
 
var open2 = angular.module('starter', ['ionic','fbservice.factory', 'ngCordova','firebaseservices.factory','ion-google-autocomplete', 'mapservices.factory', 'firebase']);

open2.run(function ($ionicPlatform, $cordovaGeolocation, $state, $firebaseAuth) {
    var config = {
        apiKey: "AIzaSyDRCV9GSpYNm4Odlwbm1Us1g86safXCMLg",               // Your Firebase API key
        authDomain: "open2-133c3.firebaseio.com",       // Your Firebase Auth domain ("*.firebaseapp.com")
        databaseURL: "https://open2-133c3.firebaseio.com/"     // Your Firebase Database URL ("https://*.firebaseio.com")
        //   storageBucket: "<STORAGE_BUCKET>"  // Your Cloud Storage for Firebase bucket ("*.appspot.com")
    };
    firebase.initializeApp(config);
    $ionicPlatform.ready(function () {
        if (!ionic.Platform.isWebView()) {
            console.log('webview');
            var authObj = $firebaseAuth();
            var firebaseRef = firebase.database().ref();
            authObj.$signInWithEmailAndPassword("sachin.p@mailinator.com", "123456789").then(function (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                localStorage.setItem('UserId', firebaseUser.uid);
                localStorage.setItem('UserLoggedIn', 'true');

                firebaseObj = firebaseRef.child('Users/' + firebaseUser.uid).once('value').then(function (snapshot) {
                    //var username = snapshot.val().username;
                    console.log(snapshot.val());
                    console.log(snapshot.val() === null)
                    if (snapshot.val() === null) {
                        firebaseRef.child('Users/' + firebaseUser.uid).set({
                            AccountStatus: "Active",
                            AverageRating: "0",
                            CompletedAppliedTasks: "",
                            //  CreatedTasks: [{ CreatedTask: true }],
                            //AppliedTasks: [{ AppliedTask: true }],
                            CreatedAt: new Date().getTime(),
                            Email: '',
                            FlaggedCount: 0,
                            InvitationDeepLink: 0,
                            InvitedByUserID: "invitedbyID",
                            KarmaPoints: 0,
                            LastLoginAt: "date of lastlogin",
                            Lat: "",
                            location: 'indore Mp',
                            Long: "",
                            Name: 'Irshad',
                            PhotoUrl: "file:///android_asset/www/img/greg.png",
                            Recommendations: "0",
                            //  SocialLinks: [{links:true}],
                            UpdatedAt: new Date().getTime()
                        });
                    }
                })
            }).catch(function (error) {
                console.error("Authentication failed:", error);
            });
        }
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $state.go("menu");
                // User is signed in.
            } else {
                $state.go('login');
            }
        })
         document.addEventListener("deviceready", function () {
            $cordovaGeolocation
       .getCurrentPosition({ timeout: 3000, enableHighAccuracy: false })
       .then(function (position) {

       }, function (err) {
           // error
       });

        }, false);

         
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
open2.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('menu', {
        url: '/menu',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'

    })

    .state('menu1', {
        url: '/menu1',
        templateUrl: 'templates/menu1.html',
        controller: 'menu1Ctrl'
    })

    .state('notification', {
        url: '/notification',
        templateUrl: 'templates/notification.html'


    })

    .state('appfeedback', {
        url: '/appfeedback',
        templateUrl: 'templates/appfeedback.html'


    })

    .state('policy', {
        url: '/policy',
        templateUrl: 'templates/policy.html'


    })


    .state('approve', {
        url: '/approve',
        templateUrl: 'templates/approve.html'


    })
    .state('location', {
        url: '/location',
        templateUrl: 'templates/location.html'


    })
    .state('select', {
        url: '/select',
        templateUrl: 'templates/select.html'


    })

    .state('selected', {
        url: '/selected',
        templateUrl: 'templates/selected.html'


    })
    .state('picture', {
        url: '/picture',
        templateUrl: 'templates/picture.html',
        controller: 'pictureCtrl'

    })
    .state('popup1', {
        url: '/popup1',
        templateUrl: 'templates/popup1.html'


    })
    
    .state('popup2', {
        url: '/popup2',
        templateUrl: 'templates/popup2.html'


    })

     .state('nav', {
         url: '/nav',
         templateUrl: 'templates/nav.html'


     });
   
    

});