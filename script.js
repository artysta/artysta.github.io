// TODO: Refactor for sure.

let isDarkThemeOn = true;
const LIGHT_THEME = 'LIGHT THEME';
const DARK_THEME = 'DARK THEME';
const loader = document.getElementById('loader');
const wrapper = document.getElementById('main-wrapper');
const content = document.getElementsByClassName('content')[0];

fetchResumeData().then(data => {
    if (!shouldPageBeVisible(data)) {
        renderMessage('Page is not available at the moment! :(');
        return;
    }

    makeLoaderVisible(true);
    renderSwitchThemeButton();
    renderSection(data.about);
    renderSection(data.personal);
    renderSection(data.workplaces);
    renderSection(data.schools);
    renderSection(data.languages);
    renderIconsSection(data.technologies);
    renderSection(data.softSkills);
    renderSection(data.certificatesAndCourses);
    renderSection(data.interestingUrls);
    renderSection(data.contact);
    renderFooter();
}).catch(error => {
    renderMessage('Could not load the page! :(');
}).finally(() => {
    setTimeout(makePageVisible, 200);
});

function createElement(element, classList) {
    let newElement = document.createElement(element);

    if (classList != undefined) {
        newElement.classList.add(...classList);
    }

    return newElement;
}

function appendHrToElement(element) {
    let hr = createElement('hr');
    element.appendChild(hr);
}

function shouldPageBeVisible(data) {
    return data.siteSettings.pageVisible;
}

function makePageVisible() {
    content.style.opacity = 1;
    makeLoaderVisible(false);
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
    let images = document.getElementsByTagName('img');

    button.classList.toggle('button-light-mode');
    button.innerHTML = isDarkThemeOn ? LIGHT_THEME : DARK_THEME;

    body.classList.toggle('body-light-mode');

    for (let groupContainer of groupContainers) {
        groupContainer.classList.toggle('group-container-light-mode');
    }

    for (let url of urls) {
        url.classList.toggle('a-light-mode');
    }

    for (let hr of hrs) {
        hr.classList.toggle('hr-light-mode');
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
    let button = createElement('button');
    button.innerText = LIGHT_THEME;
    button.onclick = switchTheme;
    wrapper.prepend(button);
}

function renderFooter() {
    let footerContainer = createElement('div', ['footer']);
    fetch('https://api.github.com/repos/artysta/artysta.github.io/commits')
        .then(response => response.json())
        .then(commits => {
            let latestCommit = commits[0];
            let lastEditedAtDate = latestCommit.commit.committer.date.replace('T', ' ').replace('Z', '');
            footerContainer.innerHTML = `Last edited at ${lastEditedAtDate} UTC | <a href='${latestCommit.html_url}' target='_blank'>${latestCommit.sha}</a>`;
        })
        .catch(error => footerContainer.innerHTML = `Last edited at N/A`)
        .finally(() => wrapper.appendChild(footerContainer));
}

function renderIconsSection(section) {
    if (!section.sectionVisible) { return; }

    let sectionContainer = createElement('div');
    let groupContainer = createElement('div', ['group-container']);
    let title = createElement('h2');
    let div = createElement('div');
    let description = createElement('p');
    let languagesWrapper = createElement('div', ['languages-wrapper']);

    title.innerHTML = section.title;
    description.innerHTML = section.description;

    section.items.forEach(technology => {
        let iconContainer = createElement('div', ['div-image']);
        let icon = createElement('i');
        let iconTitle = createElement('p');
        
        iconTitle.innerHTML = technology.name;
        icon.classList.add(...technology.class.split(' '));

        if (icon.classList.length <= 1) {
            icon.style.fontSize = technology.size;
        }

        iconContainer.appendChild(icon);
        iconContainer.appendChild(iconTitle);
        languagesWrapper.appendChild(iconContainer);
    });

    sectionContainer.appendChild(title);
    div.appendChild(description);
    div.appendChild(languagesWrapper);
    groupContainer.appendChild(div);
    sectionContainer.appendChild(groupContainer);
    wrapper.appendChild(sectionContainer);

    appendHrToElement(sectionContainer);
}

function renderSection(section) {
    if (!section.sectionVisible) { return; }

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
            li.innerHTML = item.url !== '' ? `<a href="${item.url}" target="_blank">${item.value}</a>` : item.value;
            ul.appendChild(li);
        });

        div.appendChild(ul);
    }

    // TODO: rename 'items2' key
    if (section.hasOwnProperty('items2')) {
        section.items2.forEach(section => {
            let positionGroupContainer = createElement('div', ['group-container']);
            let logoContainer = createElement('div', ['group-logo-container']);
            let positionsContainer = createElement('div');
            let logo = createElement('img');
            let logoUrlParts = section.logoUrl.split('.');
            
            logo.src = section.logoUrl;
            logo.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

            section.positions.forEach(position => {
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

    appendHrToElement(sectionContainer);
}

function fetchResumeData() {
    return fetch('https://adriankurek.pl/resume.json').then(response => response.json());
}