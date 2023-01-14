// TODO: Refactor for sure.

let isDarkThemeOn = true;
let color;
const SWITCH_THEME = 'SWITCH THEME';
const RESUME_URL = 'https://adriankurek.pl/github/resume.json';
const SETTINGS_URL = 'https://adriankurek.pl/github/settings.json';
const GITHUB_COMMITS_URL = 'https://api.github.com/repos/artysta/artysta.github.io/commits';
const PAGE_NOT_AVAILABLE = 'Page is not available at the moment! :(';
const COULD_NOT_LOAD_PAGE = 'Page is not available at the moment! :(';
const loader = document.getElementById('loader');
const wrapper = document.getElementById('main-wrapper');
const content = document.getElementsByClassName('content')[0];
const favIcon = document.getElementById('fav-icon');

(async () => {
    try {
        makeLoaderVisible(true);
        const setting = await fetchData(SETTINGS_URL);

        if (!setting.pageVisible) {
            renderMessage(PAGE_NOT_AVAILABLE);
            return;
        }

        color = setting.color;

        const data = await fetchData(RESUME_URL);

        if (setting.buttonEnabled) {
            renderSwitchThemeButton();
        }

        for (key in data) {
            renderSection(data[key]);
        }

        setFavicon();
        renderFooter();
    } catch (error) {
        renderMessage(COULD_NOT_LOAD_PAGE);
    } finally {
        setTimeout(() => {
            makePageVisible();
            makeLoaderVisible(false);
        }, 300);
    }
})();

function createElement(element, classList) {
    const newElement = document.createElement(element);

    if (classList != undefined) {
        newElement.classList.add(...classList);
    }

    return newElement;
}

function shouldPageBeVisible(data) {
    return data.siteSettings.pageVisible;
}

function makePageVisible() {
    content.style.opacity = 1;
}

function makeLoaderVisible(visible) {
    loader.style.display = visible ? 'block' : 'none';
}

