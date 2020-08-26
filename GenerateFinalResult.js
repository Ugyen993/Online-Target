var oEmployeesMaster = [];
var oReviewee = {};
var oTargetsArray = [];
var arrExceptions = ["Exceptions:"];
var oCurrentEmployeePeerReference;
var tempEmpObjID ="";
var oTempEIDPool=[]; 

apiPath = _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('Employee Target')/items?$top=2000";  
GetListItems(apiPath, getEmployees);

//Retrieve list items from sharepoint using API  
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
function getEmployees(data){
    var items; // Data will have user object  
    var oTarget, oTotalScore, oResultScore, oTNA, oPIP, oSpecialAchieve, oImpediment;
		
	if (data != null) {  
		items = data.d;  
		if (items != null) {  
            oEmployeesMaster = items.results;  

            for (var i = 0; i < oEmployeesMaster.length; i++)
            {
               oTarget = oEmployeesMaster[i].Title;
               oTotalScore = oEmployeesMaster[i].Target_x0020_Weightage;
               oResultScore = oEmployeesMaster[i].Target_x0020_Achievement;
               oTNA = oEmployeesMaster[i].Training_x0020_Need_x0020_Assess;
               oPIP = oEmployeesMaster[i].Performance_x0020_Improvement_x0;
               oSpecialAchieve = oEmployeesMaster[i].Special_x0020_Achievement;
               oImpediment = oEmployeesMaster[i].Impediment_x0020_to_x0020_perfor;


                if(!checkEID(oTempEIDPool,oEmployeesMaster[i].Subordinate_x0027_s_x0020_EID))
                {
                    oTargetsArray[oEmployeesMaster[i].Subordinate_x0027_s_x0020_EID] = {
                        "EID": oEmployeesMaster[i].Subordinate_x0027_s_x0020_EID ,
                        "Name":oEmployeesMaster[i].Provide_x0020_feedback_x0020_to_.split('(EID)')[1] ,
                        "Designation":oEmployeesMaster[i].Subordinate_x0027_s_x0020_Design, 
                        "Plant":oEmployeesMaster[i].Plant,
                    	"Group":oEmployeesMaster[i].Evaluation_x0020_Unit_x0028_TAS_,
                        "Target": oEmployeesMaster[i].Title,  
                        "TargetTotal":oEmployeesMaster[i].Target_x0020_Weightage,
                        "TargetResult":oEmployeesMaster[i].Target_x0020_Achievement,
                        "TNA":oEmployeesMaster[i].Training_x0020_Need_x0020_Assess,
                        "PIP":oEmployeesMaster[i].Performance_x0020_Improvement_x0,
                        "SpecialAchievement":oEmployeesMaster[i].Special_x0020_Achievement,
                        "Impediment":oEmployeesMaster[i].Impediment_x0020_to_x0020_perfor,
                        "status": "1",
                    };

                }
              
                setTargetsArray(oEmployeesMaster[i], oTarget, oTotalScore, oResultScore, oTNA, oPIP, oSpecialAchieve, oImpediment);

                tempEmpObjID = oEmployeesMaster[i].Subordinate_x0027_s_x0020_EID;
                oTempEIDPool.push(tempEmpObjID);

            }
     
			generateDatatable();
		}
	}
}
function checkEID(arr, el) {
    let found = false;
    arr.forEach((element) => {
      console.log(element)
      if (element === el) {
        found = true;
      }
    });
    return found;
  }
