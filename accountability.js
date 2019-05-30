function accountability(){
	//show request_div and breadcrumb at request tab
	document.getElementById("request_div").style.display="none";
	document.getElementById("request").classList.remove("active");
	//other tabs: inactive
	document.getElementById("history").classList.remove("active");
	document.getElementById("inventory").classList.remove("active");
	document.getElementById("history_div").style.display="none";
	document.getElementById("inventory_div").style.display="none";
	document.getElementById("accountability_div").style.display="block";
	document.getElementById("accountability").classList.add("active");
	search_accountability_items()
}

function updateAccountability(status, userID, requestID){
	//status = if completed then resolved, else unresolved
	//enters here if user already exists in accountabilities
	
	if(status == "resolved"){
		var removeAccountability = firebase.database().ref(""+laboratory+"/accountability/"+	userID + "/requests/" + requestID);
		removeAccountability.remove()

	}else{
		var accountability = {
		    "status" : status
		}	

		// Write the new post's data simultaneously in the posts list and the user's post list.
		var updates = {};
		updates[laboratory+'/accountability/' + userID + '/requests/'+requestID] = accountability;
		firebase.database().ref().update(updates);
	}  
}

function user_filtering_acct(element) {
	
	

	//user must belong only to logged in laboratory
	var regex = new RegExp( search_query_acct, 'gi' );
	var name = element['name'].match(regex) 
	if (name == null && (element['laboratory'] == "student")){
		
		return element['userID'].match(regex)
	}else if(element['laboratory'] == "student"){
		
		return element['name'].match(regex)
	}
}

var search_query_acct = '';
$("#search_accountability").bind('input', function () {
   search_query_acct = $(this).val();
   
   search_accountability_items();
   
   
});



function search_accountability_items(){
	
	var database = firebase.database().ref(laboratory);
	
	
	document.getElementById("accountability_result").innerHTML = '<br><div class="table-responsive table-full-width"><table class="table table-hover table-striped"><thead><th>Name</th><th>Student ID</th><th>Accountability</th></thead><tbody id="accountability_result_body"></tbody></table></div>'
	var res = document.getElementById("accountability_result_body");
	var ref = firebase.database().ref("" + laboratory + "/request");

	firebase.database().ref("users").once("value").then(function(snapshot1) {
			var data = snapshotToArray(snapshot1);
			
			data = data.filter(user_filtering_acct);
			
			if(data.length == 0){
				document.getElementById("accountability_result").innerHTML = "<h3>Sorry, nothing here yet.</h3>"
			}else{

			data.forEach(function(childSnapshot1){
				
				
				var userID = childSnapshot1["userID"]
				firebase.database().ref(laboratory+'/accountability/' + userID + '/requests/').once("value",function(snaps){
					snaps.forEach(function(req){
						
						requestID = req.key;
						firebase.database().ref(laboratory+"/request").orderByChild("requestID").equalTo(requestID).once("value").then(function(req){
							req.forEach(function(childReq) {
								
								var stats = childReq.val().status;
								
								
								if(stats == "defective"){
									var items = '';
									var defectiveitems = childReq.val().defective;
									
									for(var item in defectiveitems){
										if(defectiveitems[item]['items'] == undefined){
											break;
										}
										
										
										for (var j =0; j<defectiveitems[item]['items'].length;j++){
											var innerItems = '';
											
												innerItems += "<li>Item Status: " + defectiveitems[item]['items'][j]['status'] + "</li><li>Quantity: " + defectiveitems[item]['items'][j]["quantity"] + "</li></ul><br>" ;	
											
												
											
											items += "<ul><li>Item Name: "+ defectiveitems[item]["name"] + "</li>" + innerItems;
											
										}									
									}
									res.innerHTML +="<tr><td>"+childSnapshot1['name']+"</td><td>"+childReq.val().user+"</td><td>Request ID #"+childReq.val().requestID+"<br>"+items+"</td><td></tr>";	
									
								}
							});
							if (res.innerHTML == ""){
								
								document.getElementById("accountability_result").innerHTML = "<h3>Sorry, nothing here yet.</h3>"
							}
						});

					})
				});
				
				

				});
			}
	});
        
    
}