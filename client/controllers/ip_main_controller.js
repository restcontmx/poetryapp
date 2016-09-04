
var application = angular.module('instapoesia_main_app', ['ngRoute', 'ngCookies'])
    .config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '../Views/top_container.html',
            })
            .when( '/acerca/', {
                templateUrl: '../Views/about.html',
            })
            .when( '/faqs/', {
                templateUrl: '../Views/faqs.html',
            })
            .when( '/creditos/', {
                templateUrl: '../Views/credits.html',
            })
            .when( '/perfil/', {
                templateUrl: '../Views/credits.html',
            })
            .when( '/autores/', {
                templateUrl: '../Views/credits.html',
            })
            .when( '/libros/', {
                templateUrl: '../Views/books.html',
            })
            .when( '/libro/:id', {
                templateUrl: '../Views/book_detail.html',
            })
            .when( '/cuenta/', {
                templateUrl: '../Views/account.html',
            })
            .otherwise({
              redirectTo: '/404'
            });
    }]);// End of config application function

// The facebook stuff, async init thing
window.fbAsyncInit = function() {
    FB.init({
        appId      : '1708553892751313',
        xfbml      : true,
        version    : 'v2.7'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s); 
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); // End of the facebook stuff

//
// navbar controller
// This will manage all the buttons and all
//
application
    .factory( 'UserRepository', ['$http', '$cookies', function($http, $cookies){
        return {
            //
            // add facebook user
            // this adds the facebook user to the api
            addFacebookUser : function( name, username, email, facebook_id, user_image ) {
                var jsonData = JSON.stringify({
                    params: {
                        name: name,
                        username: username,
                        email: email,
                        facebook_id: facebook_id,
                        twitter_id: "",
                        user_image: user_image
                    }
                });
                return $http( {
                    method : 'POST',
                    url : '/api/auth/',
                    data: jsonData
                });
            },// End of add facebook user function
            updateUser: function( data ){
                var jsonData = JSON.stringify({
                    params:{
                        facebook_id : data.facebook_id,
                        name : data.name,
                        username: data.username,
                        email:data.email,
                        facebook_account: data.facebook_account,
                        twitter_account: data.twitter_account,
                        user_image: data.user_image
                    }
                });
                return $http({
                    method: 'PUT',
                    url: '/api/auth/',
                    data: jsonData
                });
            },// End of update user hahahahaha
            // 
            // get by facebook id
            // gets the user with this facebook id
            getByFbId : function( facebook_id ){
                return $http.get( '/api/auth/byFbId?facebook_id=' + facebook_id );
            },// End of get by fb id function
            // 
            // Set session
            // sets the user data
            setSession : function( data ){
                console.log( data );
                $cookies.putObject( 'userdata', data );
            },// End of set session function
            getSession : function() {
                var userCookie = $cookies.get('userdata');
                console.log( "The cookie" );
                console.log( userCookie );
                if ( userCookie == undefined ) 
                {
                    return undefined;
                }
                else
                {
                    return JSON.parse(userCookie);
                }
            },
            removeSession : function(){
                $cookies.remove( 'userdata' );
            },
            //
            // isSessionSet
            // verifies if the session is set or not
            isSessionSet : function( data ){
                var userCookie = $cookies.get('userdata');
                console.log( "In session " );
                console.log( userCookie );
                if ( userCookie == undefined ) 
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }// End of isSessionSet function
        }// End of return
    }])
    .controller( 'navbarController', [ '$scope', '$rootScope', 'UserRepository', function( $scope, $rootScope, UserRepository ) {

        function fblogin_function(){
            FB.login(function(response){
                if(response.authResponse)
                {
                    FB.api( "/me?fields=id,name,email", function(response){

                        var name = response.name;
                        console.log( "Print the facebook response" );
                        console.log( response );
                        UserRepository.getByFbId( response.id ).success( function( data ) {
                            if( data.data == null )
                            {
                                FB.api( 
                                    ("/" + response.id + "/picture?type=large"), 
                                    function(res){
                                        UserRepository.addFacebookUser(response.name, response.id, response.email, response.id, res.data.url).success(function(d){
                                            console.log( "if data is not find by facebook id" );
                                            console.log( d );
                                            var userobject = { 
                                                id: d.data._id,
                                                name: d.data.name,
                                                username: d.data.username,
                                                email: d.data.email,
                                                facebook_id: d.data.facebook_id,
                                                twitter_id: "",
                                                user_image: res.user_image
                                            };
                                            UserRepository.setSession( userobject );

                                            var userCookie = UserRepository.getSession();

                                            $scope.userPanel.show = true;
                                            $scope.loginPanel.show = false;
                                            $scope.userInfo.name = userCookie.name;

                                            $(".navbar-collapse").notify(
                                                "Bienvenido " + userCookie.name, 
                                                { 
                                                    position:"bottom center",
                                                    className: "info"
                                                }
                                            );

                                        });
                                    });
                            }
                            else
                            {
                                if( !UserRepository.isSessionSet() )
                                {
                                    var userobject = { 
                                        id: data.data._id,
                                        name: data.data.name,
                                        username: data.data.username,
                                        email: data.data.email,
                                        facebook_id: data.data.facebook_id,
                                        twitter_id: "",
                                        user_image: data.data.user_image
                                    };
                                    UserRepository.setSession( userobject );  
                                }
                                var userCookie = UserRepository.getSession();

                                $scope.userPanel.show = true;
                                $scope.loginPanel.show = false;
                                $scope.userInfo.name = userCookie.name;

                                $(".navbar-collapse").notify(
                                    "Bienvenido " + userCookie.name, 
                                    { 
                                        position:"bottom center",
                                        className: "info"
                                    }
                                );
                            }
                            
                        });
                    } );
                }
                else 
                {
                    console.log( 'Something went wrong' );
                }
            });
        }// End of fblogin_function
        
        function fblogout_function(){
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') 
                {
                    FB.logout(function(response){
                       $scope.$apply(function(){
                            $scope.userPanel.show = false;
                            $scope.loginPanel.show = true;
                            $scope.userInfo.name = "";
                        }); 
                       UserRepository.removeSession();
                    });
                }
                else
                {
                    $scope.userPanel.show = false;
                    $scope.loginPanel.show = true;
                    $scope.userInfo.name = "";
                    UserRepository.removeSession();
                }
            });
        }// End of fblogout_function function 
        
        function show_write_modal(){
            var modal = document.getElementById('write_modal');
            modal.style.display = "block";
        }// End of show_write_modal function

        function close_write_modal(){
            var modal = document.getElementById('write_modal');
            modal.style.display = "none";
        }// End of close_write_modal function

        // Show login panel and user panel
        $scope.userPanel = {
            show : false,
        };
        $scope.loginPanel = {
            show : true,
        };
        $scope.userInfo = {
            name : "",
        };
        // Facebook log in function
        $scope.FBLogin = fblogin_function;
        // Facebook log out function
        $scope.FBLogout = fblogout_function;
        // Show write modal function
        $scope.show_write_modal = show_write_modal;
        // End of show_write_modal function
        $rootScope.close_write_modal = close_write_modal;
        // Cookie verification bitch!
        if( UserRepository.isSessionSet() )
        {
            var userCookie = UserRepository.getSession();
            
            $scope.userPanel.show = true;
            $scope.loginPanel.show = false;
            $scope.userInfo.name = userCookie.name;

            $(".top_container_controller").notify(
                "Bienvenido " + userCookie.name, 
                { 
                    position:"top center",
                    className: "info"
                }
            );
            
        }
    }]); // End of nav bar controller

