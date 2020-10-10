/*****************************************************
This script is activated on Linkedin pages.
Adds Glassdoor ratings for companies on LinkedIn
*****************************************************/

// Update the glassdoor link after the Glassdoor data is fetched
function updateRating(element, data){
	let link = element.querySelector("#glassdoor-link");

	if(data){
		if(data.overallRating != null && data.numberOfRatings != null){
			const rating = element.querySelector(".glassdoor-rating");
			const reviews = element.querySelector(".glassdoor-reviews");
			const loading = element.querySelector(".loading");

			loading.classList.add("display-none");
			rating.classList.remove("display-none");
			reviews.classList.remove("display-none");
			
			if(data.overallRating !== "0"){
				rating.textContent = `${data.overallRating} ★`;
			}
			else{
				rating.textContent = `N/A ★`;
			}
			reviews.textContent = ` • ${data.numberOfRatings} Reviews`;
		}
		else{
			link.textContent = ("Company not found");
		}
		// Make glassdoor-link an actual link 
		spanToLink(link);
		link = element.querySelector("#glassdoor-link");
		link.setAttribute("href", data.url);
		link.setAttribute("target", "_blank");
		link.addEventListener('click', function (e) {
			e.stopPropagation();
		});
	}
	else{
		link.textContent = "Could not contact Glassdoor servers"
	}
}

// Grab the rating data for the company name and insert it into the rating wrapper
var addRating = async function (element, name) {
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

		let initObject = {
			method: 'GET', headers: reqHeader,
		};

		const proxyUrl = 'https://glassdoor-cors-proxy.herokuapp.com/'
		let url = `https://glassdoor-search.netlify.app/.netlify/functions/gdinfo?company=${name}`;    
		
		if (navigator.userAgent.indexOf("Chrome") != -1) {
			url = proxyUrl + url;
		}
		
		const response = await fetch(url, initObject);

		if (response.ok) {
			const json = await response.json();
			const data = json.response;
			// Take first three employers from search
			const employers = data.employers.slice(0, 3);
			// See which employers exactly match given employer name
			const exactMatchEmployers = employers.filter(function (e) {
				// Remove parenthesized location in search results
				return name.toLowerCase() === e.name.toLowerCase().replace(parenthesesRegex, "");
			});

			// Prioritize exact matches over first in Glassdoor search results
			let employer;
			if(exactMatchEmployers.length > 0) {
				if(exactMatchEmployers.length > 1) {
					// If there are multiple exact matches, choose employer with most number of ratings
					employer = exactMatchEmployers.reduce(function(prev, current) {
						if (current.numberOfRatings > prev.numberOfRatings) {
							return current;
						} else {
							return prev;
						}
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
			var returnData;

			if(employer){
				// Insert link to employer reviews
				reviewsUrl = `https://www.glassdoor.com/Reviews/${name}-Reviews-E${employer.id}.htm`
				returnData = {
					overallRating: employer.overallRating,
					numberOfRatings: kFormatter(employer.numberOfRatings),
					url: reviewsUrl,
				}
			}
			else{
				// Insert link to search page if employer can't be found
				reviewsUrl = data.attributionURL;
				returnData = {
					url: reviewsUrl,
				}
			}
			updateRating(element, returnData);
			save(name, JSON.stringify(returnData));
		}
		else {
			// GET Unsuccessful
			updateRating(element, null);
			const link = element.querySelector("#glassdoor-link");
		}
	};
}

// Append the rating wrapper after the company name element
function appendWrapper(element, twoLines=false, classesToAdd=""){
	element.parentNode.querySelectorAll(".glassdoor-label-wrapper").forEach(e => e.parentNode.removeChild(e));
	element.insertAdjacentHTML("afterend", DOMPurify.sanitize(
		`<div class='glassdoor-label-wrapper ${classesToAdd ? classesToAdd : ""}'>
			<div class='glassdoor-label'>
				<div class='tbl'>
					<span id='glassdoor-link' ${!twoLines ? "class='cell middle pad-right'" : ""}>
						<span class='glassdoor-rating display-none'>★</span>
						<span class='glassdoor-reviews display-none'>•</span>
						<span class='loading'>
							<span>.</span>
							<span>.</span>
							<span>.</span>
						</span>
					</span>
					<div class='cell middle pad-right second-line'>
						powered by
					</div>
					<div class='cell middle logo-wrapper second-line'>
						<a href='https://www.glassdoor.com/index.htm'>
							<img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search'>
						</a>
					</div>
				</div>
			<div>
		</div>`
	));
}

function appendGlassdoor(element, name, twoLines=false, classesToAdd=""){
	appendWrapper(element, twoLines, classesToAdd);
	// Get company name
	addRating(element.nextSibling, cleanCompanyName(name));
}

/************************************* Logged in UI *************************************/
// /jobs/search/* Left result list
[...document.querySelectorAll("[data-control-name='job_card_company_link']")]
	.forEach(element => {
		const name = element.childNodes[2].wholeText;
		appendGlassdoor(element, name);
	});

document.arrive("[data-control-name='job_card_company_link']", function(element) {
	const name = element.childNodes[2].wholeText;
	appendGlassdoor(element, name); 
});

// /jobs/search/* Right rail top card
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

// /my-items/saved-jobs/*
[...document.querySelectorAll(".entity-result__primary-subtitle")]
	.forEach(element => {
		const name = element.childNodes[2].textContent;
		appendGlassdoor(element, name);
	});

document.arrive(".entity-result__primary-subtitle", function(element) {
	const name = element.childNodes[2].textContent;
	appendGlassdoor(element, name); 
});

// /jobs
[...document.querySelectorAll(".jobs-blended-container .job-card-square__text--1-line .job-card-container__company-name")]
	.forEach(element => {
		const name = element.childNodes[2].wholeText;
		appendGlassdoor(element.parentNode, name, twoLines=true)
});

document.arrive(".jobs-blended-container .job-card-square__text--1-line .job-card-container__company-name", function(element) {
	const name = element.childNodes[2].wholeText;
	appendGlassdoor(element.parentNode, name, twoLines=true)
});

// /company/*/jobs/ (Recently posted jobs)
[...document.querySelectorAll(".org-jobs-recently-posted-jobs-module .job-card-square__text--1-line .job-card-container__company-name")]
	.forEach(element => {
		const name = element.childNodes[2].wholeText;
		appendGlassdoor(element.parentNode, name, twoLines=true, classesToAdd="artdeco-entity-lockup__subtitle")
});

document.arrive(".org-jobs-recently-posted-jobs-module .job-card-square__text--1-line .job-card-container__company-name", function(element) {
	const name = element.childNodes[2].wholeText;
	appendGlassdoor(element.parentNode, name, twoLines=true, classesToAdd="artdeco-entity-lockup__subtitle")
});

// /company/*
[...document.querySelectorAll(".org-top-card-summary__title")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=false, classesToAdd="t-14");
	});

document.arrive(".org-top-card-summary__title", function(element) {
	const name = element.textContent;
	appendGlassdoor(element, name, twoLines=false, classesToAdd="t-14");
});


// /jobs/view/*
[...document.querySelectorAll(".jobs-top-card__company-url")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode, name, twoLines=false, classesToAdd="t-14");
	});

