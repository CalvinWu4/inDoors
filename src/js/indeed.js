// /jobs
[...document.querySelectorAll('td.resultContent')]
    .forEach(node => {
        const companyNameNode = node.querySelector('.companyName')
        const ratingsNode = node.querySelector('.ratingsDisplay')
        if (ratingsNode) {
            appendGlassdoor(ratingsNode, companyNameNode.textContent);
        }
        else {
            appendGlassdoor(companyNameNode, companyNameNode.textContent);
        }
});

// /cmp/
const cmpNode = document.querySelector('[itemprop="name"]');

if(cmpNode) {
    appendGlassdoor(cmpNode, cmpNode.textContent);
}

// /event/
const eventNode = document.querySelector('.card-subtitle');

if(eventNode) {
    appendGlassdoor(eventNode.parentNode, eventNode.textContent);
}

// /viewjob left list
const viewjobNode = document.querySelector('.jobsearch-InlineCompanyRating > div');

if(viewjobNode) {
    appendGlassdoor(viewjobNode.parentNode, viewjobNode.textContent);
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
                            // Re-render left job results
                            [...document.querySelectorAll('td.resultContent')]
                            .forEach(node => {
                                const companyNameNode = node.querySelector('.companyName')
                                const ratingsNode = node.querySelector('.ratingsDisplay')
                                if (ratingsNode) {
                                    appendGlassdoor(ratingsNode, companyNameNode.textContent);
                                }
                                else {
                                    appendGlassdoor(companyNameNode, companyNameNode.textContent);
                                }
                            });
                                                
                            // Inject CSS into iframe
                            if (iframe.contentDocument) {
                                unloadCSS('src/css/inDoors.css', iframe.contentDocument);
                                loadCSS('src/css/inDoors.css', iframe.contentDocument);
                                unloadCSS('src/css/loading.css', iframe.contentDocument);
                                loadCSS('src/css/loading.css', iframe.contentDocument);
                                unloadCSS('node_modules/tippy.js/dist/tippy.css', iframe.contentDocument);
                                loadCSS('node_modules/tippy.js/dist/tippy.css', iframe.contentDocument);
                                unloadCSS('src/css/inDoors-tippy.css', iframe.contentDocument);
                                loadCSS('src/css/inDoors-tippy.css', iframe.contentDocument);
                                unloadCSS('src/css/indeed.css', iframe.contentDocument);
                                loadCSS('src/css/indeed.css', iframe.contentDocument);
                            } 
                          
                            const viewjobNode = iframe.contentDocument.querySelector('.jobsearch-InlineCompanyRating > div:first-child');
                            if (viewjobNode) {
                                const iframeName = viewjobNode.parentNode.querySelector('a[href*="https://www.indeed.com/cmp/"]').textContent
                                appendGlassdoor(viewjobNode.parentNode, iframeName)
                            }
                        });
                    }
                }
            }
		}
}).observe(document, {subtree: true, childList: true});
