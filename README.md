# <img src="src/icon/icon48.png" width="40" align="left"> inDoors

> Browser extension that displays [Glassdoor] ratings for companies while browsing [LinkedIn], [Google for Jobs], [Indeed] and [Stackoverflow].

## Install

- [**Chrome** extension][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/eapcedpgnlmgkigiieacngkpdjikfgci.svg?label=%20">][link-chrome]
- [**Firefox** add-on][link-firefox] [<img valign="middle" src="https://img.shields.io/amo/v/indoors.svg?label=%20">][link-firefox]

## About

This extension uses an [API proxy](https://github.com/CalvinWu4/glassdoor-api-proxy/blob/master/script.js) built on top of the [Glassdoor API]. Rating data is cached on the server and browser for 9 days (to reflect the [7 business days](https://help.glassdoor.com/article/Ratings-on-Glassdoor/en_US/#:~:text=It%20typically%20takes%207%20business,review.) it typically takes for a rating be updated after an employee leaves a review). Clicking on the rating opens up the reviews page for the company or the search results page if the company is not found. Mousing over the rating brings up a tooltip with the company's website and industry name.

## Notes
This extension works on the LinkedIn urls: `https://linkedin.com/jobs/`, `https://linkedin.com/jobs/search/`, `https://linkedin.com/my-items/saved-jobs/`, `https://www.linkedin.com/jobs/view/*`, and `https://www.linkedin.com/company/*` on both the logged in and guest sessions.

The fewer reviews a company has, the less likely Glassdoor will correctly find it. To improve chances of the finding the correct company, inDoors will strip the company name of company suffixes and text after colons, dashes, vertical bars, parentheses, and commas (except for Inc), prioritize exact word matches in the results given by Glassdoor, redo a failed search with the company name stripped of any locations, and finally use the mappings in [`misdirected-names.js`](https://github.com/CalvinWu4/inDoors/blob/master/src/js/misdirected-names.js) (e.g. Hearst Magazines on Linkedin should refer to Hearst on Glassdoor). Pull requests on that file are welcome.


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


## Screenshots
![Screenshot](images/linkedin-jobssearch.png)
![Screenshot](images/googleforjobs.png)
![Screenshot](images/indeed-jobs.png)
![Screenshot](images/stackoverflow.png)
![Screenshot](images/linkedin-jobs.png)
![Screenshot](images/linkedin-savedjobs.png)
![Screenshot](images/linkedin-jobsview.png)
![Screenshot](images/linkedin-company.png)
![Screenshot](images/indeed-viewjob.png)
![Screenshot](images/indeed-cmp.png)

[link-chrome]: https://chrome.google.com/webstore/detail/indoors-glassdoor-integra/eapcedpgnlmgkigiieacngkpdjikfgci?hl=en&authuser=0 "Version published on Chrome Web Store"
[link-firefox]: https://addons.mozilla.org/en-US/firefox/addon/indoors/ "Version published on Mozilla Add-ons"

[Glassdoor]: https://www.glassdoor.com/
[LinkedIn]: https://www.linkedin.com/
[Google for Jobs]: https://www.google.com/search?q=jobs+near+me&ibp=htl;jobs
[Indeed]: https://www.indeed.com/
[Stackoverflow]: https://www.stackoverflow.com/jobs
[Glassdoor API]: http://www.glassdoor.com/api/index.htm