document.arrive(".jobs-top-card__company-url", function(element) {
	const name = element.textContent;
	appendGlassdoor(element.parentNode, name, twoLines=false, classesToAdd="t-14");
});

/************************************* Guest UI *************************************/
// /jobs/view/* Top card
[...document.querySelectorAll(".topcard__org-name-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode.parentNode, name);
	});

document.arrive(".topcard__org-name-link", function(element) {
	const name = element.textContent;
	appendGlassdoor(element.parentNode.parentNode, name);
});

// /jobs/view/* Right rail
[...document.querySelectorAll(".people-also-viewed__list .result-card__subtitle--reduced-whitespace")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=true);
	});

document.arrive(".people-also-viewed__list .result-card__subtitle--reduced-whitespace", function(element) {
	const name = element.textContent;
	appendGlassdoor(element, name, twoLines=true);
});
	
// /jobs/* Left result list and /jobs/view/* Bottom results list  
[...document.querySelectorAll(".job-result-card__subtitle-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name);
	});

document.arrive(".job-result-card__subtitle-link", function(element) {
	const name = element.textContent;
	appendGlassdoor(element, name);
});

// /organization-guest/company/* Right Rail
[...document.querySelectorAll(".show-more-less__list .result-card__title--reduced-whitespace")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=true);
	});

document.arrive(".show-more-less__list .result-card__title--reduced-whitespace", function(element) {
	const name = element.textContent;
	appendGlassdoor(element, name, twoLines=true);
});

// /organization-guest/company/* Top card
[...document.querySelectorAll(".top-card-layout__title")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name);
	});

document.arrive(".top-card-layout__title", function(element) {
	const name = element.textContent;
	appendGlassdoor(element, name);
});

console.log('Glassdoor-Linkedinator loaded');