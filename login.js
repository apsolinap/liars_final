var historyloading;
var accountabilityloading;
var laboratory;
var full_name;

firebase.auth().onAuthStateChanged(function(user) {
  document.getElementById("loader").style.display="block";
  if (user) {
    var user = firebase.auth().currentUser;
	//var name, email, photoUrl, uid, emailVerified;
	  	document.getElementById("loader").style.display="none";
	  	document.getElementById("login_cont").style.display = "none";
	  	document.getElementById('logoutBtn').setAttribute('onclick','logout()');
		document.getElementById('logoutBtn').innerHTML = '<p>Log out</p>';
		document.getElementById('login-form').reset();
	if (user != null) {
		var email = user.email;
	  	
	  	document.getElementById("loader").style.display="none";
		var uid = user.uid
		
		
		
		
		var usersRef = firebase.database().ref("/users/" + uid);
		var userId = firebase.auth().currentUser.uid;
		firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
		  	var lab = (snapshot.val() && snapshot.val().laboratory) || 'Anonymous';
  			
  			laboratory = lab;
  			var name = (snapshot.val() && snapshot.val().name);
  			full_name = name
  			

  			text = "You are now logged in, "+ full_name;
	    	$(document).ready(function(){
	    		document.getElementById("logged_user_name").setAttribute('onclick','openUser()');
	    		document.getElementById("logged_user_name").innerHTML = "Welcome, "+ full_name +"!";
	        	demo.initChartist();

	        	$.notify({
	            	icon: 'pe-7s-smile',
	            	message: text

	            },{
	                type: 'info',
	                timer: 2000
	            });

	    	});
			});
		determineLab();
  		
  		

	}
  } else {
	  	document.getElementById("loader").style.display="none";
	  	document.getElementById("login_cont").style.display = "block";
	  	document.getElementById("cont").style.display="none";
  }

});

function login(){

	
	var userEmail = document.getElementById("username").value;
	var userPass = document.getElementById("pwd").value;

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(user) {
   
   window.location.reload();
   reloadOnce();
	}).catch(function(error) {
	    var errorCode = error.code;
	  var errorMessage = error.message;

	  switch(error.code){
	  	case "auth/invalid-email":
	  		document.getElementById("errormsg").innerHTML = "The email is badly formatted. Sample email format: name@website.com";
	 		break;
	 	case "auth/user-not-found":
	 		document.getElementById("errormsg").innerHTML = "There is no corresponding user to that email.";
	 		break;
	 	case "auth/wrong-password":
	 		document.getElementById("errormsg").innerHTML = "Invalid password.";
	 		break;
	 	default:
	 		document.getElementById("errormsg").innerHTML = error.code;
	  }
	});
}


function logout(){
	firebase.auth().signOut().then(function() {
		window.location = 'index.html'
		hideSideBar();
		hideContent();
		document.getElementById("logged_user_name").setAttribute('onclick','');
		document.getElementById("logged_user_name").innerHTML = "";
		document.getElementById('logoutBtn').setAttribute('onclick','');
		document.getElementById('logoutBtn').innerText = '';
  // Sign-out successful.
	
}).catch(function(error) {
  // An error happened.
});
}

function casualLogout(){
	firebase.auth().signOut().then(function() {
	
		}).catch(function(error) {
  // An error happened.
		});
}





function sanitize(str) {
 if ((str===null) || (str==='')){
       return false;
 }
  else{
   str = str.toString();
   return str.replace(/<[^>]*>/g, '');	
  }
}


function showSideBar(laboratory){
	if(laboratory == "chemistry"){
		document.getElementById('sidebar-actions').innerHTML = '<div class="logo"><a href="#" class="simple-text">  LIARS : CHEMISTRY <i class="pe-7s-science"></i></a></div>'
		document.getElementById('sidebar-actions').innerHTML += '<ul class="nav"><li id="request" class="active"><a href="#"><i class="pe-7s-note2"></i><p onclick="request()">Requests</p></a></li><li id="inventory"><a href="#"><i class="pe-7s-box1"></i><p onclick="inventory()">Inventory</p></a></li><li id="accountability"><a href="#"><i class="pe-7s-piggy"></i><p onclick="accountability()">Accountability</p></a></li><li id="history"><a href="#"><i class="pe-7s-note"></i><p onclick="history()">History</p></a></li> </ul>'
	}else if(laboratory == "biology"){
		document.getElementById('sidebar-actions').innerHTML = '<div class="logo"><a href="#" class="simple-text">  LIARS : BIOLOGY <i class="pe-7s-leaf"></i></a></div>'
		document.getElementById('sidebar-actions').innerHTML += '<ul class="nav"><li id="request" class="active"><a href="#"><i class="pe-7s-note2"></i><p onclick="request()">Requests</p></a></li><li id="inventory"><a href="#"><i class="pe-7s-box1"></i><p onclick="inventory()">Inventory</p></a></li><li id="accountability"><a href="#"><i class="pe-7s-piggy"></i><p onclick="accountability()">Accountability</p></a></li><li id="history"><a href="#"><i class="pe-7s-note"></i><p onclick="history()">History</p></a></li> </ul>'
	}else{
		document.getElementById('sidebar-actions').innerHTML = '<div class="logo"><a href="#" class="simple-text">  LIARS : BIOLOGY <i class="pe-7s-light"></i></a></div>'
		document.getElementById('sidebar-actions').innerHTML +='<ul class="nav"><li id="addClass"><a href="#"><i class="pe-7s-plus"></i><p id="addClass-btn" onclick="addClass()">Add Class</p></a></li><li id="inventory"><a href="#"><i class="pe-7s-search"></i><p  id="viewClasses-btn" onclick="viewClasses()">View Classes</p></a></li><li id="accountability"><a href="#"><i class="pe-7s-plus"></i><p id="addSemester-btn" onclick="addSemester()">Add Semester</p></a></li><li id="history"><a href="#"><i class="pe-7s-search"></i><p id="viewSemester-btn" onclick="viewSemesters()">View Semesters</p></a></li><li><a href="#"><i class="pe-7s-plus"></i><p id="addGroup_btn" onclick="addGroup()">Add New Group</p></a></li></ul>'

	}
}
function hideSideBar(){
	document.getElementById('sidebar-actions').innerHTML = '<div class="logo"><a href="#" class="simple-text">  LIARS </a></div>'
}
function hideContent(){
	document.getElementById("logged_in_content").style.display = "";
}
function reloadOnce(){
	window.onload = function() {
		    if(!window.location.hash) {
		        window.location = window.location + '#loaded';
		        window.location.reload();
		    }
		}
}
function determineLab(){
	var user = firebase.auth().currentUser
	var uid = user.uid
	
		
	var usersRef = firebase.database().ref("/users/" + uid);
	var userId = firebase.auth().currentUser.uid;
	firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
		var lab = snapshot.val().laboratory;
		
		if(lab == "chemistry"){
			document.getElementById('lab-color').setAttribute("data-color","green");
			setLab("chemistry");
			showSideBar(lab);
			open_pending_tab();
			request();
		}else if(lab == "equipment"){
			document.getElementById('lab-color').setAttribute("data-color","azure");
			showSideBar(lab);
			document.getElementById('equip_div').style.display = 'block';
			equipment();
		}else{
			document.getElementById('lab-color').setAttribute("data-color","blue");
			setLab("biology");
			showSideBar(lab);
			open_pending_tab();
			request();
		}
	});
}

