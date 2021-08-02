import '../styles/popup.scss';

/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 */
if (
    // From testing the following conditions seem to indicate that the popup was opened on a secondary monitor
    window.screenLeft < 0 ||
    window.screenTop < 0 ||
    window.screenLeft > window.screen.width ||
    window.screenTop > window.screen.height
) {
    chrome.runtime.getPlatformInfo(function (info) {
        if (info.os === 'mac') {
            const fontFaceSheet = new CSSStyleSheet()
            fontFaceSheet.insertRule(`
        @keyframes redraw {
          0% {
            opacity: 1;
          }
          100% {
            opacity: .99;
          }
        }
      `)
            fontFaceSheet.insertRule(`
        html {
          animation: redraw 1s linear infinite;
        }
      `)
            document.adoptedStyleSheets = [
                ...document.adoptedStyleSheets,
                fontFaceSheet,
            ]
        }
    })
}



class Engine {
    constructor(name,URL) {
        this.name = name;
        this.URL = URL;

        this.engineDiv = document.createElement('div');
        this.engineDiv.setAttribute('class','engineDiv');

        this.minusIconContainer = document.createElement('div');
        this.minusIconContainer.setAttribute('onclick','removeEngine()');
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

let engineList = [new Engine('Reddit','https://reddit.com'), new Engine('StackOverflow', 'https://stackoverflow.com'), new Engine('Hacker News', 'https://news.ycombinator.com')];

let main = document.getElementsByTagName('main')[0];

let form = document.getElementById('popup');
let formPlaceholder = document.createElement('div');
formPlaceholder.id = 'formPlaceholder';
form.appendChild(formPlaceholder);

regenerateEngineArrayDivs();


let addButtonContainer = document.createElement('div');
addButtonContainer.id = 'addButtonContainer';
main.appendChild(addButtonContainer);

let buttonSpacer = document.createElement('div');
buttonSpacer.id = 'buttonSpacer';
addButtonContainer.appendChild(buttonSpacer);

let addButtonIcon = document.createElement('span');
addButtonIcon.innerHTML = '&#8853;';
addButtonIcon.style.fontSize = '5vh';
addButtonIcon.addEventListener('click', addEngineToArray);

addButtonContainer.appendChild(addButtonIcon);

let saveButtonContainer = document.createElement('div');
saveButtonContainer.style.display = 'flex';


let saveButton = document.createElement('button');
saveButton.setAttribute('type', 'submit');
saveButton.setAttribute('value', 'Submit');
saveButton.style.alignSelf = 'center';
saveButton.innerHTML = 'Save';
saveButton.onclick = function() {

}
saveButtonContainer.appendChild(saveButton);

main.appendChild(saveButtonContainer);

document.getElementById('options__button').addEventListener('click', () => {
    browser.runtime.openOptionsPage();
});


function addEngineToArray() {
    var name = "";
    var url = "";
    engineList.push(new Engine('Name Here', 'www.example.com'));
    regenerateEngineArrayDivs();
}

function deleteEngineFromArray(URL) {
    console.log(URL);
    console.log('Removing URL:' + URL + 'from enginearray');

    for (let i = 0; i < engineList.length; i++) {
        if(engineList[i].URL == URL) {
            console.log('Found engine by id, deleting');
            engineList.splice(i,1);
        }
    }
    console.log(engineList);
    regenerateEngineArrayDivs();
}

function regenerateEngineArrayDivs() {
    form.innerHTML = '';
    if(savedList) {
        for (let i = 0; i < savedList.length; i++) {
            form.appendChild(savedList[i].engineElement);
        }
        console.log(savedList);
    } else {
        for (let i = 0; i < engineList.length; i++) {
            form.appendChild(engineList[i].engineElement);
        }
        console.log(engineList);
    }
}
