var addStudents = [];
var editStudents = [];
var transact = "add";
var editGroupID;
var sems = []
var classes = []
var stats = []
var loadfirst
var semChosen = ''
var classChosen = ''
var archiveChosen = 'active'
var chosenItem = ''
window.addEventListener('offline',()=> window.location.href = 'no_connection.html');



function equipment(){
     loadClasses();
}



function loadClasses(){
    firebase.database().ref("equipment/microscope/class").once("value").then(function(snapshot) {
        var checks="";
        var viewingClass = "";
        classes = []
        snapshot.forEach(function(childSnapshot) {
            viewingClass += "<li><a href='#" + childSnapshot.val().code + "'>"+childSnapshot.val().code+"</a></li>";
            
            classChosen = childSnapshot.val().code
            classes.push(classChosen)
            
        });
        group_sel_class =classes[classes.length-1]
        document.getElementById('search_class').innerText = classChosen
        
        
        
        var dropdownClass = document.getElementById("dropdownClass");
        dropdownClass.innerHTML = '<ul class="dropdown-menu" role="menu">'+viewingClass+'</ul>';
        var classTable = document.getElementById("showingClasses");
        var classList = ''
        classes.forEach(function(thisClass){
            classList += '<tr><td>'+thisClass+'</td><td><button class="btn btn-danger" id="'+thisClass+'" onclick="deleteClass(this)"><i class="pe-7s-trash"></i></button></td></tr>'
        })
        classTable.innerHTML = '<table class="table table-hover table-striped"><thead><th width="90%">Class</th><th width="10%">Delete</th></thead>'+classList+'</table>'
        

        $(document).ready(function(e){
                $('.search-class .dropdown-menu').find('a').click(function(e) {
                    e.preventDefault();
                    
                    classChosen = $(this).text();
                    $('.search-class span#search_class').text(classChosen);
                    
                    
                    getGroupings();
                });
                
                
                 $(document).ready(function(e){
                    $('.search-active-archive .dropdown-menu').find('a').click(function(e) {
                        e.preventDefault();
                       
                        archiveChosen = $(this).text();
                        $('.search-active-archive span#search_active_archive').text(archiveChosen);
                       
                        
                        getGroupings();
                    });
                });
            });

    });

    firebase.database().ref("equipment/microscope/semester").once("value").then(function(snapshot) {
        sems = []
        var dropdown="";
            
        
        snapshot.forEach(function(childSnapshot) {
            dropdown += "<li><a href='#" + childSnapshot.val().code + "'>"+childSnapshot.val().code+"</a></li>"
                
            semChosen = childSnapshot.val().code
            sems.push(semChosen)
        });

        group_sel_sem = sems[sems.length-1]
        document.getElementById('search_semester').innerText = semChosen
        var dropdownSem = document.getElementById("dropdownSem");
        
        var semTable = document.getElementById("showingSem");
        var semList = ''
        sems.forEach(function(sem){
            semList += '<tr><td>'+sem+'</td><td><button class="btn btn-danger" id="'+sem+'" onclick="deleteSem(this)"><i class="pe-7s-trash"></i></button></td></tr>'
        })
        semTable.innerHTML = '<table class="table table-hover table-striped"><thead><th width="90%">Semester</th><th width="10%">Delete</th></thead>'+semList+'</table>'
        

        dropdownSem.innerHTML = '<ul class="dropdown-menu" role="menu">'+dropdown+'</ul>';
        $(document).ready(function(e){
            
                $('.search-semester .dropdown-menu').find('a').click(function(e) {
                    e.preventDefault();
                    
                    semChosen = $(this).text();
                    $('.search-semester span#search_semester').text(semChosen);
                    
                    
                    getGroupings();
                });
        })
        getGroupings();
        
    });
    
}

