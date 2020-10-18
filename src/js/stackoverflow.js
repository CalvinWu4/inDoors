// /jobs/(/saved/applications)
[
  ...document.querySelectorAll(
    "div.listResults > div > div > div.grid--cell.fl1 > h3"
  ),
].forEach((node) => {
  const name = node.childNodes[1].textContent;
  appendGlassdoor(node, name, (twoLines = true));
});

// /jobs/?id
[
  ...document.querySelectorAll(
    ".main-columns > #mainbar.job-details--content > header > div:nth-child(2) > div:nth-child(2)"
  ),
].forEach((node) => {
  const name = node.childNodes[1].textContent;
  appendGlassdoor(node, name, (twoLines = true));
});

// /jobs/companies
[
  ...document.querySelectorAll(
    "div.company-list > div > div:nth-child(3) > div.grid--cell.fl1.text > h2"
  ),
].forEach((node) => {
  const name = node.childNodes[1].textContent;
  appendGlassdoor(node, name, (twoLines = true));
});

// /jobs/companies/?name
[...document.querySelectorAll("#company-name-tagline > h1")].forEach((node) => {
  const name = node.textContent;
  appendGlassdoor(node, name);
});
