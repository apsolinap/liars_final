$( document ).ready(function(){

window.addEventListener('offline',()=> window.location.href = 'no_internet.html');
	var user = firebase.auth().currentUser;
});
var firstRequestKey = ''
var laboratory ="chemistry";
var infiniteScrollRequest;
var referenceToOldestKey = ''
function setLab(passedLab){
	laboratory = passedLab;
}
function request(){
	firebase.database().ref(laboratory+"/request").orderByChild("requestID").limitToFirst(1).once('value').then(function(snaps){
		snaps.forEach(function(kid){
			firstRequestKey = kid.key
		})
	});
	clearInterval(accountabilityloading);
	clearInterval(historyloading);
	//show request_div and breadcrumb at request tab
	document.getElementById("request_div").style.display="block";
	document.getElementById("request").classList.add("active");
	//other tabs: inactive
	document.getElementById("history").classList.remove("active");/*
	document.getElementById("accountability").classList.remove("active");
	//hide other tab's divs
	//document.getElementById("accountability_div").style.display="none";*/
	document.getElementById("inventory").classList.remove("active");
	document.getElementById("history_div").style.display="none";
	document.getElementById("inventory_div").style.display="none";

	document.getElementById("accountability_div").style.display="none";
	document.getElementById("accountability").classList.remove("active");

	$( document ).ready(function(){
	  
	    firebase.database().ref(laboratory+"/request").on("child_added", function(snapshot){
	    	if(infiniteScrollRequest != "pending"){
		    		if(parseInt(snapshot.val().requestID) > parseInt(latestRequestID)){
		    			latestRequestID = snapshot.val().requestID
		    			var notif = document.getElementById("pending_notif")
		    			
						if (notif.innerText == ""){
							notif.innerText = 1;
						}else{
							prev = parseInt(notif.innerText);
							notif.innerText = prev + 1;
						}
		    		}
		    		return 0;
		    	
	    	}else{
	    		//open_pending_tab()
	    	}
	    		   
		});
	});

	
}

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
}

function open_archive_tab(){
	requestLeftToGet = 6;
	infiniteScrollRequest = "archive";
	//show request headers and pending div, set pending as active
	document.getElementById("request_header").style.display="block";
	document.getElementById("archive_div").style.display="block";
	document.getElementById("archive_tab").classList.add("active");

	//hide other tabs
	document.getElementById("pending_tab").classList.remove("active");
	document.getElementById("completed_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.remove("active");
	document.getElementById("processing_tab").classList.remove("active");

	//hide other divs
	document.getElementById("pending_div").style.display="none";
	document.getElementById("completed_div").style.display="none";
	document.getElementById("processing_div").style.display="none";
	document.getElementById("request_status").style.display="none";
	document.getElementById("declined_div").style.display="none";
	referenceToOldestKey = '';
	shouldFire = false;
	newRow = 1;

	$('#processing-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#pending-items-div-pcd').unbind('scroll',infinite_scroll);

	$('#archive-items-div-pcd').bind('scroll',infinite_scroll);

	$('#declined-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#processing-items-div-pcd').unbind('scroll',infinite_scroll);
    document.getElementById('archive-items-div-pcd').innerHTML = "";
    getRequests("archive");
}


function open_pending_tab(){
	document.getElementById("pending_notif").innerText = "";
	requestLeftToGet = 6;
	infiniteScrollRequest = "pending";
	//show request headers and pending div, set pending as active
	document.getElementById("request_header").style.display="block";
	document.getElementById("pending_div").style.display="block";
	document.getElementById("pending_tab").classList.add("active");

	//hide other tabs
	document.getElementById("archive_tab").classList.remove("active");
	document.getElementById("completed_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.remove("active");
	document.getElementById("processing_tab").classList.remove("active");

	//hide other divs
	document.getElementById("archive_div").style.display="none";
	document.getElementById("completed_div").style.display="none";
	document.getElementById("processing_div").style.display="none";
	document.getElementById("request_status").style.display="none";
	document.getElementById("declined_div").style.display="none";
	referenceToOldestKey = '';
	shouldFire = false;
	newRow = 1;

	$('#processing-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#pending-items-div-pcd').bind('scroll',infinite_scroll);
	$('#archive-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#declined-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#processing-items-div-pcd').unbind('scroll',infinite_scroll);
    document.getElementById('pending-items-div-pcd').innerHTML = "";
    getRequests("pending");
}

function open_processing_tab(){
	clearTimeout(fade);

	infiniteScrollRequest = "processing";
	//set processing as active breadcrumb
	//show div for processing
	document.getElementById("processing_tab").classList.add("active");
	document.getElementById("processing_div").style.display="block";
	document.getElementById("request_status").style.display="block";
	
	//hide evrything else
	document.getElementById("archive_tab").classList.remove("active");
	document.getElementById("pending_tab").classList.remove("active");
	document.getElementById("completed_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.remove("active");
	//hide other divs
	document.getElementById("archive_div").style.display="none";
	document.getElementById("pending_div").style.display="none";
	document.getElementById("completed_div").style.display="none";
	document.getElementById("declined_div").style.display="none";
	
	document.getElementById("color-1").checked = true;
	referenceToOldestKey = '';
	shouldFire = false;
	newRow = 1;
	requestLeftToGet = 6;

	$('#pending-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#completed-items-div-pcd').bind('scroll',infinite_scroll);
	$('#declined-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#processing-items-div-pcd').bind('scroll',infinite_scroll);
	$('#archive-items-div-pcd').unbind('scroll',infinite_scroll);
    document.getElementById('processing-items-div-pcd').innerHTML = "";
	getRequests("others");
}

function open_declined_tab(){
	clearTimeout(fade);
	infiniteScrollRequest = "declined";
	document.getElementById("pending_tab").classList.remove("active");
	document.getElementById("completed_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.add("active");
	document.getElementById("processing_tab").classList.remove("active");
	document.getElementById("pending_div").style.display="none";
	document.getElementById("completed_div").style.display="none";
	document.getElementById("processing_div").style.display="none";
	document.getElementById("request_status").style.display="none";
	document.getElementById("declined_div").style.display="block";

	document.getElementById("archive_div").style.display="none";
	document.getElementById("archive_tab").classList.remove("active");

	referenceToOldestKey = '';
	shouldFire = false;
	newRow = 1;
	requestLeftToGet = 6;

	$('#pending-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#processing-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#completed-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#declined-items-div-pcd').bind('scroll',infinite_scroll);
	$('#archive-items-div-pcd').unbind('scroll',infinite_scroll);
    document.getElementById('declined-items-div-pcd').innerHTML = "";
	getRequests("declined");

}

function open_completed_tab(){
	clearTimeout(fade);
	infiniteScrollRequest = "complete";
	document.getElementById("completed_tab").classList.add("active");
	document.getElementById("pending_tab").classList.remove("active");
	document.getElementById("declined_tab").classList.remove("active");
	document.getElementById("processing_tab").classList.remove("active");
	document.getElementById("completed_div").style.display="block";
	document.getElementById("pending_div").style.display="none";
	document.getElementById("processing_div").style.display="none";
	document.getElementById("request_status").style.display="none";
	document.getElementById("declined_div").style.display="none";

	document.getElementById("archive_div").style.display="none";
	document.getElementById("archive_tab").classList.remove("active");
	referenceToOldestKey = '';
	shouldFire = false;
	newRow = 1;
	requestLeftToGet = 6;

	$('#pending-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#processing-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#completed-items-div-pcd').bind('scroll',infinite_scroll);
	$('#declined-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#archive-items-div-pcd').unbind('scroll',infinite_scroll);
    document.getElementById('completed-items-div-pcd').innerHTML = "";

	getRequests("complete");
}
var oldestRequestKey = ''
var latestRequestID = 0;
var shouldFire = true;
var newRow = 1
var nameHolder = '';
function getRequests(status){
	//connect to db and get pending requests based on laboratory
	//assume lab =  chemistry for now
	var database = firebase.database().ref(laboratory+"/request");
	//display requests based on parameter "status"
	/*switch(status){
		case "declined": document.getElementById("declined-items-div-pcd").innerHTML = ""; break;
		case "pending": document.getElementById("pending-items-div-pcd").innerHTML = ""; break;
		case "complete": document.getElementById("completed-items-div-pcd").innerHTML = ""; break;  
		case "others": 
		default: document.getElementById("processing-items-div-pcd").innerHTML = ""; break;
	}*/
	if (!referenceToOldestKey) { 
	// if initial fetch
	 database
	   .orderByKey()
	   .limitToLast(requestLeftToGet)
	   .once('value')
	   .then((snapshot) => { 
	      // changing to reverse chronological order (latest first)
	      let arrayOfKeys = Object.keys(snapshot.val())
	         .sort()
	         .reverse();
	      // transforming to array
	      let results = arrayOfKeys
	         .map((key) => snapshot.val()[key]);
	         
	      // storing reference
	      referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];
	      formatRequest(results,status)
		})
	} 
	else {
	  database
	   .orderByKey()
	   .endAt(referenceToOldestKey)
	   .limitToLast(requestLeftToGet+1)
	   .once('value')
	   .then((snapshot) => {
	     // changing to reverse chronological order (latest first)
	     // & removing duplicate
	     let arrayOfKeys = Object.keys(snapshot.val())
	         .sort()
	         .reverse()
	         .slice(1);
	      // transforming to array
	      let results = arrayOfKeys
	         .map((key) => snapshot.val()[key]);
	      // updating reference
	      if(results.length > 0){
	      	referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];
	      	formatRequest(results,status)
	      	if(referenceToOldestKey == firstRequestKey){
	      		noCards(status);
	      	}
	      }else{
	      	noCards(status);
	      }
	   
		})
	 
	}
}
function getRequestorName(requestorId){
	firebase.database().ref("users").orderByChild("userID").equalTo(requestorId).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var data = snapshotToArray(childSnapshot);
				return data[1];
			});
		});
	return requestorId;
}


