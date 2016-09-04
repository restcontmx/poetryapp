application
	.factory( 'WriteRepository', [ '$http', function( $http ){
		return {
			addWrite : function( data ){
				var jsonData = JSON.stringify({
					params : {
						title : data.title, 
						content : data.content,
						quotation : data.quotation, 
						font : data.font,
						user_id : data.user_id,
						anonymous : data.anonymous,
					}
				});
				return $http({
					method : 'POST',
					url : '/api/write/',
					data : jsonData
				});
			},
		}
	}])
	.controller( 'write_controller', [ '$scope', '$rootScope', 'WriteRepository', 'UserRepository', function( $scope, $rootScope, WriteRepository, UserRepository ){

		var userData = UserRepository.getSession( );
		
		function initWrite(){
			if( userData != undefined ) 
			{
				$scope.write = {
					title : "",
					content : "",
					quotation : "",
					font : "Amiri",
					user_id : userData.id,
					anonymous : 0,
				};
			}
			else
			{
				$scope.write = {
					title : "",
					content : "",
					quotation : "",
					font : "Amiri",
					user_id : 0,
					anonymous : 0,
				};
			}
			
		}

		function close_write_modal(){
            var modal = document.getElementById('write_modal');
            modal.style.display = "none";
        }// End of close_write_modal function
		
		initWrite();

		$scope.add = function( write ){
			if( write.font.indexOf("Tipografía") !== -1 )
			{
				write.font = "Amiri";
			}
			write.anonymous = 0;
			WriteRepository.addWrite( write ).success( function(data){
				console.log( data );
				initWrite();
				close_write_modal();
			});
		};

		$scope.addAnonymous = function( write ){
			if( write.font.indexOf("Tipografía") !== -1 )
			{
				write.font = "Amiri";
			}
			write.anonymous = 1;
			WriteRepository.addWrite( write ).success( function(data){
				console.log( data );
				initWrite();
				close_write_modal();
			});
		};
		
	}]);