// Adds Script to DOM
let script = document.createElement("script");
script.type = 'text/javascript';
script.async = true;
script.src = "https://cse.google.com/cse.js?cx=183c9a6555cdce95e";
let s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(script, s);


//    Create Sidebar Toggle Button - visible by default
let btn = document.createElement("button");
btn.id = 'toggleButton';
btn.innerHTML = "Toggle Results";
btn.style.cssText = "background-color: #f5f5f5;border:none;color:#707070;font-size:15px;padding: 10px 20px;margin:0 35% 0 0;border-radius:4px;outline:none;";
btn.addEventListener("click", toggleSidebar)
let btnDiv = document.createElement('div');
btnDiv.style.display = 'flex';
btnDiv.style.justifyContent = 'flex-end';
btnDiv.appendChild(btn);

let slimAppBar = document.getElementById('before-appbar');
slimAppBar.insertBefore(btnDiv,slimAppBar.childNodes[0]);



//  Create Sidebar - invisible by default
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
    ' padding-right:8px';



sidebar.appendChild(resultsDiv);


let rhs = document.getElementById('rhs');
let mainDiv = document.getElementById('rcnt');



if (rhs) {
    console.log("RHS exists, inserting as display: none.");
    sidebar.style.display = 'none';
    mainDiv.insertBefore(sidebar,rhs);
} else {
    console.log("RHS doesn't exist, inserting as display:block");
    mainDiv.appendChild(sidebar);
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

