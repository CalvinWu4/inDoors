## inDoors
inDoors is a Chrome/Firefox extension that displays Glassdoor ratings for companies while browsing Linkedin. The urls: https://linkedin.com/jobs/, https://linkedin.com/jobs/search/, https://linkedin.com/my-items/saved-jobs/, `https://www.linkedin.com/jobs/view/*`, and `https://www.linkedin.com/company/*` on both the logged in and guest UI's are supported. This extension uses the [Glassdoor API](http://www.glassdoor.com/api/index.htm). Ratings are cached in localstorage for a week until they are refreshed. You can click on the rating to open up the Glassdoor reviews page for the company or the search page if the company is not found. 

Note that the fewer reviews a company has, the less likely Glassdoor will correctly find it. To improve chances of the finding the correct company, inDoors will remove text after colons, dashes, vertical bars, parentheses, etc. in company names, only look at the top 3 search results, prioritize exact matches over the number of reviews, and finally use the mappings in `misdirected-names.js` (e.g. Hearst Magazines on Linkedin should refer to Hearst on Glassdoor). Pull requests on that file are welcome.

You can download the Chrome extension [here](https://chrome.google.com/webstore/detail/indoors-glassdoor-integra/eapcedpgnlmgkigiieacngkpdjikfgci?hl=en&authuser=0) and the Firefox extension [here](https://github.com/CalvinWu4/inDoors/releases).

This extension was forked from and intended as a successor to: https://github.com/Brian-Lam/Glassdoor-Linkedinator.

For users of [Dark Reader](https://github.com/darkreader/darkreader)'s dynamic mode, drop this CSS into Dev tools under the linkedin.com section:
```
.glassdoor-label {
    color: rgba(232, 230, 227, 0.6);
}

#glassdoor-link{
    color: rgba(232, 230, 227, 0.6);
}

#glassdoor-link:hover {
    color: rgb(126, 197, 255);
}
```

Possible features:
* Support for Firefox mobile
* Cache ratings with a server and db to avoid throttling Glassdoor API.
* Add popover showing rating breakdowns by category

Screenshots:

<img src="https://i.imgur.com/bvHg5g5.jpg" width="900">
<img src="https://i.imgur.com/hoXH8Qi.jpg" width="500">
<img src="https://i.imgur.com/hrN1Mq5.jpg" width="500">
<img src="https://i.imgur.com/kx5S6co.jpg" width="500">
<img src="https://i.imgur.com/AaU2Lt3.jpg" height="350">
