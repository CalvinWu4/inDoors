// /jobs/(/saved/applications) left result list
function addRatingsToJobs(){
  [
    ...document.querySelectorAll(
      "div.listResults > div > div > div.grid--cell.fl1 > h3"
    ),
  ].forEach((node) => {
    const name = node.childNodes[1].textContent;
    appendGlassdoor(node, name, classesToAdd="stackoverflow");
  });
}

addRatingsToJobs();

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)
				if (node.querySelector("div.listResults")) {
          addRatingsToJobs();
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// right job details header
var observer = new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		if (mutation.type == "childList") {
			for(let node of mutation.addedNodes) {
				if (!(node instanceof HTMLElement)) continue;	// We track only elements, skip other nodes (e.g. text nodes)
			
				// Check the inserted element
          const nameNode = node.querySelector('.fc-black-700.mb4 > a');
          if(nameNode){
            appendGlassdoor(nameNode.parentNode, nameNode.textContent, classesToAdd="stackoverflow");
          }
			}
		}
	}
}).observe(document, {subtree: true, childList: true});

// /jobs/?id
[...document.querySelectorAll(
  ":is(.employer._up-and-out, .fc-black-700.mb4 > a[href*='/jobs/companies/'])")]
    .forEach((node) => {
  const name = node.textContent;
  appendGlassdoor(node.parentNode, name, classesToAdd="stackoverflow");
});

// /jobs/companies
function addRatingstoCompanies(){
  [...document.querySelectorAll(
    "div.company-list > div > div:nth-child(3) > div.grid--cell.fl1.text > h2")]
    .forEach((node) => {
    const name = node.childNodes[1].textContent;
    appendGlassdoor(node, name, classesToAdd="stackoverflow");
  });
}

addRatingstoCompanies();

new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)
				if (node.querySelector("div.company-list > div > div:nth-child(3) > div.grid--cell.fl1.text > h2")) {
          addRatingstoCompanies();
				}
			}
		}
}).observe(document, {subtree: true, childList: true});

// /jobs/companies/
[...document.querySelectorAll("#company-page h1.fs-display1")].forEach((node) => {
  const name = node.textContent;
  appendGlassdoor(node, name, classesToAdd="stackoverflow");
});
