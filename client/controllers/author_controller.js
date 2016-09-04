application
	.factory('AuthorsRepository', [ '$http', function( $http ){
		return {
			getAuthorPerUser: function( user_id ){
				return [
					{ 'id': 1, 'nikname' : 'itchelviac', 'name' : 'Itchel Viallnueva Acosta' },
					{ 'id': 2, 'nikname' : 'gunt2raro', 'name' : 'Ramiro de Jesús Gutiérrez A' },
				];
			}
		};
	}])
	.controller( 'AuthorsController', [ '$scope', '$rootScope', 'AuthorsRepository', function( $scope, $rootScope, AuthorsRepository ) {

	}]);