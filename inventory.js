//filter variables with default values
var filterCat = "";
var origCat, newCat;
var orgUnit;
var order = "name";
var setOrder = "name";
var searchQueryInventory = ""
var namedir = "az"
var quandir = "Ascending Quantity";
var reverseData = false;
var validateCheck = false;
var updateThisItem = "";
	var newName = "";
	var newQuan = "";
	var newAmount = "";
	var newUnit = "";
	var newitemID = "";
	var transact = "add";
function inventory(){
	clearInterval(accountabilityloading);
	clearInterval(historyloading);

	//inventory is active show inventory div
	document.getElementById("inventory_div").style.display="block";
	document.getElementById("inventory").classList.add("active");

	//other tabs inactive
	document.getElementById("history").classList.remove("active");
	//document.getElementById("accountability").classList.remove("active");
	document.getElementById("request").classList.remove("active");

	document.getElementById("accountability_div").style.display="none";
	document.getElementById("accountability").classList.remove("active");

	//hide the divs of other tabs
	document.getElementById("request_div").style.display="none";
	//document.getElementById("accountability_div").style.display="none";
	document.getElementById("history_div").style.display="none";

    var user = firebase.auth().currentUser;
	var uid = user.uid
	
		
	var usersRef = firebase.database().ref("users/" + uid);
	var userId = firebase.auth().currentUser.uid;

	firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
	  	laboratory = (snapshot.val() && snapshot.val().laboratory) || 'Anonymous';
  	
  		filterTab()
  	
  		//loadJSONdata();
  		//setTimeout(loadItems, 5000);
	});
	
}


function viewHistoryFunc(card) {
	
	var myitem = card.id;
	var ref = firebase.database().ref(""+ laboratory);
	ref.child(""+filterCat).orderByChild("itemID").equalTo(myitem).once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
	        $("#hist-name").html("Item Name: "+ childSnapshot.val().name);
    		$("#hist-cat").html("Category: " + childSnapshot.val().category);
    	}); 
	});
	$('#item-history-modal').modal('show');
}


function updateFunc(card){
			transact = "update";
			var catDataRef = firebase.database().ref(""+ laboratory + "/inventory");
			catDataRef.once("value").then(function(snapshot) {
				var dropdown = "<select id='update-item-categories' class='form-control add-item-categories'>";
				snapshot.forEach(function(childSnapshot) {
					dropdown += "<option value='"+childSnapshot.key+"' > "+ childSnapshot.key+ "</option>";
				});
				dropdown += "</select>"
				var container = document.getElementById("update-item-categories-div");
				container.innerHTML = dropdown;
		});
			var units= "";
			units += "<select class='input-unit form-control' id='update-unit'><option value='mL'> mL</option><option value='L'> L</option><option value='g' >g</option><option value='mg'> mg</option></select>"
			var container2 = document.getElementById("update-item-unit-div");
			container2.innerHTML = units;

			setTimeout(function(){
				updateCategoryChange();
			
					
			}, 2000);

	var myitem = card.id;
	$("#" + filterCat).prop("checked", true); 
	var ref = firebase.database().ref(""+laboratory + "/inventory");
	document.getElementById("modal-confirm-summary-btn").value = myitem;
	ref.child(""+filterCat).orderByChild("itemID").equalTo(myitem).once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {

			updateThisItem = childSnapshot.key;
			var oldname = childSnapshot.val().name;
			var oldunit = childSnapshot.val().unit;
			setTimeout(function(){$("#update-unit").val(oldunit)},1000);
			var oldcat = filterCat;
		//	$("#update-name").attr("placeholder", oldname );

			document.getElementById("update-name-div").innerHTML = '<label id="update-error-name" for="update-name">Item Name</label><input type="text" name="update-name" class="form-control input-name" id="update-name" value="'+oldname+'">';
			/*
			$("#update-name").attr("defaultValue", oldname);*/
			if (oldcat == "nonmetal" || oldcat == "metal"){
				var oldamount = childSnapshot.val().amount;
			
				$("#update-amount").val(oldamount);
			}else{
				var oldquan = childSnapshot.val().quantity;
				$("#update-quantity").val(oldquan);
			}
			setTimeout(function(){
				$("#update-item-categories").val(filterCat)			
				$('#update-item-modal').modal('show');
			}, 1000);
			});
	});

				
}

//filter

$(document).ready(function(e){
    $('.search-name .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		var param = $(this).attr("href").replace("#","");
		var namedir = $(this).text();
		$('.search-name span#search_name').text(namedir);
		$('.input-group #search_param').val(param);
		setOrder = "name";
		if (namedir == "Z-A"){
			//alert("Z-A")
			reverseData = true;
		}else{
			reverseData = false;
		}
		document.getElementById("search_stock").innerText = "Stock Filter"
		quandir = "Ascending Quantity"
		hasPickedCat();
		loadItems();
	});
});
function hasPickedCat(){
	var pickedCat = document.getElementById("search_category")
	if(pickedCat.innerText == "Category Filter"){
		pickedCat.innerText = filterCat;
	}
}
$(document).ready(function(e){
    $('.search-stock .dropdown-menu').find('a').click(function(e) {
		e.preventDefault();
		var param = $(this).attr("href").replace("#","");
		quandir = $(this).text();
		//alert(quandir)
		$('.search-stock span#search_stock').text(quandir);
		$('.input-group #search_param').val(param);

		if (filterCat == "culture" || filterCat == "glassware"){
		setOrder = "quantity";
		} else{
			setOrder = "amount";
		}

		if (quandir == "Ascending Quantity"){
			//alert("ASC")
			reverseData = false;
		}else{
			reverseData = true;
		}

		document.getElementById("search_name").innerText = "Name Filter"
		namedir="A-Z"
		hasPickedCat();
		loadItems();
	});
});


