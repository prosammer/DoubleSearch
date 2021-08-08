import '../styles/popup.scss';
import ExtPay from "extpay";

/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 */
if (
    window.screenLeft < 0 ||
    window.screenTop < 0 ||
    window.screenLeft > window.screen.width ||
    window.screenTop > window.screen.height
) {
    browser.runtime.getPlatformInfo(function (info) {
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
    constructor(engineName,engineURL) {
        this.engineName = engineName;
        this.engineURL = engineURL;

        this.engineDiv = document.createElement('div');
        this.engineDiv.setAttribute('class','engineDiv');

        this.minusIconContainer = document.createElement('div');
        this.minusIconContainer.setAttribute('class','minusIconContainer');
        this.minusIconContainer.addEventListener('click', function () {deleteEngineFromArray(engineName)});
        this.engineDiv.appendChild(this.minusIconContainer);

        this.minusIcon = document.createElement('div');
        this.minusIcon.className = 'minusButton';
        this.minusIcon.innerHTML = '&#x2716;';
        this.minusIconContainer.appendChild(this.minusIcon);

        this.nameInput = document.createElement('input');
        this.nameInput.setAttribute('type','text');
        this.nameInput.setAttribute('id', this.engineName);
        this.nameInput.setAttribute('class','engineInput');
        this.nameInput.setAttribute('value',this.engineName);
        this.nameInput.addEventListener('change',submitChangesToArray, false);

        this.engineDiv.appendChild(this.nameInput);

        this.URLInput = document.createElement('input');
        this.URLInput.setAttribute('id', this.engineURL);
        this.URLInput.setAttribute('class','engineInput URLInput');
        this.URLInput.setAttribute('value',this.engineURL);
        this.URLInput.addEventListener('change',submitChangesToArray, false);
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
}

function restoreEngineOptions() {

    function setEnginesList(result) {
        result = result.savedEngines;
        // If there is a saved dict, use that as the engine List that will be generated
        if(result && result.length > 0) {
            engineList = result;
        }
        regenerateEngineArrayDivs();
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("savedEngines");
    getting.then(setEnginesList, onError);
}

function regenerateEngineArrayDivs() {
    form.innerHTML = '';
    for (let i = 0; i < engineList.length; i++) {
        let newDiv = new Engine(engineList[i][0], engineList[i][1]);
        form.appendChild(newDiv.engineElement);
    }
}

function deleteEngineFromArray(engineName) {
    for (let i = 0; i < engineList.length; i++) {
        if(engineList[i][0] === engineName) {
            console.log('Removing engineName:' + engineName + ' from engineList');
            engineList.splice(i,1);
        }
    }
    regenerateEngineArrayDivs();
    saveOptions();
}

function addEngineToArray() {
    console.log('AddEnginetoArray has been called!');
    engineList.push(['Website name here', 'https://example.com']);
    regenerateEngineArrayDivs();
    saveOptions();
}

function submitChangesToArray(evt) {
    console.log(evt.currentTarget);
    let inputType = 0;
    if(evt.currentTarget.classList.contains('URLInput')) {inputType = 1;}

    let oldValue = evt.currentTarget.id;
    let inputValue = evt.currentTarget.value;

    // Input Type is 0 if changes are for an engine Name, otherwise 1 for an engine URL
    for (let i = 0; i < engineList.length; i++) {
        //    find the old name in the array and replace it with the input's value (new name)
        if(engineList[i][inputType] === oldValue) {
            console.log('Found the old value(the id), replacing with the inputs value');
            engineList[i][inputType] = inputValue;
        }
    }
    console.log(engineList);
    regenerateEngineArrayDivs();
    saveOptions();
}

function addOtherElements() {
    let main = document.getElementsByTagName('main')[0];

    let addButtonContainer = document.createElement('div');
    addButtonContainer.id = 'addButtonContainer';
    main.appendChild(addButtonContainer);

    let buttonSpacer = document.createElement('div');
    buttonSpacer.id = 'buttonSpacer';
    addButtonContainer.appendChild(buttonSpacer);

    let addButtonIcon = document.createElement('span');
    addButtonIcon.innerHTML = '&#8853;';
    addButtonIcon.id = 'addButton';
    addButtonIcon.addEventListener('click', function () {addEngineToArray()});

    addButtonContainer.appendChild(addButtonIcon);

}

let payNowButton = document.createElement('button');
payNowButton.innerHTML = 'Purchase Premium';
payNowButton.id = 'payNowButton';
payNowButton.onclick = payNow;


const extpay = ExtPay('doublesearch');
extpay.getUser().then(user => {
    console.log(user);
    if (user.paid) {
        console.log('User is Premium');
        let premiumText = document.createElement('h4');
        premiumText.id = 'premiumText';
        premiumText.innerHTML = 'Premium';
        premiumText.style.fontStyle = 'italic';
        premiumText.style.color = 'gold';
        premiumText.style.width = '100%';
        premiumText.style.textAlign = 'center';
        document.getElementsByTagName('header')[0].appendChild(premiumText);
    } else {
        console.log('User is Free');
        document.getElementsByTagName('footer')[0].appendChild(payNowButton);
    }
}).catch((error) => {
    console.error(error);
});

extpay.onPaid.addListener(user => {
    console.log('user paid!')

})

function payNow() {
    extpay.openPaymentPage();
}


const form = document.getElementById('popup');
let engineList = [
    ['Reddit', 'https://reddit.com'],
    ['StackOverflow', 'https://stackoverflow.com'],
    ['HackerNews', 'https://news.ycombinator.com']
]

document.addEventListener("DOMContentLoaded", restoreEngineOptions);
addOtherElements();