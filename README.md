## inDoors
inDoors is a Chrome/Firefox extension that displays Glassdoor ratings for companies while browsing Linkedin (and now also Google for Jobs). The urls: https://linkedin.com/jobs/, https://linkedin.com/jobs/search/, https://linkedin.com/my-items/saved-jobs/, `https://www.linkedin.com/jobs/view/*`, and `https://www.linkedin.com/company/*` on both the logged in and guest UI's are supported. This extension uses the [Glassdoor API](http://www.glassdoor.com/api/index.htm). Ratings are cached in localstorage for a week until they are refreshed. You can click on the rating to open up the Glassdoor reviews page for the company or the search page if the company is not found. 

Note that the fewer reviews a company has, the less likely Glassdoor will correctly find it. To improve chances of the finding the correct company, inDoors will remove company suffixes and text after colons, dashes, vertical bars, parentheses, etc. in names, only look at the top 3 search results, prioritize exact matches over the number of reviews, and finally use the mappings in `misdirected-names.js` (e.g. Hearst Magazines on Linkedin should refer to Hearst on Glassdoor). Pull requests on that file are welcome.

You can download the Chrome extension [here](https://chrome.google.com/webstore/detail/indoors-glassdoor-integra/eapcedpgnlmgkigiieacngkpdjikfgci?hl=en&authuser=0) and the Firefox extension [here](https://addons.mozilla.org/en-US/firefox/addon/indoors-glassdoor-on-linkedin/).

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

<img src="https://i.imgur.com/9BfzFbq.jpg" width="900">
<img src="https://i.imgur.com/hURylW7.jpg" width="700">
<img src="https://i.imgur.com/0NXzz7T.jpg" width="200">
<img src="https://i.imgur.com/F7FIpwv.jpg" width="350">
<img src="https://i.imgur.com/PIv5KKl.jpg" width="500">
<img src="https://i.imgur.com/0LHQu2r.png" width="700">
