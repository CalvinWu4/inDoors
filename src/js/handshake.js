// /postings/
document.arrive('[class*="style__job-detail"] > span > span:first-child', function(){
	appendGlassdoor(this.parentNode.parentNode, this.textContent, twoLines=true);
})

document.arrive('[class*="style__employer-name"]', function(){
	appendGlassdoor(this, this.textContent, twoLines=false);
})

// /employers/
document.arrive('[class*="style__heading"] > span > [href*="/employers/"]', function(){
	appendGlassdoor(this, this.textContent, twoLines=false, classesToAdd="style__inline-subheader___1HQsl");
})

// /employers/{id}
document.arrive('[data-hook="employers-show-cover-content"] [class*="style__heading"]', function(){
	appendGlassdoor(this, this.textContent, twoLines=false);
})

