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
/* Save ratings into local storage, and keep track of how old it is */
var save = function(name, info) {
	localStorage[name] = info;
	var date = new Date();
	localStorage["gd-retrieval-date"] = date.toDateString();
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
    var storageTime = new Date(localStorage["gd-retrieval-date"]);
    /* Used for calculating how old the data in local storage is */
    var oneDay = 24*60*60*1000;

    if(checkDatabase(name) && 
    	Math.round(Math.abs((currentDate.getTime() - storageTime.getTime())/(oneDay))) < 7) {
			/* Database entry hit - Use recent data from in localstorage. */
			var storageData = JSON.parse(load(name));
			element.parent().find(".glassdoor-rating").html(`${storageData.overallRating} out of ${storageData.numberOfRatings} ratings`);
			element.parent().find(".glassdoor-link").attr("href", storageData.url);
    } else {
    	/* Database entry miss - Send new HTTP Request to Glassdoor API for rating info */
		var xmlhttp = new XMLHttpRequest();
		var proxyurl = "https://glassdoor-cors-proxy.herokuapp.com/";
		var url = "https://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=" + partnerid + "&t.k=" + apikey + "&action=employers&userip=" + genIP() + "&useragent=" + navigator.userAgent + "&q=" + name;
		xmlhttp.open("GET", proxyurl + url, true);

		
		xmlhttp.onreadystatechange = function() {
		    if (xmlhttp.status == 200) {
				/* GET Successful, parse data into JSON object */
				var response = JSON.parse(xmlhttp.responseText || "null");
				if (response != null) {
				    if (response["success"] == true) {
						var employer = response["response"].employers[0];
						if(employer){
							var reviewsUrl = `https://www.glassdoor.com/Reviews/${name}-Reviews-E${employer.id}.htm`
							var info = {
								overallRating: employer.overallRating,
								numberOfRatings: employer.numberOfRatings,
								url: reviewsUrl,
							}
							save(name, JSON.stringify(info));
							element.parent().find(".glassdoor-rating").html(`${info.overallRating} out of ${info.numberOfRatings} ratings`);
							element.parent().find(".glassdoor-link").attr("href", info.url);
						}
				    }
				    if (response["success"] == false) {
				    	/* GET Successful, but access denied error */
					var message = "Requests throttled by Glassdoor. Try again in a few minutes";
					element.parent().find(".glassdoor-rating").html(message);
				    }
				}
				else{
					element.parent().find(".glassdoor-rating").html("N/A");
				}
		    } else {
				/* GET Unsuccessful */
				var message = "Could not contact Glassdoor servers"
				element.parent().find("glassdoor-rating").html(message);
		    }
		};
		xmlhttp.send();
    }
}

/* Append a rating box to the end of each description element */
function appendWrapper(node){
	node.parent().append(
		`<div class='glassdoor-label-wrapper'>
			<div class='glassdoor-label'>
				<div class='tbl'>
					<a class='glassdoor-link cell middle padRtSm'>
						Rating: 
						<span class='glassdoor-rating'>
						<span class="loading"><span>.</span><span>.</span><span>.</span></span>
					</a>
					<div class='cell middle padRtSm'>
						powered by
					</div>
					<div class='cell middle'>
						<a href='https://www.glassdoor.com/index.htm'>
							<img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search'>
						</a>
					</div>
				</div>
			<div>
		</div>`
	);
}

function appendRating(node){
	/* Each description class element will have the company name */
	var name = node.contents()
					.filter(function() { 
						return !!$.trim( this.innerHTML || this.data ); 
					})
					.first()
					.text();

	/* To avoid misdirected name searches */	
	const replaceManyStr = (obj, sentence) => obj.reduce((f, s) => `${f}`.replace(Object.keys(s)[0], s[Object.keys(s)[0]]), sentence)
	name = replaceManyStr(misdirectArray, name);

	if(typeof(name) !== "undefined") { 
		/* If we're in this loop, this was a valid company name. 
		Grab the company name and strip it of HTML tags */
		var cleanname = name.replace("<b>","").replace("</b>","");
		gdinfo(node, cleanname);
	}
}

$("[data-control-name='job_card_company_link']").each(function() {
	appendWrapper($(this));
	appendRating($(this));
});

$(document).arrive("[data-control-name='job_card_company_link']", function(){
	appendWrapper($(this));
	appendRating($(this));
});

// /* Each description class element will have the company name */
// $("[data-control-name='job_card_company_link']").each(function() {
// 	appendRating($(this));
// });

/* Force DOM to refresh when new page is clicked */
$(".pagination a").click(function() {
	window.location.reload();
});

/* Force DOM to refresh when new search is started */
$(".submit-advs").click(function() {
	window.location.reload();
});

/* Force DOM to refresh when new search criteria is added */
$(".label-container").click(function() {
	window.location.reload();
});

console.log('Glassdoor-Linkedinator loaded');