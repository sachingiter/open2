//Generic service for calling API
angular.module('firebaseservices.factory', []).factory('firebaseservices', ['$q', '$firebaseAuth', '$ionicLoading', '$firebaseArray', '$firebaseObject', 'mapservices', function ($q, $firebaseAuth, $ionicLoading, $firebaseArray, $firebaseObject, mapservices) {

    var events = [];
    var firebaseRef = firebase.database().ref();
    var geoFire = new GeoFire(firebaseRef.child('EventsLocation/'));
    var geoQuery;
    var data = [];
    function addUserIfNotExistInfoToDb(userId, email, name, photo) {
        // var registerd = true;
        console.log('userId    ' + userId);
        console.log('email    ' + email);
        console.log('name    ' + name);
        console.log('photo    ' + photo);
        firebaseObj = firebaseRef.child('Users/' + userId).once('value').then(function (snapshot) {
            //var username = snapshot.val().username;
            console.log(snapshot);
            if (snapshot.val() === null) {
                firebaseRef.child('Users/' + userId).set({
                    AccountStatus: "Active",
                    AverageRating: 0,
                    CompletedAppliedTasks: "",
                  //  CreatedTasks: [{ CreatedTask: true }],
                   // AppliedTasks: [{ AppliedTask: true }],
                    CreatedAt: new Date().getTime(),
                    Email: email,
                    FlaggedCount: 0,
                    InvitationDeepLink: 0,
                    InvitedByUserID: "invitedbyID",
                    KarmaPoints: 0,
                    LastLoginAt: "date of lastlogin",
                    Lat: "",
                    location: "",
                    Long: "",
                    Name: name.substr(0, name.indexOf(" ")),
                    PhotoUrl: photo,
                    Recommendations: "0",
                   // SocialLinks: [{ links: true }],
                    UpdatedAt: new Date().getTime()
                });
            }
        })
    };
    var services = {
        loginFacebookFirebase: function (token) {
            var authObj = $firebaseAuth();
            var deferred = $q.defer();
            console.log(token);
            var tok = token.authResponse.accessToken;
            var credential = firebase.auth.FacebookAuthProvider.credential(

  token.authResponse.accessToken
);
            authObj.$signInWithCredential(credential).then(function (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                addUserIfNotExistInfoToDb(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName, firebaseUser.photoURL)

                deferred.resolve(firebaseUser);
            }).catch(function (error) {
                deferred.reject(error);
                console.error("Authentication failed:", error);
            });
            return deferred.promise;
        },
        addDataToFirebase: function (data, node) {
            var deferred = $q.defer();
            //  var ref = firebase.database().ref();



            var messagesRef = firebaseRef.child(node);

            var list = $firebaseArray(messagesRef);
            //console.log(data);
            // add an item
           // firebaseRef.child(node).push(data)
            list.$add(data).then(function (suc) {
                console.log(suc);
                //var ref1 = firebaseRef.child('taskLocation');
                //var geoFire = new GeoFire(ref1);
               // if (data.Address != 'virtual') {
                geoFire.set(suc.key, [data.Latitude, data.Longitude]).then(function () {
                    // console.log("Provided key has been added to GeoFire");
                    list = $firebaseArray(firebaseRef.child('Users/' + localStorage.getItem('UserId') + "/CreatedEvents"));
                    console.log(list)
                    list.$add({ CreatedEventId: suc.key });
                    // messagesRef = firebaseRef.child('Users/' + localStorage.getItem('UserId')+"/CreatedTask").set({
                    // [suc.key]: {Conversations:true}
                    //});


                }, function (error) {
                    console.log("Error: " + error);
                })

               // } else {
                 //   list = $firebaseArray(firebaseRef.child('Users/' + localStorage.getItem('UserId') + "/CreatedTasks"));
                    //console.log(list)
                   // list.$add({ CreatedTaskId: suc.key });
               // }
                deferred.resolve(suc.key);
            }, function (er) {
                deferred.reject(er)
            });
            return deferred.promise;

        },
        //getDataFromNodeValueAsArray: function (node) {
        //    var defer = $q.defer();
        //    var data = firebaseRef.child(node).$asArray();
        //    data.$loaded().then(function (res) {
        //        defer.resolve(res)
        //    })
        //    return defer.promise;
        //},
        getRecordFromFirebaseNode: function (node) {
            //  var deferred = $q.defer();
            $ionicLoading.show();
            var messagesRef = firebaseRef.child(node);
            //  var ref = firebase.database().ref(node);
            // var messagesRef = ref.child("Tasks");
            var list = $firebaseArray(messagesRef);
            setTimeout(function () {


                $ionicLoading.hide();
            }, 2000)
            return list
            // console.log(list);
            // }, 500)

            // var rec = list.$getRecord();


        },
        deleteRecordWhere: function (node, equalTo,orderBy) {
            console.log(equalTo);
            console.log(node);
            var deferred = $q.defer();
            firebaseRef.child(node).orderByChild(orderBy).equalTo(equalTo).on("child_added", function (data) {
                console.log(data.key);
                firebaseRef.child(node+'/'+data.key).remove();
                deferred.resolve('resolved');
            });

           // var ref = firebaseRef.child(node).remove();
           
            return deferred.promise;
            //resolve(true);

        },
        updateRecord: function (node, id,awardeeId) {
            console.log(node + "                  " + id);
            var ref = firebaseRef.child(node + '/' + id)
            //var list = $firebaseArray(ref);
            //list[2].foo = "bar";
            //list.$save(2).then(function (ref) {
            //    ref.key === list[2].$id; // true
            //});
            ref.on('value', function (snap) {
                var obj = snap.val();
                console.log(obj);
                // var snapRef = snap.ref();
                ref.update({
                    Status: 'awarded',
                    awardeeId: awardeeId
                });
            });

        },
        getTaskFromKey: function (key,value) {
            var defer = $q.defer();
            var ref = firebaseRef.child('Tasks/' + key);
            ref.on('value', function (snap) {
                value.Task = snap.val();
                //console.log(value);
                defer.resolve(value);
            })
            return defer.promise;
        },
        getCreatedTask: function (node) {
            var defer = $q.defer();
            var data = [];
            var ref = firebaseRef.child(node)
            //var list = $firebaseArray(ref);
            //list[2].foo = "bar";
            //list.$save(2).then(function (ref) {
            //    ref.key === list[2].$id; // true
            //});
            // var list=  $firebaseArray(ref);
            ref.once('value', function (snap) {
                console.log(snap.val());
                var snapshot=snap.val();
                angular.forEach(snapshot, function (value, index) {
                    value.$id = index;
                    // console.log(index);
                    services.getTaskFromKey(value.CreatedTaskId, value).then(function (value) {
                     //   console.log(value);
                        data.push(value);
                     
                        //if (snapshot.length <= index) {
                            defer.resolve(data);
                          //  console.log(data);
                       // }
                    })
                   // data.push(value);
                })
              //  console.log(data)
               
            });
            return defer.promise;
        },
        updateTaskData: function (data, taskid, node) {
            var defer = $q.defer();
            firebaseRef.child(node + '/' + taskid).update(data);
            geoFire.set(taskid, [data.Latitude, data.Longitude]).then(function () {
                // console.log("Provided key has been added to GeoFire");
                defer.resolve('done')


            }, function (error) {
                console.log("Error: " + error);
            })
            return defer.promise;
        },
        updateData: function (node, id, dataToUpadate) {
            console.log(node + "                  " + id);
            var defer = $q.defer();
            var ref = firebaseRef.child(node + '/' + id)
            //var list = $firebaseArray(ref);
            //list[2].foo = "bar";
            //list.$save(2).then(function (ref) {
            //    ref.key === list[2].$id; // true
            //});
            ref.once('value', function (snap) {
                var obj = snap.val();
                console.log(obj);
                // var snapRef = snap.ref();
                ref.update(dataToUpadate);
                defer.resolve(obj);
            });
            return defer.promise;
        },
        getDataBasedOnLocation: function (center, radius) {
               var deferred = $q.defer();
            
            geoQuery = geoFire.query({
                center: center,
                radius: radius
            });

         
           geoQuery.on("key_entered", function (key, location, distance) {
                console.log(key + " entered query at " + location + " (" + distance + " km from center)");
                firebaseObj = firebaseRef.child('Events/' + key);
                var obj = $firebaseObject(firebaseObj)
                obj.$loaded(function (res) {
                   // console.log("++++++++++++++++++++++=keyentered+++++++++++++++=");
                    //console.log(res);
                    events.push(res);
                    deferred.resolve(events);
                    
                }, function () {

                })
               // events.push(obj)
                return deferred.promise;
            });
          geoQuery.on("key_exited", function (key, location, distance) {
                console.log(key + " exited query to " + location + " (" + distance + " km from center)");
              //  console.log(task)
                angular.forEach(events, function (i, j) {
                    if (i.$id == key) {
                        events.splice(j, 1);
                    }
                })
                deferred.resolve(events);
            });
            return deferred.promise;
        },
        locationFilter: function (radius) {
            console.log(radius);
            geoQuery.updateCriteria({
                radius: parseInt(radius)

            });
        },
        getTaskDetails: function (id) {
            var defered = $q.defer();
            console.log(id);
            for (var i = 0; i < task.length; i++) {
                console.log(task[i])
                if (task[i].$id == id) {
                    defered.resolve(task[i]);
                    //return task[i];
                }
            }
            return defered.promise;
        },
        addDataToFirebaseWithoutLocation: function (Taskid, node1, ownerId) {
            var defered = $q.defer();
            var list = $firebaseArray(firebaseRef.child('Users/' + localStorage.getItem('UserId') + "/AppliedTasks"));
            console.log(list)
            list.$add({ AppliedTaskId: Taskid }).then(function (suc) {
                list = $firebaseArray(firebaseRef.child('TaskConversations/'));
                list.$add({ startConversation: true }).then(function (suc) {
                    defered.resolve(suc.key)
                    var data = {};
                    data[suc.key] = true;
                    messagesRef = firebaseRef.child('Tasks/' + Taskid + '/Conversations/' + localStorage.getItem('UserId')).set(data);
                    firebaseRef.child('Tasks/' + Taskid + "/Applicants").push({ UserId: localStorage.getItem('UserId') })
                }, function (er) {
                    defered.reject(er);
                });

            });
            return defered.promise;
        },
        getDataFromNode: function (node) {
            var defered = $q.defer();
            firebaseRef.child(node)
            firebaseObj = firebaseRef.child(node);
            var obj = $firebaseObject(firebaseObj)
            console.log(obj);
            obj.$loaded(
function (data) {
    console.log(data === obj); // true
    console.log(data)
    defered.resolve(data)
},
function (error) {
    deferred.reject(error);
    console.error("Error:", error);
}
);
            return defered.promise;
        },
        liveChat: function (node, data) {
            var deferred = $q.defer();
            var ref = firebaseRef.child(node);
            //  var obj = $firebaseObject(ref);
            var list = $firebaseArray(ref);
            //  console.log(data);
            // add an item
            list.$add(data).then(function (suc) {
                console.log(suc);
                //var ref1 = firebaseRef.child('taskLocation');
                //var geoFire = new GeoFire(ref1);

                deferred.resolve(suc.key);
            }, function (er) {
                deferred.reject(er)
            });
            //obj.$bindTo()
            return deferred.promise;
        },
        getArrayDataFromNode: function (node) {
            var defered = $q.defer();
            firebaseRef.child(node)
            firebaseObj = firebaseRef.child(node);
            var obj = $firebaseArray(firebaseObj)
            console.log(obj);
            obj.$loaded(
function (data) {
    console.log(data === obj); // true
    console.log(data)
    defered.resolve(data)
},
function (error) {
    deferred.reject(error);
    console.error("Error:", error);
}
);
            return defered.promise;
        },
        getDataFromNodeValue: function (node) {
            var defered = $q.defer();
            firebaseRef.child(node).once('value').then(function (snapshot) {
                var data = snapshot.val();
                data.key = snapshot.key;
                defered.resolve(data)
                console.log(data);
            })
            return defered.promise;
        },
        addDataToArray: function (node,data) {
            var defered = $q.defer();
            firebaseRef.child(node).push(data)
        },
        getDataWhereEqualTo: function (node, condition, orderBy) {
            var defer = $q.defer();
            var data = [];
            firebaseRef.child(node).orderByChild(orderBy).equalTo(condition).on("child_added", function (dat) {
                //console.log(data.val());
                var result = dat.val();
                result.key = dat.key;
                data.push(result);
                defer.resolve(data);
                console.log(dat.key);

            });
            return defer.promise;
        },
        getTopValues: function (node, orderBy, limitTo) {
            var defer = $q.defer();
            var dataTop = [];
            firebaseRef.child(node).orderByChild(orderBy).limitToLast(limitTo).on("child_added", function (snapshot) {
                var dat = snapshot.val();
                dat.key = snapshot.key;
                //console.log(snapshot.val());
                dataTop.push(dat);
                defer.resolve(dataTop)
            });
            return defer.promise;
        },
        setDataToNode: function (node,data) {
            firebaseRef.child(node).update(data);
        },
        removeDataFromNode: function (node) {
            firebaseRef.child(node).remove();
        }
    }
    return services;
}]);