function getGroupings(){
        
        
        document.getElementById("loader_equip").style.display = "block"; 
        document.getElementById("group_results").style.display = "none";
        var container = document.getElementById("group_results");
        if(archiveChosen.toLowerCase() == "active"){
            uarchive = "Archive"
            ed = "Edit"
        }else{
            uarchive = "Activate"
            ed = "Delete"
        }
        container.innerHTML = '<table class="table table-hover table-striped"><thead><th width="10%">Semester</th><th width="10%">Class</th><th>Students</th><th width="30%">Item Name</th><th>Status</th><th width="5%">'+ed+'</th><th width="5%">'+uarchive+'</th></thead><tbody id="create_body"></tbody></table>';
        var group_body = document.getElementById('create_body')
        

        
        
        
        var groupingDataRef = firebase.database().ref("equipment/microscope/grouping");

        groupingDataRef.orderByChild("classID").equalTo(classChosen).once("value").then(function(snapshot) {
                var hasResults = true;
                var data = snapshotToArray(snapshot);
                data = data.filter(getActive);
                
                data = data.filter(getSemester);
                
                
                data.reverse();
                if (data.length == 0){
                    hasResults = false;
                    container.innerHTML = "<br><h4>No groupings on this subject yet.</h4>";
                }
                data.forEach(function(item){
                    var gID = item.groupID;
                    var students = '';
                    item.students.forEach(function(student){
                        students += "<li>" + student + "</li>";
                    });
                    if (archiveChosen.toLowerCase() == "active"){
                        group_body.innerHTML += "<tr><td>"+ item.semester + "</td> <td>"+ item.classID + "</td> <td> "+ students + "</td> <td>"+ item.itemName +"</td> <td> "+ item.status+ "</td> <td><button class='btn btn-info' id="+item.key + " onclick='editGroup(this)'> <i class='pe-7s-note' aria-hidden='true' ></i></button></td><td><button id="+item.key +" onclick='archiveGroup(this)' class='btn btn-disable'><i class='pe-7s-box1' ></i></button> </td></tr>";
                    }else{
                        group_body.innerHTML += "<tr><td>"+ item.semester + "</td> <td>"+ item.classID + "</td> <td> "+ students + "</td> <td>"+ item.itemName +"</td> <td> "+ item.status+ "</td> <td><button class='btn btn-danger' id="+item.key + " onclick='deleteGroup(this)'> <i class='pe-7s-trash' aria-hidden='true' ></i></button></td><td><button id="+item.key +" onclick='archiveGroup(this)' class='btn btn-disable'><i class='pe-7s-box1' ></i></button> </td></tr>";
                    }
                    
                });
            if(hasResults){
                document.getElementById("group_results").style.display = "block";    
            }
            document.getElementById("loader_equip").style.display = "none";
            });
    }
function getActive(element) {
    
    
    var regexStatus = new RegExp( archiveChosen, 'gi' );
    return (element['status'].match(regexStatus));
}

function getSemester(element) {
    
    
    var regexSem = new RegExp(semChosen, 'gi' );
    return  (element['semester'].match(regexSem));
}
function getSemester2(element){
    var regexSem = new RegExp(group_sel_sem, 'gi' );
    
    return  (element['semester'].match(regexSem));
}

function filteringStudents(element) {
    var regex = new RegExp(searchStudentQuery, 'gi' );
    return (element['name'].match(regex));
}
var searchStudentQuery;
$('#searchStudent').on('keypress keydown keyup',function(){
    searchStudentQuery = $("#searchStudent").val();
    if(searchStudentQuery != ''){
        getStudents();
    }
    
});

function removingTakenStudents(mystudents, takenStudents){
    var index;
    for (var i=0; i<takenStudents.length; i++) {
        index = mystudents.indexOf(takenStudents[i]);
        if (index > -1) {
            mystudents.splice(index, 1);
        }
    }
    
        return mystudents;
}