function pushRequest(){
	/*var user = firebase.auth().currentUser;
	var uid = user.uid*/
	var user =  Math.floor(Math.random() * Math.floor(9));
	//asume lab = chemistry
	var database = firebase.database().ref(laboratory);

	reqID = parseInt(latestRequestID) + 1;
	var name = ["Jyzzah Ruzgal","Aidan Resoles","Jeb Reece Grabato","Gracechel Pormilda","Rogeni Petinglay","Andrea Barros","Nina Azila Sainz","Darlene Gerardo","Gwen Cahilig", "Philip Ynion"]
	var userID = ["201516087","201471675","200676643","201886557","201738625","201979824","201613899","201861422","201351600","201825435"]
	//showNotification(action)
	var histName = name[user];
	var uid = userID[user]
	var additionalAction = {
				"details": "",
				"requestID": reqID,
				"items" : [ {
		    "itemID" : "gla-LeA-AxmLJH5-jJw2efX",
		    "name" : "Test Tube(5mL)",
		    "quantity" : 2
		  }],
			"proxyID": "201613899",
			"requestNeeded": 1557885600000,
			"requestSent": new Date().getTime(),
			"status": "pending",
			"user": uid
							
	};

	var historyofRequest = {
		"actions" : [{
			"action" : "Request created.",
			"timeStamp" : new Date().getTime(),
			"user": {
			"userID" : uid,
			"name" : histName
			}
		}],
		"historyID" : reqID
	}		
	firebase.database().ref(""+laboratory+"/request/").push(additionalAction);
	firebase.database().ref(""+laboratory+"/history/request").push(historyofRequest);	
}
function getUserName(userID){
	firebase.database().ref("users").orderByChild("userID").equalTo(userID).once("value").then(function(snapshot){
		snapshot.forEach(function(childSnapshot) {
			var data = snapshotToArray(childSnapshot);
			this.nameHolder = data[1]
			nameHolder = data[1]

		});
	});
}
function getName(count, userID){
	firebase.database().ref('/users/' + userID).orderByValue().on("value", function(snapshot) {
	  snapshot.forEach(function(data) {
	  	if(data.key == "name"){
	  		document.getElementById(count+"-history-"+userID).innerHTML += data.val();
	  	}
	  });
	});
}

function noCards(status){

	document.getElementById("loadingCards").innerHTML = "All requests loaded.";
	shouldfire = false;
	$('#pending-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#declined-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#processing-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#completed-items-div-pcd').unbind('scroll',infinite_scroll);
	$('#archive-items-div-pcd').unbind('scroll',infinite_scroll);
	//alert("nothing follows")
	switch(status){
		case 'others':
		case 'ready':
		case 'released':
		case 'defective':
		case 'preparing': 
			//console.log("processing dev")
			holder = document.getElementById('processing-items-div-pcd');break;
		case 'complete':
			//console.log('complete dev');
			status = "completed"
		default:
			//console.log(status+" dev")
			holder = document.getElementById(status+'-items-div-pcd')
	}
	//console.log("is empty? "+holder.innerHTML)
	if(holder.innerHTML == ""){
		holder.innerHTML = "<h3>Nothing here yet.</h3>";
	}
}

