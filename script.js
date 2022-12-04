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
    renderExperienceSection(data.workplaces);
    renderExperienceSection(data.schools);
    renderSection(data.languages);
    renderProgrammingLanguages(data);
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

    Array.from(groupContainers).forEach(container => container.classList.toggle('group-container-light-mode'));
    Array.from(urls).forEach(url => url.classList.toggle('group-container-light-mode'));
    Array.from(hrs).forEach(hr => hr.classList.toggle('group-container-light-mode'));
    Array.from(images).forEach(image => {
        let newSrc = image.src.split('-')[0];
        let extension = image.dataset.extension;
        image.src = isDarkThemeOn ? `${newSrc}-light.${extension}` : `${newSrc}-dark.${extension}`;
    });
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

function renderExperienceSection(section) {
    if (!section.sectionVisible) { return; }

    let sectionContainer = createElement('div');
    let title = createElement('h2');

    title.innerHTML = section.title;

    sectionContainer.appendChild(title);

    section.items.forEach(section => {
        let groupContainer = createElement('div', ['group-container']);
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
        groupContainer.appendChild(logoContainer);
        groupContainer.appendChild(positionsContainer);
        sectionContainer.appendChild(groupContainer);
    });

    wrapper.appendChild(sectionContainer);

    appendHrToElement(sectionContainer);
}

function renderProgrammingLanguages(data) {
    if (!data.technologies.sectionVisible) { return; }

    let languagesContainer = createElement('div');
    let divGroupContainer = createElement('div', ['group-container']);
    let sectionTitle = createElement('h2');
    let div = createElement('div');
    let description = createElement('p');
    let divLanguagesWrapper = createElement('div', ['languages-wrapper']);

    sectionTitle.innerHTML = data.technologies.title;
    description.innerHTML = data.technologies.description;

    data.technologies.items.forEach(technology => {
        let divIcon = createElement('div', ['div-image']);
        let iIcon = createElement('i');

        // Split if there is more than one class.
        if (technology.class.includes(' ')) {
            iIcon.classList.add(...technology.class.split(' '));
        } else {
            iIcon.classList.add(technology.class);
            iIcon.style.fontSize = technology.size;
        }

        divIcon.appendChild(iIcon);
        let pIcon = createElement('p');
        pIcon.innerHTML = technology.name;
        divIcon.appendChild(pIcon);
        divLanguagesWrapper.appendChild(divIcon);
    });

    languagesContainer.appendChild(sectionTitle);
    div.appendChild(description);
    div.appendChild(divLanguagesWrapper);
    divGroupContainer.appendChild(div);
    languagesContainer.appendChild(divGroupContainer);
    wrapper.appendChild(languagesContainer);

    appendHrToElement(languagesContainer);
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

    appendHrToElement(sectionContainer);

    if (!section.hasOwnProperty('items')) { return; }

    let ul = createElement('ul');

    section.items.forEach(item => {
        let li = createElement('li');
        li.innerHTML = item.url !== '' ? `<a href="${item.url}" target="_blank">${item.value}</a>` : item.value;
        ul.appendChild(li);
    });

    div.appendChild(ul);
}

function fetchResumeData() {
    return fetch('https://adriankurek.pl/resume.json').then(response => response.json());
}