var takenStudents = [];
function getStudents(){
        
        
        if(editStudents.length == 0){
            var groupingDataRef = firebase.database().ref("equipment/microscope/grouping");

            groupingDataRef.orderByChild("classID").equalTo(classChosen).once("value").then(function(snapshot) {
                    var data = snapshotToArray(snapshot);
                    chosenSemData = data.filter(getSemester);
                    
                    data = chosenSemData.filter(getActive); 
                    takenStudents = [];
                    chosenSemData.forEach(function(stu){
                        for (var i = 0; i < stu.students.length; i++) {
                            takenStudents.push(stu.students[i]);
                        };
                    })
                    
            });
        }else{
            takenStudents = editStudents
        }

            firebase.database().ref("users").orderByChild("name").once("value").then(function(snapshot) {
            var studentsDropdown="";
            studentsDropdown += "<ul name='chooseStudents' style='height:100px;overflow-y:auto' id='chooseStudents' >";
            var data = snapshotToArray(snapshot);
            data = data.filter(filteringStudents);
            var mystudents = [];
            data.forEach(function(dat){
                if (dat.laboratory == "student"){
                    mystudents.push(dat.name)   
                }
                
            });

            mystudents = removingTakenStudents(mystudents, takenStudents);
            
            if(mystudents.length != 0){
                for (var i = mystudents.length - 1; i >= 0; i--) {
                    studentsDropdown += "<li> <input type='checkbox' id='studentCheck' value='"+mystudents[i]+"' > "+ mystudents[i] + "</li>";
                }
                studentsDropdown += "</ul>";
                
                var studentsDropdownSem = document.getElementById("studentslist");
                var studentsDropdownSemForEdit = document.getElementById("studentslist-edit");
                studentsDropdownSemForEdit.innerHTML =  studentsDropdown;
                studentsDropdownSem.innerHTML = studentsDropdown;
                document.getElementById("summary-confirm-btn").disabled = false;
            }else{
                document.getElementById("studentslist").innerHTML = '';
                document.getElementById("studentslist-edit").innerHTML = '';
                
                document.getElementById("summary-confirm-btn").disabled = true;
                document.getElementById("studentslist").innerText ="No available student to add.";
            }

            $(".dropdown dd ul").show();
        });
}
function groupSummary(){
    $('#add-group-modal').modal('hide');
    $('#edit-group-modal').modal('hide');
    var semester = $("#new-chooseSem").val();
    var class1 = $("#new-chooseClass").val();
    var item = $("#chooseitems option:selected").text();

    var semesterEdit = $("#new-chooseSem-edit").val();
    var classEdit = $("#new-chooseClass-edit").val();
    var itemEdit = $("#chooseitems-edit option:selected").text();

    
    
    
    $("#sum-semester").html(semester);
    $("#sum-class").html(class1);
    $("#sum-item").html(item);
    studentsHolder=''
    addStudents.forEach(function(student){
        studentsHolder += "<li>"+student+"</li>";
    })
    $("#sum-students").html(studentsHolder);

    
    
    $("#sum-semester-edit").html(semesterEdit);
    $("#sum-class-edit").html(classEdit);
    
    
    var itemid = $("#chooseitems option:selected").val();
    
    $("#sum-item-edit").html(item+" "+itemid);
    studentsHolder=''
    editStudents.forEach(function(student){
        studentsHolder += "<li>"+student+"</li>";
    })
    $("#sum-students-edit").html(studentsHolder);

    if (transact == "add"){
        $('#summary-group-modal').modal('show');
    }
    else{
    $('#summary-edit-group-modal').modal('show');

    }
}
function saveGroup(){
        var item;
        if (transact == "add"){
            var groupingDataRef = firebase.database().ref("equipment/microscope/grouping");
            var newgroupRef = groupingDataRef.push();
            var groupID = newgroupRef.key;
            var semester = $("#new-chooseSem").val();
            var class1 = $("#new-chooseClass").val();
            item = $("#chooseitems").val();
            var itemName = $("#chooseitems option:selected").text();
            var newGroupData = {
            "itemName": itemName,
            "groupID": groupID,
            "classID":class1,
            "itemID": item,
            "semester" : semester,
            "status":"active",
            "students":addStudents
                }
                newgroupRef.set(newGroupData);
        
        }else{
            var semesterEdit = $("#new-chooseSem-edit").val();
            var classEdit = $("#new-chooseClass-edit").val();
            var itemEdit = $("#chooseitems option:selected").val();
            var itemName = $("#chooseitems option:selected").text();
            var newGroupData = {
                "itemName": itemName,
                "groupID": editGroupID,
                "classID":classEdit,
                "itemID": itemEdit,
                "semester" : semesterEdit,
                "status":"active",
                "students": editStudents
            }
            var updates = {}
            
            updates["equipment/microscope/grouping/" + editGroupID] = newGroupData;
            firebase.database().ref().update(updates);
            firebase.database().ref("equipment/microscope/item").orderByChild("itemID").equalTo(itemEdit).once("value").then(function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                    var updateThisChild = childSnapshot.key;
                    firebase.database().ref("equipment/microscope/item/"+updateThisChild+"/status").set("selected");
                });        
            });

        }
        var setStatus = "selected"
        if(transact != "add"){
            item = $("#old-item-id").val()
            setStatus = "available"
        }
        firebase.database().ref("equipment/microscope/item").orderByChild("itemID").equalTo(item).once("value").then(function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                var updateThisChild = childSnapshot.key;
                firebase.database().ref("equipment/microscope/item/"+updateThisChild+"/status").set(setStatus);
            });        
        });
        loadClasses();
        getGroupings();

}

