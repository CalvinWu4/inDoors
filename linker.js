/*****************************************************
This script is activated on Linkedin search pages. It will attach
a hover event onto company names that appear in search results
*****************************************************/

/* Each description class element will have the company name */
$(".description").each(function() {
	var link = $(this).find("bdi").find("a");
	var name = link.html();

	if(typeof(name) !== "undefined") { 
		/* If we're in this loop, this was a valid company name. 
		Grab the company name and strip it of HTML tags */
		var cleanname = name.replace("<b>","").replace("</b>","");
	    console.log(cleanname);
	}
});

/* Grab the GlassDoor Data given the company name */
var gdinfo = function (name) {
	var xmlhttp = new XMLHttpRequest();
	va rurl = "http://api.glassdoor.com/api/api.htm";
	
	var options = {
		"t.p" : 000000,	/* Don't commit ID or Key to git */
		"t.k" : "API KEY", /* Don't commit ID or Key to git */
		"format" : "json",
		"v" : 1,
		"action": "employers",
	}

}