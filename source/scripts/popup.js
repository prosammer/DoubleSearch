import '../styles/popup.scss';

/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 */
// if (
//     // From testing the following conditions seem to indicate that the popup was opened on a secondary monitor
//     window.screenLeft < 0 ||
//     window.screenTop < 0 ||
//     window.screenLeft > window.screen.width ||
//     window.screenTop > window.screen.height
// ) {
//     chrome.runtime.getPlatformInfo(function (info) {
//         if (info.os === 'mac') {
//             const fontFaceSheet = new CSSStyleSheet()
//             fontFaceSheet.insertRule(`
//         @keyframes redraw {
//           0% {
//             opacity: 1;
//           }
//           100% {
//             opacity: .99;
//           }
//         }
//       `)
//             fontFaceSheet.insertRule(`
//         html {
//           animation: redraw 1s linear infinite;
//         }
//       `)
//             document.adoptedStyleSheets = [
//                 ...document.adoptedStyleSheets,
//                 fontFaceSheet,
//             ]
//         }
//     })
// }


class Engine {
    constructor(name,URL) {
        this.name = name;
        this.URL = URL;

        this.engineDiv = document.createElement('div');
        this.engineDiv.setAttribute('class','engineDiv');

        this.minusIconContainer = document.createElement('div');
        // this.minusIconContainer.setAttribute('onclick','removeEngine()');
        this.minusIconContainer.setAttribute('class','minusIconContainer');


        this.minusIconContainer.addEventListener('click', function () {deleteEngineFromArray(URL)});
        this.engineDiv.appendChild(this.minusIconContainer);

        this.minusIcon = document.createElement('span');
        this.minusIcon.innerHTML = '&#8854;';
        this.minusIcon.style.fontSize = '4vh';
        this.minusIconContainer.appendChild(this.minusIcon);

        this.nameInput = document.createElement('input');
        this.nameInput.setAttribute('type','text');
        this.nameInput.setAttribute('id', this.name + '_NameInput');
        this.nameInput.setAttribute('class','engineInput');
        this.nameInput.setAttribute('value',this.name);
        this.engineDiv.appendChild(this.nameInput);

        this.URLInput = document.createElement('input');
        this.URLInput.setAttribute('id', this.name + '_URLInput');
        this.URLInput.setAttribute('class','engineInput URLInput');
        this.URLInput.setAttribute('value',this.URL);
        this.engineDiv.appendChild(this.URLInput);

    }

    get engineElement() {
        return this.engineDiv;
    }
}


function saveOptions() {
    // e.preventDefault();
    browser.storage.sync.set({
        savedEngines: engineList
    });
    console.log('Just saved engineList to storage, its:');
    console.log(browser.storage.sync.get("savedEngines"));
}

function restoreOptions() {

    function setEngines(result) {
        console.log('Running setEngines');
        if(result.savedEngines) {
            console.log('Heres result.savedEngines');
            console.log(result.savedEngines);
        }
        let defaultList = [new Engine('Reddit','https://reddit.com'), new Engine('StackOverflow', 'https://stackoverflow.com'), new Engine('Hacker News', 'https://news.ycombinator.com')];
        //    If no savedList, create default engine list
        engineList = result.savedEngines || defaultList;
        console.log('Just set engineList to either result or default');
        // Append each search engine div to form
        for (let i = 0; i < engineList.length; i++) {
            console.log('Running for loop - ' + i);
            form.appendChild(engineList[i].engineElement);
            console.log('For loop - ' +  ' complete');
        }
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("savedEngines");
    getting.then(setEngines, onError);
}

function regenerateEngineArrayDivs() {
    form.innerHTML = '';
    for (let i = 0; i < engineList.length; i++) {
        form.appendChild(engineList[i].engineElement);
    }
}

function deleteEngineFromArray(URL) {
    console.log(URL);
    console.log('Removing URL:' + URL + ' from enginearray');

    for (let i = 0; i < engineList.length; i++) {
        if(engineList[i].URL === URL) {
            console.log('Found engine by id, deleting');
            engineList.splice(i,1);
        }
    }
    console.log(engineList);
    regenerateEngineArrayDivs();
    saveOptions();
}

let form = document.getElementById('popup');
let engineList = [];
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#popup").addEventListener("submit", saveOptions);
