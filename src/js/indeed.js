// /jobs
[...document.querySelectorAll('td#resultsCol div.jobsearch-SerpJobCard span.company')]
    .forEach(nameNode => {
        const name = nameNode.textContent;
        appendGlassdoor(nameNode.parentNode, name);
});

// /cmp/
const cmpNode = document.querySelector('.cmp-CompactHeaderCompanyName');

if(cmpNode) {
    appendGlassdoor(cmpNode.parentNode.nextElementSibling, cmpNode.textContent);
}

// /event/
const eventNode = document.querySelector('.card-subtitle');

if(eventNode) {
    appendGlassdoor(eventNode.parentNode, eventNode.textContent);
}

// /viewjob
const viewjobNode = document.querySelector('.jobsearch-InlineCompanyRating a');

if(viewjobNode) {
    appendGlassdoor(viewjobNode.parentNode.parentNode, viewjobNode.textContent);
}

// // Get the iframe body
// let iframe = document.getElementById('vjs-container-iframe').document.body;
// Setup the config
let config = { attributes: true, childList: true }
// Create a callback
let callback = function(mutations) {
     /* callback actions */ 
     for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				const nameNode = node.querySelector(".jobsearch-InlineCompanyRating");
				if (nameNode) {
					const name = nameNode.textContent;
					appendGlassdoor(nameNode.parentNode, name, twoLines=false);
				}
			}
		}
    }

// Watch the iframe for changes
// let observer = new MutationObserver(callback)
// observer.observe(iframe, config)


new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
                // Get the iframe body
                let iframe = document.getElementById('vjs-container-iframe');
				if (iframe) {
                    let observer = new MutationObserver(callback)
                    observer.observe(iframe.contentDocument, config)
				}
			}
		}
}).observe(document, {subtree: true, childList: true});
