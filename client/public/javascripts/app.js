var chatApp = angular.module('nodeChat',['luegg.directives', 'ui.tree'])
.factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    console.log("socket created");
 
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
            	console.log('----EMITTING----');
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
	
	//Get all todos with AJAX request to /api/v1/messages
	// $http.get('messages')
	// 	.success(function(data){
	// 		$scope.messageData = data.data; 
	// 		console.log('Data: ', data.data);
	// 	})
	// 	.error(function(error){
	// 		console.log('Error ', error);
	// 	});
	
	socket.on("typed", function(data){
		var chatID = Object.keys(data.typing);
		$scope.actions.typing[chatID] = data.typing[chatID];
	});

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

	$scope.isMe = function(userID){
		if(userID == $rootScope.user.id){
			return 'user'
		}else{
			return 'foreignUser'
		}
	}

	socket.on("messageSent", function(data){
		console.log('Messages associated ID:', data);
		angular.forEach($scope.chatsData, function(chat, key){
    	if(chat.id == data.chat_id){
    		console.log('Chat object:', chat);
    		chat.messages.push(data);
    	}
    });
	});

	function getChatUsers(chatID){
		$http.get('chatUsers/' + chatID)
			.success(function(data){
				$scope.chatUsers[data.data.id] = data.data.users;
				console.log('Chat Users', $scope.chatUsers);
			})
			.error(function(err){
				console.log('Other Users Retrieval Error', err);
			});
	}

	function getUserInfo(userID){
		$http.get('users/' + userID)
			.success(function(data){
				$rootScope.user.username = data.data.username;
				console.log(data);
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
				console.log('Chats Data:', data.data);
				$scope.chatsData = data.data.chats;
				angular.forEach(data.data.chats, function(chat, key){
					console.log('Chat:', chat.id);
					getChatUsers(chat.id);
				});
			})
			.error(function(error){
				console.log('Chat retrieval ERROR', error);
			});
	}

	//Create a new Chat
	$scope.createChat = function(userID) {
		$http.post('chats', $scope.chatCreateData)
			.success(function(data){
				$scope.chatsData = data.data.chats;
				console.log('chatsData: ', $scope.chatsData);
				$scope.chatCreateData.username = null;
			})
			.error(function(error){
				console.log('Create Chat ERROR', error);
			});
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
        console.log('Deleted data', data.data.collection);
	    })
	    .error(function(data) {
        console.log('Error: ',  data);
	    });
	};

	//Create a user
	$scope.createUser = function(userID) {
		// console.log($scope.userData);
		$http.post('users', $scope.userData)
		.success(function(data){
			$scope.userData	= data;
			console.log(data);
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