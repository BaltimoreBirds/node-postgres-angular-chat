var chatApp = angular.module('nodeChat',['luegg.directives', 'ui.tree', 'ui.bootstrap', 'angular-flash.service', 'angular-flash.flash-alert-directive'])
.config(function (flashProvider) {

            // Support bootstrap 3.0 "alert-danger" class with error flash types
            flashProvider.errorClassnames.push('alert-danger');

            /**
             * Also have...
             *
             * flashProvider.warnClassnames
             * flashProvider.infoClassnames
             * flashProvider.successClassnames
             */

        })
.factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
 
    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }
 
            socket.on(eventName, wrapper);
 
            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },
 
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}])
.controller('mainController', function($scope, $http, $rootScope, socket){

	$rootScope.user = {};
	$scope.actions = {};
	$scope.users = getUsers();
	$scope.actions['typing'] = {};
	$rootScope.alert = {}
	$rootScope.alert.messageDelete = false;
	$scope.newMessageData = {};
	$scope.deletedMessage = {};
	$scope.chatUsers = {};
	$scope.messageData = {};
	$scope.chatsData = [];
	$scope.userData = {};
	$scope.loginData = {};
	$scope.chatCreateData = {};
	$scope.newMessageSocketData = {};
	$scope.$watch('chatsData', function(newChats, oldChats) {
	  //update the DOM with newValue
	});

	//Check If user is logged in
	checkLogin();
	
	socket.on("typed", function(data){
		var chatID = Object.keys(data.typing);
		$scope.actions.typing[chatID] = data.typing[chatID];
	});

	socket.on("chatCreated", function(data){
		// getChats();
		if(data.data.chat){
			$scope.chatsData.push(data.data.chat);
			getChatUsers(data.data.chat.id);
		}
	})

	socket.on("messageDeleted", function(data){
		angular.forEach($scope.chatsData, function(chat, key){
    	if(chat.id == data.chatID){
				angular.forEach(chat.messages, function(message, key){
        	if(message.id == data.messageID){
        		chat.messages.splice(key, 1);
        	}
        });
    	}
    });
    $rootScope.alert.messageDelete = true;
		setTimeout(function(){
			$rootScope.alert.messageDelete = false;
			$rootScope.$apply();
		}, 1500);
	});

	socket.on("loggedOut", function(data){
		//Update User models
		updateUserStatus(data, 'inactive');
	});

	socket.on("messageSent", function(data){
		angular.forEach($scope.chatsData, function(chat, key){
    	if(chat.id == data.message.chat_id){
    		//Add notification
    		if($scope.user.id != data.user){
    			$('i.msgAlert'+chat.id+'.fa-exclamation').removeClass('hide');
    		}	    		
    		chat.messages.push(data.message);
    	}
    });
	});

	socket.on("loggedIn", function(data){
		//Update User models
		updateUserStatus(data, 'active');
	});

	$scope.hideAlert = function(chatID){
		$('i.msgAlert'+chatID+'.fa-exclamation').addClass('hide');
	}

	function updateUserStatus(data, status){
		//updates $scope.chatUsers
		angular.forEach($scope.chatUsers, function(chatUser, key){
			angular.forEach(chatUser, function(user, key){
				if(data == user.id){
					user.status = status;
				}
			});
		});
		//Updates $scope.users
		angular.forEach($scope.users, function(user, key){
			if(data == user.id){
				user.status = status;
			}
		});
	}

	$scope.isMe = function(userID){
		if(userID == $rootScope.user.id){
			return 'user'
		}else{
			return 'foreignUser'
		}
	}

	$scope.active = function(status){
		if(status == 'active'){
			return 'active';
		}else{
			return 'inactive';
		}
	}

	function getUsers(){
		$http.get('users')
			.success(function(data){
				$scope.users = data.data;
			})
			.error(function(err){
				console.log('Get Users Error', err);
			});
	}	

	function getChatUsers(chatID){
		$http.get('chatUsers/' + chatID)
			.success(function(data){
				$scope.chatUsers[data.data.id] = data.data.users;
			})
			.error(function(err){
				console.log('Other Users Retrieval Error', err);
			});
	}

	function getUserInfo(userID){
		$http.get('users/' + userID)
			.success(function(data){
				$rootScope.user.username = data.data.username;
			})
			.error(function(err){
				console.log('User Retrieval Error:', err);
			});
	}
	
	function checkLogin(){
		$http.get('checkLogin')
			.success(function(data){
				if(data.loggedIn){
					getUserInfo(data.user);
					$rootScope.user.status = data.loggedIn;
					$rootScope.user.id = data.user;
					getChats();
				}else{
					$rootScope.user.status = data.loggedIn;
					$rootScope.user.id = null;
					$rootScope.user.username = null;
				}
			})
			.error(function(error){

			});
	}

	function getChats(){
		$http.get('chats')
			.success(function(data){
				$scope.chatsData = data.data.chats;
				angular.forEach(data.data.chats, function(chat, key){
					getChatUsers(chat.id);
				});
			})
			.error(function(error){
				console.log('Chat retrieval ERROR', error);
			});
	}

	//Create a new Chat
	$scope.createChat = function(userID) {
		if($scope.chatCreateData.username != $scope.user.username){
			$http.post('chats', $scope.chatCreateData)
				.success(function(data){
					if(data.data.chat){
						socket.emit("createChat", data);
						$scope.chatCreateData.username = null;
					}else{
						alert('You\'re already chatting with that person, bozo');
					}				
				})
				.error(function(error){
					console.log('Chat Create Error');
				});
		}else{
			alert('Think harder, bozo');
		}
		
	}

	$scope.createMessage = function(chatID, msg) {
		//Kill typing events.
		$scope.actions['typing'][chatID] = false;
		socket.emit("typing", $scope.actions);	
		$scope.newMessageData.chatID = chatID;
		$http.post('messages', $scope.newMessageData)
	    .success(function(data) {
        //clear input values
        $scope.newMessageData[data.data.message.chat_id].text = null;
	    })
	    .error(function(error) {
        console.log('Error: ', error);
	    });
    };

	// Delete a message
	$scope.deleteMessage = function(messageID, chatID) {
		$http.delete('messages/' + messageID)
	    .success(function(data) {
	    	$scope.deletedMessage.messageID = messageID;
	    	$scope.deletedMessage.chatID = chatID;
	    	socket.emit("messageDelete", $scope.deletedMessage);
        $scope.messageData = data.data.collection;
	    })
	    .error(function(data) {
        console.log('Error: ',  data);
	    });
	};

	//Create a user
	$scope.createUser = function(userID) {
		$http.post('users', $scope.userData)
		.success(function(data){
			$scope.userData	= data;
		})
		.error(function(error){
			//!!!!!!!!!!!HOLY SHIP PROPER DISPLAY OF [OBJECT][OBJECT]!!!!!!!!!YOU IDIOT!!!!!!!
			console.log('User Creation Error: ', error);
		});
	}

	$scope.logOut = function(){
		$http.get('logout')
			.success(function(){
				console.log('logged out!');
				socket.emit("logOut", $scope.user.id);
				checkLogin();
			})
			.error(function(error){
				console.log('Error logging out:', error);
			});
	}

	var myTimer = undefined;
	var delayTime = 1500;

	function typingCheck(chatID){
		$scope.actions['typing'][chatID] = false;
		socket.emit("typing", $scope.actions);	
	}
	$scope.typing = function(chatID){
		//Send Typing Socket
		$scope.actions['typing'][chatID] = true;
		socket.emit("typing", $scope.actions);	
		if (myTimer) {
        clearTimeout(myTimer);
    }
    myTimer = setTimeout(function(){
    	typingCheck(chatID);
    }, 1500);    
	}

	// $scope.fBAuthenticate = function(userID) {
	// 	$http.get('auth/facebook')
	// 	.success(function(data){
	// 		$scope.userData = data;
	// 		console.log(data);
	// 	})
	// 	.error(function(error){
	// 		console.log('Facebook Authentication Error: ', error);
	// 	});
	// }

});