function editGroup(group){
    
        transact = "edit"
        editStudents = [];
        

        var semdropdown = "<select class='chooseSem form-control' id='new-chooseSem-edit' onchange='changeSemEdSel(this)'>";
            
            sems.forEach(function(semval) {
                semdropdown += "<option value="+semval+"> "+ semval+ "</option>";   
            });
            semdropdown += "</select>"
            var semdropdownSem = document.getElementById("semDD-edit");
            
            semdropdownSem.innerHTML = semdropdown;

        var classDropdown = "<select class='chooseClass form-control' id='new-chooseClass-edit' onchange='changeClassEdSel(this)'>";
            
            classes.forEach(function(classval) {
                classDropdown += "<option value="+classval+"> "+ classval+ "</option>"; 
            });
            classDropdown += "</select>"
            var classDropdownDiv = document.getElementById("classDD-edit");
            classDropdownDiv.innerHTML = classDropdown;
        
        

        getStudents();
        setTimeout(function(){
            editGroupID = group.id;
            var groupingDataRef = firebase.database().ref("equipment/microscope/grouping");

            groupingDataRef.orderByChild("groupID").equalTo(editGroupID).once("value").then(function(snapshot) {
                snapshot.forEach(function(childSnapshot){
                    $("#old-item-id").val(childSnapshot.val().itemID)
                    $("#new-chooseSem-edit").val(childSnapshot.val().semester); 
                    $("#new-chooseClass-edit").val(childSnapshot.val().classID);
                    $("#chooseitems-edit").val(childSnapshot.val().itemID);
                    var html = "";
                    var currentStudents = childSnapshot.val().students;
                    currentStudents.forEach(function(student){
                        html += '<span title="' + student + ',">' + student + ' &nbsp; </span>';
                        editStudents.push(student);
                        
                        $(":checkbox[value='"+student+"']").prop("checked", true);
                    });

                    $('.multiSel-edit').append(html);
                    
                })  ;
            });
            getItems(false);
            
        }, 1000)
        
            $('#edit-group-modal').modal('show');
        
        
 $(".dropdown dd ul").hide();
}
$(".dropdown dt a").on('click', function() {
  $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li a").on('click', function() {
  $(".dropdown dd ul").hide();
});
$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});
function cancelAdd(){
    
    $(":checkbox").prop("checked", false);
    $('.multiSel').html("&nbsp;");
    $('.multiSel-edit').html("&nbsp;");
}
$("#edit-group-modal").on("hidden.bs.modal", function () {
    
    $(":checkbox").prop("checked", false);
    $('.multiSel-edit').html("&nbsp;");
    $('.multiSel').html("&nbsp;");
});
$("#add-group-modal").on("hidden.bs.modal", function () {
    
    $(":checkbox").prop("checked", false);
    $('.multiSel-edit').html("&nbsp;");
    $('.multiSel').html("&nbsp;");
});

$(document).on("click", "input[id='studentCheck']", function (event) {
        
        var title = $(this).val() + ",";
          if ($(this).is(':checked')) {
    addStudents.push($(this).val());
    editStudents.push($(this).val());
    var html = '<span title="' + title + '">' + title + '</span>';
    $('.multiSel').append(html);
    $('.multiSel-edit').append(html);
    $(".hida").hide();
  } else {
    for (var i=editStudents.length-1; i>=0; i--) {
        if (editStudents[i] === $(this).val()) {
            editStudents.splice(i, 1);
             break;    
        }
    }
    addStudents.pop($(this).val());
    
    $('span[title="' + title +  '"]').remove();
    var ret = $(".hida");
    $('.dropdown dt a').append(ret);
  }
  
  
});
function cancelSave(){
    $("#sum-semester").html("");
    $("#sum-class").html("");
    $("#sum-item").html("");
    $("#sum-students").html("");
    $("#sum-semester-edit").html("");
    $("#sum-class-edit").html("");
    $("#sum-item-edit").html("");
    $("#sum-students-edit").html("");
}

