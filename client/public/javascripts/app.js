angular.module('nodeChat',[])

.controller('mainController', function($scope, $http){

	$scope.formData= {};
	$scope.messageData = {};
	$scope.userData = {};

	//Get all todos with AJAX request to /api/v1/messages
	$http.get('messages')
		.success(function(data){
			$scope.messageData = data; 
			console.log(data);
		})
		.error(function(error){
			console.log('Error ', error);
		});

	// Create a new message
	$scope.createMessage = function(messageID) {
		$http.post('messages', $scope.formData)
		    .success(function(data) {
		        $scope.formData = {};
		        $scope.messageData = data;
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
		        $scope.messageData = data;
		        console.log(data);
		    })
		    .error(function(data) {
		        console.log('Error: ',  data);
		    });
	};

	//Create a user
	$scope.createUser = function(userID) {
		console.log($scope.userData);
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

	//Login User
	$scope.authenticateUser = function(userID) {
		$http.post('login', $scope.userData)
		.success(function(data){
			$scope.userData = data;
			console.log(data);
		})
		.error(function(error){
			console.log('Authentication Error: ', error);
		});
	}
	// $scope.fBAuthenticate = function(userID) {
	// 	$http.post('http://www.facebook.com/dialog/oauth?1001237643242798&localhost:3000/')
	// 	.success(function(data){
	// 		$scope.userData = data;
	// 		console.log(data);
	// 	})
	// 	.error(function(error){
	// 		console.log('Facebook Authentication Error: ', error);
	// 	});
	// }

});