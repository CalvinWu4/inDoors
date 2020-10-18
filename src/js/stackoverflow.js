// /jobs/(/saved/applications) left result list
function addRatingsToJobs(){
  [
    ...document.querySelectorAll(
      "div.listResults > div > div > div.grid--cell.fl1 > h3"
    ),
  ].forEach((node) => {
    const name = node.childNodes[1].textContent;
    appendGlassdoor(node, name, (twoLines = true));
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
          const nameNode = node.querySelector('.job-details--header > .grid--cell > div:nth-of-type(1) > a');
          if(nameNode){
            appendGlassdoor(nameNode.parentNode, nameNode.textContent);
          }
			}
		}
	}
}).observe(document, {subtree: true, childList: true});

// /jobs/?id
[
  ...document.querySelectorAll(
    ".main-columns > #mainbar.job-details--content > header > div:nth-child(2) > div:nth-child(2)"
  ),
].forEach((node) => {
  const name = node.childNodes[1].textContent;
  appendGlassdoor(node, name);
});

// /jobs/companies
function addRatingstoCompanies(){
  [
    ...document.querySelectorAll(
      "div.company-list > div > div:nth-child(3) > div.grid--cell.fl1.text > h2"
    ),
  ].forEach((node) => {
    const name = node.childNodes[1].textContent;
    appendGlassdoor(node, name);
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

// /jobs/companies/?name
[...document.querySelectorAll("#company-name-tagline > h1")].forEach((node) => {
  const name = node.textContent;
  appendGlassdoor(node, name);
});