function archiveGroup(groupID){
    if(archiveChosen.toLowerCase() == "active"){
        $('#archive-confirm-text').html("Archive this group?");
        $('#additional-archive-text').html("Once this group is archived, the students involved still <b>CANNOT </b> be added to a new group within this class and semester.")
        document.getElementById('archive-btn').setAttribute('onclick','confirmArchive()')
    }else{
        $('#archive-confirm-text').html("Activate this group?");
        $('#additional-archive-text').html("Once this group is active, it can be edited.");
        document.getElementById('archive-btn').setAttribute('onclick','confirmActive()')
    }
    updateThisGroup = groupID.id;
    $('#confirmModal_archive').modal('show');    
}
function confirmActive(){
    var updates = {};
    updates["equipment/microscope/grouping/" + updateThisGroup+"/"+"status"] = "active";
    firebase.database().ref().update(updates);
    getGroupings();
    getStudents();
}
function confirmArchive(){
    var updates = {};
    updates["equipment/microscope/grouping/" + updateThisGroup+"/"+"status"] = "archived";
    firebase.database().ref().update(updates);
    getGroupings();
    getStudents();
}

function addSemester(){
    document.getElementById('newSemCode').reset()
    $('#addSemester-modal').modal('show');
    $("#newSemesterName").bind('input', function () {
       name = $(this).val();
       if(name == ''){
        document.getElementById('error-sem').innerText = "Semester code can't be blank."
        document.getElementById('addSemester-confirm-btn').disabled = true
       }else{
            document.getElementById('error-sem').innerText = "";
                
            var count = 0;
            sems.forEach(function(sem){
                
                if(sem.toLowerCase() == name.toLowerCase()){
                    
                    document.getElementById('error-sem').innerText = "Semester code already exists."
                    document.getElementById('addSemester-confirm-btn').disabled = true
                    return
                }else{
                    count+=1
                }
            })
            if(count == sems.length){
                document.getElementById('error-sem').innerText = ""
                document.getElementById('addSemester-confirm-btn').disabled = false
            }
        }
    });
}


function addSemesterConfirm(){
    var code = $('#newSemesterName').val();
    
    var newSemester={
        "code": code
    }
    var semref = firebase.database().ref("equipment/microscope/semester");
    semref.push(newSemester);
    $('#chooseSem').append($("<option value='" + code + "'>"+ code + "</option>"));
    $('#addSemester-modal').modal('hide');
    document.getElementById("semCodeNew").reset();
    loadClasses();
}

function addClass(){
    document.getElementById('addClass-confirm-btn').disabled = true
    $('#addClass-modal').modal('show');
    $("#newClassName").bind('input', function () {
       name = $(this).val();
       if(name == ''){
        document.getElementById('error-class').innerText = "Class name can't be blank."
        document.getElementById('addClass-confirm-btn').disabled = true
       }else{
            document.getElementById('error-class').innerText = "";
                
            var count = 0;
            classes.forEach(function(cla){
                
                if(cla.toLowerCase() == name.toLowerCase()){
                    
                    document.getElementById('error-class').innerText = "Class already exists."
                    document.getElementById('addClass-confirm-btn').disabled = true
                    return
                }else{
                    count+=1
                }
            })
            if(count == classes.length){
                document.getElementById('error-class').innerText = ""
                document.getElementById('addClass-confirm-btn').disabled = false
            }
        }
    });
}

function addSemester(){
    document.getElementById('addSemester-confirm-btn').disabled = true
    $('#addSemester-modal').modal('show');
    $("#newSemesterName").bind('input', function () {
       name = $(this).val();
       if(name == ''){
        document.getElementById('error-sem').innerText = "Semester code can't be blank."
        document.getElementById('addSemester-confirm-btn').disabled = true
       }else{
            document.getElementById('error-sem').innerText = "";
            var count = 0;
            sems.forEach(function(sem){
                
                if(sem.toLowerCase() == name.toLowerCase()){
                    
                    document.getElementById('error-sem').innerText = "Semester already exists."
                    document.getElementById('addSemester-confirm-btn').disabled = true
                    return
                }else{
                    count+=1
                }
            })
            if(count == sems.length){
                document.getElementById('error-class').innerText = "";
                document.getElementById('newSemesterCode').innerText = name;
                document.getElementById('addSemester-confirm-btn').disabled = false;
            }
        }
    });
}