//
// account controller
// This is the account view controller
application
    .controller( 'account_controller', ['$scope', '$rootScope', 'UserRepository', function($scope, $rootScope, UserRepository){
        
        // Validate if session is opened on the cookies
        if(UserRepository.isSessionSet())
        {
            var userData = UserRepository.getSession();
            UserRepository.getByFbId( userData.facebook_id ).success(function(data){
                console.log(data);
                $scope.user = {
                    id: data.data._id,
                    facebook_id : data.data.facebook_id,
                    name : data.data.name,
                    username : data.data.username,
                    email : data.data.email,
                    facebook_account : data.data.facebook_account,
                    twitter_account : data.data.twitter_account,
                    user_image : data.data.user_image,
                }; 
            });
        }// End of validate if session is open
        // This will update the user on the api
        $scope.update = function(user){
            UserRepository.updateUser( user ).success(function(data){
                $scope.user = {
                    id: data.data._id,
                    facebook_id : data.data.facebook_id,
                    name : data.data.name,
                    username : data.data.username,
                    email : data.data.email,
                    facebook_account : data.data.facebook_account,
                    twitter_account : data.data.twitter_account,
                    user_image : data.data.user_image,
                }; 
            });
        };// End of update function 

    }]);

// 
// principal service
// This will return all the things we need for the start of the page
//
application
    .factory( 'PrincipalRepository', ['$http', function($http){
        return {
            getAdds : function(){
                return [
                    { "title" : "fuck you all", "type" : "fragment", "user":"itchelvill", "author":"", "shares":4560, "added":998 },
                    { "title" : "el amor de mi vida", "type" : "original", "user":"gunt.raro", "author":"", "shares":91, "added":256 },
                    { "title" : "he perdido la vida", "type" : "fragment", "user":"tematoconunpedo", "author":"", "shares":671, "added":971 },
                    { "title" : "el amor de mi vida", "type" : "original", "user":"loco304", "author":"", "shares":4560, "added":13 },
                    { "title" : "puto el que lo lea", "type" : "original", "user":"fuckUall", "author":"", "shares":9123, "added":67 },
                    { "title" : "he perdido la vida", "type" : "fragment", "user":"tematoconunpedo", "author":"", "shares":671, "added":971 },
                    { "title" : "el amor de mi vida", "type" : "original", "user":"loco304", "author":"", "shares":4560, "added":13 },
                    { "title" : "el amor de mi vida", "type" : "original", "user":"gunt.raro", "author":"", "shares":91, "added":256 },
                    { "title" : "he perdido la vida", "type" : "fragment", "user":"tematoconunpedo", "author":"", "shares":671, "added":971 },
                    { "title" : "he perdido la vida", "type" : "fragment", "user":"tematoconunpedo", "author":"", "shares":671, "added":971 },            
                ];
            },
            getShares : function(){
                return [
                    { "title" : "Lo que el viento se llevó", "type" : "fragment", "user":"itchelvill", "author":"", "shares":4560, "added":998 },
                    { "title" : "El triste", "type" : "original", "user":"gunt.raro", "author":"", "shares":91, "added":256 },
                    { "title" : "Gavilán y paloma", "type" : "fragment", "user":"tematoconunpedo", "author":"", "shares":671, "added":971 },
                    { "title" : "If only yesterday", "type" : "original", "user":"loco304", "author":"", "shares":4560, "added":13 },
                    { "title" : "Atorado, Atorado, Atorado", "type" : "original", "user":"fuckUall", "author":"", "shares":9123, "added":67 },
                    { "title" : "Atorado, Atorado, Atorado", "type" : "original", "user":"fuckUall", "author":"", "shares":9123, "added":67 },
                    { "title" : "El triste", "type" : "original", "user":"gunt.raro", "author":"", "shares":91, "added":256 },
                    { "title" : "Atorado, Atorado, Atorado", "type" : "original", "user":"fuckUall", "author":"", "shares":9123, "added":67 },
                    { "title" : "Lo que el viento se llevó", "type" : "fragment", "user":"itchelvill", "author":"", "shares":4560, "added":998 },
                    { "title" : "Atorado, Atorado, Atorado", "type" : "original", "user":"fuckUall", "author":"", "shares":9123, "added":67 },    
                ];
            },
            getAuthors : function(){
                return [
                    { "username" : "itchelvill", "writes" : 4523, "times_shared" : 12412, "followers" : 912, "image" : "http://i.imgur.com/UDhue18.png" },
                    { "username" : "ramiro123", "writes" : 1892, "times_shared" : 9871623124, "followers" : 100123, "image" : "http://i.imgur.com/IvW0ASv.png" },
                    { "username" : "blueSlive", "writes" : 6512, "times_shared" : 22333, "followers" : 313, "image" : "http://i.imgur.com/IvW0ASv.png" },
                    { "username" : "tavogay123", "writes" : 513, "times_shared" : 52364, "followers" : 224, "image" : "http://i.imgur.com/FY37R0t.png" },
                    { "username" : "gunt.raro", "writes" : 4523, "times_shared" : 34521, "followers" : 463, "image" : "http://i.imgur.com/IvW0ASv.png" },
                    { "username" : "hana4523", "writes" : 125333, "times_shared" : 7532, "followers" : 501, "image" : "http://i.imgur.com/FY37R0t.png" },
                ];
            }
        };
    }])// End of principal service
    //
    // top container controller
    // This will manage all the content to the scopes
    //
    .controller('top_container_controller',  ['$scope', '$rootScope', 'PrincipalRepository', function ($scope, $rootScope, PrincipalRepository) {
        // This are request harcoded now; TODO: get them from the db, nice
        $scope.adds = PrincipalRepository.getAdds();
        $scope.shares = PrincipalRepository.getShares();
        $scope.authors = PrincipalRepository.getAuthors();

        angular.element(document).bind("scroll", function(Fragments) {
            var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
            var body = document.body, html = document.documentElement;
            var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
            windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight) {
                // Here send again the 
                /**
                if( !ban ){
                    poems_index++;
                    ban = true;
                }
                FragmentsRepository.getAllFragments(poems_index).success( function( data ) {
                    loadFragmentsOnScope( poems_index, $rootScope, data )
                    ban = false;
                } ).error(function(data, status){
                    console.log("eee");
                });**/
                console.log( "lasdjflkjasdflkjasdlkfjadf " );
            }
        });// End of scroll binding

    }])
    .directive('ng-attr-id', function(){
            return 
    });

application
    // This is how you make a filter haha
    .filter('newlines', function ($sce) {
        return function(text) {
            return $sce.trustAsHtml( text.replace(/\n/g, '<br/>') );
        }
    });// End of filters
