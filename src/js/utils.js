/*****************************************************
Utility functions for inDoors.js
*****************************************************/

// Load company rating if saved in localstorage
var load = function(name) {
	const key = `glassdoor-data: ${name}`;
    if(localStorage.getItem(key) && tryParseJSON(localStorage.getItem(key))) {
		return JSON.parse(localStorage.getItem(key));
    }
    return false;
}

// Save ratings into local storage
var save = function(name, info) {
	localStorage.setItem(`glassdoor-data: ${name}`, info);
}

// Convert 2500 to 2.5K
function kFormatter(num) {
	if (num > 9999) {
		return (num/10000).toFixed(1)*10 + 'k'
	}
    else if (num > 999) {
		return (num/1000).toFixed(1) + 'k'
	}
	else{
		return num;
	}
}

// Convert span element to an anchor element
function spanToAnchor(span){
	let anchor = document.createElement('a');
	
	anchor.innerHTML = DOMPurify.sanitize(span.innerHTML);
	span.getAttributeNames()
			.forEach(attrName => {
				const attrValue = span.getAttribute(attrName);
				anchor.setAttribute(attrName, attrValue);
			});
	span.parentNode.replaceChild(anchor, span);
}

const parenthesesRegex = /\s*\(.*?\)\s*/g;
const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

function normalizeCompanyName(name){
    name = name.trim();

	// To avoid misdirected name searches
	const replaceManyStr = 
	(obj, sentence) => obj.reduce((f, s) => `${f}`.replace(new RegExp("\\b" + Object.keys(s)[0] + "\\b"), s[Object.keys(s)[0]]), sentence)
	name = replaceManyStr(misdirectArray, name);

	// Remove accents/diacritics
	const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	name = normalize(name);

	// Remove text after colons, and vertical bars and dashes surrounded by spaces
	name = name.replace(/(\:|(\s\-\s)|(\s\|\s)|(\s\I\s)|(\s\–\s)).*$/gi, "");

	// Remove text after commas if Inc or Inc. doesn't come after it
	if (name.match(/(^((?!\Inc\.?\b).)*$)/gi)) {
		name = name.replace(/(\,).*$/, "");
	}

	// Remove company suffixes 
	name = name.replace(/\sS.L.U.|\sSLU|\sPBC/g, "");

	// Remove parentheses and text inside of them
    name = name.replace(parenthesesRegex, "");

	// Remove any reminaing non-ASCII characters
	name = name.replace(/[^\x00-\x7F]/g, "");
    
    name = name.trim();

    return name;
}

// Return name stripped of generic company endings
function trimCompanyNameEndings(name) {
	const regex = /(-|\s)(Compan(y|ies)|Family of Companies|Franchise|Platform|Stores)$/i;

	return name.replace(regex, '');
}

function loadCSS(filename, document) {
    var head = document.head;
    var link = document.createElement("link");
  
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = chrome.extension.getURL(filename);
  
    head.appendChild(link);
}

function unloadCSS(filename, document) {
    var targetelement="link"; 
    var targetattr="href";
    var allsuspects=document.getElementsByTagName(targetelement)

    for (var i=allsuspects.length; i>=0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && 
        allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1) {
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
        }
    }
}

function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};
