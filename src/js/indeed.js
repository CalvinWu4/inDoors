// jobs
new MutationObserver(function(mutations) {
    for(let mutation of mutations) {
        for(let node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

                // on right card first load
                if (node.querySelector('[data-testid="inlineHeader-companyName"]')) {
                    // appendGlassdoor for left results
                    [...document.querySelectorAll('[data-testid="company-name"]')]
                        .forEach(companyNameNode => {
                            if (companyNameNode.nextElementSibling.getAttribute('data-testid')) {
                                appendGlassdoor(companyNameNode, companyNameNode.textContent);
                            }
                            // append after Indeed rating
                            else {
                                appendGlassdoor(companyNameNode.nextElementSibling, companyNameNode.textContent);
                            }
                        });
                    this.disconnect();
                }
            }
        }
}).observe(document, {subtree: true, childList: true});

new MutationObserver(function(mutations) {
    for(let mutation of mutations) {
        for(let node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

                // when right card loads
                if (node.querySelector('[data-testid="inlineHeader-companyName"]')) {
                    // appendGlassdoor for right card
                    const companyNameNode = node.querySelector('[data-testid="inlineHeader-companyName"]');
                    appendGlassdoor(companyNameNode.parentElement, companyNameNode.textContent);
                }

                // appendGlassdoor for right card collapsed
                if (node.querySelector('[data-testid="jobsearch-CollapsedEmbeddedHeader-companyName"]')) {
                    const companyNameNode = node.querySelector('[data-testid="jobsearch-CollapsedEmbeddedHeader-companyName"]')
                    appendGlassdoor(companyNameNode.parentNode, companyNameNode.textContent);
                }

                // appendGlassdoor when more left results are loaded
                if (node.querySelector('[data-testid="company-name"]')) {
                    const companyNameNode = node.querySelector('[data-testid="company-name"]')
                    if (companyNameNode.nextElementSibling.getAttribute('data-testid')) {
                        appendGlassdoor(companyNameNode, companyNameNode.textContent);
                    }
                    // append after Indeed rating
                    else {
                        appendGlassdoor(companyNameNode.nextElementSibling, companyNameNode.textContent);
                    }
                }
            }
        }
}).observe(document, {subtree: true, childList: true});

// /cmp/
const cmpNode = document.querySelector('[itemprop="name"]');

if(cmpNode) {
    appendGlassdoor(cmpNode.parentElement.parentElement, cmpNode.textContent);
}


// /viewjob/
new MutationObserver(function(mutations) {
    for(let mutation of mutations) {
        for(let node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

                // on right card first load
                if (node.querySelector('#viewJobButtonLinkContainer') || node.querySelector('#indeedApplyButton')) {
                    const companyNameNode = document.querySelector('[data-testid="inlineHeader-companyName"]');

                    if (companyNameNode) {
                        appendGlassdoor(companyNameNode.parentElement, companyNameNode.textContent);
                    }
                    this.disconnect();
                }
            }
        }
    }).observe(document, {subtree: true, childList: true});

// /saved/
new MutationObserver(function(mutations) {
    for(let mutation of mutations) {
        for(let node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

                if (node.querySelector('.atw-JobInfo-companyLocation > span')) {
                    const companyNameNode = node.querySelector('.atw-JobInfo-companyLocation > span');

                    if (companyNameNode) {
                        appendGlassdoor(companyNameNode, companyNameNode.textContent);
                    }
                }
            }
        }
    }).observe(document, {subtree: true, childList: true});