var requestLeftToGet = 6;
function formatRequest(results,status){
	var processedRequest = 0;

	for(id of results){
	 	data = id;
		if(data["archived"] && (status != "archive")){
			continue;
		}if(data["status"] == "cancelled"){
			continue;
		}
	  //console.log(data["details"]+"STATUS:"+ status.toLowerCase() + data)
	  if(parseInt(latestRequestID) < parseInt(data['requestID'])){
	  	latestRequestID = data['requestID']
	  }
	  var requestStatus = data["status"];
	  var items = data["items"];
	  var requestId = data["requestID"];
	  var requestNeeded = data["requestNeeded"];
	  var requestSent = data["requestSent"];
	  var userID = data["user"]
	  var itemStorage = '';

	  switch(status.toLowerCase()){
	    case "pending":
	      if(requestStatus.toLowerCase() == "pending"){
	        //display processing cards
	        itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
	        for (var i = 0;i<Object.keys(items).length;i++){
	          //limit item display to three
	          if(i < 3){
	            var itemID = data["items"][i]["itemID"].split("-")[0];
	            if(itemID == "gla"){
	              itemStorage += '<tr><td align="right">'+data["items"][i]["quantity"] +'</td><td>pc/s</td><td>'+data["items"][i]["name"]+'</td></tr>';
	             }
	            else{
	              itemStorage += '<tr><td align="right">'+data["items"][i]["amount"] +'</td><td>'+data["items"][i]["unit"]+'</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }  
	          } 
	          else{
	            break;
	          }
	        } 
	        var container = document.getElementById('pending-items-div-pcd');
	        container.innerHTML+='<div class="card_request card col-md-4 col-sm"  id="'+requestId+'" ondblclick="seeMoreRequest(this)"><div class="header"><h4 class="title"><span class="status">Request ID: #'+ requestId + '</span></h4></div><div class="content"><p> Request Needed : '+formatTimestamp(requestNeeded)+'</p><p> Request Sent : '+formatTimestamp(requestSent)+'</p><p> Requestor : '+data["user"]+'</p></div><div class="footer"><button class="btn btn-primary" id="'+requestId+'" value="'+data["status"]+'" onclick="showUpdateModal(this)"> Update </button><button class="btn btn-primary" id="'+requestId+'" value="'+requestStatus+'" onclick="seeMoreRequest(this)"> More Details </button><hr><div class="stats"><i class="fa fa-clock-o"></i> '+getDays(requestNeeded)+'</div></div></div></div>';
	       processedRequest +=1;
	      }
	      break;
	    case "declined":
	      //console.log('opening declined tab')
	      if(requestStatus.toLowerCase() == "declined" ){
	        itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
	        for (var i = 0;i<Object.keys(items).length;i++){
	        //limit item display to three
	          if(i < 3){
	            var itemID = data["items"][i]["itemID"].split("-")[0];
	            if(itemID == "gla"){          
	              itemStorage += '<tr><td align="right">'+data["items"][i]["quantity"] +'</td><td>pc/s</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }
	            else{
	              itemStorage += '<tr><td align="right">'+data["items"][i]["amount"] +'</td><td>'+data["items"][i]["unit"]+'</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }
	          } 
	          else{
	            break;
	          }
	        } 
	        var container = document.getElementById('declined-items-div-pcd');
	        
	        container.innerHTML+='<div class="card_request card col-md-4 col-sm"  id="'+requestId+'" ondblclick="seeMoreRequest(this)"><div class="header"><h4 class="title"><span class="status">Request ID: #'+ requestId + '</span></h4></div><div class="content"><p> Request Needed : '+formatTimestamp(requestNeeded)+'</p><p> Request Sent : '+formatTimestamp(requestSent)+'</p><p> Requestor : '+data["user"]+'</p></div><div class="footer"><button class="btn btn-primary" id="'+requestId+'" value="'+requestStatus+'" onclick="seeMoreRequest(this)"> More Details </button><hr><div class="stats"><i class="fa fa-clock-o"></i> '+getDays(requestNeeded)+'</div></div></div></div>';
	        processedRequest +=1;
	      }
	      break;
	    case "complete":
	      //console.log('opening complete tab')
	      if(requestStatus.toLowerCase() == "complete" ){
	        itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
	        for (var i = 0;i<Object.keys(items).length;i++){
	        //limit item display to three
	          if(i < 3){
	            var itemID = data["items"][i]["itemID"].split("-")[0];
	            if(itemID == "gla"){
	              itemStorage += '<tr><td align="right">'+data["items"][i]["quantity"] +'</td><td>pc/s</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }
	            else{
	              itemStorage += '<tr><td align="right">'+data["items"][i]["amount"] +'</td><td>'+data["items"][i]["unit"]+'</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }
	          } 
	          else{
	            break;
	          }
	        } 
	        var container = document.getElementById('completed-items-div-pcd');
	        container.innerHTML+='<div class="card_request card col-md-4 col-sm"  id="'+requestId+'" ondblclick="seeMoreRequest(this)"><div class="header"><h4 class="title"><span class="status">Request ID: #'+ requestId + '</span></h4></div><div class="content"><p> Request Needed : '+formatTimestamp(requestNeeded)+'</p><p> Request Sent : '+formatTimestamp(requestSent)+'</p><p> Requestor : '+data["user"]+'</p></div><div class="footer"><button class="btn btn-primary" id="'+requestId+'" value="'+requestStatus+'" onclick="seeMoreRequest(this)"> More Details </button><hr><div class="stats"><i class="fa fa-clock-o"></i> '+getDays(requestNeeded)+'</div></div></div></div>';
	       	processedRequest +=1;
	      }
	      break;
	    case "others":
	      //console.log('opening processing tab')
	      if((requestStatus != 'declined') && (requestStatus != 'complete') && (requestStatus != 'pending')){
	        //display processing cards
	        itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
	        for (var i = 0;i<Object.keys(items).length;i++){
	          //limit item display to three
	          if(i < 3){
	            var itemID = data["items"][i]["itemID"].split("-")[0];
	            if(itemID == "gla"){
	              itemStorage += '<tr><td align="right">'+data["items"][i]["quantity"] +'</td><td>pc/s</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }
	            else{
	              itemStorage += '<tr><td align="right">'+data["items"][i]["amount"] +'</td><td>'+data["items"][i]["unit"]+'</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }  
	          } 
	          else{
	            break;
	          }
	        } 
	        var container = document.getElementById('processing-items-div-pcd');
	        var color = "fa fa-circle text-danger";
	        switch(requestStatus){
				case "defective" : color = "<i class ='fa fa-circle text-danger'></i>"; break;
				case "preparing" : color = "<i class='fa fa-circle text-warning'></i>"; break;
				case "released" : color = "<i class='fa fa-circle text-info'></i>"; break;
				case "ready" : color = "<i class='fa fa-circle text-success'></i>"; break;
			}
	        container.innerHTML+='<div class="card_request card col-md-4 col-sm"  id="'+requestId+'" ondblclick="seeMoreRequest(this)"><div class="header"><h4 class="title"><span class="status">'+color+' '+ requestStatus + '</span></h6><p class="category">Request ID: #'+requestId+'</p></div><div class="content"><p> Request Needed : '+formatTimestamp(requestNeeded)+'</p><p> Request Sent : '+formatTimestamp(requestSent)+'</p><p> Requestor : '+data["user"]+'</p></div><div class="footer"><button class="btn btn-primary" id="'+requestId+'" value="'+data["status"]+'" onclick="showUpdateModal(this)"> Update </button><button class="btn btn-primary" id="'+requestId+'" value="'+requestStatus+'" onclick="seeMoreRequest(this)"> More Details </button><hr><div class="stats"><i class="fa fa-clock-o"></i> '+getDays(requestNeeded)+'</div></div></div></div>';
	        processedRequest +=1;
	      }
	      break;
	    case "archive":
	    	//console.log("archive");
	    	if(data['archived']){
	    		//console.log("ENETERD ARCH")
		    	//display processing cards
		        itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
		        for (var i = 0;i<Object.keys(items).length;i++){
		          //limit item display to three
		          if(i < 3){
		            var itemID = data["items"][i]["itemID"].split("-")[0];
		            if(itemID == "gla"){
		              itemStorage += '<tr><td align="right">'+data["items"][i]["quantity"] +'</td><td>pc/s</td><td>'+data["items"][i]["name"]+'</td></tr>';
		            }
		            else{
		              itemStorage += '<tr><td align="right">'+data["items"][i]["amount"] +'</td><td>'+data["items"][i]["unit"]+'</td><td>'+data["items"][i]["name"]+'</td></tr>';
		            }  
		          } 
		          else{
		            break;
		          }
		        }
		        var container = document.getElementById('archive-items-div-pcd');
		        switch(requestStatus){
					case "defective" : color = "fa fa-circle text-danger"; break;
					case "declined" : color = "fa fa-circle text-danger"; break;
					case "preparing" : color = "fa fa-circle text-warning"; break;
					case "released" : color = "fa fa-circle text-info"; break;
					case "completed" : color = "fa fa-circle text-success"; break;
					case "ready" : color = "fa fa-circle text-success"; break;
				}
		        container.innerHTML+='<div class="card_request card col-md-4 col-sm archived"  id="'+requestId+'" ondblclick="seeMoreRequest(this)"><div class="header"><h4 class="title"><span class="status"><i class="'+color+'"></i> '+ requestStatus + '</span></h6><p class="category">Request ID: #'+requestId+'</p></div><div class="content"><p> Request Needed : '+formatTimestamp(requestNeeded)+'</p><p> Request Sent : '+formatTimestamp(requestSent)+'</p><p> Requestor : '+data['user']+'</p></div><div class="footer"><button class="btn btn-primary" id="'+requestId+'" name="unarchive" onclick="showConfirmModal(this)"> Return to Active </button><button class="btn btn-primary" id="'+requestId+'" value="'+requestStatus+'" onclick="seeMoreRequest(this)"> More Details </button><hr><div class="stats"><i class="fa fa-clock-o"></i> '+getDays(requestNeeded)+'</div></div></div></div>';
		        processedRequest +=1;
	    	}
	    	break;
	    default:
	  //    console.log('opening filtered tab')
	      if(status == requestStatus.toLowerCase()){
	        //display processing cards
	        itemStorage = '<tr><th></th><th width="20%"></th><th width="70%"></th></tr>'
	        for (var i = 0;i<Object.keys(items).length;i++){
	          //limit item display to three
	          if(i < 3){
	            var itemID = data["items"][i]["itemID"].split("-")[0];
	            if(itemID == "gla"){
	              itemStorage += '<tr><td align="right">'+data["items"][i]["quantity"] +'</td><td>pc/s</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }
	            else{
	              itemStorage += '<tr><td align="right">'+data["items"][i]["amount"] +'</td><td>'+data["items"][i]["unit"]+'</td><td>'+data["items"][i]["name"]+'</td></tr>';
	            }  
	          } 
	          else{
	            break;
	          }
	        } 
	        var container = document.getElementById('processing-items-div-pcd');
	        switch(requestStatus){
				case "defective" : color = "fa fa-circle text-danger"; break;
				case "preparing" : color = "fa fa-circle text-warning"; break;
				case "released" : color = "fa fa-circle text-info"; break;
				case "ready" : color = "fa fa-circle text-success"; break;
			}
	        container.innerHTML+='<div class="card_request card col-md-4 col-sm"  id="'+requestId+'" ondblclick="seeMoreRequest(this)"><div class="header"><h4 class="title"><span class="status"><i class="'+color+'"></i> '+ requestStatus + '</span></h6><p class="category">Request ID: #'+requestId+'</p></div><div class="content"><p> Request Needed : '+formatTimestamp(requestNeeded)+'</p><p> Request Sent : '+formatTimestamp(requestSent)+'</p><p> Requestor : '+data['user']+'</p></div><div class="footer"><button class="btn btn-primary" id="'+requestId+'" value="'+requestStatus+'" onclick="showUpdateModal(this)"> Update </button><button class="btn btn-primary" id="'+requestId+'" value="'+requestStatus+'" onclick="seeMoreRequest(this)"> More Details </button><hr><div class="stats"><i class="fa fa-clock-o"></i> '+getDays(requestNeeded)+'</div></div></div></div>';
	        processedRequest +=1;
	      }
	  }

		
	
	    
	   if(processedRequest ==  requestLeftToGet){
	   	break;
	   }
	}
	if (Object.keys(results).length < requestLeftToGet){
		if(requestLeftToGet == 6){
			noCards(status);
		}
	}
	else{
		if(processedRequest < requestLeftToGet){
			requestLeftToGet -= processedRequest;
	        document.getElementById("loadingCards").innerHTML = "Loading more cards. Please wait...";
	        if(status == "processing"){
	        	status =  document.getElementById("request_status").options[ statusUpdate.selectedIndex ].value
	        	getRequests(status)
	        }else{
	   			getRequests(status)
	        }
		}else{

	   	shouldFire = true;
	   	requestLeftToGet = 6;
	   	document.getElementById("loadingCards").innerHTML = "Scroll down to load more requests.";
	   	//$('#pending-items-div-pcd').bind('scroll',infinite_scroll);
	   	switch(status){
	   		case 'pending' : $('#declined-items-div-pcd').bind('scroll',infinite_scroll);break;
			case 'completed' : $('#completed-items-div-pcd').bind('scroll',infinite_scroll); break;
			case 'archive' : $('#archive-items-div-pcd').bind('scroll',infinite_scroll); break;
			case 'declined': $('#declined-items-div-pcd').bind('scroll',infinite_scroll); break;
			default: $('#processing-items-div-pcd').bind('scroll',infinite_scroll);
	   	}
		}
	}

}

function infinite_scroll(e){
    var elem = $(e.currentTarget);
    if ((elem[0].scrollHeight - elem.scrollTop() <= elem.outerHeight()+0.5) &&(shouldFire == true)){
        //console.log("bottom");
        shouldFire = false;
        document.getElementById("loadingCards").innerHTML = "Loading more cards. Please wait...";
        if(infiniteScrollRequest ==  "processing"){
        	var request_header = $("input[name=request_status]:checked").val()
        	//console.log("calling getrequest from 501 "+ request_header)
        	getRequests(request_header)
        }else{
        	//console.log("calling getrequest from 503")
   			getRequests(infiniteScrollRequest);
        }
    }
}



function showNotification(text){
	$.notify({
		icon: "pe-7s-like",
		message: sanitize(text)

	},{
		type: 'success',
		timer: 3000,
		placement: {
			from: 'top',
			align: 'center'
		}
	});
}
//double clicking to see more of the request
function seeMoreRequest(card){
	//console.log(card.id)
	//clear previous see more

	document.getElementById("modal-status").innerHTML ="<h6>Status</h6>: ";
	document.getElementById("modal-request-number").innerHTML ="<h6>Request Number</h6>: #"+card.id;
	document.getElementById("modal-request-sent").innerHTML = "<h6>Request Sent</h6>:  " ;
	document.getElementById("modal-request-needed").innerHTML = "<h6>Request Needed</h6>:  " ;
	document.getElementById("modal-userid").innerHTML = "<h6>Requestor Name</h6>:  ";
	document.getElementById("modal-description").innerHTML = "";
	document.getElementById("modal-items").innerHTML = "<div class='header'><h6>Item Summary</h6><p class='catergory'>Below are the summary of items</p></div>";
	
	var database = firebase.database().ref(laboratory + "/request");
	var database = firebase.database().ref(laboratory);
	database.child("/request").orderByChild("requestID").equalTo(card.id).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				//var data = snapshotToArray(childSnapshot);
				var status = childSnapshot.val().status;
				var date = childSnapshot.val().requestSent;
				var requestNeeded = childSnapshot.val().requestNeeded;
				var user = childSnapshot.val().user;
				var items = childSnapshot.val().items;
				var description = childSnapshot.val().details;

				
				document.getElementById("modal-status").innerHTML += status;
				document.getElementById("modal-request-sent").innerHTML += formatTimestamp(date);
				document.getElementById("modal-request-needed").innerHTML += formatTimestamp(requestNeeded);
				document.getElementById("modal-items").innerHTML += '<table width="80%" class="table table-hover table-striped"><thead><tr></tr></thead><tbody id="summary-body"></tbody>';

				firebase.database().ref("/users").orderByChild("userID").equalTo(user).once("value").then(function(nameshot){
					nameshot.forEach(function(nshot){
						var name = nshot.val().name;
						document.getElementById("modal-userid").innerHTML += name;
					});
				});

				var itemStorage = ''
				var temp = [];
				
				if(status == "defective"){
					if(description != ""){
						document.getElementById("modal-description").innerHTML = "<h6>Defective Notes</h6>:  "+description;
					}
					var defective = childSnapshot.val().defective;
					for(var i = 0; i < defective.length;i++){
						var quantity = 0;

						for(var j = 0; j < defective[i]["items"].length;j++){
							quantity = quantity + parseInt(defective[i]["items"][j]["quantity"]);
							
							document.getElementById("summary-body").innerHTML += '<tr><td align="right" style="color:red">'+defective[i]["items"][j]["status"] +'</td><td align="right">'+defective[i]["items"][j]["quantity"]+'</td><td>pc/s</td><td>'+defective[i]["name"]+'</td></tr>';
						}
						var id = defective[i]["itemID"]
						temp.push({ "itemID" : id, "quantity": quantity})
					}
					itemStorage +='<hr>'
					//console.log(temp)
					for(var i = 0; i<items.length; i++){
						//console.log("looping item is=" + items[i]["name"])
						var cat = items[i]["itemID"].split("-")[0];
						var itemID = items[i]["itemID"];
						if(cat == "gla"){
							//console.log("is quan")
							var quantity = items[i]["quantity"];
							for(var k = 0; k<temp.length;k++){
								if(temp[k]["itemID"] == itemID){
									//get itemID's qty and subtract by temp[k]qty
									quantity = parseInt(items[i]["quantity"]) - parseInt(temp[k]["quantity"]);
									break;
								}
							}
							if(quantity >0){
								document.getElementById("summary-body").innerHTML += '<tr><td></td><td align="right">'+ quantity +'</td><td>pc/s</td><td>'+items[i]["name"]+'</td></tr>';
							}
							
						}
						else{
							document.getElementById("summary-body").innerHTML += '<tr><td></td><td align="right">'+items[i]["amount"] +'</td><td>'+items[i]["unit"]+'</td><td>'+items[i]["name"]+'</td></tr>';
						}
					}
				}else{
					if(status == "declined"){
						document.getElementById("modal-description").innerHTML = "<h6>Reason for Declining Request</h6>:  "+ description;
					}
						items.forEach(function(item){
							//console.log(item);
							var cat = item['itemID'].split("-")[0];
							switch(cat){
								case 'gla': cat = "glassware"; break;
								case 'cul': cat = "culture"; break;
								case 'sol': cat = "solid"; break;
								case 'dye': cat = "dye"; break;
								case 'non': cat = "nonmetal"; break;
								case 'met': cat = "metal"; break;
								case 'che': cat = "chemical"; break;
							}
							if(cat == "glassware" || cat == "culture"){
								firebase.database().ref(laboratory+"/inventory/"+cat).orderByChild("itemID").equalTo(item['itemID']).once("value").then(function(snapshotItem){ 
									snaps = snapshotToArray(snapshotItem)[0]
									var quan = snaps['quantity']
									if(quan < item['quantity']){
										document.getElementById("summary-body").innerHTML += '<tr><td align="right">'+item["quantity"] +'</td><td>pc/s</td><td>'+item["name"]+'</td><td class="error">Not enough. Only '+quan+' in inventory.</td></tr>';
										
									}else{
										document.getElementById("summary-body").innerHTML += '<tr><td align="right">'+item["quantity"] +'</td><td>pc/s</td><td>'+item["name"]+'</td><td class="available">Available.</td></tr>';
										
									}
								});	
							}else{
								firebase.database().ref(laboratory+"/inventory/"+cat).orderByChild("itemID").equalTo(item['itemID']).once("value").then(function(snapshotItem){ 
									var snaps = snapshotToArray(snapshotItem)[0]
									var amount = parseFloat(snaps['amount'])
									if(amount < parseFloat(item['amount'])){
										document.getElementById("summary-body").innerHTML += '<tr><td align="right">'+item["amount"] +'</td><td>'+item["unit"]+'</td><td>'+item["name"]+'</td><td class="error">Not enough. Only '+amount+' '+ snaps['unit']+' in inventory.</td></tr>';
									}else{
										document.getElementById("summary-body").innerHTML += '<tr><td align="right">'+item["amount"] +'</td><td>'+item["unit"]+'</td><td>'+item["name"]+'</td><td class="available">Available.</td></tr>';
									}
								});	
							}
						});					
				}
				
			});
	});
	
	document.getElementById("view-history-modal-btn").value = card.id
	$('#seeMore').modal('show');
	
	

}
//getHistory
function getHistory(requestID, type){
	var id = requestID.value
	
	var database = firebase.database().ref(laboratory);

	if(type == null){
		type = "item"
		document.getElementById("viewHistoryModalTitle").innerHTML = "History of Item";
		document.getElementById("viewHistoryFooter").innerHTML = '<button type="button" id="cancelHistoryView" class="btn btn card-btn" data-toggle="modal" data-dismiss="modal"> Close </button>';
	}else{
		type = "request"
		//var id = parseInt(requestID.value)
		document.getElementById("viewHistoryModalTitle").innerHTML = "History of Request";
		database.child("/request").orderByChild("requestID").equalTo(id).once("value").then(function(snap){
			
			snap.forEach(function(childSnap){
				if(childSnap.val().archived){
					document.getElementById("viewHistoryFooter").innerHTML = '<button type="button" id="cancelHistoryView" class="btn btn card-btn" data-toggle="modal" data-dismiss="modal"> Close </button>';
				}else{
					document.getElementById("viewHistoryFooter").innerHTML = '<button type="button" id="cancelHistoryView" class="btn btn card-btn" data-toggle="modal" data-dismiss="modal"> Close </button><button type="button" id="'+id+'" name="archive" class="btn btn card-btn" data-dismiss="modal" onclick="showConfirmModal(this)"> Move to Archive </button>';
	
				}
			})
		})
		
	}
	document.getElementById("history-table-modal").innerHTML = "";
	database.child("/history/"+type).orderByChild("historyID").equalTo(id).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
				var data = snapshotToArray(childSnapshot);
				actions = data[0];
				var historyStorage = ''
				count = 0;
				for(var i in actions){
					if(actions[i]["timeStamp"] == undefined){
						break;
					}
					historyStorage +="<tr><td width='25%'>"+formatTimestamp(actions[i]['timeStamp'])+"</td><td >"+actions[i]["action"]+"</td><td>"+actions[i]["user"]["name"]+"</td></tr>";
					
				}
					document.getElementById("history-table-modal").innerHTML = '<div class="table-responsive table-full-width"><table width="80%" class="table table-hover table-striped"><thead><tr><th width="30%">Date</th><th width="50%">Action</th><th>User</th></tr></thead><tbody>'+historyStorage+'</tbody></table></div>';

			});
	});
	$('#viewHistoryModal').modal('show');
}