function setTargetsArray(currentEmpObj,oTarget,oTotalScore,oResultScore, oTNA, oPIP, oSpecialAchieve, oImpediment)
{   
    if(checkEID(oTempEIDPool,currentEmpObj.Subordinate_x0027_s_x0020_EID))
    {
        oTargetsArray[currentEmpObj.Subordinate_x0027_s_x0020_EID]["Target"] += "," + oTarget;
        oTargetsArray[currentEmpObj.Subordinate_x0027_s_x0020_EID]["TargetTotal"] += oTotalScore;
        oTargetsArray[currentEmpObj.Subordinate_x0027_s_x0020_EID]["TargetResult"] += oResultScore;
        oTargetsArray[currentEmpObj.Subordinate_x0027_s_x0020_EID]["TNA"] += "," + oTNA;
        oTargetsArray[currentEmpObj.Subordinate_x0027_s_x0020_EID]["PIP"] += "," + oPIP;
        oTargetsArray[currentEmpObj.Subordinate_x0027_s_x0020_EID]["SpecialAchievement"] += "," + oSpecialAchieve;
        oTargetsArray[currentEmpObj.Subordinate_x0027_s_x0020_EID]["Impediment"] += "," + oImpediment;
    }
}
function generateDatatable(){
	alert(arrExceptions.join("\n"));
    
    var oRevieweeData = Object.keys(oTargetsArray).map(Subordinate_x0027_s_x0020_EID => ({ Subordinate_x0027_s_x0020_EID, EID:oTargetsArray[Subordinate_x0027_s_x0020_EID]["EID"], Name:oTargetsArray[Subordinate_x0027_s_x0020_EID]["Name"], Designation:oTargetsArray[Subordinate_x0027_s_x0020_EID]["Designation"], Plant:oTargetsArray[Subordinate_x0027_s_x0020_EID]["Plant"], Group:oTargetsArray[Subordinate_x0027_s_x0020_EID]["Group"],Target:oTargetsArray[Subordinate_x0027_s_x0020_EID]["Target"], TargetTotal:oTargetsArray[Subordinate_x0027_s_x0020_EID]["TargetTotal"], TargetResult:oTargetsArray[Subordinate_x0027_s_x0020_EID]["TargetResult"], TNA:oTargetsArray[Subordinate_x0027_s_x0020_EID]["TNA"], PIP:oTargetsArray[Subordinate_x0027_s_x0020_EID]["PIP"], SpecialAchievement:oTargetsArray[Subordinate_x0027_s_x0020_EID]["SpecialAchievement"], Impediment:oTargetsArray[Subordinate_x0027_s_x0020_EID]["Impediment"] }));
	$(".ms-rte-layoutszone-inner").prepend('<h1>Please verify generated matrix</h1><table id="oTargetsArray" class="display"><thead><tr role="row"><th>EID</th><th>Name</th><th>Designation</th><th>Plant</th><th>Group</th><th>Targets</th><th>Target Total</th><th>Target Result</th><th>TNA</th><th>PIP</th><th>Target Result</th><th>Special Achievement</th><th>Impediment To Performance</th></tr></thead></table><textarea id="exceptions" rows="6" cols="100"></textarea><input id="proceed" type="button" style="font-size: 16px;margin-top: 20px;" class="pull-right btn-primary" onclick="updateMaster()" value="Proceed >>" />');
	
	$('#oTargetsArray').dataTable({
		"aaData": oRevieweeData,
		"aoColumns": [{
			"mDataProp": "Subordinate_x0027_s_x0020_EID"
		},
		{
			"mDataProp": "Name"
		},
		{
			"mDataProp": "Designation"
		},
		{
			"mDataProp": "Plant"
		},
		{
			"mDataProp": "Group"
        },
        {
			"mDataProp": "Target"
		},
		{
			"mDataProp": "TargetTotal"
		},
		{
			"mDataProp": "TargetResult"
		},
		{
			"mDataProp": "TNA"
		},
		{
			"mDataProp": "PIP"
		},
		{
			"mDataProp": "SpecialAchievement"
		},
		{
			"mDataProp": "Impediment"
		}]
	});
	
	$("#exceptions").html(arrExceptions.join("\n"));
}
function DeleteAllItems(){
    var ctx = SP.ClientContext.get_current(),
    list = ctx.get_web().get_lists().getByTitle('Employee Target Result'),
    query = new SP.CamlQuery(),
    items = list.getItems(query);
    ctx.load(items, "Include(Id)");
    ctx.executeQueryAsync(function () {
    var enumerator = items.getEnumerator(),
    itemArray = [];
    while (enumerator.moveNext()) {
    itemArray.push(enumerator.get_current());
    }
    
    for (var s in itemArray) {
    itemArray[s].deleteObject();
    }
    ctx.executeQueryAsync();
    });
    }
function updateMaster(){
	ShowWaitDialog();
	var listName = "Employee Target Result";
	var context = new SP.ClientContext.get_current();
	var oList = context.get_web().get_lists().getByTitle(listName);
        
    var itemCreateInfo = new SP.ListItemCreationInformation();
    oTempEIDPool = unique(oTempEIDPool); //Getting the unique EID array
    DeleteAllItems(); // Deleting all the previous data in final target report    
    for (var i = 0; i < oTempEIDPool.length; i++) {
	
        this.oListItem = oList.addItem(itemCreateInfo);
        oListItem.set_item('Title', oTargetsArray[oTempEIDPool[i]]["EID"]);
        oListItem.set_item('Name', oTargetsArray[oTempEIDPool[i]]["Name"]);
        oListItem.set_item('Designation', oTargetsArray[oTempEIDPool[i]]["Designation"]);
        oListItem.set_item('Plant', oTargetsArray[oTempEIDPool[i]]["Plant"]);		
        oListItem.set_item('Evaluation_x0020_Unit', oTargetsArray[oTempEIDPool[i]]["Group"]);
        oListItem.set_item('Target_x0020_Summary', oTargetsArray[oTempEIDPool[i]]["Target"]);
        oListItem.set_item('Total_x0020_Targets_x0020_Score', oTargetsArray[oTempEIDPool[i]]["TargetTotal"]);
        oListItem.set_item('Target_x0020_Result', oTargetsArray[oTempEIDPool[i]]["TargetResult"]);
        oListItem.set_item('Training_x0020_Need_x0020_Assess', oTargetsArray[oTempEIDPool[i]]["TNA"]);
        oListItem.set_item('Performance_x0020_improvement_x0', oTargetsArray[oTempEIDPool[i]]["PIP"]);
        oListItem.set_item('Special_x0020_Achievement', oTargetsArray[oTempEIDPool[i]]["SpecialAchievement"]);
        oListItem.set_item('Impediment_x0020_to_x0020_perfor', oTargetsArray[oTempEIDPool[i]]["Impediment"]);
        
    oListItem.update();

    context.load(oListItem);

		if(i % 200 === 0){
			context.executeQueryAsync(Function.createDelegate(this, function () {
				//alert("List Updated");
			}), Function.createDelegate(this, function () {
				// stop.. error
				alert("Error occured while updating role master list");
			}));
		}
	}
	
	context.executeQueryAsync(Function.createDelegate(this, function () {
		alert("List Updated");
		$("#proceed").hide();
		RequestEnded();
	}), Function.createDelegate(this, function () {
		// stop.. error
		RequestEnded();
		alert("Error occured while updating role master list");
	}));
	
}
function unique(array){
    return $.grep(array,function(el,index){
        return index == $.inArray(el,array);
    });
}
// Loading
var waitDialog;
function RequestEnded(sender, args) {
  try {
    waitDialog.close();
    waitDialog = null;
  } catch (ex) { }
};
function ShowWaitDialog() {
   try {
      if (waitDialog == null) {
         waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Processing...', 'Generating Final EAS Result...', 150, 500);
      }
   } catch (ex) { }
};