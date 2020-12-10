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

const css =                             
`<style> 
/* 
* === General styles ===
*/
.glassdoor-label-wrapper {
    position: relative;
}

.glassdoor-label {
font-weight: 400;
color: #2d2d2d !important;
}

#glassdoor-link {
position: relative;
}

#glassdoor-link, :visited {
    font-weight: 400;
    color: #2d2d2d !important;
}

a#glassdoor-link:hover {
color: var(--color-action-active);
text-decoration: underline;
}

.glassdoor-rating {
color: #0caa41;
font-weight: bold;
}

.display-none {
display: none;
}

/* Remove Glassdoor logo link */
a[href="https://www.glassdoor.com/index.htm"]{
pointer-events: none;
}

/* 
* === Columnate Glassdoor wrapper ===
*/
.cell {
    display: table-cell;
    float: none;
}

.middle {
    vertical-align: middle;
}

.pad-right {
    padding-right: 10px;
}

/* 
* === Indeed.com styles ===
*/
.glassdoor-label-wrapper {
  font-size: initial;
}
  
.glassdoor-label {
  color: #2d2d2d !important;
}
  
.glassdoor-reviews {
  color: #2d2d2d !important
}
  
#glassdoor-link {
  color: #2d2d2d !important;
  text-decoration-color: #2d2d2d !important;
}
  
/* /jobs */
.jobsearch-SerpJobCard .logowrapper {
  transform: translate(0, .15rem);
}
  
/* /cmp/ */
.cmp-CompactHeaderLayout-companyInfo .logowrapper {
  transform: unset;
}
  
/* /event */
.event-page .logowrapper {
  transform: translate(0, -.1rem);
}
  
/* /viewjob */
.jobsearch-ViewJobLayout-jobDisplay .logowrapper {
  transform: translate(0, .15rem);
}

.jobsearch-JobComponent-embeddedHeader .logowrapper {
  transform: translate(0, .15rem);
}
</style>`;

// /viewjob right iframe
new MutationObserver(function(mutations) {
	for(let mutation of mutations) {
		for(let node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    // Watch the iframe for changes
                    let iframe = document.getElementById('vjs-container-iframe');
                    if (iframe) {
                        iframe.addEventListener("load", function() {
                            // Inject main document's CSS
                            iframe.contentDocument.body.innerHTML = iframe.contentDocument.body.innerHTML.replace(css) + css;
                          
                            const viewjobNode = iframe.contentDocument.querySelector('.jobsearch-InlineCompanyRating > div:first-child');
                            if (viewjobNode) {
                                appendGlassdoor(viewjobNode.parentNode.parentNode, viewjobNode.textContent);
                            }
                        });
                    }
                }
            }
		}
}).observe(document, {subtree: true, childList: true});
