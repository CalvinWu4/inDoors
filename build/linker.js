/*****************************************************
This script is activated on Linkedin search pages. It will attach
a hover event onto company names that appear in search results
*****************************************************/

// Check if company is already in localstorage
var checkDatabase = function(name) {
	return localStorage[name] ? true : false;
}

// Save ratings into local storage, and keep track of how old it is
var save = function(name, info) {
	localStorage[name] = info;
	var date = new Date();
	localStorage["gd-retrieval-date"] = date.toDateString();
}

// Load rating
var load = function(name) {
    return localStorage[name];
}

// Convert 2500 to 2.5K
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

// Update the rating after the Glassdoor data is fetched
function updateRating(element, data){
	const link = element.querySelector("#glassdoor-link");
	link.setAttribute("href", data.url);
	link.addEventListener('click', function (e) {
		e.stopPropagation();
	});

	if(data.overallRating != null && data.numberOfRatings != null){
		const rating = element.querySelector(".glassdoor-rating");
		const reviews = element.querySelector(".glassdoor-reviews");
		const loading = element.querySelector(".loading");

		loading.classList.add("display-none");
		rating.classList.remove("display-none");
		reviews.classList.remove("display-none");
		rating.innerHTML = data.overallRating !== "0" ? `${data.overallRating} ★` : `N/A ★`;
		reviews.innerHTML = `• ${data.numberOfRatings} Reviews`;
	}
	else{
		link.innerHTML = ("Company not found");
	}
}

// Grab the Glassdoor data for the company name and update the HTML
var gdinfo = async function (element, name) {
    var currentDate = new Date();
	var storageTime = new Date(localStorage["gd-retrieval-date"]);
    // Used for calculating how old the data in local storage is
	var oneDay = 24*60*60*1000;

    if(checkDatabase(name) && 
    	Math.round(Math.abs((currentDate.getTime() - storageTime.getTime())/(oneDay))) < 7) {
			// Database entry hit - Use recent data from in localstorage.
			var storageData = JSON.parse(load(name));
			updateRating(element, storageData);
    } else {
    	// Database entry miss - Send new HTTP Request to Glassdoor API for rating info
		let reqHeader = new Headers();
		reqHeader.append('Content-Type', 'text/json');

		const initObject = {
			method: 'GET', headers: reqHeader,
		};
		const proxyUrl = 'https://glassdoor-cors-proxy.herokuapp.com/'
		const url = `https://glassdoor-search.netlify.app/.netlify/functions/gdinfo?company=${name}`;    

		const response = await fetch(proxyUrl + url, initObject);
		
		// Convert a tag to span tag
		function linkToSpan(message){
			const link = element.querySelector("#glassdoor-link");
			let span = document.createElement('span');
			span.innerHTML = message;

			if (link) {
				link.hasAttribute('id') && link.removeAttribute('id');
				link.parentNode.replaceChild(span, link);
			}
		}

		if (response.ok) {
			const json = await response.json();
			const data = json.response;
			// Take first three employers from search
			const employers = data.employers.slice(0, 3);
			// See which employers exactly match given employer name
			const exactMatchEmployers = employers.filter(function (e) {
				// Remove location in parentheses in search results
				parenthesesRegex = /\s*\(.*?\)\s*/g;
				return name.toLowerCase() === e.name.toLowerCase().replace(parenthesesRegex, "");
			});

			// Prioritize exact matches over first in Glassdoor search results
			let employer;
			if(exactMatchEmployers.length > 0) {
				if(exactMatchEmployers.length > 1) {
					// If there are multiple exact matches, choose employer with most number of ratings
					employer = exactMatchEmployers.reduce(function(prev, current) {
						return current.numberOfRatings > prev.numberOfRatings ? current : prev;
					});
				}
				else{
					employer = exactMatchEmployers[0];
				}
			}
			// If there are no exact matches, choose the first one
			else{
				employer = employers[0];
			}
				
			var reviewsUrl;
			var info;

			if(employer){
				// Insert link to employer reviews
				reviewsUrl = `https://www.glassdoor.com/Reviews/${name}-Reviews-E${employer.id}.htm`
				info = {
					overallRating: employer.overallRating,
					numberOfRatings: kFormatter(employer.numberOfRatings),
					url: reviewsUrl,
				}
			}
			else{
				// Insert link to search page if employer can't be found
				reviewsUrl = data.attributionURL;
				info = {
					url: reviewsUrl,
				}
			}
			updateRating(element, info);
			save(name, JSON.stringify(info));
		}
		else {
			// GET Unsuccessful
			var message = "Could not contact Glassdoor servers";
			linkToSpan(message);		    
		}
	};
}

