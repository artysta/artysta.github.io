// TODO: Refactor for sure.

let isDarkThemeOn = true;
const SWITCH_THEME = 'SWITCH THEME';
const RESUME_URL = 'https://adriankurek.pl/github/resume.json';
const SETTINGS_URL = 'https://adriankurek.pl/github/settings.json';
const GITHUB_COMMITS_URL = 'https://api.github.com/repos/artysta/artysta.github.io/commits';
const loader = document.getElementById('loader');
const wrapper = document.getElementById('main-wrapper');
const content = document.getElementsByClassName('content')[0];
let color;

fetchSettingsData().then(setting => {
    makeLoaderVisible(true);

    if (!setting.pageVisible) {
        renderMessage('Page is not available at the moment! :(');
        makeLoaderVisible(false);
        return;
    }
    
    color = setting.color;

    fetchResumeData().then(data => {
        if (setting.buttonEnabled) {
            renderSwitchThemeButton();
        }
    
        for (key in data) {
            renderSection(data[key]);
        }
    
        renderFooter();
    });
}).catch(error => {
    renderMessage('Could not load the page! :(');
}).finally(() => {
    setTimeout(() => {
        makePageVisible();
        makeLoaderVisible(false);
    }, 200);
});

function createElement(element, classList) {
    let newElement = document.createElement(element);

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
    let button = document.getElementsByTagName('button')[0];
    let body = document.body;
    let groupContainers = document.getElementsByClassName('group-container');
    let urls = document.getElementsByTagName('a');
    let hrs = document.getElementsByTagName('hr');
    let icons = document.getElementsByTagName('i');
    let images = document.getElementsByTagName('img');

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
        let newSrc = image.src.split('-')[0];
        let extension = image.dataset.extension;
        image.src = isDarkThemeOn ? `${newSrc}-light.${extension}` : `${newSrc}-dark.${extension}`;
    }
}

function renderMessage(message) {
    let div = createElement('div');
    let p = createElement('p');

    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    p.innerText = message;
    content.innerHTML = '';

    div.appendChild(p);
    content.appendChild(div);
}

function renderSwitchThemeButton() {
    let button = createElement('button', [`button-${color}-dark`]);
    button.innerText = SWITCH_THEME;
    button.onclick = switchTheme;
    wrapper.prepend(button);
}

function renderFooter() {
    let footerContainer = createElement('div', ['footer']);
    fetch(GITHUB_COMMITS_URL)
        .then(response => response.json())
        .then(commits => {
            let latestCommit = commits[0];
            let lastEditedAtDate = latestCommit.commit.committer.date.replace('T', ' ').replace('Z', '');
            footerContainer.innerHTML = `Last edited at ${lastEditedAtDate} UTC | <a href='${latestCommit.html_url}' target='_blank' class="url-${color}-dark">${latestCommit.sha}</a>`;
        })
        .catch(error => footerContainer.innerHTML = `Last edited at N/A`)
        .finally(() => wrapper.appendChild(footerContainer));
}

function renderSection(section) {
    if (!section.visible) { return; }

    let sectionContainer = createElement('div');
    let groupContainer = createElement('div', ['group-container']);
    let title = createElement('h2');
    let div = createElement('div');
    let description = createElement('p');

    title.innerHTML = section.title;
    description.innerHTML = section.description;

    sectionContainer.appendChild(title);
    div.appendChild(description);
    groupContainer.appendChild(div);
    sectionContainer.appendChild(groupContainer);
    wrapper.appendChild(sectionContainer);

    if (section.hasOwnProperty('items')) {
        let ul = createElement('ul');

        section.items.forEach(item => {
            let li = createElement('li');
            li.innerHTML = item.url !== '' ? `<a href="${item.url}" target="_blank" class="url-${color}-dark">${item.value}</a>` : item.value;
            ul.appendChild(li);
        });

        div.appendChild(ul);
    }

    if (section.hasOwnProperty('itemsWithLogo')) {
        section.itemsWithLogo.forEach(item => {
            let positionGroupContainer = createElement('div', ['group-container']);
            let logoContainer = createElement('div', ['group-logo-container']);
            let positionsContainer = createElement('div');
            let logo = createElement('img');
            let logoUrlParts = item.logoUrl.split('.');
            
            logo.src = item.logoUrl;
            logo.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

            item.positions.forEach(position => {
                let positionUl = createElement('ul');
                let positionLi = createElement('li');

                positionLi.innerHTML = `<strong>${position.dateFrom} - ${position.dateThru}</strong> - ${position.title}`;
                positionUl.appendChild(positionLi);

                if (!position.isActive) {
                    positionUl.innerHTML = `<s>${positionUl.innerHTML}</s>`;
                }

                position.details.forEach(detail => {
                    let detailUl = createElement('ul');
                    let detailLi = createElement('li');

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
        let iconsWrapper = createElement('div', ['icons-wrapper']);

        section.icons.forEach(icon => {
            let iconContainer = createElement('div', ['div-image']);
            let iconI = createElement('i', [`icon-${color}-dark`]);
            let iconTitle = createElement('p');
            
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

    let hr = createElement('hr', [`hr-${color}-dark`]);
    sectionContainer.appendChild(hr);
}

function fetchSettingsData() {
    return fetch(SETTINGS_URL).then(response => response.json());
}

function fetchResumeData() {
    return fetch(RESUME_URL).then(response => response.json());
}