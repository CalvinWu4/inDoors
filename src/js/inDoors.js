/*****************************************************
This script is activated on all pages.
Adds Glassdoor ratings to companies.
*****************************************************/

// Update the glassdoor link after the Glassdoor data is fetched
function updateRating(element, data){
	let link = element.querySelector("#glassdoor-link");
	let addTooltip = false;

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
			addTooltip = true;
		}
		else{
			link.textContent = ("Company not found");
		}
		// Make glassdoor-link an actual link 
		spanToAnchor(link);
		link = element.querySelector("#glassdoor-link");
		link.setAttribute("href", data.url);
		link.setAttribute("target", "_blank");
		link.addEventListener('click', function (e) {
			e.stopPropagation();
		});
		addTooltip &&
		tippy(link, {
			content: '<strong>Bolded content</strong>',
			allowHTML: true,
			arrow: false,
			placement: 'bottom-start',
			offset: [0, 0],
			interactive: true
		});
	}
	else{
		link.textContent = "Error retrieving rating";
	}
}

// Grab the rating data for the company name and insert it into the rating wrapper
async function addRating(element, name, originalName=null) {
	name = name.toLowerCase();
    var currentDate = new Date();
	var storageTime = new Date(localStorage[`gd-${originalName ? originalName: name}-retrieval-date`]);
    // Used for calculating how old this company's data in local storage is
	var oneDay = 24*60*60*1000;

    if(checkDatabase(name) && 
    	Math.round(Math.abs((currentDate.getTime() - storageTime.getTime())/(oneDay))) < 7) {
			// Database entry hit - Use recent data from in localstorage.
			var storageData = JSON.parse(load(name));
			updateRating(element, storageData);
    } else {
    	// Database entry miss - Send new HTTP Request to Glassdoor API for rating info		
		chrome.runtime.sendMessage(name, async function (JSONresponse) { 
			if (JSONresponse.status === "OK") {
				const data = JSONresponse.response;
				let employers = data.employers;
				// See which employers exactly match given employer name
				const exactMatchEmployers = employers.filter(function (e) {
					// Remove parenthesized location in search results
					return name === e.name.toLowerCase().replace(parenthesesRegex, "");
				});
				// Prioritize exact matches over first results in Glassdoor search results
				if (exactMatchEmployers.length > 0) {
					employers = exactMatchEmployers;
				}
				let employer;
				if (employers.length > 1) {
					// Remove companies with no reviews in search results
					employers = employers.filter(e => e.numberOfRatings > 0);
				}
				employer = employers[0];
								
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
					// Try again with the company name stripped of any place names
					if (!originalName) {
						const placeName = nlp(name).places().last().text();
						const locationStrippedName = name.replace(placeName, "");
						if (locationStrippedName !== name) {
							return await addRating(element, locationStrippedName, name);
						}
					}

					// Insert link to search page if employer can't be found
					reviewsUrl = data.attributionURL;
					returnData = {
						url: reviewsUrl,
					}
				}
				updateRating(element, returnData);
				save(originalName ? originalName : name, JSON.stringify(returnData));
			}
			else if (JSONresponse.status === "Access-Denied") {
				// Retry fetch to bypass throttling
				addRating(element, name);
			}
			else {
				updateRating(element, null);
			}
		});
	}
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
					<div class='cell middle logowrapper second-line'>
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
	if (name) {
		appendWrapper(element, twoLines, classesToAdd);
		// Get company name
		addRating(element.nextSibling, cleanCompanyName(name));
	}
}

console.log('inDoors loaded');