/*****************************************************
This script is activated on Linkedin search pages. It will attach
a hover event onto company names that appear in search results
*****************************************************/

/* Grab the GlassDoor Data given the company name */
var gdurl = function (name) {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=" + partnerid + "&t.k=" + apikey + "&action=employers&userip=192.168.43.42&useragent=Mozilla/%2F4.0&q=" + name;
	return url;
}

/* Each description class element will have the company name */
$(".description").each(function() {
	var link = $(this).find("bdi").find("a");
	var name = link.html();

	if(typeof(name) !== "undefined") { 
		/* If we're in this loop, this was a valid company name. 
		Grab the company name and strip it of HTML tags */
		var cleanname = name.replace("<b>","").replace("</b>","");
		var url = gdurl(cleanname)
	}
});