function addClassConfirm(){
    $("#confirmClassName").text($('#newClassName').val() + "?");
    $('#addClass-modal').modal('hide');
    $('#addClassConfirm-modal').modal('show');
}
function saveClass(){
    var code = $('#newClassName').val();
    
    var newClass={
        "code": code
    }
    var classref = firebase.database().ref("equipment/microscope/class");
    classref.push(newClass);
    document.getElementById('classNameNew').reset()
    $('#addClassConfirm-modal').modal('hide');
    loadClasses()
}
var group_sel_class, group_sel_sem; 

function changeClassSel(){
    classChosen = $("#new-chooseClass").val();
    group_sel_class = classChosen;
    
    getStudents();
    getItems(true);
    addStudents = []
}
function changeSemSel(){
   semChosen = $("#new-chooseSem").val();
   group_sel_sem = semChosen
   
   getStudents();
   getItems(true);
   addStudents = []
}
function changeClassEdSel(){
    classChosen = $("#new-chooseClass-edit").val();
    group_sel_class = classChosen;
    
    doesStudentHaveGroup();
    getItems(false);
    
}
function changeSemEdSel(){
   semChosen = $("#new-chooseSem-edit").val();
   group_sel_sem = semChosen
   
   getItems(false);
   doesStudentHaveGroup();
   
}

function doesStudentHaveGroup(){
    //get old class
    //get new class
    
    
    var isIn = false;
    document.getElementById('edit-error-msg').innerHTML = ''
    document.getElementById('edit-summary-confirm-btn').disabled = false;
    document.getElementById('searchStudent').disabled =false;
    firebase.database().ref("equipment/microscope/grouping").orderByChild("classID").equalTo(classChosen).once("value").then(function(snapshot) {
                var data = snapshotToArray(snapshot);
                
                chosenSemData = data.filter(getSemester2);
                takenStudents = [];
                
                
                
                chosenSemData.forEach(function(stu){
                    for (var i = 0; i < stu.students.length; i++) {
                        
                        if(editStudents.includes(stu.students[i])){
                            
                            document.getElementById('edit-error-msg').innerHTML = 'Some of the students exists in that semester and class already.'
                            document.getElementById('edit-summary-confirm-btn').disabled = true;
                            document.getElementById("studentslist-edit").innerHTML = '';
                            document.getElementById("studentslist").innerHTML = '';
                            document.getElementById('searchStudent').disabled =true;
                            isIn = true;
                            break;
                        }
                    }
                    
                    if(isIn){
                        return 0;
                    }
                });
                if(isIn ==  false){
                    
                    getStudents()  
                }

    });

}
function deleteGroup(groupID){
    $('#remove-title').html('Delete Group')
    $('#delete-confirm-text').html('Are you sure you want to delete this group ?')
    $('#additional-delete-text').html('If you confirm, the item and students will be available for this semester and class again.')
    document.getElementById('delete-confirm-btn').setAttribute('value',groupID.id);
    $('#delete-modal').modal('show');
}
function deleteGroupConfirm(groupID){
    var id = groupID.value
    
    firebase.database().ref("equipment/microscope/grouping").child(id).remove();
    $('#delete-modal').modal('hide');
    getGroupings();
}
function getItems(type){
    
    firebase.database().ref("equipment/microscope/grouping").orderByChild("classID").equalTo(classChosen).once("value").then(function(snap){
        var notAvailable = [];
        
        snap.forEach(function(s){
            var sem = s.val().semester
            
            
            if(sem.toLowerCase() == semChosen.toLowerCase()){
             
                notAvailable.push(s.val().itemName);
            }

        })

   
        firebase.database().ref("equipment/microscope/item").once("value").then(function(snapshot) {
            var itemsDropdown="";
            itemsDropdown += "<select class='chooseitems form-control' id='chooseitems' >";
            
            snapshot.forEach(function(itemsval) {
           
                
               
                if (notAvailable.includes(itemsval.val().name)){
                    itemsDropdown += "<option value="+itemsval.val().itemID+" class='selectedItem' disabled> "+ itemsval.val().name+ "</option>"; 
                }else{
                    if((type==false) && (itemsval.val().itemID == $("#old-item-id").val())){
                        itemsDropdown += "<option value="+itemsval.val().itemID+" selected>"+ itemsval.val().name+ "</option>"; 
                    }else{
                        itemsDropdown += "<option value="+itemsval.val().itemID+">"+ itemsval.val().name+ "</option>";  
                    }
                }
            });
            itemsDropdown += "</select>"
            if (type){
                var itemsDropdownSem = document.getElementById("itemDD");
            }else{
                var itemsDropdownSem = document.getElementById("itemDD-edit");
            }
            itemsDropdownSem.innerHTML = itemsDropdown;

        });
    });
}
function addGroup(){
    
    transact = "add";
        addStudents = [];
        var semdropdown = "<select class='chooseSem form-control' id='new-chooseSem' onchange='changeSemSel()'>";
            
            sems.forEach(function(semval) {
                if(semval == semChosen){
                    semdropdown += "<option value="+semval+" selected> "+ semval+ "</option>";
                    group_sel_sem = semval;
                }else{
                    semdropdown += "<option value="+semval+"> "+ semval+ "</option>";
                }
            });
            

            semdropdown += "</select>"
            var semdropdownSem = document.getElementById("semDD");
            
            semdropdownSem.innerHTML = semdropdown;

        var classDropdown= "<select class='chooseClass form-control' id='new-chooseClass' onchange='changeClassSel()'>";
            
            classes.forEach(function(classval) {
                if(classval == classChosen){
                    classDropdown += "<option value="+classval+" selected> "+ classval+ "</option>";
                    group_sel_class = classval; 
                }else{
                    classDropdown += "<option value="+classval+"> "+ classval+ "</option>";
                }
            });
            classDropdown += "</select>"
            var classDropdownDiv = document.getElementById("classDD");
            classDropdownDiv.innerHTML = classDropdown;
        
        getItems(true);
        getStudents();

        $('#add-group-modal').modal('show');
        $(".dropdown dd ul").hide();

}
function viewClasses(){
    $('#viewClass-modal').modal('show');
}

