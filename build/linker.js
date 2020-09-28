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

/* Convert 2500 to 2.5K */
function kFormatter(num) {
	if (num > 9999) {
		return (num/10000).toFixed(1)*10 + 'k'
	}
    else if (num > 999) {
		return (num/1000).toFixed(1) + 'k'
	}
	else{
		return num;
	}
}


function updateHtmlFromData(element, data){	
	const link = element.querySelector("#glassdoor-link");
	link.setAttribute("href", data.url);

	if(data.overallRating && data.numberOfRatings){
		const rating = element.querySelector(".glassdoor-rating");
		const reviews = element.querySelector(".glassdoor-reviews");
		const loading = element.querySelector(".loading");

		loading.classList.add("display-none");
		rating.classList.remove("display-none");
		reviews.classList.remove("display-none");
		rating.innerHTML = `${data.overallRating} ★`;
		reviews.innerHTML = `• ${data.numberOfRatings} Reviews`;
	}
	else{
		link.innerHTML = ("Rating not found");
	}
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
			updateHtmlFromData(element, storageData);
    } else {
    	/* Database entry miss - Send new HTTP Request to Glassdoor API for rating info */
		var xmlhttp = new XMLHttpRequest();

		const proxyUrl = 'https://glassdoor-cors-proxy.herokuapp.com/'
		const url = `https://glassdoor-search.netlify.app/.netlify/functions/gdinfo?company=${name}`;    

		xmlhttp.open("GET", proxyUrl + url, true);

		xmlhttp.onreadystatechange = function() {
				function linkToSpan(message){
					const link = element.querySelector("#glassdoor-link");
					let span = document.createElement('span');
					span.innerHTML = message;

					link.removeAttribute('id');
					link.parentNode.replaceChild(span, link);
				}

		    if (xmlhttp.status == 200) {
				/* GET Successful, parse data into JSON object */
				var response = JSON.parse(xmlhttp.responseText || "null");

				if (response != null) {

				    if (response["success"] == true) {
						var employer = response["response"].employers[0];
						var reviewsUrl;
						var info;

						if(employer){
							reviewsUrl = `https://www.glassdoor.com/Reviews/${name}-Reviews-E${employer.id}.htm`
							info = {
								overallRating: employer.overallRating,
								numberOfRatings: kFormatter(employer.numberOfRatings),
								url: reviewsUrl,
							}
						}
						else{
							reviewsUrl = response["response"].attributionURL;
							info = {
								url: reviewsUrl,
							}
						}
						updateHtmlFromData(element, info);
						save(name, JSON.stringify(info));
				    }
				    if (response["success"] == false) {
				    	/* GET Successful, but access denied error */
						var message = "Requests throttled by Glassdoor. Try again in a few minutes";
						linkToSpan(message);
				    }
				}
			}
			else {
				/* GET Unsuccessful */
				var message = "Could not contact Glassdoor servers"
				linkToSpan(message);		    
			}
		};
		xmlhttp.send();
    }
}

/* Append a rating box to the end of each description element */
function appendWrapper(element){
	element.insertAdjacentHTML('beforeend',
		`<div class='glassdoor-label-wrapper'>
			<div class='glassdoor-label'>
				<div class='tbl'>
					<a id='glassdoor-link' class='cell middle padRtSm'>
						<span class='glassdoor-rating display-none'>★</span>
						<span class='glassdoor-reviews display-none'>•</span>
						<span class='loading'><span>.</span><span>.</span><span>.</span></span>
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

//
function appendRating(element){
	/* Each description class element will have the company name */
	var name = element.childNodes[2].textContent;

	/* To avoid misdirected name searches */	
	const replaceManyStr = (obj, sentence) => obj.reduce((f, s) => `${f}`.replace(Object.keys(s)[0], s[Object.keys(s)[0]]), sentence)
	name = replaceManyStr(misdirectArray, name);

	if(typeof(name) !== "undefined") { 
		/* If we're in this loop, this was a valid company name. 
		Grab the company name and strip it of HTML tags */
		var cleanname = name.replace("<b>","").replace("</b>","");
		gdinfo(element, cleanname);
	}
}

// linkedin.com/jobs/search/*
if(window.location.href.includes("jobs/search")){
	document.arrive("[data-control-name='job_card_company_link']", function(newElem) {
		const parentNode = newElem.parentNode;
		appendWrapper(parentNode); 
		appendRating(parentNode);
	});
}

// linkedin.com/my-items/saved-jobs/?cardType=SAVED
document.arrive(".entity-result__primary-subtitle", function(newElem) {
	appendWrapper(newElem); 
	appendRating(newElem);
});

console.log('Glassdoor-Linkedinator loaded');