$(document).on('change', '#add-item-categories', categoryChange);
$(document).on('change', '#update-item-categories', updateCategoryChange);
function categoryChange() {

    console.log("wtf");
    current = $('#add-item-categories').val();
    console.log(current)
    if (current == 'glassware' || current == 'culture') {
        $(".appa-quan").css("visibility", "visible");
        $(".appa-quan").css("display", "block");
        $(".chem-quan").css("display", "none");
        $(".chem-quan").css("visibility", "hidden");
    }
    else{
        $(".chem-quan").css("visibility", "visible");
         $(".chem-quan").css("display", "block");
          $(".appa-quan").css("display", "none");
          	$(".appa-quan").css("visibility", "hidden");
    }
    $("#error-quantity").html("Quantity");
    $("#error-amount").html("Amount");


}

function updateCategoryChange() {

     console.log("updateCategoryChange");
    current = $('#update-item-categories').val();
    console.log(current)
    if (current == 'glassware' || current == 'culture') {
        $(".appa-quan").css("visibility", "visible");
        $(".appa-quan").css("display", "block");
        $(".chem-quan").css("display", "none");
        $(".chem-quan").css("visibility", "hidden");
    }
    else{
        $(".chem-quan").css("visibility", "visible");
         $(".chem-quan").css("display", "block");
          $(".appa-quan").css("display", "none");
          	$(".appa-quan").css("visibility", "hidden");
    }
    $("#error-quantity").html("Quantity");
    $("#error-amount").html("Amount");

}
/*
$(document).on("change", "input[type=radio][name='add-item-categories']", function(event){

    console.log(this.value);
    if (this.value == 'apparatus') {
        $(".appa-quan").css("visibility", "visible");
        $(".appa-quan").css("display", "block");
          $(".chem-quan").css("display", "none");
          $(".chem-quan").css("visibility", "hidden");
    }
    else if ((this.value == 'metal') || (this.value == 'nonmetal')  ){
        $(".chem-quan").css("visibility", "visible");
         $(".chem-quan").css("display", "block");
          $(".appa-quan").css("display", "none");
          	$(".appa-quan").css("visibility", "hidden");
    }
});
*/

$("#searchQueryInventory").bind('input', function () {
   searchQueryInventory = $(this).val();
   console.log(searchQueryInventory)
   //$("#history_result").text(search_query);
   loadItems();
});

/*$( "#search_inventory").click(function() {
	searchQueryInventory = $("#searchQueryInventory").val();

	//loadJSONdata()
	loadItems();
});*/

function deleteItem(){
	var deleteRef = firebase.database().ref(""+laboratory+"/inventory/"+	filterCat + "/" + updateThisItem);
	deleteRef.remove()
	//alert("item deleted")
	$('#update-item-modal').modal('hide');
	loadItems();

}


$( "#view-in-list").click(function() {
	window.open('inventory-list.html', '_blank')
});


$( "#add-item-btn").click(function(){


	loadAddItem(laboratory);
});
//clear form for adding/updating an item
function clearItemForm(){
	
	    $("#error-name").html("Name");
		$("#error-amount").html("Amount");
	    $("#error-unit").html("Unit");
	    $("#error-quantity").html("Quantity");
	    $("#item-name").attr("value", "dic");
		$("#item-amount").attr("value", 0);
		$("#item-quantity").attr("value",0);

		$("#update-name").attr("value", "");
		//$("#update-name").attr("placeholder", "");
		$("#update-amount").val(0);
		$("#update-quantity").val(0);

	    $("#update-error-name").html("Name");
		$("#update-error-amount").html("Amount");
	    $("#update-error-unit").html("Unit");
	    $("#update-error-quantity").html("Quantity");

	    $('#add-item-modal').find('input').val('');
		$('#add-item-modal').find('span').html('');
		$('#update-item-modal').find('input').val('');
		$('#update-item-modal').find('span').html('');

}
function createItemHistory(historyID,text){
	var user = firebase.auth().currentUser;
	var uid = user.uid
	//asume laboratory = chemistry
	//var lab = "chemistry";
	var database = firebase.database().ref(laboratory);
	showNotification("Added a new item to inventory.");

	var timestamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
					dateParts = (timestamp.toString()).split(" ");
					firebase.database().ref('users').child(uid)
				    .once('value')
				    .then(function(snapshot) {
				     var name = snapshot.val().name;
					var historyofItem = {
						"actions" : [{
							"action" : text,
							"timeStamp" :new Date().getTime(),
							"user": {
							"userID" : uid,
							"name" : name
							}
						}],
						"historyID" : historyID
											
					};			
					firebase.database().ref(""+laboratory+"/history/item/").push(historyofItem);
					clearItemForm()
				    });
}

function startsWithVowel(test_string){
	var vowelRegex = '^[aieouAIEOU].*'
	var matched = test_string.match(vowelRegex)
	return matched
}

