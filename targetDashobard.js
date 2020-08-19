ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");   
function initializePage() { 
	if("Edit" !== document.forms[MSOWebPartPageFormName]._wikiPageMode.value){
	    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model  
        var userId = _spPageContextInfo.userId;
        var assignedEID = _spPageContextInfo.userLoginName.substring(_spPageContextInfo.userLoginName.indexOf('\\') + 1).match(/\d+/)[0];
		var apiPath = _spPageContextInfo.webAbsoluteUrl +  apiPath  + "/_api/Lists/getbytitle('Employee Target')/Items?$filter=((AuthorId eq " + userId + ") or (Subordinate_x0027_s_x0020_EID eq"+ assignedEID +"))" ;  
        
        http://disc:5000/HRAD/Target/_api/Web/Lists/getbytitle('Employee%20Target')/Items?$filter=((AuthorId%20eq%2042)%20or%20(AssignedToId%20eq%2042))
        // apiPath = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getbytitle('Project Tasks')/Items?$filter=((AuthorId eq " + userId + ") or (AssignedTo eq" + userId+ "))";
        GetListItems(apiPath, updateNewsItems);
	    
	    fixCalendar();
    }		
    function updateNewsItems(data){
		var items; // Data will have user object  
		var results; 
		var newsBlockHTML = '';
		if (data != null) {  
			items = data.d;  
			if (items != null) {  
				results = items.results;  
				for (var i = 0; i < results.length; i++) {
					newsBlockHTML = '<div class="row newsBlock"><div class="col-md-3 hidden-xs"><img src="$imgsrc$" class="img-responsive" style="height:105px;width:153px;"></div><div class="col-md-8 col-xs-12"><div class="news-title"><a href="$newsurl$"><h5 class="newsTitleHead" title="newstitle">newstitle</h5></a></div><div class="news-cats"><ul class="list-unstyled list-inline mb-1"><li class="list-inline-item"><i class="fa fa-calendar text-danger"></i><small>$publisheddate$</small></li></ul></div><div class="news-content"><p>$newsshortdesc$</p></div></div></div>';
					newsBlockHTML = newsBlockHTML.replace("$newsurl$", _spPageContextInfo.siteAbsoluteUrl + "/Lists/News%20and%20Events/DispForm.aspx?ID=" + results[i].ID);
					newsBlockHTML = results[i].Image ? newsBlockHTML.replace("$imgsrc$", results[i].Image.Url) : newsBlockHTML.replace("$imgsrc$","");
					newsBlockHTML = newsBlockHTML.replace(/newstitle/g, results[i].Title);
					newsBlockHTML = results[i].PublishedDate ? newsBlockHTML.replace("$publisheddate$", new Date(results[i].PublishedDate).format("dd MMM, yyyy")) : newsBlockHTML.replace("$publisheddate$","");
					newsBlockHTML = results[i].ShortDescription? newsBlockHTML.replace("$newsshortdesc$", results[i].ShortDescription) : newsBlockHTML.replace("$newsshortdesc$", "");
					$("#companyNews .card-body").append(newsBlockHTML);
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
	if (isMobileDevice()){
		var setWidth = $("#contentRow").width();
		setWidth = setWidth - 20;
		$(".videoSection .ms-webpart-chrome-vertical").width(setWidth);
		$(".videoSection .ms-WPBody").width(setWidth);
		$(".videoSection video").width(setWidth);	
	}
	$(".ms-webpart-zone").hide();
});