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
			
			if(data.overallRating != 0){
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
			allowHTML: true,
			arrow: false,
			placement: 'bottom-start',
			offset: [0, 0],
			interactive: true,
			delay: 500,
			onShow: function(instance) {
				instance.setContent(`
				<div id='inDoors-tippy'>
					${data.squareLogo ? `<img id='inDoors-tippy-logo' src=${data.squareLogo}>` : ""}
					<div>
						<div id='inDoors-tippy-company'>
							${data.website ? `<a href="http://${data.website}" target="_blank">${data.name}</a>` : `${data.name}`}
						</div>
						${data.industryName ? `<div>Industry: ${data.industryName}</div>` : ""}
					</div>
				</div>
				`);
				instance.popper.addEventListener('click', function (e) {
					e.stopPropagation();
				});
			  }
		});
	}
	else{
		link.textContent = "Error retrieving rating";
	}
}

// Grab the rating data for the company name and insert it into the rating wrapper
async function addRating(element, name, originalName=null) {
    var currentDate = new Date();
	var storageTime = new Date(localStorage[`gd-${originalName ? originalName: name}-retrieval-date`]);
    // Used for calculating how old this company's data in local storage is
	var oneDay = 24*60*60*1000;
	// Data schema for the rating wrapper
	const returnDataKeys = 
		['overallRating', 'numberOfRatings', 'url', 'name', 'website', 'squareLogo', 'industryName'];
	const storageData = load(name) && JSON.parse(load(name));

    if(checkDatabase(name) 
		// Entry was saved less than a week ago
		&& Math.round(Math.abs((currentDate.getTime() - storageTime.getTime())/(oneDay))) < 7
		//  Data schema wasn't changed
		&& (JSON.stringify(Object.keys(storageData)) === JSON.stringify(returnDataKeys) 
		|| JSON.stringify(Object.keys(storageData)) === JSON.stringify(["url"]))) {
			// Database entry hit - Use recent data from in localstorage.
			updateRating(element, storageData);
    } else {
    	// Database entry miss - Send new HTTP Request to Glassdoor API for rating info		
		chrome.runtime.sendMessage(name, async function (JSONresponse) { 
			if (JSONresponse.status === "OK") {
				const data = JSONresponse.response;
				let employers = data.employers.sort(
					// Prioritize companies with at least five reviews
					// then exact matches (case-sensitive first then non-case-senstive)
					firstBy(function (x) {
						return x.numberOfRatings >= 5 ? -1 : 0;
					})
					.thenBy(function (x) {
						const currName = x.name.replace(parenthesesRegex, "");
						const targetName = name.replace(parenthesesRegex, "");
						return currName === targetName ? -1 : 0;
					})
					.thenBy(function (x) {
						const currName = x.name.toLowerCase().replace(parenthesesRegex, "");
						const targetName = name.toLowerCase().replace(parenthesesRegex, "");
						return currName === targetName ? -1 : 0;
					})
				);
				let employer = employers[0];
				let reviewsUrl;
				let returnData;
				// Remove ampersands and apostrophes because they don't work in a Glassdoor URL
				const normalizedName = name.replace("&", "").replace("'", "-").replace("’","-").replace(" ", "-");

				// Handle Glassdoor sometimes showing the Explore page when company not found
				if (data.attributionURL.startsWith("https://www.glassdoor.com/Explore/")) {
					employer = null;
					data.attributionURL = `https://www.glassdoor.com/Reviews/${normalizedName}-reviews-SRCH_KE0,${normalizedName.length}.htm`;
				}
				if (employer) {
					// Insert link to employer reviews
					// Remove ampersands and apostrophes because they don't work in a Glassdoor URL
					const normalizedName = name.replace("'", "-").replace("’","-").replace(" ", "-");
					reviewsUrl = `https://www.glassdoor.com/Reviews/${normalizedName}-Reviews-E${employer.id}.htm`;
					returnData = {
						overallRating: employer.overallRating,
						numberOfRatings: kFormatter(employer.numberOfRatings),
						url: reviewsUrl,
						name: employer.name,
						website: employer.website ?? null,
						squareLogo: employer.squareLogo ?? null,
						industryName: employer.industryName ?? null
					}
				}
				else {
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
						url: reviewsUrl
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
		addRating(element.nextSibling, normalizeCompanyName(name));
	}
}

console.log('inDoors loaded');