function deleteClass(classID){
    $('#viewClass-modal').modal('hide');
    $('#remove-title').html('Delete Class')
    $('#delete-confirm-text').html('Are you sure you want to delete this class ?')
    $('#additional-delete-text').html('If you confirm, all groups associated with this class will be deleted. This action <b>CANNOT BE UNDONE</b>.')
    document.getElementById('delete-confirm-btn').setAttribute('value',classID.id);
     document.getElementById('delete-confirm-btn').setAttribute('onclick','deleteClassConfirm(this)');
    $('#delete-modal').modal('show');
}
function deleteClassConfirm(classID){
    
    $('#delete-modal').modal('hide');
    firebase.database().ref("equipment/microscope/grouping").orderByChild("classID").equalTo(classID.value).once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            
            groupKey = childSnapshot.key;
            

           firebase.database().ref("equipment/microscope/grouping/"+groupKey).remove()
        })
    })
    firebase.database().ref("equipment/microscope/class").orderByChild("code").equalTo(classID.value).once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            
            classKey = childSnapshot.key;
           
            firebase.database().ref("equipment/microscope/class/"+classKey).remove()
        })
    })
    loadClasses();
}
function viewSemesters(){
    $('#viewSem-modal').modal('show');
}
function deleteSem(semID){
    $('#viewSem-modal').modal('hide');
    $('#remove-title').html('Delete Semester')
    var confirmtext = 'Are you sure you want to delete this semester '+semID.id+'?'
    $('#delete-confirm-text').html(confirmtext)
    $('#additional-delete-text').html('If you confirm, all groups associated with this semester will be deleted. This action <b>CANNOT BE UNDONE</b>.')
    document.getElementById('delete-confirm-btn').setAttribute('value',semID.id);
     document.getElementById('delete-confirm-btn').setAttribute('onclick','deleteSemConfirm(this)');
    $('#delete-modal').modal('show');
}
function deleteSemConfirm(semID){
    
    $('#delete-modal').modal('hide');
    firebase.database().ref("equipment/microscope/grouping").orderByChild("semester").equalTo(semID.value).once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            
            groupKey = childSnapshot.key;
            

           firebase.database().ref("equipment/microscope/grouping/"+groupKey).remove()
        })
    })
    firebase.database().ref("equipment/microscope/semester").orderByChild("code").equalTo(semID.value).once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            
            semKey = childSnapshot.key;
            
            firebase.database().ref("equipment/microscope/class/"+classKey).remove()
        })
    })
    loadClasses();
}