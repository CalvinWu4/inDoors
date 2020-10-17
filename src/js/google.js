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