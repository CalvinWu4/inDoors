/*****************************************************
This script is activated on Linkedin search pages. It will attach
a hover event onto company names that appear in search results
*****************************************************/
/* Check if company is already in localstorage */
var checkDatabase = function(name) {
    if(localStorage[name]) {
	return true;
    }
    return false;
}
/* Saving things into local storage */
var save = function(addName,addRating) {
    var date = new Date();
    var employer = [addRating, date.getMonth(), date.getDate(), date.getYear()];
    localStorage[addName] = employer;
}

/* Load rating */
var load = function(name) {
    return localStorage[name];
}

/* IP Generator - Fix IP address blocking issues */
var genIP = function() {
	return randomInt() + "." + randomInt() + "." + randomInt() + "." + randomInt();
}

var randomInt = function () {
	return Math.floor((Math.random() * 220) + 15);
}

/* Grab the GlassDoor Data given the company name */
var gdinfo = function (element, name) {
    var currentDate = new Date();
    if(checkDatabase(name) && 
       !(currentDate.getFullYear() > load(name)[3] || 
	 currentDate.getMonth() > load(name)[1] || 
	 currentDate.getDate() - 7 >= load(name)[2])) {
	/* Database entry hit - No need to send new HTTP Request */
	console.log("Database entry hit");
	var rating = load(name)[0];
	element.find(".glassdoor-rating").html(rating);
    }
    else{
    	/* Database entry miss - Send new HTTP Request to Glassdoor API for rating info */
	console.log("new request");
	var xmlhttp = new XMLHttpRequest();
	var url = "https://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=" + partnerid + "&t.k=" + apikey + "&action=employers&userip=" + genIP() + "&useragent=" + navigator.userAgent + "&q=" + name;
	xmlhttp.open("GET", url, true);
	
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.status == 200) {
		console.log(url);
		/* GET Successful, parse data into JSON object */
		var response = JSON.parse(xmlhttp.responseText || "null");
		if (response != null) {
		    if(response["success"] == true) {
			var rating = response["response"].employers[0].overallRating;
			save(name,rating);
			element.find(".glassdoor-rating").html(rating);
		    }
		}
	    } else {
		/* GET Unsuccessful */
	    }
	};
	
	xmlhttp.send();
    }
}
    
/* Append a rating box to the end of each description element */
$(".description bdi").each( function() {
	$(this).append("<div class='glassdoor-label-wrapper'><div class='glassdoor-label'>Rating: <span class='glassdoor-rating'></span><div><a class='glassdoor-link' style='color:white' href='http://www.glassdoor.com/index.htm'>Powered by  <img style='margin-left:6px' src='http://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search' /></a></div></div></div>");
});

$(".description .glassdoor-label").each( function() {
	$(this).hide();
});

/* Each description class element will have the company name */
$(".description bdi").hover(function() {
	var link = $(this).find("a");
	var name = link.html();

	var element = $(this);
	if(typeof(name) !== "undefined") { 
		$(this).find(".glassdoor-label").toggle();
		/* If we're in this loop, this was a valid company name. 
		Grab the company name and strip it of HTML tags */
		var cleanname = name.replace("<b>","").replace("</b>","");
		var info = gdinfo(element, cleanname);
	}
});

/* Force DOM to refresh when new page is clicked */
$(".pagination a").click(function() {
	window.location.reload();
});