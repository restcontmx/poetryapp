application
	.factory( 'BookRepository', [ '$http', function( $http ){
		return {
			getBooksPerUser : function( user_id ){
				return [
                    { "title" : "Esto es un libro", "fragments" : 23, "shares" : 43 }, 
                    { "title" : "Poesía de terror", "fragments" : 13, "shares" : 12 },
                    { "title" : "Fragmentos de Edgar A. Poe", "fragments" : 500, "shares" : 1 },
                    { "title" : "Cuando el sol despierta", "fragments" : 500, "shares" : 56 },
                    { "title" : "Y así te conocí", "fragments": 3, "shares" : 450 },
                    { "title" : "Cuando la luz se esconde", "fragments" : 27, "shares" : 356 },          
                ];
			},
			getBookPerId : function( book_id ){
				// get the book per book id
			},
			getFragmentsPerBookId: function( book_id ){
				// return the list of fragments per book
			}
		}
	}])
	.controller( 'book_controller', [ '$scope', '$routeParams', 'BookRepository', function( $scope, $routeParams, BookRepository ) { 
		$scope.books = BookRepository.getBooksPerUser( 1 );
	}]);