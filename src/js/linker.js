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
		let url = `https://glassdoor-api-proxy.azurewebsites.net/api/gdinfo?company=${name}`;    
		
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
							<span>.</span><span>.</span><span>.</span>
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

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches("[data-control-name='job_card_company_link']")) {
					const name = node.childNodes[2].wholeText;
					appendGlassdoor(node, name);
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/search/* Right rail top card
var observer = new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		if (mutation.type == "childList") {
			for(let node of mutation.addedNodes) {
				node = node.parentNode;
				if (!(node instanceof HTMLElement)) continue;	// We track only elements, skip other nodes (e.g. text nodes)
			
				// Check the inserted element
				if (node.matches(".jobs-details-top-card__company-url") ||
					node.matches(".jobs-details-top-card__company-info")) {	// Company names w/o hrefs
					let name = node.innerText.split(/\r?\n/)[1];
					if (name !== 'Company Location') {	// No company name
						appendGlassdoor(node, name, twoLines=true);
					}
					else{
						node.parentNode.querySelectorAll(".glassdoor-label-wrapper").forEach(e => e.parentNode.removeChild(e));
					}
				}
			}
		}
		// On text change
		else if (mutation.type == "characterData") {
			let node = mutation.target.parentNode;
			if (!(node instanceof HTMLElement)) continue;	// We track only elements, skip other nodes (e.g. text nodes)

			// Check changed element
			if (node.matches(".jobs-details-top-card__company-url") ||
				node.matches(".jobs-details-top-card__company-info")) {	// Company names w/o hrefs
				let name = node.innerText.split(/\r?\n/)[1];
				if (name !== 'Company Location') {	// No company name
					appendGlassdoor(node, name, twoLines=true)
				}
				else{
					node.parentNode.querySelectorAll(".glassdoor-label-wrapper").forEach(e => e.parentNode.removeChild(e));
				}
			}
		}
	}
}).observe(document, {characterData: true, attributeFilter: [ "href" ], subtree: true, childList: true});

// /my-items/saved-jobs/*
[...document.querySelectorAll(".reusable-search__entity-results-list .entity-result__primary-subtitle")]
	.forEach(element => {
		const name = element.childNodes[2].textContent;
		appendGlassdoor(element, name, twoLines=false, classesToAdd="t-14");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".reusable-search__entity-results-list .entity-result__primary-subtitle")) {	
					const name = node.childNodes[2].textContent;
					appendGlassdoor(node, name, twoLines=false, classesToAdd="t-14"); 
				}
			}
		}
}).observe(document, {subtree: true, childList: true});


// /jobs
[...document.querySelectorAll(".jobs-blended-container .job-card-square__text--1-line .job-card-container__company-name")]
	.forEach(element => {
		const name = element.childNodes[2].wholeText;
		appendGlassdoor(element.parentNode, name, twoLines=true, classesToAdd="artdeco-entity-lockup__subtitle")
});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".jobs-blended-container .job-card-square__text--1-line .job-card-container__company-name")) {
					const name = node.childNodes[2].wholeText;
					appendGlassdoor(node.parentNode, name, twoLines=true, classesToAdd="artdeco-entity-lockup__subtitle")
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /company/*/jobs/ Recently posted jobs
[...document.querySelectorAll(".org-jobs-recently-posted-jobs-module .job-card-square__text--1-line .job-card-container__company-name")]
	.forEach(element => {
		const name = element.childNodes[2].wholeText;
		appendGlassdoor(element.parentNode, name, twoLines=true, classesToAdd="artdeco-entity-lockup__subtitle")
});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".org-jobs-recently-posted-jobs-module .job-card-square__text--1-line .job-card-container__company-name")) {
					const name = node.childNodes[2].wholeText;
					appendGlassdoor(node.parentNode, name, twoLines=true, classesToAdd="artdeco-entity-lockup__subtitle")
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /company/*
[...document.querySelectorAll(".org-top-card-summary__title")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=false, classesToAdd="t-14");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".org-top-card-summary__title")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=false, classesToAdd="t-14");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/view/* Top card
[...document.querySelectorAll(".jobs-top-card__company-url")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode, name, twoLines=false, classesToAdd="t-14");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".jobs-top-card__company-url")) {
					const name = node.textContent;
					appendGlassdoor(node.parentNode, name, twoLines=false, classesToAdd="t-14");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/view/* Similar jobs
[...document.querySelectorAll(".job-card--tile .t-14")]
	.forEach(element => {
		const name = element.wholeText;
		appendGlassdoor(element, name, twoLines=true, classesToAdd="t-12")
});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".job-card--tile .t-14")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=true, classesToAdd="t-12"); 
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

/************************************* Guest UI *************************************/
// /jobs/* Left result list and /jobs/view/* Bottom results list  
[...document.querySelectorAll(".job-result-card__subtitle-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name);
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".job-result-card")) {
					const nameNode = node.querySelector(".job-result-card__subtitle-link");
					const name = nameNode.textContent;
					appendGlassdoor(nameNode, name);
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/* Right top card
new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".topcard")) {
					const nameNode = node.querySelector(".topcard__org-name-link")
					const name = nameNode.textContent;
					appendGlassdoor(nameNode.parentNode.parentNode, name);
				}
			}
		}
}).observe(document, {subtree: true, childList: true, attributes: true});

// /jobs/view/* Top card
[...document.querySelectorAll(".topcard__org-name-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode.parentNode, name);
	});
	
// /jobs/view/* Right rail
[...document.querySelectorAll(".people-also-viewed__list .result-card__subtitle--reduced-whitespace")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=true, classesToAdd="result-card__subtitle--reduced-whitespace");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".people-also-viewed__list .result-card__subtitle--reduced-whitespace")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=true, classesToAdd="result-card__subtitle--reduced-whitespace");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /company/* Right Rail
[...document.querySelectorAll(".show-more-less__list .result-card__title--reduced-whitespace")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=true, "result-card__subtitle result-card__subtitle--reduced-whitespace");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)
				
				// check the inserted element
				if (node.matches(".show-more-less__list .result-card__title--reduced-whitespace")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=true, "result-card__subtitle result-card__subtitle--reduced-whitespace");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});
	
// /company/* Top card
[...document.querySelectorAll(":not(.profile) .top-card-layout__title")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name);
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(":not(.profile) .top-card-layout__title")) {
					const name = node.textContent;
					appendGlassdoor(node, name);
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

/* ================================= Google for Jobs ================================= */
// Left results list
function addRatingsToGoogleResults(node){
	[...node.querySelectorAll('.gws-plugins-horizon-jobs__li-ed > div > div > .gws-plugins-horizon-jobs__tl-lif > div > div > div:nth-of-type(3) > div > div:nth-of-type(1)')]
		.forEach(nameNode => {
			const name = nameNode.textContent;
			appendGlassdoor(nameNode, name, twoLines=true);
	});
}

// Initial left results list load
addRatingsToGoogleResults(document);

// Add ratings when jobs load
new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				if (node.querySelector('.gws-plugins-horizon-jobs__li-ed')) {
					addRatingsToGoogleResults(node);
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// Right details page
function addRatingsToGoogleDetails(node) {
	[...node.querySelectorAll('#gws-plugins-horizon-jobs__job_details_page > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1)')]
	.forEach(nameNode => {
		const name = nameNode.textContent;
		appendGlassdoor(nameNode, name, twoLines=true);
	});
}

// Initial right details page load
new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// When new batch of jobs load
				if (node.querySelector('#gws-plugins-horizon-jobs__job_details_page > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1)')) {
					addRatingsToGoogleDetails(document);
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// Add ratings when a new job is selected
new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		if(mutation.attributeName === 'class'){
			if(mutation.target.classList.contains('tl-item-selected')){
				addRatingsToGoogleDetails(document);
				// addRatingsToGoogleResults(document); // Add ratings to left results list when you switch to saved jobs
			}
		}
	}
}).observe(document, {subtree: true, childList: true, attributes: true, });

console.log('inDoors loaded');