function createItemID(user_input, category){
	//if it does, get the number of the found item and add 1 to the item
	//if more that one word, cut the first two letters of each word, search and add number as necessary

	var item_name = user_input.split(" ");

	var code = category+"-";
	//if one word, cut the first 3letters and search in db if the ID already exists 
	for(i = 0;i <2;i++){
		if(startsWithVowel(item_name[i])){
			//if starts with vowel, take the first three
		
			code +=item_name[i].substring(0,5)
		}else{
			//if starts with consonant, remove vowels and take first three
		
			code +=item_name[i].replace(/[aeiou]/ig,'').substring(0,5)
		}	
	}
		

	return code+"1";
}
var idToFilter = ''
function itemID_filtering(element) {
	//console.log("id to filter "+idToFilter)
	//var regex = new RegExp( idToFilter, 'gi' );
	var str = element['itemID'].toLowerCase()

	if(str.includes(idToFilter.toLowerCase())){
	    console.log(element)
	    return element
	}
    //console.log(element['historyID'].match(regex))
}
function confirmSummary(item){
	var name, category, amount, unit;
  	//quantity = $("#item-quantity").val()
  
	var value = item.name
    console.log("TRSNSACT "+transact);
	var chemicalsRef = firebase.database().ref(""+ laboratory + "/inventory"  +"/" + category);
	var addChemicals = chemicalsRef.push();

	if (transact == "add"){
		category = $("#add-item-categories").val();
		name = $("#item-name").val()
		amount = $("#item-amount").val()
      	unit = $("#item-unit").val()
      	quantity = $("#item-quantity").val()
      
    	//var itemID = category.substring(0, 3) + addChemicals.key;
		itemID = createItemID(name,category.substring(0,3))
      
	}else{
		category = $("#update-item-categories").val();
		name = $("#update-name").val()
		//name = createItemID(name,category)
      	unit = $("#update-unit").val()
      		//image = $('#item-image').get(0).files[0];
      	var itemID = document.getElementById("modal-confirm-summary-btn").value;
      
	}
    if (category == "glassware" || category == "culture"){
			newData = {
	          "category" : category,
	          "itemID" : itemID,
	          "name" : name,
	          "quantity" : item.name
	      }
	       var text = name + " added to inventory with starting quantity of " + item.name;

	}else{
			newData = {
	          "category" : category,
	          "itemID" : itemID,
	          "name" : name,
	          "amount" : item.name,
	          "unit" : unit
	      }
	      var text = name + " added to inventory with starting amount of " + item.name + " " + unit;
	}
   	

    if (transact == "add"){ 
    	
			//var addChemicals = chemical.sRef.push();
			//addChemicals.set(newData);
			//
			idToFilter = itemID
			category = $("#add-item-categories").val();
			firebase.database().ref(laboratory+"/inventory/").child(category).orderByChild('itemID').once('value').then(function (snapshot){
			
				snapshot = snapshotToArray(snapshot)
				snapshot = snapshot.filter(itemID_filtering);

				if(snapshot.length == 0){
				
					createItemHistory(itemID,text);
					firebase.database().ref(laboratory+"/inventory/"+category).push(newData);
				}else{
				
				
					last = snapshot[snapshot.length-1]['itemID']
				
					var last = parseInt(last.substr(-1)) + 1
					var newCode = itemID.slice(0, -1) + last;
				
					newData = {
				          "category" : category,
				          "itemID" : newCode,
				          "name" : name,
				          "amount" : item.name,
				          "unit" : unit
				      }
				    createItemHistory(newCode,text);
					firebase.database().ref(laboratory+"/inventory/"+category).push(newData);
				}
			})

		
			loadItems();
			$('#add-item-modal').modal('hide')
	}else{
	//var updateKey = firebase.database().ref(""+ lab + "/inventory" + "/" + filterCat).push().key;
	origCat = filterCat;
	//console.log(
	var changes = '';
	/*if (origCat == category){*/
		
		//lab= "chemistry";
		firebase.database().ref(""+laboratory + "/inventory/"+filterCat).orderByChild("itemID").equalTo(itemID).once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
			
				updateThisItem = childSnapshot.key;
				data=snapshotToArray(childSnapshot)
			
				var oldcat = filterCat;
				cat = $("#update-item-categories").val();
				//name = $("#update-name").val()
		      	unit = $("#update-unit").val()
			

				var oldCatWithUnit = false;
				var newCatWithUnit = false;
				//check changes
				switch(oldcat){
					case 'culture':
					case 'glassware':
						oldCatWithUnit = false; break;
					default : oldCatWithUnit = true;
				}

				switch(category){
					case 'culture':
					case 'glassware':
						newCatWithUnit = false; break;
					default : newCatWithUnit = true;
				}
				
				if (oldCatWithUnit != newCatWithUnit){
					if(category == "glassware" || category == "culture"){
						if(data[3]!=name){
							changes+="Name changed from "+ data[3] +" to " + name + "<br>";
						}
						changes+="Quantity changed to " + value + "<br>";
					}else{
						if(data[2]!=name){
							changes+="Name changed from "+ data[2] +" to " + name + "<br>";
						}
						changes+="Amount changed to " + value +"<br>";
						changes+="Unit changed to " + unit + "<br>";
					}
				}else{
					if (oldcat != "culture" && oldcat != "glassware" ){
						if(data[3]!=name){
							changes+="Name changed from "+ data[3] +" to " + name + "<br>";
						}
						var oldamount =data[0];
						//amount = $("#update-amount").val()
						amount =  value
					
						if(oldamount!=amount){
							changes+="Amount changed from "+ oldamount +" to " + amount + "<br>";
						}
						var oldunit = data[4]
						if(oldunit!=unit){
						changes+="Unit changed from "+ oldunit +" to " + unit + "<br>";
					}
					}else{
						if(data[2]!=name){
							changes+="Name changed from "+ data[2] +" to " + name + "<br>";
						}
						var oldquan = data[3];
						quantity =  value
					
						if(oldquan != quantity){
							changes+="Quantity changed from "+ oldquan +" to " + quantity + "<br>";
						}
					}
				}
			
				updateItemHistory(itemID,changes);
				

				if(category != origCat){
					changes+="Category changed from "+ origCat +" to " + category + "<br>";
					newitemID = itemID.split("-")[1];
					newHistoryID = category.substring(0, 3) + "-"+newitemID;
				
					if(category == "glassware" || category == "culture"){
						newData = {
				          "category" : category,
				          "itemID" : newHistoryID,
				          "name" : name,
				          "quantity" : value
				        }
				  	}else{
					  	newData = {
				          "category" : category,
				          "itemID" : newHistoryID,
				          "name" : name,
				          "amount" : value,
				          "unit" : unit
				        }
				  	}
				  	//change item id in history


					var deleteRef = firebase.database().ref(""+laboratory+"/inventory/"+	origCat + "/" + updateThisItem);
					deleteRef.remove()
					alert("confirm transfer to category")
					firebase.database().ref(""+laboratory+"/inventory/"+category).push(newData);
					changeHistoryID(itemID,newHistoryID)
					
				}
				else{
					var updates = {}
					updates[""+laboratory+"/inventory/"+filterCat + "/" + updateThisItem] = newData;
					firebase.database().ref().update(updates);
				}
			});
		
		
		});

	/*}
	else{

		var deleteRef = firebase.database().ref(""+laboratory+"/inventory/"+	origCat + "/" + updateThisItem);
		deleteRef.remove()
		alert("confirm transfer to category")
		var addRef = firebase.database().ref(""+ laboratory + "/inventory"  +"/" + category);
		var item = addRef.push(newData);
	}*/


	
	$('#update-item-modal').find('input').val('');
	loadItems();
	}

	//console.log("you bebeh");
	
	$('#item-summary-modal').modal('hide')
	
	$('#alertModal').modal('show')
	/*if (transact == "add"){
		$('#add-item-modal').find('input').val('');
		$('#add-item-modal').find('span').html('');	
	}else{
		$('#update-item-modal').find('input').val('');
		$('#update-item-modal').find('span').html('');
	}*/
	
	
}
$(document).on("click", "#modal-edit-summary-btn", function(event){

	$("#add-item-modal").find("span").html("");
	$("#update-item-modal").find("span").html("");
	clearItemForm();
	validateCheck = false;
});



