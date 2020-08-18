var oEmployeesDetails = {};
var oSubordinateDetails = {};
var sGroup;
var oResults={};
$(document).ready(function(){

	//Extracting the logged in user data from master data
	var sCurrentEmployee = _spPageContextInfo.userLoginName.substring( _spPageContextInfo.userLoginName.indexOf('\\') + 1);
	//var sCurrentEID = _spPageContextInfo.userLoginName.match(/\d+/g)[0];
	//apiPath = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('Master%20Data')/items?$select*&$filter= UserID eq '" + sCurrentEmployee + "'";
	apiPath = "http://disc:5000/HRAD/_api/lists/getbytitle('Role%20Matrix%20Master')/items?$select*&$filter= UserID eq '" + sCurrentEmployee + "'";
	
	if(window.location.href.indexOf("MyItems") !== -1 && window.location.href.indexOf("NewForm") === -1 && window.location.href.indexOf("EditForm") === -1)//Run the code when in Quick Edit mode and disbale the subordiante and acepting officer fields based on user type 
	{
		if (checkUserGroup("EAS Heads Group") == false)
		{(function () {
			var overrideContext = {};
			overrideContext.Templates = overrideContext.Templates || {};
			overrideContext.Templates.OnPreRender = function(ctx) {
				
				var disbleField = ['Office','Accepting_x0020_Officer_x0020_Co'];
				
				disbleField.forEach(function(item){
					var statusField = ctx.ListSchema.Field.filter(function(f) { //disbale field on quick edit mode
						return f.Name === item;
					});
					if (statusField) {
						statusField[0].AllowGridEditing = false;
					}

				});
				
			}
			SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
		})();
		}
	}
	else if(window.location.href.indexOf("NewForm") !== -1 ) //If the form  is New Form run the code 
	{
		$('#sideNavBoxCustom').hide(); // Hide Top Menu
		$("input[id= 'Subordinate_x0027_s_x0020_Design_463df320-79ff-4bd9-a97b-d10d07e47581_$TextField']").prop('disabled', true); //Disable designation field 
		GetListItems(apiPath, getEmployeeDetails); //Usinf RESTful API to get the logged in user data from HRAD role matrix
		
	}
	else if(window.location.href.indexOf("EditForm") !== -1 && window.location.href.indexOf("MyItems") !== -1) //If the form is Eidt  Form run the code 
	{
		$('#sideNavBoxCustom').hide(); // Hide Top Menu
		var selectFieldValue = $("input[title*= 'Select Subordinate']")[0].value;
		$("input[title*= 'Select Subordinate']").prop('disabled', true);
		disablePeoplePicker(); // disbaling the poeple picker 
		if(checkUserGroup("EAS Heads Group") === false)
		{
			$("select[title='Approval']").parent().parent().parent().hide(); //Hide the accept and remark colmun if the user is not a accepting officer.    
		    $("textarea[title='Accepting Officer Comment']").closest('tr').hide();
		}
		else if(sCurrentEmployee !== (selectFieldValue.split(':')[1]))
		{
			$("select[title='Subordinate Approval']").parent().parent().parent().hide(); //Hide the accept and remark colmun if the user is not the selected subordinate.    
		    $("textarea[title='Subordinate Comment']").closest('tr').hide();
		}
		else if (sCurrentEmployee === (selectFieldValue.split(':')[1]))
		{
			$("input[id='Subordinate_x0027_s_x0020_Design_463df320-79ff-4bd9-a97b-d10d07e47581_$TextField']").val(sCurrentEmployee.Designation);
		}

	}
	
	});

