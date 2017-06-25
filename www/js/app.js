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

        $ionicPlatform.registerBackButtonAction(function () {
            console.log("back button");
        }, 100);
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
         if (ionic.Platform.isWebView()) {
             //window.FirebasePlugin.getToken(function (token) {
             //    // save this server-side and use it to push notifications to this device
             //    console.log(token);
             //}, function (error) {
             //    console.error(error);
             //});
             //window.FirebasePlugin.onTokenRefresh(function (token) {
             //    // save this server-side and use it to push notifications to this device
             //    console.log(token);
             //}, function (error) {
             //    console.error(error);
             //});
             //window.FirebasePlugin.onNotificationOpen(function (notification) {
             //    console.log(notification);
             //}, function (error) {
             //    console.error(error);
             //});
             var push = PushNotification.init({
                 //
                   //  android: { senderID: "12345679" }, //correct id
                   //  ios: { alert: "true", badge: true, sound: 'false' },
                     //windows: {}
                 
                 android: {
                     senderID: "584274948676"
                 },
                 browser: {
                     pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                 },
                 ios: {
                     alert: "true",
                     badge: "true",
                     sound: "true"
                 },
                 windows: {}
             });


             push.on('registration', function (data) {
                 // data.registrationId
               //  alert(data.registrationId)
             });

             push.on('notification', function (data) {
                 // data.message,
                 // data.title,
                 // data.count,
                 // data.sound,
                 // data.image,
                 // data.additionalData
                 alert(data)
             });

             push.on('error', function (e) {
                 // e.message
                 alert(e.message)
             });

             // FCMPlugin.onTokenRefresh(function (token) {

             //     localStorage.setItem('token', token);
             //     //firebaseRef.child('Users/'+localStorage.getItem('UserId'))
             // });
             // FCMPlugin.onNotification(function (data) {
             //     if (data.wasTapped) {
             //         //Notification was received on device tray and tapped by the user.
             //         // alert(JSON.stringify(data));
             //     } else {
             //         //Notification was received in foreground. Maybe the user needs to be notified.
             //         // alert(JSON.stringify(data));
             //     }
             // });
             // FCMPlugin.getToken(function (token) {
             //     localStorage.setItem('token', token);
             //     // alert(token);
             //     //return token;
             // })

         }

         
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

    $ionicPlatform.registerBackButtonAction(function(event){
      event.preventDefault();
    }, 100);



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
        templateUrl: 'templates/appfeedback.html',
        controller: 'feedBackCtrl'

    })

    .state('policy', {
        url: '/policy',
        templateUrl: 'templates/policy.html',
        controller:'policyCtrl'

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
        url: '/picture/:data',
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