$(document).on("click", "#modal-add-btn", function(event){

	var name, category, quantity, amount, unit;
  	var name = $("#item-name").val()
    var category = $("#add-item-categories").val();

    $("#sum-name").html("Item Name: "+ name);
    $("#sum-cat").html("Category: " + category);
    if (category == "glassware" || category == "culture"){
    	$("#sum-amount").html("");
    	$("#sum-unit").html("");
    	var quantity = $("#item-quantity").val()
    	var validateCheck = validateItem(name, category, quantity, amount, unit);
    	if (validateCheck){
    		document.getElementById("modal-confirm-summary-btn").setAttribute('name',quantity);
    		document.getElementById("modal-confirm-summary-btn").setAttribute('onclick','confirmSummary(this)');
       		$("#sum-quan").html("Quantity: " + quantity + "<br>");
    	
    		$('#item-summary-modal').modal('show');
    	}
    	else{
    		
    	}
    }else {
    	$("#sum-quan").html("");
    	var amount = $("#item-amount").val()
      	var unit = $("#item-unit").val()
    	var validateCheck = validateItem(name, category, quantity, amount, unit);
    	if (validateCheck){
      		$("#sum-amount").html("Amount: " + amount +  "<br>");
    		$("#sum-unit").html("Unit: " +unit);    		

    		document.getElementById("modal-confirm-summary-btn").setAttribute('name', "");
    		document.getElementById("modal-confirm-summary-btn").setAttribute('name', amount);
    		document.getElementById("modal-confirm-summary-btn").setAttribute('onclick','confirmSummary(this)');
      	
      		$('#item-summary-modal').modal('show');
    	}
    	else{
    			console.lofg("error in validation")
    	}
    	
    }
});

$(document).on("click", "#modal-update-btn", function(event){
	

	var name, category, quantity, amount, unit;
  	var name = $("#update-name").val()
    var category = $("#update-item-categories").val();
    console.log(category)
    $("#sum-name").html("Item Name: "+ name);
    $("#sum-cat").html("Category: " + category);
    if (category == "glassware" || category == "culture"){
    	$("#sum-amount").html("");
    	$("#sum-unit").html("");
    	var quantity = $("#update-quantity").val()
    	var validateCheck = validateItemForEdit(name, category, quantity, amount, unit);
    	if (validateCheck){
       		$("#sum-quan").html("Quantity: " + quantity + "<br>");
    	

    		document.getElementById("modal-confirm-summary-btn").setAttribute('name',quantity);
    		document.getElementById("modal-confirm-summary-btn").setAttribute('onclick','confirmSummary(this)');
    		$('#update-item-modal').modal('hide');
    		$('#item-summary-modal').modal('show');
    	}
    	else{
    		
    	}
    }else {
    	$("#sum-quan").html("");
    	var amount = $("#update-amount").val()
      	var unit = $("#update-unit").val()
    	var validateCheck = validateItemForEdit(name, category, quantity, amount, unit);
    	if (validateCheck){
      		$("#sum-amount").html("Amount: " + amount +  "<br>");
    		$("#sum-unit").html("Unit: " +unit);
      	
      		document.getElementById("modal-confirm-summary-btn").setAttribute('name',amount);
    		document.getElementById("modal-confirm-summary-btn").setAttribute('onclick','confirmSummary(this)');
      		$('#update-item-modal').modal('hide');
      		$('#item-summary-modal').modal('show');
    	}
    	else{
    		
    	}
    	
    }
});