//format dates
function formatTimestamp(UNIX_timestamp, ms){

  var a = new Date(UNIX_timestamp);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  	if(hour>=13){
  		hour = hour-12;
  		meridian = 'PM';
  	}
  	else if(hour==0){
  		hour = 12;
  		meridian = 'AM';
  	}else{
  		meridian = 'AM'
  	}
  	if(min < 10){
  		//min = "0" + min;
  	var time =  month + ' ' + date +', ' + year + '   ' + hour + ':0' + min + ' ' + meridian ;
  	}else{
  		 var time =  month + ' ' + date +', ' + year + '   ' + hour + ':' + min + ' ' + meridian ;

  	}
  return time;

}
//show confirm modal
function showConfirmModal(requestId, text){
	if(text == undefined){
		if(requestId.name == "archive"){
			document.getElementById("confirm-text-title").innerHTML = "Move request to archive?";
			document.getElementById("confirm-text").innerHTML = "<h4><center>This request will be moved to the archive.</center></h4>";
			document.getElementById("confirmStatusChange").setAttribute('onclick','addArchiveStatus(this)')
		}else{
			document.getElementById("confirm-text-title").innerHTML = "Move request to active tabs?";
			document.getElementById("confirm-text").innerHTML = "<h4><center>This request will be removed from archive.</center></h4>";
			document.getElementById("confirmStatusChange").setAttribute('onclick','removeArchiveStatus(this)')
		}
		document.getElementById("confirmStatusChange").setAttribute('name', requestId.id);
	}else{
		if (text == "Defective"){
			document.getElementById("confirm-text-title").innerHTML = "Update Defective Items";
			document.getElementById("confirm-text").innerHTML = "<h4><center>Are you sure would like to update the defective items list?</center></h4>";
		}
		else if(text == "Declined" || text == "Complete"){
			document.getElementById("confirm-text-title").innerHTML = "Update Status to "+ text;
			document.getElementById("confirm-text").innerHTML = "<h4><center>Are you sure to update this request to " +text+ "?</center></h4><center><span style='size:10px'>Once confirmed, this cannot be changed.</span></center>";
		}
		else{
			document.getElementById("confirm-text-title").innerHTML = "Update Status to "+ text;
			document.getElementById("confirm-text").innerHTML = "<h4><center>Are you sure to update status to "+text+"?</center></h4>";	
		}
		document.getElementById("confirmStatusChange").setAttribute('name', requestId);
		document.getElementById("confirmStatusChange").setAttribute('value', text.toLowerCase());
		document.getElementById("confirmStatusChange").setAttribute('onclick','changeStatusOfRequest(this)')
	}
		$('#confirmModal').modal('show');
}

//remove archive status, bring back to active
function removeArchiveStatus(req){
	var database = firebase.database().ref(laboratory);
	database.child("/request").orderByChild("requestID").equalTo(req.name).once("value").then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var updateThisChild = childSnapshot.key;
			firebase.database().ref(""+laboratory+"/request/"+updateThisChild+"/archived").remove();
			updateRequestHistory(req.name, "Request has been removed from archive.");
			changeStatusDisplay(req.name, "unarchive");
		})
	})
}

//add archive status, move to archive
function addArchiveStatus(req){
	var database = firebase.database().ref(laboratory);
	database.child("/request").orderByChild("requestID").equalTo(req.name).once("value").then(function(snapshot){
		snapshot.forEach(function(childSnapshot){
			var updateThisChild = childSnapshot.key;
			firebase.database().ref(""+laboratory+"/request/"+updateThisChild+"/archived").set("true");
			updateRequestHistory(req.name, "Request has been archived.");
			changeStatusDisplay(req.name, "archive");
		})
	})
}