function GetListItems(apiPath, success) {     
	$.ajax({  
		url: apiPath,  
		headers: {
			Accept: "application/json;odata=verbose"  
		},  
		async: false,  
		success: function(data) {   
			success(data);
		},  
		eror: function(data) {  
			console.log("An error occurred. Please try again.");  
		}  
	});  
} 
function getEmployeeDetails(data){
	var items; // Data will have user object  
		
	if (data != null) {  
		items = data.d;  
		if (items != null) {  
			oEmployeesDetails = items.results[0]; 
			if(oEmployeesDetails){
				setFields();
				var sLoadVal = $("input[title*= 'Select Subordinate']").val();
				setDropdown(sLoadVal);
			}
			else {
				alert("Couldnt find entry in the master data. Please contact Employee Performance Divison,CO");
				window.location.href = "/HRAD/Target/Lists/Project%20Tasks/MyItems.aspx";
			}
		}
	}
}
function setFields(){

	// Populating the office and plant detail
	$("input[title='Evaluation Unit(TAS-Bonus group)']").val(oEmployeesDetails.EvaluationGroup);
	$("input[title='Plant']").val(oEmployeesDetails.Plant);
	
	//Get the subordinte of the user
	oEmployeesDetails.Supervisors = oEmployeesDetails.AsSupervisor? oEmployeesDetails.AsSupervisor.split(","): [];

	//Setting dropdown option -subordinates
	setDropdown();
	// hide textbox and show dropdown with possible values
	$("input[title*= 'Select Subordinate']").hide().parent().append("<select id='selectPerson' onchange='setPerson(this)'></select>");
	$("input[title*= 'Select Subordinate']").parent().find("br").remove();	
}
function setDropdown(sLoadVal){
	var $select = $("#selectPerson");
	$select.empty();
	$("#noOption").remove();
	if(oEmployeesDetails.Supervisors!=null)
	{
	$select.html(generateOptions(oEmployeesDetails.Supervisors));
	if(!$select.find("option").length){
		$select.after("<span id='noOption' class='ms-formvalidation' role='alert'>You dont have any Subordinates</span>");	
		}}
	
	if(sLoadVal){
		$select.val(sLoadVal);
	}
	else{
		setPerson($("#selectPerson"));
	}
}
function generateOptions(arr){
	var sHTML = "";
	$(arr).each(function(index, val){ //Setting the option dynamically based on the subordinates in the role matrix 
		sHTML = sHTML + "<option>" + val + "</option>";
	});
	return sHTML;
}
function setPerson(obj){
	$("input[title*= 'Select Subordinate']").val($(obj).val());
	
	var drpOption = document.getElementById( 'selectPerson' );
	if(drpOption != null)
	{  if(drpOption.length != 0)
		{
		//Getting the selected user 
		var selectedOption = drpOption.options[ drpOption.selectedIndex ].value;
		var subordinateID = selectedOption.split(':')[1];
		var subordinateEID = selectedOption.split('(')[0]


		//Getting the selected subordinate details from Master Data by RESTful API
		// apiPath2 = "http://disc:5000/HRAD/_api/lists/getbytitle('Role%20Matrix%20Master')/items?$select*&$filter= UserID eq '" + subordinateID + "'";
		// GetListItems(apiPath2, getSubordinateDetails);
		
		// peoplePickerObject.AddUserKeys(subordinateID);
		var form = jQuery("table[class='ms-formtable']"); // get the form element
    	var userField = form.find("input[id$='ClientPeoplePicker_EditorInput']").get(0) // find the people picker element, getting the first people pickers on the form 
    	var peoplepicker = SPClientPeoplePicker.PickerObjectFromSubElement(userField) // Use SPClientPeoplePicker to get the actual picker object
		var usersObject = peoplepicker.GetAllUserInfo(); //getting the users in the people picker 
		if(usersObject != null)
		{			
			usersObject.forEach(function(index){
				peoplepicker.DeleteProcessedUser(usersObject[index]); //deleting the user 
			})
		}
		peoplepicker.AddUserKeys(subordinateID); // finally set the loginName as the people picker value, this also triggers a validation.
				
		disablePeoplePicker(); //Disbaling the people picker

		// // Populating the subordinate's EID
		$("input[id='Subordinate_x0027_s_x0020_EID_3d17e8f4-63ee-414f-afa3-814e46e0c5e6_$NumberField']").val(subordinateEID);

		}
	}
}

function disablePeoplePicker()
{
/*** Making the people picker read only ****/
		//hide x image
		$(".sp-peoplepicker-delImage").hide();
		//disable peoplepicker control
		$("input.sp-peoplepicker-editorInput[title='Assigned To']").prop('disabled', true);
		//set disable css style
		$("div.sp-peoplepicker-topLevel[title='Assigned To']").addClass("sp-peoplepicker-topLevelDisabled");
		/**** END of making people picker read only**/

}
// function getSubordinateDetails(data){
// 	if (data != null) {  
// 		items = data.d;  
// 		if (items != null) {  
// 			oSubordinateDetails = items.results[0]; 
// 		}
// 		else
// 		{
// 			alert("Couldnt find entry for subordinate in the master data. Please contact Employee Performance Divison,CO");
// 		}
// 	}
// }
function checkUserGroup(groupName) {

    var result = false;
    $.ajax({
      url: _spPageContextInfo.webAbsoluteUrl +'/_api/web/currentuser/groups',
      type: "GET",
      async: false,
      contentType: "application/json;odata=verbose",
      headers: {
          "Accept": "application/json;odata=verbose",
          "X-RequestDigest": $("#__REQUESTDIGEST").val(),       
      },
      success: function(data){
          var groups = data.d.results
          for(i=0; i<groups.length; i++) {
              if (groups[i].LoginName == groupName) {               
                 result = true;
              }
          };
      },
      error: function() { return false; }
    })
    return result;
  }
function checkUser(){

}


                        