$(document).on("click", "#modal-cancel-btn", function(event){

	$('#add-item-modal').find('input').val('');
	$('#add-item-modal').find('span').html('');
	clearItemForm();
});

$(document).on("click", "#update-modal-cancel-btn", function(event){

	$('#update-item-modal').find('input').val('');
	$('#update-item-modal').find('span').html('');
	clearItemForm();
});

function filterTab() {	
			var ref = firebase.database().ref(""+ laboratory + "/inventory");
			ref.once("value").then(function(snapshot) {
				var checks1 = "";
				var checks2 = "";
				var cat_filter = "";
				checks1 += "<label class='radio-container' id='chooseCat'>";
				checks2 += "<label class='radio-container' id='update-chooseCat'>";
				snapshot.forEach(function(childSnapshot) {
					//checks += "<input type='radio' name='categories' class='cat' value="+childSnapshot.key+" > "+ childSnapshot.key+ "</option>";
					if (childSnapshot.key == 'glassware' || childSnapshot.key == 'culture'){
						checks1 += "<label class='radio-container'>"+ childSnapshot.key +" <input type='radio' name='categories'  class='cat' value='"+ childSnapshot.key +"' checked> <span class='checkmark'></span></label>"
					}else{
					checks1 += "<label class='radio-container'>"+ childSnapshot.key +" <input type='radio' name='categories'  class='cat' value='"+childSnapshot.key+"'> <span class='checkmark'></span></label>"
					}
					checks2 += "<label class='radio-container'>"+ childSnapshot.key +" <input type='radio' name='update-categories'  class='cat' value='"+childSnapshot.key+"' id='"+childSnapshot.key+"''> <span class='checkmark'></span></label>"
					cat_filter += '<li><a href="#'+childSnapshot.key+'_filter">'+childSnapshot.key+'</a></li>';
					//checks += "<option value="+"'sadasd'"+" > "+ "'sadasd"+ "</option>";
					//checks += "asd"
					//console.log(checks1)
				
		    		filterCat = childSnapshot.key;
		    	});     	
		    console.log("new Filtercat = "+filterCat)
			
			var container = document.getElementById("inventory_category_filter");
			container.innerHTML = '<ul class="dropdown-menu" role="menu">'+cat_filter+'</ul>';
			$(document).ready(function(e){
			    $('.search-category .dropdown-menu').find('a').click(function(e) {
					e.preventDefault();
					var param = $(this).attr("href").replace("#","");
					filterCat = $(this).text();
					$('.search-category span#search_category').text(filterCat);
					$('.input-group #search_param').val(param);

					var user = firebase.auth().currentUser;
					var uid = user.uid

					var usersRef = firebase.database().ref("users/" + uid);
					var userId = firebase.auth().currentUser.uid;
					
					loadItems();


				});
			});
			var container = document.getElementById("update-categories-div");
			container.innerHTML = checks2;

			});

console.log(filterCat)
	
}
function loadAddItem(laboratory){
	transact = "add"

	var cat = ""
	var units = ""
		
			var container = document.getElementById("add-item-categories-div");
			container.innerHTML = "Loading categories..."
			
			var catDataRef = firebase.database().ref(""+ laboratory + "/inventory");
			catDataRef.once("value").then(function(snapshot) {
				var dropdown = "<select id='add-item-categories' class='form-control add-item-categories'>";
				snapshot.forEach(function(childSnapshot) {
					dropdown += "<option value='"+childSnapshot.key+"' > "+ childSnapshot.key+ "</option>";
				});
				dropdown += "</select>"
				container.innerHTML = dropdown;

				$("#add-item-categories").val(filterCat)
				categoryChange();


		});
			
			units += "<select class='input-unit form-control' id='item-unit'><option value='mL'> mL</option><option value='L'> L</option><option value='g' >g</option><option value='mg'> mg</option></select>"
			
			var container2 = document.getElementById("add-item-unit-div");
			container2.innerHTML = units;
			
			$('#add-item-modal').modal('show')
			

	
}



