# <img src="src/icon/icon48.png" width="40" align="left"> inDoors

> Browser extension that displays [Glassdoor] ratings for companies while browsing [LinkedIn], [Google for Jobs], [Indeed] and [Stackoverflow].

## Install

- [**Chrome** extension][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/eapcedpgnlmgkigiieacngkpdjikfgci.svg?label=%20">][link-chrome]
- [**Firefox** add-on][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/indoors.svg?label=%20">][link-firefox]

## About

This extension uses the [Glassdoor API]. Ratings are cached in browser's `localstorage` for a week until they are refreshed. You can click on the rating to open up the Glassdoor reviews page for the company or the search page if the company is not found.

This extension was forked from and intended as a successor to [Glassdoor-Linkedinator](https://github.com/Brian-Lam/Glassdoor-Linkedinator).

## Notes
This extension works on the LinkedIn urls: `https://linkedin.com/jobs/`, `https://linkedin.com/jobs/search/`, `https://linkedin.com/my-items/saved-jobs/`, `https://www.linkedin.com/jobs/view/*`, and `https://www.linkedin.com/company/*` on both the logged in and guest sessions.

The fewer reviews a company has, the less likely Glassdoor will correctly find it. To improve chances of the finding the correct company, inDoors will strip the company name of company suffixes and text after colons, dashes, vertical bars, parentheses, and commas (except for Inc), only look at the top 3 search results, prioritize exact matches over the number of reviews, retry a fetch with region names from [`company-region.js`]("/src/js/company-region.js") stripped (if applicable), and finally use the mappings in [`misdirected-names.js`]("/src/js/misdirected-names.js") (e.g. Hearst Magazines on Linkedin should refer to Hearst on Glassdoor). Pull requests on those files are welcome.


### Dark Reader

For users of [Dark Reader](https://github.com/darkreader/darkreader)'s dynamic mode, drop this CSS into Dev tools under the `linkedin.com` section

```css
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

## Possible features

- Support for Firefox mobile
- Cache ratings to avoid throttling Glassdoor API
- Add popover showing rating breakdowns by category

## Screenshots

<img src="https://i.imgur.com/9BfzFbq.jpg" width="900">
<img src="https://i.imgur.com/dP4Iv3u.jpg" width="350">
<img src="https://i.imgur.com/0LHQu2r.png" width="700">
<img src="https://i.imgur.com/OButwa3.png" width="350">
<img src="https://i.imgur.com/hURylW7.jpg" width="700">
<img src="https://i.imgur.com/0NXzz7T.jpg" width="200">
<img src="https://i.imgur.com/F7FIpwv.jpg" width="350">
<img src="https://i.imgur.com/PIv5KKl.jpg" width="500">
<img src="https://i.imgur.com/Y1Uz5JA.jpg" width="700">
<img src="https://i.imgur.com/MbxfHgv.jpg" width="500">

[link-chrome]: https://chrome.google.com/webstore/detail/indoors-glassdoor-integra/eapcedpgnlmgkigiieacngkpdjikfgci?hl=en&authuser=0 "Version published on Chrome Web Store"
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/indoors/ "Version published on Mozilla Add-ons"

[Glassdoor]: https://www.glassdoor.com/
[LinkedIn]: https://www.linkedin.com/
[Google for Jobs]: https://www.google.com/search?q=jobs+near+me&ibp=htl;jobs
[Indeed]: https://www.indeed.com/
[Stackoverflow]: https://www.stackoverflow.com/jobs
[Glassdoor API]: http://www.glassdoor.com/api/index.htm
