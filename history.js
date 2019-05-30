function history(){
	//other tabs: inactive
	//hide other tab's divs
	document.getElementById("request_div").style.display="none";
	document.getElementById("request").classList.remove("active");
	document.getElementById("inventory_div").style.display="none";
	document.getElementById("inventory").classList.remove("active");

	document.getElementById("accountability_div").style.display="none";
	document.getElementById("accountability").classList.remove("active");
	document.getElementById("history_div").style.display="block";
	document.getElementById("history").classList.add("active");
   search_request_by_id()
	
}

n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
var today = y + "-" + m + "-" + d;
var history_filter_type = "request"
var start = formatDate(today+ " 00:00:00")
var end = new Date().getTime();
var newToday = getTodayDate();

//filter
$(document).ready(function(e){
    $('.search-panel .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		var param = $(this).attr("href").replace("#","");
		var concept = $(this).text();
		history_filter_type = concept;
		$('.search-panel span#search_concept').text(concept);
		$('.input-group #search_param').val(param);
		if(search_query != ""){
			search_request_by_id();
		}
		if(history_filter_type == "Date Request"){
			history_filter_type = "request";
			document.getElementById('search_history').setAttribute('value','');
			document.getElementById("start").setAttribute('value',newToday);
			document.getElementById("end").setAttribute('value',"");
			document.getElementById("start").setAttribute('min',"2015-01-01");
			document.getElementById("end").setAttribute('max',"");
			document.getElementById('datepicker_div').style.display="block";
			document.getElementById('search_history').disabled = true;
			document.getElementById("history_result").innerHTML = "<h3>Sorry, nothing here yet.</h3>";
			search_request_by_date();
		}else if(history_filter_type == "Date Item"){
			history_filter_type = "item";			
			document.getElementById('search_history').setAttribute('value','');
			document.getElementById("start").setAttribute('value',newToday);
			document.getElementById("start").innerText = today
			document.getElementById("end").setAttribute('value',"");
			document.getElementById("start").setAttribute('min',"2015-01-01");
			document.getElementById("end").setAttribute('max',"");
			document.getElementById('datepicker_div').style.display="block";
			document.getElementById('search_history').disabled = true;
			document.getElementById("history_result").innerHTML = "<h3>Sorry, nothing here yet.</h3>";
			search_request_by_date();
		}else{
			document.getElementById("history_result").innerHTML = "<h3>Sorry, nothing here yet.</h3>";
			document.getElementById('datepicker_div').style.display="none";
			document.getElementById('search_history').disabled = false;
			search_request_by_id()
			
		}
	});




});




var search_query = '';
$("#search_history").bind('input', function () {
   search_query = $(this).val();
   historyRefToLast = '';
   search_request_by_id()
});

$("#start").bind('input', function () {
   start = $(this).val();
   document.getElementById("end").setAttribute('min',start);
   start = formatDate(start + " 00:00:00")
   search_request_by_date();
});

$("#end").bind('input', function () {
   end = $(this).val();
   document.getElementById("start").setAttribute('max',end);
   end = formatDate(end + " 23:59:59")
   search_request_by_date();
});




function formatDate(givenDate){
	var datum = Date.parse(givenDate);
 	return datum;
}

function history_filtering(element) {
	var regex = new RegExp( search_query, 'gi' );
    return element['historyID'].match(regex)
}
var historyRefToLast = ''
function search_request_by_date(){
	var type= history_filter_type.toLowerCase()
	var database = firebase.database().ref(laboratory);
	
	document.getElementById("history_result").innerHTML = '<br><div class="table-responsive table-full-width"><table class="table table-hover table-striped"><thead><th width="20%">'+type+' ID</th><th width="30%">Date</th><th width="30%">Action</th><th  width="20%">User</th></thead><tbody id="history_result_body"></tbody></table></div>'
	var res = document.getElementById("history_result_body");
	var ref = firebase.database().ref("" + laboratory + "/history");

	ref.child(type).orderByChild("historyID").once("value").then(function(snapshot) {
			var data = snapshotToArray(snapshot);
			data.forEach(function(childSnapshot){
				var key = childSnapshot.key;
				firebase.database().ref("" + laboratory + "/history/"+type+"/"+key+"/actions").orderByChild('timeStamp').once('value', function(snapshots) {
					snapshots.forEach(function(childSnapshots){
						var time = childSnapshots.val().timeStamp
						if (start <= childSnapshots.val().timeStamp) {
							if(childSnapshots.val().timeStamp <= end){
								if(type == "request"){
									res.innerHTML +="<tr><td>"+childSnapshot['historyID']+"</td><td>"+formatTimestamp(time)+"</td><td>"+childSnapshots.val().action+".</td><td>"+childSnapshots.val().user.name+"</td><td><button class='btn btn-primary' id='"+childSnapshot['historyID']+"' onclick='seeMoreRequest(this)'> More Details </button></td></tr>";
								}else{
									res.innerHTML +="<tr><td>"+childSnapshot['historyID']+"</td><td>"+formatTimestamp(time)+"</td><td>"+childSnapshots.val().action+".</td><td>"+childSnapshots.val().user.name+"</td></tr>";
								}
							}
						}
						
					})
						setTimeout(function () {
						    if (res.innerHTML == ""){
								document.getElementById("history_result").innerHTML = "Sorry, nothing here."
							}
							}, 3000);

				});
				
			});
	});

	
	

}