function loadItems(){
	document.getElementById("items-loader").style.display = "block"; 	
   	document.getElementById("items-div").style.display = "none";
	

	
	var itemsCard = "";
	//connect to db and get elements
	var ref = firebase.database().ref(""+ laboratory + "/inventory");

	ref.child(""+filterCat).orderByChild(setOrder).once("value").then(function(snapshot) {
	//convert object to array
	var data = snapshotToArray(snapshot);

	//filter data, you can edit filtering() function (i mean create your own para indi maoverridae) depende sa need mo kung pano magfilter
	data = data.filter(filtering);
	//sort data based on attribute
	data.sort(
		   function(a, b) {
		      return a[setOrder] > b[setOrder] ? 1 : -1;
		   });

	if (reverseData){
	
		data.reverse();
	}
	if (data.length == 0){
		var empty = true;
		
	}console.log("AAAAAAAAAAA "+filterCat)
	//use data.forEach for iterate sa data
	if (filterCat == "glassware" || filterCat == "culture"){
		data.forEach(function(item){
		  itemsCard += '<tr><td>'+item.name+'</td><td>'+item.quantity+' unit</td><td>'+filterCat+'</td><td><button class="btn-primary btn" id='+item.itemID+' onclick="updateFunc(this)"> Update </button><button class="btn-primary btn  view-history-btn" value='+item.itemID+' onclick="getHistory(this)"> View history </button></td></tr>';
		  
		});
	}else {
		data.forEach(function(item){
			
		  itemsCard += '<tr><td>'+item.name+'</td><td>'+item.amount+' '+item.unit+'</td><td>'+filterCat+'</td><td><button class="btn-primary btn" id='+item.itemID+' onclick="updateFunc(this)"> Update </button><button class="btn-primary btn  view-history-btn" value='+item.itemID+' onclick="getHistory(this)"> View history </button></td></tr>';
		  
		});
	}
	var container = document.getElementById("items-div");
	if(empty){
		container.innerHTML = "<h3>No item matched your request.</h3>";
	}else{
		container.innerHTML = '<div class="table-responsive table-full-width"><table class="table table-hover table-striped"><thead><th>Item Name</th><th>Quantity</th><th>Category</th><th align="center" width="30%"></th></thead><tbody>'+itemsCard+'</tbody></table></div>';
	}
	//itemsCard;


	document.getElementById("items-loader").style.display = "none"; 	
   	document.getElementById("items-div").style.display = "block";

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


function getApparatus(){

	var itemsCard = "";
	var ref = firebase.database().ref(""+ laboratory + "/inventory");
	ref.child("chemicals").child(""+filterCat).limitToFirst(10).orderByChild(setOrder).once("value").then(function(snapshot) {

	var data = snapshotToArray(snapshot);
	data = data.filter(filtering);
	
	data.forEach(function(item){
	  itemsCard += '<div class="card-div"> <span class="card item">Item Name: '+ item.name+'</span> <span class="card unit">Quantity: '+item.quantity+'</span> <span class="card cat">Category: '+item.category+'</span> <button class="btn-primary btn "> View history </button> <button class="btn-primary btn "> Update </button> </div>';

	});
	var container = document.getElementById("items-div");
	container.innerHTML = itemsCard;

	});
}



function validateItem(name, category, quantity, amount, unit){

	var valid = true;
	if (name.length == 0 ) {
	  	$("#error-name").html("Name <label class='error'>Name cannot be blank. </label>");
	  	valid = false;
	}else{
		$("#error-name").html("Name");
	}
	if (category == "culture" || category == "glassware"){
		$("#error-cat").html("Category");
		var intRegex = /^[0-9]+$/;
		var testing = intRegex.test(quantity);
	
		if (quantity.length == 0 || quantity <= 0 || testing == false){
		  	valid = false;
		  	$("#error-quantity").html("Quantity <label class='error'>Please enter a valid quantity.</label>");
		  	
		}else{
			$("#error-quantity").html("Quantity");
		}
	}else if (category == undefined){
			$("#error-cat").html("Category <label class='error'>Please choose item category.</label>");
	}else{
		$("#error-cat").html("Category");
		if (amount.length == 0 || amount <= 0){
		  	valid = false;
		  	$("#error-amount").html("Amount <label class='error'>Please enter a valid amount.</label>");
		  	
		}else{
			$("#error-amount").html("Amount");
		}
	}
    return valid;
}

function validateItemForEdit(name, category, quantity, amount, unit){

	var valid = true;
	if (name.length == 0 ) {
	  	$("#update-error-name").html("Name <label class='error'>Name cannot be blank. </label>");
	  	valid = false;
	}else{
		$("#update-error-name").html("Name");
	}
	if (category == "glassware" || category == "culture"){
		$("#update-error-cat").html("Category");
		var intRegex = /^[0-9]+$/;
		var testing = intRegex.test(quantity);

	
		if (quantity.length == 0 || quantity <= 0 || testing == false){
		  	valid = false;
		  	$("#update-error-quantity").html("Quantity <label class='error'>Please enter a valid quantity.</label>");
		  	
		}else{
			$("#update-error-quantity").html("Quantity");
		}
	}else if (category == undefined){
			$("#update-error-cat").html("Category <label class='error'>Please choose item category.</label>");
	}else{
		$("#update-error-cat").html("Category");
		if (amount.length == 0 || amount <= 0){
		  	valid = false;
		  	$("#update-error-amount").html("Amount <label class='error'>Please enter a valid amount.</label>");
		}else{
			$("#update-error-amount").html("Amount");
		}
	}
    return valid;
}

$(document).ready(function(){
    var $regexunit=/^[0-9]+$/;
    $('#item-quantity').on('keypress keydown keyup',function(){
             if (!$(this).val().match($regexunit) || $(this).val() == 0 ) {
              $("#error-quantity").html("Quantity <label class='error'>Please enter a valid quantity.</label>");
             }
           else{
                $("#error-quantity").html("Quantity");
               }
         });
    var $regexamount = /^\d*\.?\d*$/;
    $('#item-amount').on('keypress keydown keyup',function(){
             if (!$(this).val().match($regexamount) || $(this).val() == 0 ) {
              $("#error-amount").html("Amount <label class='error'>Please enter a valid amount.</label>");
             }
           else{
                $("#error-amount").html("Amount");
               }
         });
    $('#item-name').on('keypress keydown keyup',function(){
             if ($(this).val() == 0 ) {
              $("#error-name").html("Name <label class='error'>Name cannot be blank. </label>");
             }
           else{
                $("#error-name").html("Name");
               }
         });
});

$(document).ready(function(){
    var $regexunit=/^[0-9]+$/;
    $('#update-quantity').on('keypress keydown keyup',function(){
             if (!$(this).val().match($regexunit) || $(this).val() == 0 ) {
              $("#update-error-quantity").html("Quantity <label class='error'>Please enter a valid quantity.</label>");
             }
           else{
                $("#update-error-quantity").html("Quantity");
               }
               console.log("QUANTITY "+ $('#update-quantity').val())
         });
    var $regexamount = /^\d*\.?\d*$/;
    $('#update-amount').on('keypress keydown keyup',function(){
             if (!$(this).val().match($regexamount) || $(this).val() == 0 ) {
              $("#update-error-amount").html("Amount <label class='error'>Please enter a valid amount.</label>");
             }
           else{
                $("#update-error-amount").html("Amount");
				
               }
                console.log("AMOUNT "+ $('#update-quantity').val())
         });
    $('#update-name').on('keypress keydown keyup',function(){
             if ($(this).val() == 0 ) {
              $("#update-error-name").html("Name <label class='error'>Name cannot be blank. </label>");
             }
           else{
                $("#update-error-name").html("Name");
               }
         console.log("NAME "+ $('#update-name').val())
         });
});


/*$(document).on("change", "input[type=radio][name='direction']", function(event){
	if (filterCat == "glassware" || filterCat == "culture"){
		setOrder = "quantity";
	} else{
		setOrder = "amount";
	}
	quandir = this.value;
	if (quandir == "Descending Quantity"){
		reverseData = true;
	}else{
		reverseData = false;
	}

	
	loadItems();

});*/


function filtering(element) {

	var regex = new RegExp( searchQueryInventory, 'gi' );
    return element['name'].match(regex);
}




//history
function changeHistoryID(oldHistoryID,newHistoryID){
	//asume lab = chemistry
	
	var database = firebase.database().ref(laboratory);
	

	database.child("/history/item").orderByChild("historyID").equalTo(oldHistoryID).once("value").then(function(snapshot){
				snapshot.forEach(function(childSnapshot) {
				var updateThisChild = childSnapshot.key;
				firebase.database().ref(""+laboratory+"/history/item/"+updateThisChild+"/historyID").set(newHistoryID);
						
				});
			
	});
}

//update item history
function updateItemHistory(historyID,action){
	var user = firebase.auth().currentUser;
	var uid = user.uid
	
	
	var database = firebase.database().ref(laboratory);

	


	database.child("/history/item").orderByChild("historyID").equalTo(historyID).once("value").then(function(snapshot){
			
				var data = snapshotToArray(snapshot);
				var timestamp = firebase.firestore.Timestamp.fromDate(new Date()).toDate();
					dateParts = (timestamp.toString()).split(" ");
				
				snapshot.forEach(function(childSnapshot) {
				var updateThisChild = childSnapshot.key;
			
					firebase.database().ref('users').child(uid)
				    .once('value')
				    .then(function(snapshot) {
				      var name = snapshot.val().name;
				      var uname = snapshot.val().userID;
					var additionalAction = {
								"user": {
									"userID" : uid,
									"name" : name
								},
								"action": action,
								"timeStamp": new Date().getTime()
					};			
					firebase.database().ref(laboratory+"/history/item/"+updateThisChild+"/actions/").push(additionalAction);
				    });

						
				});
			
	});
}

//item deduction upon release of the item
function inventoryQuantityAddSubtract(items,symbol,rec,requestID){
	// go through all the items and access each item
	// sort their categories and deduct accordingly
	
	var database = firebase.database().ref(laboratory);
	items.forEach(function(child){
	
	
		var category = child["itemID"].split("-")[0]
		switch(category){
			case 'gla': category = "glassware"; break;
			case 'cul': category = "culture"; break;
			case 'sol': category = "solid"; break;
			case 'dye': category = "dye"; break;
			case 'non': category = "nonmetal"; break;
			case 'met': category = "metal"; break;
			case 'che': category = "chemical"; break;
		}
		if(category == "glassware" || category == "culture"){
			var num = child['quantity'];
			database.child("inventory/"+category).orderByChild("itemID").equalTo(child["itemID"]).once("value").then(function(snapshot){
			
			
					snapshot.forEach(function(childSnapshot) {
						
						var updateThisChild = childSnapshot.key;
						var data = snapshotToArray(childSnapshot);
					
						if(symbol == '-'){
							var remaining = parseInt(data[3]) - parseInt(num)
							var action = "Deducted "+ num + " from " + data[2] + "<br>" + remaining + " remaining.<br>From <a id='"+requestID+"' onclick='seeMoreRequest(this)'> this request</a>.";	
						}else{
							var remaining = parseInt(data[3]) + parseInt(num)
							var action = "Re-added "+ num + " to " + data[2] + "<br>New quantity is " + remaining + ".<br>From <a id='"+requestID+"' onclick='seeMoreRequest(this)'> this request</a>.";
						}

						firebase.database().ref(""+laboratory+"/inventory/"+category+"/"+updateThisChild+"/quantity").set(remaining);
					
						if(rec == true){
							updateItemHistory(data[1],action);
						}
					});
			});
		}else{
			database.child("inventory/"+category).orderByChild("itemID").equalTo(child["itemID"]).once("value").then(function(snapshot){
			snapshot.forEach(function(childSnapshot) {
			var num = child['amount'];
		
				var updateThisChild = childSnapshot.key;
				var data = snapshotToArray(childSnapshot);
			
				if(symbol == "-"){
					var remaining = parseFloat(data[0]) - parseFloat(num)
					
					var action = "Deducted "+ child['amount'] + " " + child['unit'] +" from " + data[3] + "<br>" + remaining + " remaining.<br>From <a id='"+requestID+"' onclick='seeMoreRequest(this)'> this request</a>.";
				}else{
					var remaining = parseFloat(childSnapshot.val().amount) + parseInt(num)
					var action = "Re-added "+ num + " " + child['unit'] + " to " + childSnapshot.val().name + " " + child['unit'] + "<br>New quantity is " + remaining + ".<br>From <a id='"+requestID+"' onclick='seeMoreRequest(this)'> this request</a>.";	
				}
				remaining = ""+remaining;
				firebase.database().ref(""+laboratory+"/inventory/"+category+"/"+updateThisChild+"/amount").set(remaining);
			
				if(rec == true){
					updateItemHistory(childSnapshot.val().itemID,action);
				}

				});
			});
		}
	});

}

//defective -> completed
function returnGlasswareFromDefective(defectivelist,requestID){
	var toReturn = []
	for(var i = 0; i < defectivelist.length;i++){
		var quantity = 0;

		for(var j = 0; j < defectivelist[i]["items"].length;j++){
			quantity = quantity + parseInt(defectivelist[i]["items"][j]["quantity"]);
		}
		var id = defectivelist[i]["itemID"]
			toReturn.push({ "itemID" : id, "quantity": quantity})
		}

	inventoryQuantityAddSubtract(toReturn,"+",true,requestID)

}



//defective -> defective
//return defectiveReturnGlassware() for every defective->defective update
function defectiveReturnGlassware(oldDefective,newDefective, items, requestID){
	//get the OK-ed in olddefectivelist and subtract it from the inventory
	
		//loop through defective items
		
			var temp = [];
			var holder =[];
			var toSubtract = [];
		
				for(var i = 0; i < oldDefective.length;i++){
					var quantity = 0;

					for(var j = 0; j < oldDefective[i]["items"].length;j++){
						quantity = quantity + parseInt(oldDefective[i]["items"][j]["quantity"]);
					}
					var id = oldDefective[i]["itemID"]
					toSubtract.push({ "itemID" : id, "quantity": quantity})
				}

				
				var temp1 = [];
				for(var i = 0; i < newDefective.length;i++){
					var quantity = 0;

					for(var j = 0; j < newDefective[i]["items"].length;j++){
						quantity = quantity + parseInt(newDefective[i]["items"][j]["quantity"]);
					}
					var id = newDefective[i]["itemID"]
					temp1.push({ "itemID" : id, "quantity": quantity})
				}
				inventoryQuantityAddSubtract(toSubtract,"+",false,requestID)
				setTimeout(function () {
				inventoryQuantityAddSubtract(temp1,"-",true,requestID);
				//returnGlassware(holder, newDefective,requestID,false)
					}, 3000);
				

	//after subtracting it, process the newdefective and items by adding to the inventory based on the new OK-ed quantity.

}



//return glassware if Released -> Completed
//return glassware if Released -> Defective
function returnGlassware(items,defective,requestID,rec){
	// pass two list, itemlist and defective list
	// if defectivelist is empty, meaning, return all glassware
	// but if defectivelist is not empty, do:
	var database = firebase.database().ref(laboratory);


	if(defective == null){
		items.forEach(function(child){
	
		var category = child["itemID"].split("-")[0]
		if(category == "gla"){
			category = "glassware";
		}else{
			category = "culture"
		}
		if(category == "glassware" || category == "culture"){
			var num = child['quantity'];
			database.child("inventory/"+category).orderByChild("itemID").equalTo(child["itemID"]).once("value").then(function(snapshot){
			
			
					snapshot.forEach(function(childSnapshot) {
						var updateThisChild = childSnapshot.key;
						var data = snapshotToArray(childSnapshot);
					
						
							var remaining = parseInt(data[3]) + parseInt(num)
							var action = "Returned "+ num + " to " + data[2] + "<br>Quantity back to " + remaining + ".<br>From <a id='"+requestID+"' onclick='seeMoreRequest(this)'> this request</a>.";
						
						firebase.database().ref(""+laboratory+"/inventory/"+category+"/"+updateThisChild+"/quantity").set(remaining);
					
						if(rec == true){
							updateItemHistory(data[1],action);
						}
					});
			});
		}
	});
	}
	
	else{
	
		//loop through defective items
			//must be glassware
			var temp = [];
			var toUpdate = [];
				//loop through defective items and get their quantity and ID;
				for(var i = 0; i < defective.length;i++){
					var quantity = 0;

					for(var j = 0; j < defective[i]["items"].length;j++){
						quantity = quantity + parseInt(defective[i]["items"][j]["quantity"]);
					}
					var id = defective[i]["itemID"]
					temp.push({ "itemID" : id, "quantity": quantity})
				}

				for(var i = 0; i<items.length; i++){
					var cat = items[i]["itemID"].split("-")[0];
					var itemID = items[i]["itemID"];
					if(cat == "gla"){
						//check if possibly defective
						var quantity = 0;
						for(var k = 0; k<temp.length;k++){
							if(temp[k]["itemID"] == itemID){
								//get itemID's qty and subtract by temp[k]qty
								quantity = parseInt(items[i]["quantity"]) - parseInt(temp[k]["quantity"]);
								break;
							}
						}
						if(quantity > 0){
							toUpdate.push({"itemID":temp[k]["itemID"], "quantity" : quantity})
						}
							
					}
				}
			
				
				if(items.length !=0){
					temp = [];
					var counter = parseInt(toUpdate.length)
					//from items, return all the nondefective glassware items
					for(var i=0;i<items.length;i++){
						var count = 0;
						var cat = items[i]["itemID"].split("-")[0];
						var itemID = items[i]["itemID"];
						if(cat == "gla"){
							for(var j=0;j<toUpdate.length;j++){
								if(itemID == toUpdate[j]["itemID"]){
									temp.push({"itemID":toUpdate[j]["itemID"], "quantity": toUpdate[j]["quantity"]})
									counter +=1
									break;
								}else{
									count++;
								}
							}
							if(count>=toUpdate.length){
								temp.push({"itemID":itemID, "quantity": items[i]["quantity"]})
								counter +=1
							}
						}
					}
				}

			
			
				returnGlassware(temp,null,requestID,rec)
			
	}
	
}
