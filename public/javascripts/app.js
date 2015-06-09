angular.module('nodeChat',[])

.controller('mainController', function($scope, $http){

	$scope.formData= {};
	$scope.messageData = {};

	//Get all todos with AJAX request to /api/v1/messages
	$http.get('/api/v1/messages')
		.success(function(data){
			$scope.messageData = data; 
			console.log(data);
		})
		.error(function(error){
			console.log('Error '+error);
		});

	// Create a new todo
	$scope.createMessage = function(messageID) {
		$http.post('/api/v1/messages', $scope.formData)
		    .success(function(data) {
		        $scope.formData = {};
		        $scope.messageData = data;
		        console.log(data);
		    })
		    .error(function(error) {
		        console.log('Error: ' + error);
		    });
    };

	// Delete a todo
	$scope.deleteMessage = function(messageID) {
		$http.delete('/api/v1/messages/' + messageID)
		    .success(function(data) {
		        $scope.messageData = data;
		        console.log(data);
		    })
		    .error(function(data) {
		        console.log('Error: ' + data);
		    });
	};

});