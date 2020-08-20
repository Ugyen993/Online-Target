 
function initializePage() { 
	if("Edit" !== document.forms[MSOWebPartPageFormName]._wikiPageMode.value){
	    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model  
        var userId = _spPageContextInfo.userId;
        var assignedEID = _spPageContextInfo.userLoginName.substring(_spPageContextInfo.userLoginName.indexOf('\\') + 1).match(/\d+/)[0];
		var apiPath = _spPageContextInfo.webAbsoluteUrl + "/_api/Lists/getbytitle('Employee Target')/Items?$filter=((AuthorId eq " + userId + ") or (Subordinate_x0027_s_x0020_EID eq "+ assignedEID +"))&$orderby=StartDate desc&$top=4" ;  
		var apiPath2 = _spPageContextInfo.webAbsoluteUrl + "/_api/Lists/getbytitle('Employee Target')/Items?$filter=((AuthorId eq " + userId + ") or (Subordinate_x0027_s_x0020_EID eq "+ assignedEID +"))&$orderby=DueDate desc&$top=4" ;  
		
      
        //http://disc:5000/HRAD/Target/_api/Web/Lists/getbytitle('Employee%20Target')/Items?$filter=((AuthorId%20eq%2042)%20or%20(AssignedToId%20eq%2042))
        // apiPath = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Project Tasks')/Items?$filter=((AuthorId eq " + userId + ") or (AssignedTo eq" + userId+ "))";
		
		//$filter=(datetime('" + ReFormatTime() + "') ge dateFrom) and (datetime('" + ReFormatTime() + "') le dateTo)&$top=1

		GetListItems(apiPath, updateTaskItems);
		GetListItems(apiPath2, updateDelayItem)
	    
    }		
    function updateTaskItems(data){
		var items; // Data will have user object  
		var results; 
		var upcomingTaskBlockHTML = '';
	
		if (data != null) {  
			items = data.d;  
			if (items != null) {  
				results = items.results;  
				for (var i = 0; i < results.length; i++) {

				    upcomingTaskBlockHTML =	'<tr><td><div class="form-check"> <label class="form-check-label"> <input class="form-check-input" type="checkbox" value=""> <span class="form-check-sign"> <span class="check"></span>  </span> </label></div> </td> <td>  <p class="title">$targetDescription$</p> <p class="text-muted"><small>Due Date : $duedate$</small></p>  </td><td class="td-actions text-right"> <button type="button" rel="tooltip" title="" class="btn btn-link" data-original-title="Edit Task"><a href="$targeturl$"><i class="tim-icons icon-pencil"></i> </a></button>  </td> </tr>';
					//upcomingTaskBlockHTML = '<div class="row newsBlock"><div class="col-md-3 hidden-xs"><img src="$imgsrc$" class="img-responsive" style="height:105px;width:153px;"></div><div class="col-md-8 col-xs-12"><div class="news-title"><a href="$targeturl$"><h5 class="titleHead" title="title">titl</h5></a></div><div class="news-cats"><ul class="list-unstyled list-inline mb-1"><li class="list-inline-item"><i class="fa fa-calendar text-danger"></i><small>$duedate$</small></li></ul></div><div class="news-content"><p>$targetDescription$</p></div></div></div>';
					upcomingTaskBlockHTML = upcomingTaskBlockHTML.replace("$targeturl$", _spPageContextInfo.webAbsoluteUrl + "/Lists/Project%20Tasks/DispForm.aspx?ID=" + results[i].ID);
					//upcomingTaskBlockHTML = results[i].Image ? upcomingTaskBlockHTML.replace("$imgsrc$", results[i].Image.Url) : upcomingTaskBlockHTML.replace("$imgsrc$","");
					//upcomingTaskBlockHTML = upcomingTaskBlockHTML.replace(/titl/g, results[i].Title);
					upcomingTaskBlockHTML = results[i].DueDate ? upcomingTaskBlockHTML.replace("$duedate$", new Date(results[i].DueDate).format("dd MMM, yyyy")) : upcomingTaskBlockHTML.replace("$duedate$","");
					upcomingTaskBlockHTML = results[i].Title? upcomingTaskBlockHTML.replace("$targetDescription$", results[i].Title) : upcomingTaskBlockHTML.replace("$targetDescription$", "");
                   // $("#companyNews .card-body").append(upcomingTaskBlockHTML);
                    $("#upcomingTask .upcomingTaskBody").append(upcomingTaskBlockHTML);
				}
			} 
		}  
	} 
	function updateDelayItem(data){
		var items; // Data will have user object  
		var results; 
		var delayedTaskBlockHTML = '';

		if (data != null) {  
			items = data.d;  
			if (items != null) {  
				results = items.results;  
				for (var i = 0; i < results.length; i++) {

				    delayedTaskBlockHTML = '<tr><td><a href="$targeturl$"><h7 class="newsTitleHead" title="newstitle">title</h7></a></td>  <td>  $duedate$ </td> <td class="text-center">   $status$ </td>  </tr>';
					delayedTaskBlockHTML = delayedTaskBlockHTML.replace("$targeturl$", _spPageContextInfo.webAbsoluteUrl + "/Lists/Project%20Tasks/DispForm.aspx?ID=" + results[i].ID);
					delayedTaskBlockHTML = delayedTaskBlockHTML.replace(/title/g, results[i].Title);
					delayedTaskBlockHTML = results[i].DueDate ? delayedTaskBlockHTML.replace("$duedate$", new Date(results[i].DueDate).format("dd MMM, yyyy")) : delayedTaskBlockHTML.replace("$duedate$","");
					delayedTaskBlockHTML = results[i].Status? delayedTaskBlockHTML.replace("$status$", results[i].Status) : delayedTaskBlockHTML.replace("$status$", "");
                    $("#delayTask .delayTaskBody").append(delayedTaskBlockHTML);
				}
			} 
		}  
	} 	
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
}  

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

$(document).ready(function(){
	ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");  
	if (isMobileDevice()){
		var setWidth = $("#contentRow").width();
		setWidth = setWidth - 20;
		$(".videoSection .ms-webpart-chrome-vertical").width(setWidth);
		$(".videoSection .ms-WPBody").width(setWidth);
		$(".videoSection video").width(setWidth);	
	}
	$(".ms-webpart-zone").hide();
});