// Append the rating wrapper after the company name element
function appendWrapper(element, twoLines=false, classes=false){
	element.parentNode.querySelectorAll(".glassdoor-label-wrapper").forEach(e => e.parentNode.removeChild(e));

	element.insertAdjacentHTML('afterend',
		`<div class='glassdoor-label-wrapper ${classes ? classes : ""}'>
			<div class='glassdoor-label'>
				<div class='tbl'>
					<a id='glassdoor-link' ${!twoLines ? "class='cell middle padRtSm'" : ""}>
						<span class='glassdoor-rating display-none'>★</span>
						<span class='glassdoor-reviews display-none'>•</span>
						<span class='loading'><span>.</span><span>.</span><span>.</span></span>
					</a>
					<div class='cell middle padRtSm'>
						powered by
					</div>
					<div class='cell middle logo-wrapper'>
						<div class='cell middle'>
							<a href='https://www.glassdoor.com/index.htm'>
								<img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search'>
							</a>
						</div>
					</div>
				</div>
			<div>
		</div>`
	);
}

// Insert the rating data into the rating wrapper
function addRating(element, name){
	// Remove whitespace
	name = name.trim();

	// To avoid misdirected name searches
	const replaceManyStr = (obj, sentence) => obj.reduce((f, s) => `${f}`.replace(Object.keys(s)[0], s[Object.keys(s)[0]]), sentence)
	name = replaceManyStr(misdirectArray, name);

	// Remove ampersands because Glassdoor URL's don't work with them
	name = name.replace("&", "");

	// Remove accents/diacritics
	const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	name = normalize(name);

	// Remove text after colons, and vertical bars and dashes surrounded by spaces
	name = name.replace(/(\:|(\s\-\s)|(\s\|\s)|(\s\–\s)).*$/, "");

	// Remove company suffixes 
	name = name.replace(/®|™|(Inc\.)|(Inc)|\sLP|\sPBC/, "");

	gdinfo(element, name.trim());
}

function appendGlassdoor(element, name, twoLines=false, classes=false){
	appendWrapper(element, twoLines, classes);
	// Get company name
	addRating(element.nextSibling, name);
}

// linkedin.com/jobs/search/*
// Left result list
[...document.querySelectorAll("[data-control-name='job_card_company_link']")]
	.forEach(element => {
		const name = element.childNodes[2].wholeText;
		appendGlassdoor(element, name);
	});

document.arrive("[data-control-name='job_card_company_link']", function(element) {
	const name = element.childNodes[2].wholeText;
	appendGlassdoor(element, name); 
});

// Right rail
document.arrive(".jobs-details-top-card__company-url", function(element) {
	let name = element.textContent;
	appendGlassdoor(element.parentNode, name, twoLines=true)

	var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function() {
			name = element.textContent;
			appendGlassdoor(element.parentNode, name, twoLines=true)
		});
	});
	observer.observe(element, { attributeFilter: [ "href" ],   subtree: true});
});

// (Logged out UI) Left result list 
[...document.querySelectorAll(".jobs-search__results-list .job-result-card__subtitle-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name);
	});

document.arrive(".jobs-search__results-list .job-result-card__subtitle-link", function(element) {
	const name = element.textContent;
	appendGlassdoor(element, name);
});

// linkedin.com/my-items/saved-jobs/*
[...document.querySelectorAll(".entity-result__primary-subtitle")]
	.forEach(element => {
		const name = element.childNodes[2].textContent;
		appendGlassdoor(element, name);
	});

document.arrive(".entity-result__primary-subtitle", function(element) {
	const name = element.childNodes[2].textContent;
	appendGlassdoor(element, name); 
});

// linkedin.com/jobs
[...document.querySelectorAll(".job-card-square__text--1-line .job-card-container__company-name")]
	.forEach(element => {
		const name = element.childNodes[2].wholeText;
		appendGlassdoor(element.parentNode, name, twoLines=true, classes="artdeco-entity-lockup__subtitle")
});

document.arrive(".job-card-square__text--1-line .job-card-container__company-name", function(element) {
	const name = element.childNodes[2].wholeText;
	appendGlassdoor(element.parentNode, name, twoLines=true, classes="artdeco-entity-lockup__subtitle")
});

// https://www.linkedin.com/company/*
[...document.querySelectorAll(".org-top-card-summary__title")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name);
	});
	
document.arrive(".org-top-card-summary__title", function(element) {
	const name = element.textContent;
	appendGlassdoor(element, name);
});

// https://www.linkedin.com/jobs/view/*
[...document.querySelectorAll(".jobs-top-card__company-url")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode, name);
	});

document.arrive(".jobs-top-card__company-url", function(element) {
	const name = element.textContent;
	appendGlassdoor(element.parentNode, name);
});

// (Logged out UI) Top card
[...document.querySelectorAll(".topcard__org-name-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode.parentNode, name);
	});

document.arrive(".topcard__org-name-link", function(element) {
	const name = element.textContent;
	appendGlassdoor(element.parentNode.parentNode, name);
});

// (Logged out UI) Job tiles
[...document.querySelectorAll(".job-result-tile .job-result-card__subtitle-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode, name, twoLines=true);
	});

document.arrive(".job-result-tile .job-result-card__subtitle-link", function(element) {
	const name = element.textContent;
	appendGlassdoor(element.parentNode, name, twoLines=true);
});	

// (Logged out UI) Right rail
[...document.querySelectorAll(".result-card__subtitle--reduced-whitespace")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=true);
	});


console.log('Glassdoor-Linkedinator loaded');