//change status of request from pending to processing
function changeStatusOfRequest(req){
	var database = firebase.database().ref(laboratory);
	
	database.child("/request").orderByChild("requestID").equalTo(req.name).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var textUpdate = ''
					var updateThisChild = childSnapshot.key;
					
					var details = childSnapshot.val().details;
					var requestID = childSnapshot.val().requestID;
					var items = childSnapshot.val().items;
					var proxyID = childSnapshot.val().proxyID;
					var requestNeeded = childSnapshot.val().requestNeeded;
					var requestSent = childSnapshot.val().requestSent;
					var user = childSnapshot.val().user;
					var status = childSnapshot.val().status;
					var new_proxy = "";
					var goal_status = req.value.toLowerCase();
					//get currently logged in user
					var staffID = 1;
					var prev_status = status
					//req.value is goal status
					//childsnapshot.val().status is previous/current status that hasn't been changed yet
					

					if (goal_status == "declined"){
						var details = $("#updateDeclineComments").val()
						if(status == "released" || status == "defective"){
							updateAccountability("resolved", user, requestID);
							if(status == "defective"){
								textUpdate ="Accountabilities removed."
							}
							textUpdate += "All items returned.";
							inventoryQuantityAddSubtract(items,"+",true,requestID);
						}
						textUpdate += "Updated request status from "+status+" to Declined. "+details;
						status = "declined";
					}
					else if (goal_status == "ready"){
						if(status == "released" || status == "defective"){
							updateAccountability("resolved", user, requestID);
							if(status == "defective"){
								textUpdate ="Accountabilities removed."
							}
							textUpdate += "All items returned.";
							inventoryQuantityAddSubtract(items,"+",true,requestID)
							//returnAll(items);
						}
						textUpdate += "Updated request status from "+status+" to Ready.";
						status = "ready";
					}
					else if (goal_status == "complete" || goal_status == "completed"){		
						textUpdate = "Updated request status from "+status+" to Completed.";
						if(status == "defective"){
							returnGlasswareFromDefective(childSnapshot.val().defective,requestID)
							defectiveData = retrieveDefectiveData();
							action = defectiveData[1];
						    updateAccountability("resolved", user, requestID);
							textUpdate = "Updated request status from Defective to Completed.<br> All accountabilities have been resolved.";
						}
						status = "complete";
					}
					else if (goal_status == "released"){
						textUpdate = "Updated request status from "+status+" to Released.";
						
						//if released to released aka changing the one who picks up the item.
						if(status == "released"){
							textUpdate = "Edited the recipient.";
						}else if(status == "defective"){
							updateAccountability("resolved", user, requestID);
							textUpdate +="Accountabilities removed."
							inventoryQuantityAddSubtract(items,"-",true,requestID);
						}else if(status == "ready"){
							inventoryQuantityAddSubtract(items,"-",true,requestID);
						}else{
							textUpdate += "Staff updated to Released without first updating the request to Ready.";
						}

						if(document.getElementById('radio1').checked == true){
							details=user;
							//console.log("released to requestor "+details)
							textUpdate += "Released to requestor.";
						}else{
							if(document.getElementById('radio3').checked == true){
								details = document.getElementById("releasedTo").value;
								proxyName = document.getElementById("releasedTo").name;
								textUpdate += "Released to new proxy: "+proxyName+" ("+details+").";
							}else{
								details="";
								proxyName = document.getElementById("releasedTo").name;
								textUpdate += "Released to authorized proxy: "+proxyName+" ("+proxyID+").";
							}
						}
						status = "released"
						
					}
					else if (goal_status == "defective"){
						defectiveData = retrieveDefectiveData();
						defective = defectiveData[0];
						action = defectiveData[1];
						if(status =="defective"){
							defectiveReturnGlassware(childSnapshot.val().defective,defective,items,requestID)
						}else if(status != "released"){
							//meaning, skipped released, trigger release.
							inventoryQuantityAddSubtract(items,"-",true,requestID);
							textUpdate = "Staff skipped release status, items requested considered as released.";
						}else{
							updateAccountability("unresolved", user, requestID);
							returnGlassware(items,defective,requestID,true)
						}
						status = "defective";
					}
					else{
						if(status == "released" || status == "defective"){
							updateAccountability("resolved", user, requestID);
							if(status == "released"){
								textUpdate = "All items returned.";
							}
							textUpdate +="Accountabilities removed."
							inventoryQuantityAddSubtract(items,"+",true,requestID);
						}
						textUpdate += "Updated request status from "+status+" to Preparing.";
						status = "preparing"
					}

					if(status == "defective"){
					    updateAccountability("unresolved", user, requestID);
						firebase.database().ref(""+laboratory+"/request/"+updateThisChild+"/status").set(status);
						firebase.database().ref(""+laboratory+"/request/"+updateThisChild+"/defective").set(defective);

						//updateAccountability(user['userID'],requestID);
						
						possibly_new_details = document.getElementById("defective-comments").value
						if(possibly_new_details != details){
							firebase.database().ref(""+laboratory+"/request/"+updateThisChild+"/details").set(possibly_new_details);
							if(possibly_new_details == ""){
								updateRequestHistory(requestID,textUpdate+"Accountabilities updated. Updated defective and missing list to: "+ action + "Comments set to empty.");	
							}else{
								updateRequestHistory(requestID,textUpdate+"Accountabilities updated. Updated defective and missing list to: <br>"+ action + "Comments updated to: "+possibly_new_details+"");						
							}

						}else{							
							updateRequestHistory(requestID,textUpdate+"Accountabilities updated. Updated defective and missing list to: <br>"+ action + "");
					
						}
					}else{
							var newData = {
							"details": details,
							"requestID": requestID,
							"items": items,
							"proxyID": proxyID,
							"requestNeeded": requestNeeded,
							"requestSent": requestSent,
							"user": user,
							"status": status
						};
						var updates = {}
						updates[""+laboratory+"/request/"+ updateThisChild] = newData;
						firebase.database().ref().update(updates);
						updateRequestHistory(requestID,textUpdate);
						if(prev_status != status){
							if(status == "defective"){
								var defectiveData = {
									"defective":defective,
									"details": details,
									"requestID": requestID,
									"items": items,
									"proxyID": proxyID,
									"requestNeeded": requestNeeded,
									"requestSent": requestSent,
									"user": user,
									"status": status
								};
								var notif = {
									"request": defectiveData,
									"status": "new"
								}
								firebase.database().ref("notification/"+user).push(notif)
							}else{
								var notif = {
									"request": newData,
									"status": "new"
								}
								firebase.database().ref("notification/"+user).push(notif)
							}
							
						}
						}
					changeStatusDisplay(requestID,status)
					
			});
	})
}

//get days until request is needed
function getDays(whenNeeded){
  //Get 1 day in milliseconds
  var one_day = 24*60*60*1000;
  //get timestamp now
  var timeNow = new Date().getTime()
  var todayStart = formatDate(getTodayDate() + " 00:00:00");
  var todayEnd = formatDate(getTodayDate() + " 23:59:59");


// get total seconds between the times
var delta = Math.abs(whenNeeded - timeNow) / 1000;

// calculate (and subtract) whole days
var days = Math.floor(delta / 86400);

//  var days = Math.round(Math.abs(((whenNeeded*1000) - timeNow)/(one_day)));
  //Math.abs(whenNeeded - timeNow);
  //var days = Math.round(difference/one_day); 
  if((todayStart <= whenNeeded) && (whenNeeded <= todayEnd)){
  	return "Request is due today.";
  }else if(whenNeeded < timeNow){
  	if(days == 1 || days == 0){
  		return "Was due yesterday.";
  	}
  	return "Was due " + days + " days ago.";
  }else{
  	return "Request is due in "+ days + " days.";
  }
  // Convert back to days and return
  return days

}
function getTodayDate(){
	today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //As January is 0.
	var yyyy = today.getFullYear();

	if(dd<10) dd='0'+dd;
	if(mm<10) mm='0'+mm;
	return (yyyy+"-"+mm+"-"+dd);
}
//update request history
function updateRequestHistory(historyID,action){
	var user = firebase.auth().currentUser;
	var uid = user.uid
	var database = firebase.database().ref(laboratory);
	showNotification(action)

	database.child("/history/request").orderByChild("historyID").equalTo(historyID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var updateThisChild = childSnapshot.key;

					firebase.database().ref('users').child(uid)
				    .once('value')
				    .then(function(snapshot) {
				      var name = snapshot.val().name;
				      var uname = snapshot.val().userID;
					var additionalAction = {
							"user": {
								"name" : name,
								"userID" : uname
							},
							"action": action,
							"timeStamp" : new Date().getTime()
					};			
					firebase.database().ref(""+laboratory+"/history/request/"+updateThisChild+"/actions").push(additionalAction);
				    });
					return true;
			});
	});
}
var fade;
//change status
function changeStatusDisplay(requestID,status){
	if(status != "archive" && status != "unarchive"){
		//if pending tab open....
		if(infiniteScrollRequest != "pending"){
			var myList = document.getElementById(requestID);
			var myListItems = myList.getElementsByTagName('span');
			var cardButton = myList.getElementsByTagName('button');
			cardButton[0].value = status

			switch(status){
				case "defective" : myListItems[0].innerHTML = '<i class="fa fa-circle text-danger"></i> '; break;
				case "declined" : myListItems[0].innerHTML = '<i class="fa fa-circle text-danger"></i> '; break;
				case "released" : myListItems[0].innerHTML = '<i class="fa fa-circle text-info"></i> '; break;
				case "ready" : myListItems[0].innerHTML = '<i class="fa fa-circle text-success"></i> '; break;
				case "completed" : myListItems[0].innerHTML = '<i class="fa fa-circle text-success"></i> '; break;
				case "complete" : myListItems[0].innerHTML = '<i class="fa fa-circle text-success"></i> '; break;
			}
			myListItems[0].innerHTML += " " + status;
		}
		
	}else{
		if(status=="archive"){
			document.getElementById(requestID).classList.add("archived");
		}else{
			document.getElementById(requestID).classList.remove("archived");
		}
	}
	//if opened tab is pending, perform, else dont
	if(infiniteScrollRequest == "pending" || infiniteScrollRequest == "archive"){
		fade = setTimeout(function () {
		    $("#"+requestID).fadeTo(500, 0).slideUp(500, function () {
			        $(this).remove();
			    });
			}, 5000);
	}else if(status == "completed" || status == "declined"){
		fade = setTimeout(function () {
		    $("#"+requestID).fadeTo(500, 0).slideUp(500, function () {
			        $(this).remove();
			    });
			}, 5000);
	}
	else{
		clearTimeout(fade);
	}
	
}
//show update modal
function showUpdateModal(requestId){
	status = requestId.value
	document.getElementById("defectiveTitle").style.display="none";
	if(status == "pending"){
		document.getElementById("statusUpdate").innerHTML = '<option value="preparing">Preparing</option><option value="declined">Declined</option>'
 	}else{
 		document.getElementById("statusUpdate").innerHTML = '<option value="preparing">Preparing</option><option value="ready">Ready</option><option value="released">Released</option><option value="defective">Defective</option><option value="completed">Completed</option><option value="declined">Declined</option>';
 	}
	switch(status){
		case 'declined':
			document.getElementById("statusUpdate").selectedIndex = "5";			
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="block";
			document.getElementById("defectiveContent").style.display="none";
			break;
		case 'ready':
			document.getElementById("statusUpdate").selectedIndex = "1";
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="none";
			break;
		case 'released':
			hasAuthorized(requestId.id)
			document.getElementById("statusUpdate").selectedIndex = "2";
			document.getElementById("releasedContent").style.display="block";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="none";
			break;
		case 'defective':
			document.getElementById("statusUpdate").selectedIndex = "3";
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="block";
			document.getElementById("moreitemsbtn").value = requestId.id;
			document.getElementById("defective-comments").value = "";
			defectiveGetItems(requestId.id)
			break;
		case 'completed':
		case 'complete':
			document.getElementById("statusUpdate").selectedIndex = "4";
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="none";
			break;
		default:
			document.getElementById("statusUpdate").selectedIndex = "0";		
			document.getElementById("releasedContent").style.display="none";
			document.getElementById("declinedContent").style.display="none";
			document.getElementById("defectiveContent").style.display="none";
			break;
	}

	//change confirm name to request id
	
	document.getElementById("statusUpdate").setAttribute('name', requestId.id);
	document.getElementById("submitUpdate").setAttribute('name', requestId.id);
	$('#updateModal').modal('show');
}

