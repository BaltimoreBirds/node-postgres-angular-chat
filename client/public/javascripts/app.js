angular.module('nodeChat',[])

.controller('mainController', function($scope, $http){

	$scope.formData= {};
	$scope.messageData = {};
	$scope.userData = {};
	$scope.loginData = {};

	//Get all todos with AJAX request to /api/v1/messages

	$http.get('messages')
		.success(function(data){
			$scope.messageData = data.data; 
			console.log('Data: ', data.data);
		})
		.error(function(error){
			console.log('Error ', error);
		});

	// Create a new message
	$scope.createMessage = function(messageID) {
		$http.post('messages', $scope.formData)
		    .success(function(data) {
		        $scope.formData = {};
		        $scope.messageData = data.data.messages;
		        console.log(data);
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
		})
		.error(function(error){
			console.log('Error logging out:', error);
		});
	}

	//Login User
	// $scope.authenticateUser = function(userID) {
	// 	$http.post('login', $scope.loginData)
	// 	.success(function(data){
	// 		$scope.loginData = data;
	// 		console.log(data);
	// 		console.log('post success');
	// 	})
	// 	.error(function(error){
	// 		console.log('Authentication Error: ', error);
	// 	});
	// }
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