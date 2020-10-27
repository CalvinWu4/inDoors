chrome.runtime.onMessage.addListener(
    function (name, sender, sendResponse) {
        var xhr = new XMLHttpRequest();
        let url = `https://glassdoor-api-proxy.azurewebsites.net/api/gdinfo?company=${name}`;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                sendResponse(JSON.parse(xhr.responseText));
            }
        }
        xhr.send();

        return true;
    });