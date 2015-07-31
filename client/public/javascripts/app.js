var chatApp = angular.module('nodeChat',['luegg.directives'])
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
	$scope.newMessageData= {};
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

	// Create a new message
	$scope.sendMsgSocket = function(chatID, msg){
		// $scope.createMessage(chatID);
		$scope.newMessageSocketData['chatID'] = chatID;
		$scope.newMessageSocketData['msg'] = msg;
    socket.emit("messageSend", $scope.newMessageSocketData);
  }

	$scope.createMessage = function(chatID, msg) {
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
	$scope.deleteMessage = function(messageID) {
		$http.delete('messages/' + messageID)
	    .success(function(data) {
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