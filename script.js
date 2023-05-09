import { renderSection, renderFooterTemplate, renderButtonTemplate, renderMessageTemplate } from './renderer.js';
import * as CONSTANTS from './constants.js';

let isDarkThemeOn = true;
let color;
const wrapper = document.getElementById('main-wrapper');

(async () => {
    try {
        makeLoaderVisible(true);
        const setting = await fetchData(CONSTANTS.SETTINGS_URL);

        if (!setting.pageVisible) {
            wrapper.insertAdjacentHTML('afterbegin', renderMessageTemplate(CONSTANTS.PAGE_NOT_AVAILABLE));
            return;
        }

        color = setting.color;

        const data = await fetchData(CONSTANTS.RESUME_URL);
        const commits = await fetchData(CONSTANTS.GITHUB_COMMITS_URL);

        for (let key in data) {
            renderSection(wrapper, data[key], color);
        }
        
        if (setting.buttonEnabled) {
            wrapper.insertAdjacentHTML('afterbegin', renderButtonTemplate(color, CONSTANTS.SWITCH_THEME));
        }

        attachListeners();

        wrapper.insertAdjacentHTML('beforeend', renderFooterTemplate(commits, color));
    } catch (error) {
        wrapper.insertAdjacentHTML('afterbegin', renderMessageTemplate(CONSTANTS.COULD_NOT_LOAD_PAGE));
    } finally {
        setFavicon();
        
        setTimeout(() => {
            makePageVisible();
            makeLoaderVisible(false);
        }, 300);
    }
})();

function attachListeners() {
    const elements = document.querySelectorAll('[data-type="logo"]');
    elements.forEach(element => {
        element.onmouseenter = changeLogoSrcOnMouseEnter;
        element.onmouseleave = changeLogoSrcOnMouseLeave;
    });

    const button = document.getElementById('btn-switch-theme');
    button.onclick = switchTheme;
}

function makePageVisible() {
    const content = document.getElementById('content');
    content.style.opacity = 1;
}

function makeLoaderVisible(visible) {
    const loader = document.getElementById('loader');
    loader.style.display = visible ? 'block' : 'none';
}

async function fetchData(url) {
    return await fetch(url).then(response => response.json());
}

function setFavicon() {
    const favIcon = document.getElementById('fav-icon');
    favIcon.href = `./images/favicons/ak-${color}-favicon.png`;
}

function changeLogoSrcOnMouseEnter() {
    const logo = this.children[0].children[0];
    const theme = isDarkThemeOn ? 'light' : 'dark';
    logo.src = `./images/logos/${logo.dataset.name}/${logo.dataset.name}-${color}-${theme}.${logo.dataset.extension}`;
    this.children[1].children[0].children[0].classList.add(`text-${color}-${theme}`);
}

function changeLogoSrcOnMouseLeave() {
    const logo = this.children[0].children[0];
    const theme = isDarkThemeOn ? 'light' : 'dark';
    logo.src = logo.src.replace(`-${color}`, '');
    this.children[1].children[0].children[0].classList.remove(`text-${color}-${theme}`);
}

function switchTheme() {
    isDarkThemeOn = !isDarkThemeOn;
    const button = document.getElementsByTagName('button')[0];
    const body = document.body;
    const mainWrapper = document.getElementById('main-wrapper');
    const groupContainers = document.getElementsByClassName('group-container');
    const urls = document.getElementsByTagName('a');
    const hrs = document.getElementsByTagName('hr');
    const icons = document.getElementsByTagName('i');
    const images = document.getElementsByTagName('img');

    button.classList.toggle(`button-${color}-light`);
    body.classList.toggle('body-light-mode');
    mainWrapper.classList.toggle(`wrapper-light-mode`);

    for (let groupContainer of groupContainers) {
        groupContainer.classList.toggle('group-container-light-mode');
    }

    for (let url of urls) {
        url.classList.toggle(`url-${color}-light`);
    }

    for (let hr of hrs) {
        hr.classList.toggle(`hr-${color}-light`);
    }

    for (let icon of icons) {
        icon.classList.toggle(`icon-${color}-light`);
    }

    for (let image of images) {
        const newSrc = image.src.split('-')[0];
        const extension = image.dataset.extension;
        image.src = isDarkThemeOn ? `${newSrc}-light.${extension}` : `${newSrc}-dark.${extension}`;
    }
}
