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

// /viewjob left list
const viewjobNode = document.querySelector('.jobsearch-InlineCompanyRating a');

if(viewjobNode) {
    appendGlassdoor(viewjobNode.parentNode.parentNode, viewjobNode.textContent);
}

// /viewjob right iframe
new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    // Watch the iframe for changes
                    let iframe = document.getElementById('vjs-container-iframe');
                    if (iframe) {
                        iframe.addEventListener("load", function() {
                            iframe.contentDocument.body.innerHTML = iframe.contentDocument.body.innerHTML + '<style> .glassdoor-rating { color: #2d2d2d !important; } </style>';
                          
                            const viewjobNode = iframe.contentDocument.querySelector('.jobsearch-InlineCompanyRating a');
                            if (viewjobNode) {
                                appendGlassdoor(viewjobNode.parentNode.parentNode, viewjobNode.textContent);
                            }
                        });
                    }
                }
            }
		}
}).observe(document, {subtree: true, childList: true});
