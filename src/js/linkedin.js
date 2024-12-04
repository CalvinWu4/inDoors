/************************************* Logged in UI *************************************/
// /jobs and /jobs/collections/* Left result list
[...document.querySelectorAll(".job-card-container .artdeco-entity-lockup__subtitle > span")]
	.forEach(element => {
		const name = element.textContent.split(' · ')[0];
		appendGlassdoor(element, name, twoLines=false, classesToAdd="linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".job-card-container .artdeco-entity-lockup__subtitle > span")) {
					const name = node.textContent.split(' · ')[0];
					appendGlassdoor(node, name, twoLines=false, classesToAdd="linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/collections/* Right rail details
new MutationObserver(function(mutations) {
    for(let mutation of mutations) {
        for(let node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;    // we track only elements, skip other nodes (e.g. text nodes)

            // check the inserted element
            if (node.matches(".job-details-jobs-unified-top-card__company-name > a")) {
                const name = node.textContent;
                appendGlassdoor(node.parentNode.parentNode.parentNode, name, twoLines=false, classesToAdd="t-14 linkedin");
            }
        }
    }
}).observe(document, {subtree: true, childList: true});

new MutationObserver(function(mutations) {
    for(let mutation of mutations) {
        if (mutation.type == "characterData") {
            let changedNode = mutation.target;

            // Check changed element
            if (changedNode.parentNode.parentNode.matches(".job-details-jobs-unified-top-card__company-name")) {
                const name = changedNode.textContent;
                document.querySelector('.job-details-jobs-unified-top-card__company-name').parentNode
                .querySelectorAll('.glassdoor-label-wrapper').forEach(e => e.parentNode.removeChild(e));

                appendGlassdoor(document.querySelector('.job-details-jobs-unified-top-card__company-name'), name, twoLines=false, classesToAdd="t-14 linkedin");
            }
        }
    }
}).observe(document, {characterData: true, subtree: true, childList: true});

// /my-items/saved-jobs/*
new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".workflow-results-container .mb1 > .t-14:nth-child(2)")) {	
					if (window.location.pathname === '/my-items/saved-jobs/') {
						const name = node.textContent;
						appendGlassdoor(node, name, twoLines=false, classesToAdd="linkedin t-14"); 
					}
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/search/* Right rail details
[...document.querySelectorAll(".job-details-jobs-unified-top-card__primary-description-without-tagline .app-aware-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode.parentNode, name, twoLines=false, classesToAdd="linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".job-details-jobs-unified-top-card__primary-description-without-tagline .app-aware-link")) {
					const name = node.textContent;
					appendGlassdoor(node.parentNode.parentNode, name, twoLines=false, classesToAdd="linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/search/* Left result list
[...document.querySelectorAll(".job-card-container__primary-description")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=false, classesToAdd="linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".job-card-container__primary-description")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=false, classesToAdd="linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /company/*
[...document.querySelectorAll(".org-top-card__primary-content h1 > span")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=false, classesToAdd="t-14 linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".org-top-card__primary-content h1 > span")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=false, classesToAdd="t-14 linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/view/* Top card
[...document.querySelectorAll(".careers .jobs-unified-top-card__subtitle-primary-grouping > span:first-of-type")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode, name, twoLines=false, classesToAdd="t-14 linkedin");
	});

// /jobs/view/* Similar jobs
[...document.querySelectorAll(".job-card--tile .t-14")]
	.forEach(element => {
		const name = element.wholeText;
		appendGlassdoor(element, name, twoLines=true, classesToAdd="t-12 linkedin")
});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".job-card--tile .t-14")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=true, classesToAdd="t-12 linkedin"); 
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/search/* Left result list
[...document.querySelectorAll(".job-card-job-posting-card-wrapper__content .flex-grow-1")]
	.forEach(element => {
		const name = element.getElementsByClassName("artdeco-entity-lockup__subtitle")[0].textContent;
		appendGlassdoor(element, name, twoLines=false, classesToAdd="t-14 linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".job-card-job-posting-card-wrapper__content .flex-grow-1")) {
					const name = node.getElementsByClassName("artdeco-entity-lockup__subtitle")[0].textContent;
					appendGlassdoor(node, name, twoLines=false, classesToAdd="t-14 linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/search/* Right rail details
[...document.querySelectorAll(".job-details-jobs-unified-top-card__company-name .app-aware-link")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode.parentNode.parentNode, name, twoLines=false, classesToAdd="linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".job-details-jobs-unified-top-card__company-name .app-aware-link")) {
					const name = node.textContent;
					appendGlassdoor(node.parentNode.parentNode.parentNode, name, twoLines=false, classesToAdd="linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

/************************************* Guest UI *************************************/
// /jobs/* Left result list
[...document.querySelectorAll(".jobs-search__results-list .base-search-card__subtitle")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=false, classesToAdd="linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				const nameNode = node.querySelector(".jobs-search__results-list .base-search-card__subtitle");
				if (nameNode) {
					const name = nameNode.textContent;
					appendGlassdoor(nameNode, name, twoLines=false, classesToAdd="linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/view/* Similar jobs  
[...document.querySelectorAll(".show-more-less .base-main-card__subtitle")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=true, classesToAdd="linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				const nameNode = node.querySelector(".show-more-less .base-main-card__subtitle");
				if (nameNode) {
					const name = nameNode.textContent;
					appendGlassdoor(nameNode, name, twoLines=true, classesToAdd="linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/ and /jobs/view Top card
[...document.querySelectorAll("span[class=topcard__flavor]")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.parentNode, name, twoLines=false, classesToAdd="linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				const nameNode = node.querySelector("span[class=topcard__flavor]");
				if (nameNode) {
					const name = nameNode.textContent;
					appendGlassdoor(nameNode.parentNode, name, twoLines=false, classesToAdd="linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true, attributes: true});
	
// /jobs/view/* Right rail
[...document.querySelectorAll(".people-also-viewed__list .result-card__subtitle--reduced-whitespace")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=true, classesToAdd="result-card__subtitle--reduced-whitespace linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				if (node.matches(".people-also-viewed__list .result-card__subtitle--reduced-whitespace")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=true, classesToAdd="result-card__subtitle--reduced-whitespace linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /company/* Right Rail
[...document.querySelectorAll(".similar-pages .show-more-less__list .result-card__title--reduced-whitespace")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element, name, twoLines=true, "result-card__subtitle result-card__subtitle--reduced-whitespace linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)
				
				// check the inserted element
				if (node.matches(".similar-pages .show-more-less__list .result-card__title--reduced-whitespace")) {
					const name = node.textContent;
					appendGlassdoor(node, name, twoLines=true, "result-card__subtitle result-card__subtitle--reduced-whitespace linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true});
	
// /company/* Top card
[...document.querySelectorAll(".org-top-card-summary__title")]
	.forEach(element => {
		const name = element.textContent;
		appendGlassdoor(element.nextElementSibling, name, twoLines=false, classesToAdd="linkedin");
	});

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)

				// check the inserted element
				const nameNode = node.querySelector(".org-top-card-summary__title");
				if (nameNode) {
					const name = nameNode.textContent;
					appendGlassdoor(nameNode.nextElementSibling, name, twoLines=false, classesToAdd="linkedin");
				}
			}
		}
}).observe(document, {subtree: true, childList: true, attributes: true});