$('.dblProcessing').on('dblclick',function () {
	$('#moreProcessing').modal('toggle');
})
//change dropdown value
$(".dropdown-menu a").click(function(){
  
  $("#status:first-child").html($(this).text()+' <span class="caret"></span>');
  
});
$('#cancelConfirm').click(function(){
	$('#updateModal').modal('show');
	$('#cancelConfirm').modal('hide');
});
$('#cancelHistoryView').click(function(){
	if(document.getElementById("viewHistoryModalTitle").innerHTML == "History of Item"){
		$('#seeMore').modal('show');	
	}
	$('#viewHistoryModal').modal('hide');
});

$('#confirm').click(function(){
	$("#statusUpdate").val("Preparing");
});
$('#declineMain').click(function(){
	$("#statusUpdate").val("Declined").change();
	document.getElementById("releasedContent").style.display="none";
	document.getElementById("declinedContent").style.display="block";
	document.getElementById("defectiveContent").style.display="none";
	document.getElementById("statusUpdate").style.display="none";
	document.getElementById("statusSpan").style.display="none";
	$('#updateModal').modal('show');
})


function submitUpdate(req){
	var drop = document.getElementById("statusUpdate");
	var status = drop.options[drop.selectedIndex].value
	var id = req.name;
	document.getElementById("defectiveTitle").style.display="none";
	switch(status){
		case 'preparing':
			//console.log('preparing');
			document.getElementById("submitUpdate").setAttribute('value','Preparing');
			showConfirmModal(id,'Preparing');
			$('#updateModal').modal('hide');
			break;
		case 'ready':
			//console.log('ready');
			document.getElementById("submitUpdate").setAttribute('value','Ready');
			showConfirmModal(id,'Ready');
			$('#updateModal').modal('hide');			
			break;
		case 'released':
			//console.log('released');
			//console.log(document.getElementById("releaseConfirmUpdate").value)
			//insert released checker here//
			if(document.getElementById("releaseConfirmUpdate").value == "true"){
				//console.log(id);
				document.getElementById("submitUpdate").setAttribute('value','Released');
				showConfirmModal(id,'Released');
				$('#updateModal').modal('hide');
			}
			break;
		case 'defective':
			//console.log('defective');
			//insert defective checker here//
			switch(validateDefective()){
				case "items": document.getElementById("defectiveTableWarning").innerHTML = "Choose an item."; break;
				case "qty" : document.getElementById("defectiveTableWarning").innerHTML = "Invalid quantity number."; break;
				case "status": document.getElementById("defectiveTableWarning").innerHTML = "Check type of item status (missing or defective)"; break;
				default: document.getElementById("submitUpdate").setAttribute('value','Defective');
					showConfirmModal(id,'Defective');
					$('#updateModal').modal('hide');
			}
			
			break;
		case 'completed':
			//console.log('ok');
			//insert complete checker here in case of defects//
			document.getElementById("submitUpdate").setAttribute('value','Complete');
			showConfirmModal(id,'Complete');
			$('#updateModal').modal('hide');
			break;
		case 'declined':
			//console.log('declined');
			if($("#updateDeclineComments").val() != ""){
				//console.log(id);
				document.getElementById("submitUpdate").setAttribute('value','Declined');
				showConfirmModal(id,'Declined');
				$('#updateModal').modal('hide');
				$("#declineWarning").html("");
			}
			else{
				$("#declineWarning").html("Can't be blank.");
			}
			break;

	}
}
$('#submitsUpdate').click(function() {
	var status = $('#statusUpdate').val();
	switch (status) { 
		case 'Released': 
			if($("#releaseConfirmUpdate").val() === "true"){
				$('#confirmModal').modal('show');
				$('#updateModal').modal('hide');
			}
			break;
		case 'Defective':
			if($("#releaseConfirmDefective").val() === "true"){
				$('#confirmModal').modal('show');
				$('#updateModal').modal('hide');
			}
			break;
		case 'Declined': 
			if($("#updateDeclineComments").val() != ""){
				showConfirmModal()
				//$('#confirmModal').modal('show');
				$('#updateModal').modal('hide');
			}
			else{
				$("#declineWarning").html("Can't be blank.");
			}
			break;
		default:
			$('#confirmModal').modal('show');
			$('#updateModal').modal('hide');
	}

});

//status of modal
function update_status(request){
	var requestId = request.name
	//console.log('update status req id: '+requestId)
	var statusUpdate = document.getElementById("statusUpdate");
	document.getElementById("statusUpdate").style.display="block";
	document.getElementById("statusSpan").style.display="block";
	document.getElementById("defectiveTitle").style.display="none";
	document.getElementById("submitUpdate").disabled = false;
	switch(statusUpdate.options[ statusUpdate.selectedIndex ].value){
	 	case "released":
	 		hasAuthorized(requestId);
	 		document.getElementById("releasedContent").style.display="block";
	 		document.getElementById("declinedContent").style.display="none";
	 		document.getElementById("defectiveContent").style.display="none";
	 		break;
	 	case "defective":
	 		document.getElementById("releasedContent").style.display="none";
	 		document.getElementById("declinedContent").style.display="none";
	 		document.getElementById("defectiveContent").style.display="block";
	 		//console.log("defective id " + requestId)
			document.getElementById("moreitemsbtn").value = requestId;
			defectiveGetItems(requestId)
	 		break;
	 	case "declined":
	 		document.getElementById("releasedContent").style.display="none";
	 		document.getElementById("declinedContent").style.display="block";
	 		document.getElementById("defectiveContent").style.display="none";
	 		break;
	 	default:
	 		document.getElementById("releasedContent").style.display="none";
	 		document.getElementById("declinedContent").style.display="none";
	 		document.getElementById("defectiveContent").style.display="none";
	}
}

//allow submit??
/*function allowSubmit(){
	var currentStatus = document.getElementById('statusUpdate').value
	if (currentStatus == "Released"){
		if (document.getElementById('radio3').checked ==true){

		}
	}
}*/
window.setTimeout(function () {
    $(".alert-success").fadeTo(500, 0).slideUp(500, function () {
        $(this).remove();
    });
}, 5000);

function hasAuthorized(requestId){
	//checks if request has set anyone to claim other than requestor
	//assuming lab = chemistry

	//var lab = "chemistry";
	var database = firebase.database().ref(laboratory);
	//console.log('checking autho + req' + requestId)
	database.child("/request").orderByChild("requestID").equalTo(requestId).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var updateThisChild = childSnapshot.key;
					var user = childSnapshot.val().user;
					
					//console.log('checking if has authorized others');
					var proxyID = childSnapshot.val().proxyID;
					//console.log("has authorized proxy: "+ proxyID);
					if (proxyID == "" || proxyID == " "){
						document.getElementById('radio2').disabled = true;
						document.getElementById('radio2').checked = false;
					}else{
						document.getElementById('radio2').disabled = false;
					}
					var details = childSnapshot.val().details;
					var status = childSnapshot.val().status;
					//console.log(details)
					if(status == "released"){
						if(details == "" || details == " "){
							//console.log('has deets')
							document.getElementById("student_id").value = "";
							document.getElementById("student_id").innerHTML = "";
							document.getElementById('radio2').checked = true;
							notOther('authorized');
						}else{
							//console.log('no deets');
							if(details == user){
								document.getElementById('radio1').checked = true;
							}else{
								document.getElementById('radio3').checked = true;
								document.getElementById("student_id").value = details.substring(0, 4) + "-" + details.substring(4);
								releasedOtherCheck();					
							}
						}
					}else{				
						document.getElementById("student_id").value = "";
						document.getElementById("student_id").innerHTML = "";
						document.getElementById('radio1').checked = true;
					}
					document.getElementById('studentIdWarning').innerHTML = "";
					document.getElementById('studentIdWarning').value = "";
			});
	})

}
function notOther(chosen){
	//var lab = "chemistry";
	var requestID = document.getElementById("statusUpdate").name;
	document.getElementById('studentIdWarning').innerHTML = "";
	document.getElementById('studentIdWarning').value = "";
	if(chosen == "authorized"){
		firebase.database().ref(laboratory+"/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(snapshot){
					snapshot.forEach(function(childSnapshot) {
						var proxyID = childSnapshot.val().proxyID;
						//console.log('proxy'+proxyID)
						document.getElementById("releasedTo").value = proxyID;
						firebase.database().ref("users").orderByChild("userID").equalTo(proxyID).once("value").then(function(snapshot){
							snapshot.forEach(function(childSnapshot) {
								var data = snapshotToArray(childSnapshot);
								//console.log("naem"+data[1])
								document.getElementById("releasedTo").name = data[1];
							});
						});
					});
				});
	}
	document.getElementById('student_id').value = "";
	document.getElementById('releaseConfirmUpdate').value= "true";

}
//check if the other option is correct.
function releasedOtherCheck(){
	document.getElementById('radio3').checked = true;
	var student_id = document.getElementById("student_id").value;
	if (student_id.length == 10 ){
		var splits = student_id.split(/(-)/);
	    if (splits.length == 3){
	     	var year = splits[0];
	      	var id = splits[2];
			var yearpattern = /^20[0-1][0-8]$/;
			var idpattern = /^[0-9]{5}$/;
			var idFound = id.match(idpattern);
			var yearFound = year.match(yearpattern);
			document.getElementById("studentIdWarning").value = student_id;
			if (!idFound){
				document.getElementById("studentIdWarning").innerHTML = "Invalid unique id.";
				document.getElementById("studentIdWarning").classList.add("error");
				document.getElementById('releaseConfirmUpdate').value = "false";
				//console.log(id);
			}
			else if (!yearFound){
				document.getElementById("studentIdWarning").innerHTML = "Invalid year.";
				document.getElementById("studentIdWarning").classList.add("error");
				document.getElementById('releaseConfirmUpdate').value = "false";
			}
			else{
					document.getElementById("studentIdWarning").innerHTML = "No such user.";
					document.getElementById("studentIdWarning").classList.add("error");
					document.getElementById("releaseConfirmUpdate").value = "false";
					var requestID = document.getElementById("statusUpdate").name;

					firebase.database().ref(laboratory+"/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(snapshot){
						snapshot.forEach(function(childSnapshot) {
							var user = childSnapshot.val().user;
							if(user!= year+id){
								firebase.database().ref("users").orderByChild("userID").equalTo(year+id).once("value").then(function(snapshot){
									snapshot.forEach(function(childSnapshot) {
										var data = snapshotToArray(childSnapshot);
										if(data[0] == "student"){
											document.getElementById("studentIdWarning").innerHTML = "Found user: "+data[1];
											document.getElementById("studentIdWarning").classList.remove("error");
											document.getElementById("releasedTo").value = year+id;
											document.getElementById("releasedTo").name = data[1];
											document.getElementById("releaseConfirmUpdate").value = "true";
										}
									});
								});
							}else{
								document.getElementById("studentIdWarning").innerHTML = "New proxy the same as requestor. Choose the first option instead.";
								document.getElementById("studentIdWarning").classList.add("error");
								document.getElementById('releaseConfirmUpdate').value = "false";
							}
						});
					});
			}
		}
	}
	else{
		document.getElementById("studentIdWarning").innerHTML = "Something missing. Format: 20XX-XXXX";
		document.getElementById("studentIdWarning").classList.add("error");
		document.getElementById('releaseConfirmUpdate').value = "false";
		//console.log(student_id.length)
	}

}