function openUser(){
	$('#user-settings').modal('show');
	var pattern = new RegExp(/\w{8,}$/);
 
	var newpassword1 = '';
	var newpassword2 = '';
	var oldPass = '';
	$(document).ready(function(e){
		$("#new-password1").bind('input', function () {
		   newpassword1 = $(this).val();
		   if(newpassword1 != newpassword2){
		   		document.getElementById('submit-settings').disabled = true;
		   		document.getElementById('doesMatch').innerText = "Passwords don't match.";
		   }
		   else{
		   		if(pattern.test(newpassword1) == false){
			   		document.getElementById('submit-settings').disabled = true;
			   		document.getElementById('doesMatch').innerText = "New password must be 8 characters or longer.";
			   }else{
			   	
		   		
		   		document.getElementById('submit-settings').disabled = false;
		   		document.getElementById('doesMatch').innerText = "";
			   }
		   }
		});
		$("#new-password2").bind('input', function () {
		   newpassword2 = $(this).val();
		   
		   if(newpassword1 != newpassword2){
		   		document.getElementById('submit-settings').disabled = true;
		   		document.getElementById('doesMatch').innerText = "Passwords don't match.";
		   }else{
			   if(pattern.test(newpassword1) == false){
			   		document.getElementById('submit-settings').disabled = true;
			   		document.getElementById('doesMatch').innerText = "New password must be 8 characters or longer.";
			   }else{

		   		
		   		document.getElementById('submit-settings').disabled = false;
		   		document.getElementById('doesMatch').innerText = "";
			   }
		   }
		});
		$("#change-pass-old").bind('input', function () {
		   oldPass = $(this).val();
		   if(oldPass == ""){
		   	document.getElementById("submit-settings").disabled = true;
		   	document.getElementById("doesMatch").innerText = "Enter old password to continue."
		   }else{
		   	document.getElementById("submit-settings").disabled = false;
		   	document.getElementById("doesMatch").innerText = ""
		   }
		});
	})
	

}

function changePass(oldPass){
	var user = firebase.auth().currentUser;
	var newPassword = document.getElementById("new-password1").value
	

	
	var credential = firebase.auth.EmailAuthProvider.credential(
		  user.email,
		  oldPass
		);
	// Prompt the user to re-provide their sign-in credentials

	user.reauthenticateWithCredential(credential).then(function() {
	  // User re-authenticated.
	  user.updatePassword(newPassword).then(function() {
		  // Update successful.
		  	document.getElementById('doesMatch').innerText = '';
		    document.getElementById('success-change').innerText = "Password change successful. Please re-login."
		  	
			setTimeout(function () {
			    casualLogout();
			    reloadOnce();
			    $('#user-settings').modal('hide')
			}, 3000);
		}).catch(function(error) {
		  // An error happened.
		  alert("Unable to change password.")
		});
	}).catch(function(error) {
	  // An error happened.
	  
	  document.getElementById('doesMatch').innerText = "Invalid user credentials. Try again."
	});

	
}
function verify(){
	var user = firebase.auth().currentUser;
	var newPassword = document.getElementById("new-password1").value
	var oldPassword = document.getElementById("change-pass-old").value
	
	var credential = firebase.auth.EmailAuthProvider.credential(
		  user.email,
		  oldPassword
	);
	user.reauthenticateWithCredential(credential).then(function() {
	  // User re-authenticated.
	  user.updatePassword(newPassword).then(function() {
		  // Update successful.
		  	document.getElementById("successfulChange").innerText = "Password change successful. You will be logged out.";
		  	document.getElementById('doesMatch').innerText = '';
		    
		  	
			setTimeout(function () {
			    $('#user-settings').modal('hide')
			    logout();
			    window.location.reload();
			}, 4000);
		}).catch(function(error) {
		  // An error happened.
		  document.getElementById("doesMatch").innerText = "Unable to change password. Try again in a while."
		  //alert("Unable to change password.")
		});
	}).catch(function(error) {
	  // An error happened.
	  document.getElementById("doesMatch").innerText = "Invalid user password."
	});	
}