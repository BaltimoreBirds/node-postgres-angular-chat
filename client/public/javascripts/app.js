angular.module('nodeChat',[])

.controller('mainController', function($scope, $http, $rootScope){

	$rootScope.isLoggedIn = {};
	$scope.formMessageData= {};
	$scope.messageData = {};
	$scope.chatsData = [];
	$scope.userData = {};
	$scope.loginData = {};
	$scope.chatCreateData = {};

	$scope.$watch('chatsData', function(newChats, oldChats) {
	  //update the DOM with newValue
	});

	checkLogin();
	//Check If user is logged in

	
	//Get all todos with AJAX request to /api/v1/messages
	// $http.get('messages')
	// 	.success(function(data){
	// 		$scope.messageData = data.data; 
	// 		console.log('Data: ', data.data);
	// 	})
	// 	.error(function(error){
	// 		console.log('Error ', error);
	// 	});
	function getUser(){
		
	}
	
	function checkLogin(){
		$http.get('checkLogin')
			.success(function(data){
				console.log('LOGIN', data);
				if(data.loggedIn){
					$rootScope.isLoggedIn.status = data.loggedIn;
					$rootScope.isLoggedIn.id = data.user
					getChats();
				}
			})
			.error(function(error){

			});
	}

	function getChats(){
		$http.get('chats')
			.success(function(data){
				$scope.chatsData = data.data.chats;
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
			})
			.error(function(error){
				console.log('Create Chat ERROR', error);
			});
	}

	// Create a new message
	$scope.createMessage = function(chatID) {
		$scope.formMessageData.chatID = chatID;
		$http.post('messages', $scope.formMessageData)
	    .success(function(data) {
        angular.forEach($scope.chatsData, function(chat, key){
        	console.log('MEssages associated ID:', data.data.message.chat_id)
        	if(chat.id == data.data.message.chat_id){
        		console.log('Chat object:', chat);
        		chat.messages.push(data.data.message);
        	}
        });
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