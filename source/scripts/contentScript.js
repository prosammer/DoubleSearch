// Adds Script to DOM
let script = document.createElement("script");
script.type = 'text/javascript';
script.async = true;
script.src = "https://cse.google.com/cse.js?cx=183c9a6555cdce95e";
let s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(script, s);


//    Create "Toggle Results" div
let btn = document.createElement("div");
btn.id = 'toggleButton';
btn.innerHTML = "Toggle Results";
btn.style.paddingLeft = "163px";
btn.addEventListener("click", toggleSidebar)

let toolbar = document.getElementById('hdtb-msb');
toolbar.appendChild(btn);


//  Create Sidebar
let resultsDiv = document.createElement("div");
resultsDiv.className = 'gcse-searchresults-only';

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
    console.log("RHS exists, inserting as display: none.");
    sidebar.style.display = 'none';
    mainDiv.insertBefore(sidebar,rhs);
} else {
    console.log("RHS doesn't exist, inserting as display:block");
    // mainDiv.appendChild(sidebar);
    mainDiv.insertBefore(sidebar,mainDiv.childNodes[1]);
}




function toggleSidebar() {
    console.log('Running toggleSidebar Function');

    if (sidebar.style.display === "none") {
        console.log("sidebar.style.display is none, switching");
        if(rhs) {
            rhs.style.display = 'none';
        }
        sidebar.style.display = "block";

    } else {
        console.log("sidebar.style.display is block, switching");
        if(rhs) {
            rhs.style.display = 'block';
        }
        sidebar.style.display = "none";
    }
}

