
chrome.runtime.onMessage.addListener(function (name, sender, sendResponse) {
    let url = `https://glassdoor.calvinwu4.workers.dev/?company='${name}'`;
    
    fetch(url).then((res) => res.json().then((json) => sendResponse(json)));
    
    return true;
});
