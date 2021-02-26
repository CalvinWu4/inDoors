chrome.runtime.onMessage.addListener(
    function (name, sender, sendResponse) {
        var xhr = new XMLHttpRequest();
        let url = `https://glassdoor.calvinwu4.workers.dev/?company='${name}'`;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (tryParseJSON(xhr.responseText)) {
                    sendResponse(JSON.parse(xhr.responseText));
                }
                else {
                    sendResponse({status: "Bad Request"});
                }
            }
        }
        xhr.send();

        return true;
    });