function switchTheme() {
    isDarkThemeOn = !isDarkThemeOn;
    const button = document.getElementsByTagName('button')[0];
    const body = document.body;
    const groupContainers = document.getElementsByClassName('group-container');
    const urls = document.getElementsByTagName('a');
    const hrs = document.getElementsByTagName('hr');
    const icons = document.getElementsByTagName('i');
    const images = document.getElementsByTagName('img');

    button.classList.toggle(`button-${color}-light`);
    body.classList.toggle('body-light-mode');

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

function renderMessage(message) {
    const div = createElement('div');
    const p = createElement('p');

    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    p.innerText = message;
    content.innerHTML = '';

    div.appendChild(p);
    content.appendChild(div);
}

function renderSwitchThemeButton() {
    const button = createElement('button', [`button-${color}-dark`]);
    button.innerText = SWITCH_THEME;
    button.onclick = switchTheme;
    wrapper.prepend(button);

    const hr = createElement('hr', [`hr-${color}-dark`]);
    wrapper.appendChild(hr);
}

async function renderFooter() {
    const footerContainer = createElement('div', ['footer']);

    try {
        const commits = await fetchData(GITHUB_COMMITS_URL);
        const latestCommit = commits[0];
        const lastEditedAtDate = latestCommit.commit.committer.date.replace('T', ' ').replace('Z', '');
        footerContainer.innerHTML = `Last edited at ${lastEditedAtDate} UTC | <a href='${latestCommit.html_url}' target='_blank' class="url-${color}-dark">${latestCommit.sha}</a>`;
    } catch (error) {
        footerContainer.innerHTML = `Last edited at N/A`;
    } finally {
        wrapper.appendChild(footerContainer)
    }
}

function renderSection(section) {
    if (!section.visible) { return; }

    const sectionContainer = createElement('div');
    const groupContainer = createElement('div', ['group-container']);
    const title = createElement('h2');
    const div = createElement('div');
    const description = createElement('p');

    title.innerHTML = section.title;
    description.innerHTML = section.description;

    sectionContainer.appendChild(title);
    div.appendChild(description);
    groupContainer.appendChild(div);
    sectionContainer.appendChild(groupContainer);
    wrapper.appendChild(sectionContainer);

    if (section.hasOwnProperty('items')) {
        const ul = createElement('ul');

        section.items.forEach(item => {
            const li = createElement('li');
            li.innerHTML = item.url !== '' ? `<a href="${item.url}" target="_blank" class="url-${color}-dark">${item.value}</a>` : item.value;
            ul.appendChild(li);
        });

        div.appendChild(ul);
    }

    if (section.hasOwnProperty('itemsWithLogo')) {
        section.itemsWithLogo.forEach(item => {
            const positionGroupContainer = createElement('div', ['group-container']);
            const logoContainer = createElement('div', ['group-logo-container']);
            const positionsContainer = createElement('div');
            const logo = createElement('img');
            const logoUrlParts = item.logoUrl.split('.');
            
            logo.src = item.logoUrl;
            logo.dataset.name = item.dataName;
            logo.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

            positionGroupContainer.onmouseenter = changeLogoSrcOnMouseEnter;
            positionGroupContainer.onmouseleave = changeLogoSrcOnMouseLeave;

            item.positions.forEach(position => {
                const positionUl = createElement('ul');
                const positionLi = createElement('li');

                positionLi.innerHTML = `<strong>${position.dateFrom} - ${position.dateThru}</strong> - ${position.title}`;
                positionUl.appendChild(positionLi);

                if (!position.isActive) {
                    positionUl.innerHTML = `<s>${positionUl.innerHTML}</s>`;
                }

                position.details.forEach(detail => {
                    const detailUl = createElement('ul');
                    const detailLi = createElement('li');

                    detailLi.innerHTML = detail.value;

                    if (!position.isActive) {
                        detailLi.innerHTML = `<s>${detailLi.innerHTML}</s>`;
                    }

                    detailUl.appendChild(detailLi);
                    positionUl.appendChild(detailUl);
                });

                positionsContainer.appendChild(positionUl);
            });

            logoContainer.appendChild(logo);
            positionGroupContainer.appendChild(logoContainer);
            positionGroupContainer.appendChild(positionsContainer);
            sectionContainer.appendChild(positionGroupContainer);
        });
    }

    if (section.hasOwnProperty('icons')) {
        const iconsWrapper = createElement('div', ['icons-wrapper']);

        section.icons.forEach(icon => {
            const iconContainer = createElement('div', ['div-image']);
            const iconI = createElement('i', [`icon-${color}-dark`]);
            const iconTitle = createElement('p');
            
            iconTitle.innerHTML = icon.name;
            iconI.classList.add(...icon.class.split(' '));
    
            if (iconI.classList.length <= 2) {
                iconI.style.fontSize = icon.size;
            }
    
            iconContainer.appendChild(iconI);
            iconContainer.appendChild(iconTitle);
            iconsWrapper.appendChild(iconContainer);
        });

        div.appendChild(iconsWrapper);
    }

    const hr = createElement('hr', [`hr-${color}-dark`]);
    sectionContainer.appendChild(hr);
}

async function fetchData(url) {
    return await fetch(url).then(response => response.json());
}

function setFavicon() {
    favIcon.href = `./images/favicons/ak-${color}-favicon.png`;
}

function changeLogoSrcOnMouseEnter() {
    const logo = this.children[0].children[0];
    const theme = isDarkThemeOn ? 'light' : 'dark';
    logo.src = `./images/logos/${logo.dataset.name}/${logo.dataset.name}-${color}-${theme}.${logo.dataset.extension}`;
}

function changeLogoSrcOnMouseLeave() {
    const logo = this.children[0].children[0];
    logo.src = logo.src.replace(`-${color}`, '');
}