$(document).ready(function(){
	console.log( "ready!" );
		
		// Config for PitchPickersApp project 
        // Removed for security
		var config = {
			apiKey: "",
			authDomain: "",
			databaseURL: "",
			projectId: "",
			storageBucket: "",
			messagingSenderId: ""
			};
		// Initialize Firebase
		firebase.initializeApp(config);

		// Login alert message
		var fb = firebase.database().ref();
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				alert("You are logged in. Welcome to PitchPicker!");
			}
			else{
			alert("You are not logged in. Log in to access PitchPicker.");
			}
		});

		// Handle account status
		firebase.auth().onAuthStateChanged(user => {
			if(user) {
				window.location = '#home'; // After successful login, user will be redirected to homepage
			}
			else {
				window.location = '#welcome'; // After logout, user is redirected to welcome screen
			}
		});

		// // // // //  JAVASCRIPT - BUTTON FUNCTIONALITY  // // // // //

		// Sign up button creates user
		$("#btnSignup").on('click', function(){
			var email = $("#txtEmail").val();
			var password = $("#txtPassword").val();
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handles errors
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(error.message)			
			});			
		});

		// Log in button on welcome screen
		$("#btnLogin").on('click', function(){
			var email = $("#txtEmail").val();
			var password = $("#txtPassword").val();
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			// Handles errors
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(error.message);
			});

		});

		// Sign out buttom logs the user out
		$("#btnLogout").on('click', function(){
			firebase.auth().signOut().then(function() {
			}, function(error) {
					alert(error);
			});
		});


		// // // // //  JAVASCRIPT - SEND DATA TO FIREBASE  // // // // //

		// Listen for booking form submit
		document.getElementById('bookingForm').addEventListener('submit', submitForm);

		// Submit form
		function submitForm(e){
				e.preventDefault();

				// Get values
				// Pitch fields
				var pitchType = getInputVal('pitch-type');
				var pitchSize = getInputVal('pitch-size');
				var pitchPlayers = getInputVal('pitch-players');
				var pitchLocation = getInputVal('pitch-location');
				var pitchDate = getInputVal('pitch-date');
				var pitchTime = getInputVal('pitch-time');
				var pitchDuration = getInputVal('pitch-duration');
				// Equipment fields
				var equipFootball = getInputVal('equip-football')
				var equipBib = getInputVal('equip-bib')
				var equipPole = getInputVal('equip-pole')
				var equipHurdle = getInputVal('equip-hurdle')
				var equipCone = getInputVal('equip-cone')


				// Save booking
				saveBooking(pitchType, pitchSize, pitchPlayers, pitchLocation, pitchDate, pitchTime, pitchDuration, equipFootball, equipBib, equipPole, equipHurdle, equipCone);

				// Clears form after submitting
				$( '#bookingForm' ).each(function(){
					this.reset();
				});
			
		}

		// Function to get form values
		function getInputVal(id){
				return document.getElementById(id).value;
		}    

		// Save booking to firebase > bookings
		function saveBooking(pitchType, pitchSize, pitchPlayers, pitchLocation, pitchDate, pitchTime, pitchDuration, equipFootball, equipBib, equipPole, equipHurdle, equipCone){
				
				// get unique user ID from logged in user
				var userId = firebase.auth().currentUser.uid;
				
				// get email address of logged in user
				var userEmail = firebase.auth().currentUser.email;

				// reference bookings collection
				// var userBookingRef = firebase.database().ref('users/' + userId + '/booking history');
				var userBookingRef = firebase.database().ref('bookings');

				// pushes data to the 'bookings' collection on Fbase
				var newUserBookingRef = userBookingRef.push();
				
				// grabs the unique ID against each booking
				var key = newUserBookingRef.key; 

				// Sets the fields in Firebase against the form data
				// Values on left of the colons are the Firebase fields (i.e. bookingId, userId, userEmail etc.)
				newUserBookingRef.set({
						bookingId: key,
						userId: userId,
						userEmail: userEmail,
						type: pitchType,
						size: pitchSize,
						totalPlayers: pitchPlayers,
						location: pitchLocation,
						date: pitchDate,
						time: pitchTime,
						duration: pitchDuration,
						footballs: equipFootball,
						bibs: equipBib,
						poles: equipPole,
						hurdles: equipHurdle,
						cones: equipCone
				})	
		}


		// // // // //  JAVASCRIPT - PULL DATA FROM FIREBASE  // // // // //


		// Load current user's booking history
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var historyRef = firebase.database().ref('bookings/');
				var userId = user.uid;
				
				// Will only return data for current logged in user
				historyRef.orderByChild("userId").equalTo(userId).on("child_added", function(data) {
				
				// Loads all of the user's data
				var info = data.val();
				
				// Data from Firebase to be used in the HTML / jQuery grid
				// Picks each element from the booking history and assigns to a var
				var gBooking = info.bookingId;
				var gUser = info.userId;
				var gEmail = info.userEmail;
				var gType = info.type;
				var gSize = info.size;
				var gPlayer = info.totalPlayers;
				var gLocation = info.location;
				var gDate = info.date;
				var gTime = info.time;
				var gDuration = info.duration;
				var gFootball = info.footballs;
				var gBib = info.bibs;
				var gPole = info.poles;
				var gHurdle = info.hurdles;
				var gCone = info.cones;	

				// Function for creating dynamic collapsible list
				// When a new booking is made, a collapsible section is automatically added
				var Markup = new Object();

				// Links to "makecollapsible" form in HTML file
				Markup.Collapsible = function () {
					$('#makecollapsible')
						.append($('<div>')
						.attr({
						'data-role': 'collapsible-set',
							'id': 'primary'
					}));
					($('<div>')
						.attr({
						'data-role': 'collapsible',
							'data-content-theme': 'c',
							'data-collapsed': 'true'
					})
						// Inputs booking data in to the grid
						// Grid A (on left) is just text values (Account ID, Email Address etc.)
						// Grid B (on right) is the values from Fbase
						.html('<h4>ID: ' + gBooking + '</h4><div class="ui-grid-a"><div class="ui-block-a"><div class="ui-bar" style="height:100%">Email Address:<br>Pitch Type:<br>Pitch Size:<br>Players:<br>Location:<br>Date:<br>Time:<br>Duration:<br>Footballs:<br>Bibs:<br>Poles:<br>Hurdles:<br>Cones:<br></div></div><div class="ui-block-b"><div class="ui-bar" style="height:100%">'+gEmail+'<br>'+gType+'<br>'+gSize+'<br>'+gPlayer+'<br>'+gLocation+'<br>'+gDate+'<br>'+gTime+'<br>'+gDuration+'<br>'+gFootball+'<br>'+gBib+'<br>'+gPole+'<br>'+gHurdle+'<br>'+gCone+'<br></div></div></div>'
						))
						// This appends the data to the collapsible list
						.appendTo('#primary');
					
					$('#makecollapsible').collapsibleset().trigger('create');
				}

				// This calls the function for each booking that is listed under the logged in user
				Markup.Collapsible();
				});
				
			}
		});


}); // end of file
