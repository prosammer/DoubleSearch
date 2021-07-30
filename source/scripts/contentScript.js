
// Adds Script to DOM
function reload_GoogleScript() {
    console.log("Reloading Google Script");
    // Remove script if exists currently
    let existingScript = document.getElementById('engineScript');
    if (typeof(existingScript) != 'undefined' && existingScript != null) existingScript.remove();

    // Add Script
    let engineURL = "https://cse.google.com/cse.js?cx=20929241749f9dd83";
    let script = document.createElement("script");
    script.type = 'text/javascript';
    script.async = true;
    script.src = engineURL;
    let s = document.getElementsByTagName('head')[0];
    s.parentNode.insertBefore(script, s);
}



let defaultSite = "https://reddit.com";
let currentSite = defaultSite;

reload_GoogleScript();

//    Create Reddit results div
let redditBtn = document.createElement("div");
redditBtn.id = 'redditBtn';
redditBtn.innerHTML = 'Reddit';
redditBtn.style.paddingLeft = '163px';
redditBtn.addEventListener("click", function() {
    toggleSidebar("https://reddit.com");
});

//    Create SO results div
let soBtn = document.createElement("div");
soBtn.id = 'soBtn';
soBtn.innerHTML = "StackOverflow";
soBtn.style.paddingLeft = '12px';
soBtn.addEventListener("click", function() {
    toggleSidebar("https://stackoverflow.com");
});

//    Create SO results div
let hnBtn = document.createElement("div");
hnBtn.id = 'hnBtn';
hnBtn.innerHTML = "HackerNews";
hnBtn.style.paddingLeft = '12px';
hnBtn.addEventListener("click", function() {
    toggleSidebar("https://news.ycombinator.com");
});



let toolbar = document.getElementById('hdtb-msb');
toolbar.appendChild(redditBtn);
toolbar.appendChild(soBtn);
toolbar.appendChild(hnBtn);




//  Create Sidebar
let resultsDiv = document.createElement("div");
resultsDiv.setAttribute('data-as_sitesearch', defaultSite);
resultsDiv.className = 'gcse-searchresults-only';
resultsDiv.id = 'resultDiv';

let sidebar  = document.createElement('div');
sidebar.id = 'sidebarContainer';
sidebar.style.cssText = ' float:left;\n' +
    ' min-width:268px;\n' +
    ' display:block;\n' +
    ' position:relative;\n' +
    ' padding-bottom:15px;\n' +
    ' margin-left:892px;\n' +
    ' padding-right:10px';

sidebar.appendChild(resultsDiv);


let rhs = document.getElementById('rhs');
let mainDiv = document.getElementById('rcnt');



if (rhs) {
    sidebar.style.display = 'none';
    mainDiv.insertBefore(sidebar,rhs);
} else {
    mainDiv.insertBefore(sidebar,mainDiv.childNodes[1]);
}


function toggleSidebar(selectedSite) {
    if(selectedSite === currentSite) {
        if(sidebar.style.display === 'none') {
            if (rhs) rhs.style.display = 'none';
            sidebar.style.display = "block";
        } else {
            sidebar.style.display = "none";
            if (rhs) rhs.style.display = 'block';
        }
    } else {
        currentSite = selectedSite;
        regenerateResults(selectedSite);
        if(sidebar.style.display === 'none') {
            if (rhs) rhs.style.display = 'none';
            sidebar.style.display = 'block';
        }
    }
}

function regenerateResults(selectedSite) {
    console.log(selectedSite);

    document.getElementById('resultDiv').remove();

    let newResultDiv = document.createElement("div");
    newResultDiv.setAttribute('data-as_sitesearch', selectedSite);
    newResultDiv.className = 'gcse-searchresults-only';
    newResultDiv.id = 'resultDiv';

    document.getElementById('sidebarContainer').appendChild(newResultDiv);
    reload_GoogleScript();
}
