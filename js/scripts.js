jQuery(document).ready( function(){
  $('#container').addClass('ready');




  /******************************
  ***** FIREBASE SCRIPTS ********
  ******************************/
  var firebase = new Firebase("https://dbs-ppl.firebaseio.com/");
    firebase.unauth();

    jQuery("#signup").find(".submit").on("click", function(e){
        e.preventDefault();
        var email = jQuery("#signup-inputEmail").val();
        var password = jQuery("#signup-inputPassword").val();

        firebase.createUser({
          email    : email,
          password : password
        }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                jQuery("body").prepend('<p class="bg-success">Account Created.</p>')
                jQuery("#signup").fadeOut(1000);
                jQuery("#signin").fadeIn(1000);
                console.log("Successfully created user account with uid:", userData);
                console.dir(userData.uid);
            }
        });
    });

    jQuery("#signin").find(".submit").on("click", function(e){
        e.preventDefault();
        var email = jQuery("#signin-inputEmail").val();
        var password = jQuery("#signin-inputPassword").val();

        firebase.authWithPassword({
            email    : email,
            password : password
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                console.dir(authData);
            }
        });
    });

    jQuery("#addContent").find(".submit").on("click", function(e){
            e.preventDefault();
            var number = jQuery("#number").val(); ;
            var description = jQuery("#description").val();
            var authData = firebase.getAuth();

            var data = {
                "number": number,
                "description": description,
                "date": Firebase.ServerValue.TIMESTAMP,
                "is_approved": false
            };

            firebase.child("users/" + authData.uid + "/content" ).push( data );
    });


    // When data is received. Runs only once.
    firebase.once("value", function(snap){
        console.log( snap.val() );
    });


    // When on AUTH.
    firebase.onAuth(function(authData) {

        // Setup new user profile if it doesn't exist.
        if ( authData && is_new_user( authData.uid ) ) {
            firebase.child("users").child( authData.uid ).set({
                provider: authData.provider,
                name: getName(authData),
                approvedUser: false,
                content: { "blank":"blank"}
            });
        }
    });

    // find a suitable name based on the meta info given by each provider
    function getName(authData) {
      switch( authData.provider ) {
         case 'password':
           return authData.password.email.replace(/@.*/, '');
      }
    }

    // Check to see if this is new user.
    function is_new_user( uid ){
        var exists = null;
        firebase.once("value", function(snap){
            exists = snap.child("users/" + uid ).exists();
        });
        return exists;
    }






});