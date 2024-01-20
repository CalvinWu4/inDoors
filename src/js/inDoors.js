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
							${data.website ? `<a href="https://${data.website}">${data.name}</a>` : `${data.name}`}
						</div>
						${data.industryName ? `<div>Industry: ${data.industryName}</div>` : ""}
					</div>
				</div>
				`);
				// Prevent clicking on tooltip background from triggering any events 
				instance.popper.addEventListener('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
				});
				// Restore clicking for company website link in tooltip
				const companyWebsiteLink = instance.popper.querySelector('#inDoors-tippy-company > a');
				companyWebsiteLink.addEventListener('click', function (e) {
					window.open(companyWebsiteLink.href, "_blank");
					e.stopImmediatePropagation();
					e.preventDefault();
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
	// Data schema for the rating wrapper
	const returnDataKeys = [
		'retrievalDate',
		'expirationDate',
		'overallRating',
		'numberOfRatings',
		'url',
		'name',
		'website',
		'squareLogo',
		'industryName'
	];
	const storageData = load(name);
	
    if (storageData && 
		//  Data schema wasn't changed
		(JSON.stringify(Object.keys(storageData)) === JSON.stringify(returnDataKeys) 
		|| JSON.stringify(Object.keys(storageData)) === JSON.stringify(['retrievalDate', 'expirationDate', 'url']))
		// Entry was saved less than a week ago
		&& new Date() < new Date(Date.parse(storageData.expirationDate))) {
		// Database entry hit - Use recent data from in localstorage.
		updateRating(element, storageData);
    } else {
    	// Database entry miss - Send new HTTP Request to Glassdoor API for rating info		
		chrome.runtime.sendMessage(name, async function (backgroundScriptResponse) { 
			if (backgroundScriptResponse.status === 200) {
				const retrievalDate = backgroundScriptResponse.headers.date;
				const expirationDate = backgroundScriptResponse.headers.expires;
				const data = backgroundScriptResponse.json.response;
				let employers = data.employers.sort(
					// Prioritize exact word matches (case-sensitive first then non-case-senstive)
					// Then matches that don't contain "The " if the the name doesn't					
					firstBy(function (e) {
						const currName = e.name.replace(parenthesesRegex, "").replace(punctuationRegex, "");
						const targetName = name.replace(parenthesesRegex, "").replace(punctuationRegex, "");
						return -currName.split(" ").includes(targetName);
					})
					.thenBy(function (e) {
						const currName = e.name.toLowerCase().replace(parenthesesRegex, "").replace(punctuationRegex, "");
						const targetName = name.toLowerCase().replace(parenthesesRegex, "").replace(punctuationRegex, "");
						return -currName.split(" ").includes(targetName);
					})
					.thenBy(function (e) {
						const currName = e.name.replace(parenthesesRegex, "").replace(punctuationRegex, "");
						const targetName = name.replace(parenthesesRegex, "").replace(punctuationRegex, "");
						return currName.includes("The ") && !targetName.includes("The ");
					})
				);
				let employer = employers[0];
				let reviewsUrl;
				let returnData;

				const urlEncodedName = encodeURIComponent(name);
				// Handle Glassdoor sometimes showing the Explore page when company not found
				if (data.attributionURL.startsWith("https://www.glassdoor.com/Explore/")) {
					employer = null;
					data.attributionURL = 
					`https://www.glassdoor.com/Reviews/${urlEncodedName}-reviews-SRCH_KE0,${name.length}.htm`;
				}
				if (employer) {
					// Insert link to employer reviews
					reviewsUrl = 
					`https://www.glassdoor.com/Reviews/${urlEncodedName}-Reviews-E${employer.id}.htm`;
					returnData = {
						retrievalDate: retrievalDate,
						expirationDate: expirationDate,
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
					// Try again with the company name stripped of any place names and generic company endings
					if (!originalName) {
						const placeName = nlp(name).places().last().text();
						const strippedName = trimCompanyNameEndings(name.replace(placeName, "").trim()).trim();
						if (strippedName !== name) {
							return await addRating(element, strippedName, name);
						}
					}

					// Insert link to search page if employer can't be found
					reviewsUrl = data.attributionURL;
					returnData = {
						retrievalDate: retrievalDate,
						expirationDate: expirationDate,
						url: reviewsUrl
					}
				}
				updateRating(element, returnData);
				save(originalName ? originalName : name, JSON.stringify(returnData));
			}
			else if (backgroundScriptResponse.status === 403) {
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