//get glassware items in request
function defectiveGetItems(requestID){
	//assuming lab = chemistry
	//var lab = "chemistry";
	var items;
	var list = [];
	//clear any defective table
	var df = countDefectiveTable();
	//alert(df)
	if (df > 1){
		for(i = df-1; i>=1;i--){
			document.getElementById("defectiveTable").deleteRow(i);
		}
	}
	document.getElementById("defective-comments").value = ""
	var database = firebase.database().ref(laboratory);
	//console.log('getting glassware items in request id: ' + requestID);
	database.child("/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var data = snapshotToArray(childSnapshot);
					items = data[0]
					
					//console.log("asd")
					if(data.length == 9){
						document.getElementById("defective-comments").value = data[1]
						var table = document.getElementById("defectiveTable");
					    var max = document.getElementById("maxItems")
					    max.innerHTML = ""

					    for(i=0;i<=data[2].length-1;i++){
					    	if (data[2][i]["itemID"].split('-')[0] ==  "gla"){
					    		max.innerHTML += data[2][i]["name"]+":"+data[2][i]["quantity"]+":"+data[2][i]["itemID"] + ",";
					    		//data[0][i]["name"]+":"+data[0][i]["max"]+",";
					    		
					    	}
					    }
					    for (i=0;i<=data[0].length-1;i++){
					    	//max.innerHTML += data[0][i]["name"]+":"+data[0][i]["max"]+",";
					    	for(j=0;j<=data[0][i]["items"].length-1;j++){
					    		var totalRowCount = countDefectiveTable();
							    var row = table.insertRow(totalRowCount);
							    var item = row.insertCell(0);
					    		var qty = row.insertCell(1);
							    var status = row.insertCell(2);
					    		var del = row.insertCell(3);	
					    		//console.log(data[0][i]["items"][0]["quantity"] + " "+requestID)
					    		var options = ""
					    		for(k = 0; k<data[2].length;k++){
					    			if(data[0][i]["id"] != data[2][k]['itemID'] && data[2][k]['itemID'].split("-")[0] == "gla"){
					    				options+= '<option>'+data[2][k]['name']+'</option>';
					    			}
					    		}
					    		item.innerHTML += '<select id="defectiveitems'+totalRowCount+'" onchange="updateItem(id)" class="form-control" style="overflow:hidden"><option>'+data[0][i]["name"]+'</option>'+options+'</selected>';
					    		qty.innerHTML += '<select id="defectivequantities'+totalRowCount+'" onclick="updateQty(id)" class="form-control" style="overflow:hidden"><option>'+data[0][i]["items"][j]["quantity"]+'</option></selected>';
					    		if (data[0][i]["items"][j]["status"] == "missing"){
					    			status.innerHTML = '<div class="custom-controls-stacked"><label class="custom-control custom-radio"><input id="missing'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input" checked><span class="custom-control-indicator"></span><span class="custom-control-description" >Missing</span></label><label class="custom-control custom-radio"><input id="defective'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description">Defective</span></label></div>'
					    			//'<form name="defectivestatus"><div class="form-check-inline custom-controls-stacked"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio'+totalRowCount+'" checked>Missing</label></div><div class="form-check-inline"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Defective</label></div></form></center>';
					    		    
					    		}else{
					    			status.innerHTML = '<div class="custom-controls-stacked"><label class="custom-control custom-radio"><input id="missing'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input" ><span class="custom-control-indicator"></span><span class="custom-control-description" >Missing</span></label><label class="custom-control custom-radio"><input id="defective'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input" checked><span class="custom-control-indicator"></span><span class="custom-control-description">Defective</span></label></div>'
					    			//status.innerHTML = '<div class="form-check-inline custom-controls-stacked"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio'+totalRowCount+' ">Missing</label></div><div class="form-check-inline"><label class="form-check-label"><input type="radio" class="form-check-input" name="optradio'+totalRowCount+'" checked>Defective</label></div></center>';
					    		}
   								del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-danger btn"><i class="fa fa-trash"></i></button>';
					    		updateDefectiveTable();
					    	}
					    }
					    document.getElementById("moreItemStatus").innerHTML ='<button hidden tabindex="0" class="btn btn-info" data-toggle="popover" data-trigger="focus" title="Available Items:" data-content="'+max.innerHTML+'" style="display:hidden"><i style="font-size:25px;" class="fas fa-info-circle"></i></button>'
					    $('[data-toggle="popover"]').popover({placement: "bottom"});   
						$('.popover-dismiss').popover({
	  						trigger: 'focus'
						});
					    //='<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="aa">'+max.innerHTML+'</button>'
					    list = ["1"]
					}

					else{
						var table = document.getElementById("defectiveTable");
					    var max = document.getElementById("maxItems")
					    max.innerHTML = ""

					    for(i=0;i<=data[1].length-1;i++){
					    	if (data[1][i]["itemID"].split('-')[0] ==  "gla"){
					    		max.innerHTML += data[1][i]["name"]+":"+data[1][i]["quantity"]+":"+data[1][i]["itemID"]+",";
					    		//data[0][i]["name"]+":"+data[0][i]["max"]+",";
					    		
					    	}
					    }
					    if (max.innerHTML == ""){
							list="";
					    }else{
					    	document.getElementById("moreItemStatus").innerHTML ='<button tabindex="0" class="btn btn-info" data-toggle="popover" data-trigger="focus" title="Available Items:" data-content="'+max.innerHTML+'" style="display:none"><i style="font-size:25px;" class="fas fa-info-circle"></i></button>'
						    $('[data-toggle="popover"]').popover({placement: "bottom"});   
							$('.popover-dismiss').popover({
		  						trigger: 'focus'
							});
						    console.log("no defective");
							defectiveAddItem(requestID);
							list=['1']
					    }
					}
					
					defectiveSorter(list)
		});
	});
}


//limits what should be added
function defectiveSorter(items){
	//everything in items are only glassware
	//defectiveGetItems(requestID);
	
	if (items == ""){
		document.getElementById("defectiveContent").style.display = 'none';
		document.getElementById("defectiveTitle").style.display = 'block';
		document.getElementById("submitUpdate").disabled = true;
	}else{
		document.getElementById("defectiveTitle").style.display = 'none';
		document.getElementById("submitUpdate").disabled = false;
	}
}

//get defective/missing items of a request
function getDefectiveofRequest(requestID){
	var database = firebase.database().ref(laboratory);
	database.child("/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
					var data = snapshotToArray(childSnapshot);
					if (data.length == 9){
						//console.log("returning data, " + data[0])
						var table = document.getElementById("defectiveTable");
					    

					    for (i=0;i<data["defective"].length;i++){
					    	for(j=0;j<data["defective"][i]["items"].length;j++){
					    		var totalRowCount = countDefectiveTable();
							    var row = table.insertRow(totalRowCount);
							    var item = row.insertCell(0);
					    		var qty = row.insertCell(1);
							    var status = row.insertCell(2);
					    		var del = row.insertCell(3);	

					    		item.innerHTML = '<select id="defectiveitems" class="form-control" style="overflow:hidden">'+data["defective"][i]["id"]+'</selected>';
					    		qty.innerHTML = '<select id="defectiveqty" class="form-control" style="overflow:hidden">'+data["defective"][i]["items"][j]["quantity"]+'</selected>';
					    		if (data["defective"][i]["items"][j]["quantity"] == "missing"){
					    			status.innerHTML = '<div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+' selected">Missing  </label></div><div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Defective  </label></div></center>';
					    		}else{

					    			status.innerHTML = '<div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Missing  </label></div><div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'" selected>Defective  </label></div></center>';
					    		}
   								del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-light btn">X</button>';
					    		updateDefectiveTable();
					    	}
					    }
						return data[0]
					}else{
						return null
					}
			});
	});
}