function search_request_by_id(){
	var type= history_filter_type.toLowerCase();
	var database = firebase.database().ref(laboratory);
	document.getElementById("history_result").innerHTML = '<br><div class="table-responsive table-full-width"><table class="table table-hover table-striped"><thead><th>'+type+'</th><th width="30%">Date</th><th width="50%">Action</th><th width="20%">User</th></thead><tbody id="history_result_body"></tbody></table></div>';
	var res = document.getElementById("history_result_body");
	var ref = firebase.database().ref("" + laboratory + "/history");

	firebase.database().ref("" + laboratory + "/history/"+type).orderByChild("historyID").once("value").then(function(snapshot) {
			var data = snapshotToArray(snapshot);
			data = data.filter(history_filtering);
			data.forEach(function(childSnapshot){
				actions = childSnapshot["actions"];
				var historyStorage = ''
				count = 0;
				for(var i in actions){
					if(actions[i]["timeStamp"] == undefined){
						break;
					}

					if(type == "item"){
						res.innerHTML +="<tr><td>"+childSnapshot['historyID']+"</td><td>"+formatTimestamp(actions[i]['timeStamp'])+"</td><td>"+actions[i]["action"]+".</td><td>"+actions[i]["user"]["name"]+"</td><td><button class='btn btn-primary' value='"+childSnapshot['historyID']+"' onclick='getHistory(this)'> Full History </button></td></tr>";	
					
					}else{
						res.innerHTML +="<tr><td>"+childSnapshot['historyID']+"</td><td>"+formatTimestamp(actions[i]['timeStamp'])+"</td><td>"+actions[i]["action"]+".</td><td>"+actions[i]["user"]["name"]+"</td><td><button class='btn btn-primary' id='"+childSnapshot['historyID']+"' onclick='seeMoreRequest(this)'> More Details </button></td></tr>";	
					}
				}
			});				
	});

	firebase.database().ref("users").once("value").then(function(snapshot1) {
			var data = snapshotToArray(snapshot1);
			data = data.filter(user_filtering);
			data.forEach(function(childSnapshot1){
				ref.child(type).orderByChild("historyID").once("value").then(function(snapshot) {
						var data1 = snapshotToArray(snapshot);
						var uid = childSnapshot1['userID']
						data1.forEach(function(snap){
							var act = snap['actions'];
							for(var action in act){
								if(act[action]['user']['userID'] == uid){
										if(act[action]["timeStamp"] == undefined){
											break;
										}
										if(type == "item"){
											res.innerHTML +="<tr><td>"+snap['historyID']+"</td><td>"+formatTimestamp(act[action]['timeStamp'])+"</td><td>"+act[action]["action"]+".</td><td>"+act[action]["user"]["name"]+"</td><td><button class='btn btn-primary' value='"+snap['historyID']+"' onclick='getHistory(this)'> Full History </button></td></tr>";		
										}else{
											res.innerHTML +="<tr><td>"+snap['historyID']+"</td><td>"+formatTimestamp(act[action]['timeStamp'])+"</td><td>"+act[action]["action"]+".</td><td>"+act[action]["user"]["name"]+"</td><td><button class='btn btn-primary' id='"+snap['historyID']+"' onclick='seeMoreRequest(this)'> More Details </button></td></tr>";	
										}
									
								}
							}
							if (res.innerHTML == ""){
								document.getElementById("history_result").innerHTML = "Sorry, nothing here."
							}
						});						
				});

			});
	});

	

}

function user_filtering(element) {
	var regex = new RegExp( search_query, 'gi' );
	var name = element['name'].match(regex) 
	if (name == null && (element['laboratory'] == laboratory || element['laboratory'] == "student")){
		return element['userID'].match(regex)
	}else if(element['laboratory'] == laboratory || element['laboratory'] == "student"){
		return name
	}
}
