
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

function createSidebar() {

//  Create Sidebar
    let resultsDiv = document.createElement("div");
    resultsDiv.setAttribute('data-as_sitesearch', defaultSite);
    resultsDiv.className = 'gcse-searchresults-only';
    resultsDiv.id = 'resultDiv';

    sidebar.id = 'sidebarContainer';
    sidebar.style.cssText = ' float:left;\n' +
        ' min-width:268px;\n' +
        ' display:block;\n' +
        ' position:relative;\n' +
        ' padding-bottom:15px;\n' +
        ' margin-left:892px;\n' +
        ' padding-right:10px';

    sidebar.appendChild(resultsDiv);
}

function toggleSidebar(evt) {
    let selectedSite = evt.currentTarget.dataset.engineurl;
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

function regenerateButtons() {
    let toolbar = document.getElementById('hdtb-msb');
    // Remove any existing toolbar
    let btnDiv = toolbar.querySelector('#btnDiv');
    if(btnDiv !== null) {
        btnDiv.remove();
    }
    btnDiv = document.createElement('div');
    btnDiv.id = 'btnDiv';
    btnDiv.style.paddingLeft = '163px';
    btnDiv.style.display = 'flex';

    for (let i = 0; i < engineList.length; i++) {
        let btn = document.createElement("div");
        btn.id = 'btn_' + engineList[i][0];
        btn.innerHTML = engineList[i][0];
        btn.setAttribute('data-engineURL', engineList[i][1]);
        btn.style.paddingLeft = '12px';
        btn.addEventListener("click", toggleSidebar, false);
        btnDiv.appendChild(btn);
    }
    toolbar.appendChild(btnDiv);
}

function restoreButtonOptions() {

    function setButtonList(result) {
        result = result.savedEngines;
        // If there is a saved dict, use that as the engine List that will be generated
        if(result && result.length > 0) {
            engineList = result;
        }
        regenerateButtons();
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("savedEngines");
    getting.then(setButtonList, onError);
}

let engineList = [
    ['Reddit', 'https://reddit.com'],
    ['StackOverflow', 'https://stackoverflow.com'],
    ['HackerNews', 'https://news.ycombinator.com']
]

reload_GoogleScript();
restoreButtonOptions();
let defaultSite = engineList[0][1];
let currentSite = defaultSite;

sidebar  = document.createElement('div');
let rhs = document.getElementById('rhs');
let mainDiv = document.getElementById('rcnt');

createSidebar();

if (rhs) {
    sidebar.style.display = 'none';
    mainDiv.insertBefore(sidebar,rhs);
} else {
    mainDiv.insertBefore(sidebar,mainDiv.childNodes[1]);
}