//adding more items for defective list
function defectiveAddItem(requestID){
    //alert("ADDING ITEM" + requestID.value)
    //check if all the items are maxed out
    //if they are maxed out, remove/disable add button

	var table = document.getElementById("defectiveTable");
    var totalRowCount = countDefectiveTable();
    var row = table.insertRow(totalRowCount);
    var item = row.insertCell(0);
    var qty = row.insertCell(1);
    var status = row.insertCell(2);
    var del = row.insertCell(3);
	

	var database = firebase.database().ref(laboratory);
	database.child("/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
			var data = snapshotToArray(childSnapshot);
			var i = 1;
			var options = ""
			if(data.length == 9){
				i = 2;
			}
			for(k = 0; k<data[i].length;k++){
			    if(data[i][k]['itemID'].split("-")[0] == "gla"){
			    	options+= '<option>'+data[i][k]['name']+'</option>';
			    }
			}
			item.innerHTML += '<select id="defectiveitems'+totalRowCount+'" onchange="updateItem(id)" class="form-control" style="overflow:hidden"><option value="0" selected>Choose Item</option>'+options+'</selected>';
			qty.innerHTML += '<select id="defectivequantities'+totalRowCount+'" onclick="updateQty(id)" class="form-control" style="overflow:hidden"><option value="0" selected>0</option></selected>';
			status.innerHTML = '<div class="custom-controls-stacked"><label class="custom-control custom-radio"><input id="missing'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description" >Missing</span></label><label class="custom-control custom-radio"><input id="defective'+totalRowCount+'" name="radio-stacked'+totalRowCount+'" type="radio" class="custom-control-input"><span class="custom-control-indicator"></span><span class="custom-control-description">Defective</span></label></div>'
			del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-danger btn"><i class="fa fa-trash"></i></button>';
			updateDefectiveTable();
				
		});
	});
    
    /*qty.innerHTML = '<select id="defectivequantities'+totalRowCount+'" onclick="updateQty(id)" class="form-control">  <option>0</option></select>';
    status.innerHTML = '<div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Missing  </label></div><div class="form-check-inline">  <label class="form-check-label">    <input type="radio" class="form-check-input" name="optradio'+totalRowCount+'">Defective  </label></div></center>';
    del.innerHTML = '<button id="'+totalRowCount+'" onclick="defectiveDeleteItem(id)" class="btn-light btn">X</button>';
	*/
}

function updateItem(rowID){
	id = rowID.split("s")[1]

	if(document.getElementById(rowID).options[0].value ==  "0"){
		document.getElementById(rowID).remove(0);
	}

	//when changing the dropdown choice for the item
	//set qty to 0 and missing/defective to unchecked
	qty = document.getElementById("defectivequantities"+id)
	qty.innerHTML = "";
	qty.options[0] = new Option("0","0");
	qty.value = "0";

	missing = document.getElementById("missing"+id);
	defective = document.getElementById("defective"+id);
	missing.checked = false
	defective.checked = false

	//update all qty for rows with the same item
	item = document.getElementById("defectiveitems"+rowID);
	selected = item.options[ item.selectedIndex ].value

	for(i = 1; i<= countDefectiveTable()+1; i++){
		choice = document.getElementById("defectiveitems"+i);
		if(choice.options[choice.selectedIndex].value == selected){
			updateQty("defectiveitems"+i)
		}
	}
}

function retrieveDefectiveData(){
	var totalRowCount = countDefectiveTable();
	var defectiveitems = {};
	var final = []
	for (row = 1; row<=totalRowCount-1;row++){
		//check if default
		count = 1;
		item = document.getElementById("defectiveitems"+row);
		if(!(item.options[ item.selectedIndex ].value in defectiveitems) ){
			defectiveitems[item.options[ item.selectedIndex ].value] = [{"quantity": 0,"status":"missing"},{"quantity": 0,"status":"defective"}];
		}
		//else{
			//find the match, check if missing or defective
			qty = document.getElementById("defectivequantities"+row);
			qtyValue = parseInt(qty.options[ qty.selectedIndex ].value)
			if(document.getElementById("missing"+row).checked == true){
				//add to missing
				count = 0;
			oldValue = defectiveitems[item.options[ item.selectedIndex ].value][count]["quantity"] ;
			newval = qtyValue + parseInt(oldValue); 
			defectiveitems[item.options[ item.selectedIndex ].value][count] = {"quantity":newval,"status":"missing"}
			}else{

			oldValue = defectiveitems[item.options[ item.selectedIndex ].value][count]["quantity"] ;
			newval = qtyValue + parseInt(oldValue); 
			defectiveitems[item.options[ item.selectedIndex ].value][count] = {"quantity":newval,"status":"defective"}
		//	}

		}
	}
	var list = ""


	for (var item in defectiveitems){
		if(defectiveitems[item][0]["quantity"] == 0){
			defectiveitems[item].splice(0,1)
		}else if (defectiveitems[item][1]["quantity"] == 0){
			defectiveitems[item].pop();
		}
		var id;
		var maxItems = document.getElementById("maxItems").innerHTML.split(",");
		for(var i = 0; i<maxItems.length;i++){
			if(maxItems[i].split(":")[0] == item){
				id = maxItems[i].split(":")[2];
			}
		}
		final.push({"name":item, "itemID": id, "items": defectiveitems[item]})
		for (var i =0; i<defectiveitems[item].length;i++){
			list += "<ul><li>Item Name: "+ item + "</li><li>Item Status: " + defectiveitems[item][i]["status"] + "</li><li>Quantity: " + defectiveitems[item][i]["quantity"] + "</li></ul><br>" ;
		}

	}
	return [final, list]

}
function validateDefective(){
	//check each row
	//return false if:
			// no checked status
			// has choose default
	var totalRowCount = countDefectiveTable();
	for (row = 1; row<=totalRowCount-1;row++){
		//check if default
		item = document.getElementById("defectiveitems"+row);
		if(item.options[ item.selectedIndex ].value == "0"){
			return "items";
		}
		//check if there is a qty == 0
		qty = document.getElementById("defectivequantities"+row);
		if(qty.options[ qty.selectedIndex ].value == "0"){
			return "qty";
		}
		//check status
		if(document.getElementById("missing"+row).checked == false && document.getElementById("defective"+row).checked == false){
			return "status";
		}
	}
	return true;
}
function isMaxed(){
	num = document.getElementById("maxItems").innerHTML;
	max = num.split(",");
	totalRowCount = countDefectiveTable();
	count = 0;

	//for each id in maxItems, check if maxed
	for(item = 0; item<max.length-1; item++){
		id = max[item].split(":")[0];
		limit = max[item].split(":")[1];
		//check all the qty rows if equal to id
		itemCount = 0;
		for(row = 1; row<=totalRowCount-1; row++){
			chosenItem = document.getElementById("defectiveitems"+row);
			if (chosenItem.options[ chosenItem.selectedIndex ].value != null){
				selected = chosenItem.options[ chosenItem.selectedIndex ].value
			}
			if(selected == id){
				qty = document.getElementById("defectivequantities"+row);
				itemCount += parseInt(qty.options[ qty.selectedIndex ].value)
			}
		}
		if(itemCount==limit){
			count+=1;
		}
	}
	if(count == max.length-1){
		return true;
	}
	return false;
}

function updateQty(rowID){
	num = document.getElementById("maxItems").innerHTML;
	
	max = num.split(",");

	if(isMaxed()){
		document.getElementById("moreitemsbtn").disabled = true;
	}else{
		document.getElementById("moreitemsbtn").disabled = false;
	}
	id = rowID.split("s")[1]
	itemMax = 0
	quantity = document.getElementById("defectivequantities"+id);
	items = document.getElementById("defectiveitems"+id);

	selected = items.options[ items.selectedIndex ].value
	totalRowCount = countDefectiveTable();
	count = 0
	for(i = 1; i<totalRowCount;i++){
		temp = document.getElementById("defectiveitems"+i);
		tempselected = temp.options[temp.selectedIndex].value
		if(selected == tempselected){
			qty = document.getElementById("defectivequantities"+i);
			count += parseInt(qty.options[qty.selectedIndex ].value)
		}
	}
	for (i = 0; i<max.length;i++){
		temp = max[i].split(":")
		if(selected == temp[0]){
			itemMax = parseInt(temp[1])
			break
		}
	}
		
	rem = itemMax - count;
	selectedQuantity = parseInt(quantity.options[ quantity.selectedIndex ].value)
	quantity.innerHTML=""
		
	if (rem+selectedQuantity == 0){
		quantity.options[quantity.options.length] = new Option(0, 0);
	}else{
		for(i = 1;i<=rem+selectedQuantity;i++){
			quantity.options[quantity.options.length] = new Option(i, i);
			if(selectedQuantity == i){
				quantity.value = i
			}
		}
	}
	if(isNaN(selected)){
		selected = 0;
	}
	

}
function defectiveDeleteItem(row){
	var count = countDefectiveTable();

	if (count==2){
		document.getElementById('itemsheader').style.display = "none";
		document.getElementById("defectiveTableWarning").innerHTML = "Can't delete all the items.";
	}
	else{
		document.getElementById("defectiveTable").deleteRow(row);
		//update all qty
		updateDefectiveTable();
		for(i = 1; i<= count+1; i++){
			updateQty("defectiveitems"+i)
		}
	}
}
function updateDefectiveTable(){
	var table = document.getElementById("defectiveTable");
    var rowCount = 1;
    var rows = table.getElementsByTagName("tr")
    for (var i = 1; i < rows.length; i++) {
        var btn = rows[i].getElementsByTagName("button")[0]
        btn.id = rowCount;
        var item = rows[i].getElementsByTagName("select")[0]
        item.id = "defectiveitems"+rowCount;
        var qty = rows[i].getElementsByTagName("select")[1]
        qty.id = "defectivequantities"+rowCount;
        var missing = rows[i].getElementsByClassName("custom-control-input")[0];
        missing.id = "missing"+rowCount;
        missing.name = "radio-stacked"+rowCount;
        var defective = rows[i].getElementsByClassName("custom-control-input")[1];
        defective.id = "defective"+rowCount;
        defective.name = "radio-stacked"+rowCount;			    			
        rowCount++;
    }
}

function countDefectiveTable(){
	var table = document.getElementById("defectiveTable");
	var totalRowCount = 0;
    var rowCount = 0;
    var rows = table.getElementsByTagName("tr")
    for (var i = 0; i < rows.length; i++) {
        totalRowCount++;
        if (rows[i].getElementsByTagName("td").length > 0) {
            rowCount++;
        }
    }

    document.getElementById("defectiveTableWarning").innerHTML = "";
    return totalRowCount;

}

$(document).on("change", "input[type=radio][name='urgency']", function(event){
	filterCat = this.value;
	var user = firebase.auth().currentUser;
	var uid = user.uid

	var usersRef = firebase.database().ref("0/users/" + uid);
	var userId = firebase.auth().currentUser.uid;
	loadItems();

});
$(document).on("change", "input[type=radio][name='request_status']", function(event){
	referenceToOldestKey = '';
	//change to loader
	newRow = 1
	shouldFire = false
	requestLeftToGet = 6;
    document.getElementById('processing-items-div-pcd').innerHTML = "";
	getRequests(this.value);
	$('#processing-items-div-pcd').bind('scroll',infinite_scroll);

});


