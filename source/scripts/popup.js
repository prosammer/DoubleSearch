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

        this.svgContainer = document.createElement('div');
        this.svgContainer.setAttribute('onclick','removeEngine()');
        this.svgContainer.setAttribute('class','svgContainer');
        this.engineDiv.appendChild(this.svgContainer);

        this.minusIcon = document.createElement('span');
        this.minusIcon.innerHTML = '&#8854;';

        this.svgContainer.appendChild(this.minusIcon);


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

const engineList = [new Engine('Reddit','https://reddit.com'), new Engine('StackOverflow', 'https://stackoverflow.com'), new Engine('Hacker News', 'https://news.ycombinator.com')];

let form = document.getElementById('popup');
for (let i = 0; i < engineList.length; i++) {
    form.appendChild(engineList[i].engineElement);
}

let addButtonContainer = document.createElement('div');
addButtonContainer.id = 'addButtonContainer'
form.appendChild(addButtonContainer);

let buttonSpacer = document.createElement('div');
buttonSpacer.id = 'buttonSpacer';
addButtonContainer.appendChild(buttonSpacer);

let addButtonIcon = document.createElement('span');
addButtonIcon.innerHTML = '&#8853;';
addButtonIcon.style.fontSize = '5vh';

addButtonContainer.appendChild(addButtonIcon);

let saveButton = document.createElement('button');
saveButton.setAttribute('type', 'submit');
saveButton.setAttribute('value', 'Submit');
saveButton.style.alignSelf = 'center';
saveButton.innerHTML = 'Save';
form.appendChild(saveButton);

let minusIcons =  document.getElementsByClassName('svgContainer');

// for (let i = 0; i < minusIcons.length; i++) {
//     let name =
//     // minusIcons[i].addEventListener('click', () => {engineList = engineList.filter()pop(i)});
// }

function updateArray() {
    document.getElementById('options__button').remove();
    return false;
}