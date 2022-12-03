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
    renderAbout(data);
    renderPersonal(data);
    renderWorkplaces(data);
    renderEducation(data);
    renderLanguages(data);
    renderProgrammingLanguages(data);
    renderSoftSkills(data);
    renderCertificatesAndCourses(data);
    renderURLs(data);
    renderContact(data);
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

function createUrlElement(innerHtml, href, target) {
    let urlElement = createElement('a');

    urlElement.innerHTML = innerHtml;
    urlElement.href = href;
    urlElement.target = target;

    return urlElement;
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

function renderAbout(data) {
    if (!data.about.sectionVisible) { return; }

    let aboutContainer = createElement('div');
    let divGroupContainer = createElement('div', ['group-container']);
    let sectionTitle = createElement('h2');
    let description = createElement('p');

    sectionTitle.innerHTML = data.about.title;
    description.innerHTML = data.about.description;

    aboutContainer.appendChild(sectionTitle);
    divGroupContainer.appendChild(description);
    aboutContainer.appendChild(divGroupContainer);
    wrapper.appendChild(aboutContainer);

    appendHrToElement(aboutContainer);
}

function renderPersonal(data) {
    if (!data.personal.sectionVisible) { return; }

    let personalContainer = createElement('div');
    let divGroupContainer = createElement('div', ['group-container']);
    let sectionTitle = createElement('h2');
    let div = createElement('div');
    let description = createElement('p');
    let personalUl = createElement('ul');
    let nameLi = createElement('li');
    let birthYearLi = createElement('li');
    let nationalityLi = createElement('li');

    sectionTitle.innerHTML = data.personal.title;
    description.innerHTML = data.personal.description;
    nameLi.innerHTML = data.personal.name;
    birthYearLi.innerHTML = data.personal.birthYear;
    nationalityLi.innerHTML = data.personal.nationality;

    personalContainer.appendChild(sectionTitle);
    div.appendChild(description);
    div.appendChild(personalUl);
    personalUl.appendChild(nameLi);
    personalUl.appendChild(birthYearLi);
    personalUl.appendChild(nationalityLi);
    divGroupContainer.appendChild(div);
    personalContainer.appendChild(divGroupContainer);
    wrapper.appendChild(personalContainer);

    appendHrToElement(personalContainer);
}

function renderWorkplaces(data) {
    if (!data.workplaces.sectionVisible) { return; }

    let workplacesContainer = createElement('div');
    let sectionTitle = createElement('h2');

    sectionTitle.innerHTML = data.workplaces.title;

    workplacesContainer.appendChild(sectionTitle);

    data.workplaces.items.forEach(workplace => {
        let divGroupContainer = createElement('div', ['group-container']);
        let divLogoContainer = createElement('div', ['group-logo-container']);
        let img = createElement('img');
        let divPositionsContainer = createElement('div');
        let logoUrlParts = workplace.logoUrl.split('.');

        img.src = workplace.logoUrl;
        img.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

        workplace.positions.forEach(position => {
            let positionUl = createElement('ul');
            let positionLi = createElement('li');

            positionLi.innerHTML = `<strong>${position.dateFrom} - ${position.dateThru}</strong> - ${position.title}`;
            positionUl.appendChild(positionLi);

            position.duties.forEach(duty => {
                let dutyUl = createElement('ul');
                let dutyLi = createElement('li');

                dutyLi.innerHTML = duty.value;

                dutyUl.appendChild(dutyLi);
                positionUl.appendChild(dutyUl);
            });

            divPositionsContainer.appendChild(positionUl);
        });

        divLogoContainer.appendChild(img);
        divGroupContainer.appendChild(divLogoContainer);
        divGroupContainer.appendChild(divPositionsContainer);
        workplacesContainer.appendChild(divGroupContainer);
    });

    wrapper.appendChild(workplacesContainer);

    appendHrToElement(workplacesContainer);
}

function renderEducation(data) {
    if (!data.schools.sectionVisible) { return; }

    let educationContainer = createElement('div');
    let sectionTitle = createElement('h2');

    sectionTitle.innerHTML = data.schools.title;

    educationContainer.appendChild(sectionTitle);

    data.schools.items.forEach(school => {
        let divGroupContainer = createElement('div', ['group-container']);
        let divLogoContainer = createElement('div', ['group-logo-container']);
        let img = createElement('img');
        let divPositionsContainer = createElement('div');
        let logoUrlParts = school.logoUrl.split('.');

        img.src = school.logoUrl;
        img.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

        school.fieldOfStudies.forEach(fieldOfStudy => {
            let fieldOfStudyUl = createElement('ul');
            let fieldOfStudyLi = createElement('li');

            fieldOfStudyLi.innerHTML = `<strong>${fieldOfStudy.dateFrom} - ${fieldOfStudy.dateThru}</strong> - ${school.name}`;

            fieldOfStudyUl.appendChild(fieldOfStudyLi);

            if (!school.isActive) {
                let tmp = fieldOfStudyUl.innerHTML;
                fieldOfStudyUl.innerHTML = `<s>${tmp}</s>`;
            }

            fieldOfStudy.details.forEach(detail => {
                let detailUl = createElement('ul');
                let detailLi = createElement('li');

                detailLi.innerHTML = detail.value;

                if (!fieldOfStudy.isActive) {
                    let tmp = detailLi.innerHTML;
                    detailLi.innerHTML = `<s>${tmp}</s>`;
                }

                detailUl.appendChild(detailLi);
                fieldOfStudyUl.appendChild(detailUl);
            });

            divPositionsContainer.appendChild(fieldOfStudyUl);
        });

        divLogoContainer.appendChild(img);
        divGroupContainer.appendChild(divLogoContainer);
        divGroupContainer.appendChild(divPositionsContainer);
        educationContainer.appendChild(divGroupContainer);
    });

    wrapper.appendChild(educationContainer);

    appendHrToElement(educationContainer);
}

function renderLanguages(data) {
    if (!data.languages.sectionVisible) { return; }

    let languagesContainer = createElement('div');
    let divGroupContainer = createElement('div', ['group-container']);
    let sectionTitle = createElement('h2');
    let div = createElement('div');
    let description = createElement('p');
    let languageUl = createElement('ul');

    sectionTitle.innerHTML = data.languages.title;
    description.innerHTML = data.languages.description;

    data.languages.items.forEach(language => {
        let languageLi = createElement('li');
        languageLi.innerHTML = `${language.name} (${language.level})`
        languageUl.appendChild(languageLi);
    });


    languagesContainer.appendChild(sectionTitle);
    div.appendChild(description);
    div.appendChild(languageUl);
    divGroupContainer.appendChild(div);
    languagesContainer.appendChild(divGroupContainer);
    wrapper.appendChild(languagesContainer);

    appendHrToElement(languagesContainer);
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

function renderSoftSkills(data) {
    if (!data.softSkills.sectionVisible) { return; }

    let softSkillsContainer = createElement('div');
    let divGroupContainer = createElement('div', ['group-container']);
    let sectionTitle = createElement('h2');
    let div = createElement('div');
    let description = createElement('p');
    let softSkillUl = createElement('ul');

    sectionTitle.innerHTML = data.softSkills.title;
    description.innerHTML = data.softSkills.description;

    data.softSkills.items.forEach(softSkill => {
        let softSkillLi = createElement('li');
        softSkillLi.innerHTML = softSkill.value;
        softSkillUl.appendChild(softSkillLi);
    });

    softSkillsContainer.appendChild(sectionTitle);
    div.appendChild(description);
    div.appendChild(softSkillUl);
    divGroupContainer.appendChild(div);
    softSkillsContainer.appendChild(divGroupContainer);
    wrapper.appendChild(softSkillsContainer);

    appendHrToElement(softSkillsContainer);
}

function renderCertificatesAndCourses(data) {
    if (!data.certificates.sectionVisible) { return; }

    let certificationsAndCoursesContainer = createElement('div');
    let divGroupContainer = createElement('div', ['group-container']);
    let div = createElement('div');
    let description = createElement('p');
    let sectionTitle = createElement('h2');
    let certificateUl = createElement('ul');

    description.innerHTML = data.certificates.description;
    sectionTitle.innerHTML = data.certificates.title;


    data.certificates.items.forEach(certificate => {
        let url = createUrlElement(certificate.name, certificate.url, '_blank');
        let certificateLi = createElement('li');
        certificateLi.appendChild(url);
        certificateUl.appendChild(certificateLi);
    });

    certificationsAndCoursesContainer.appendChild(sectionTitle);
    div.appendChild(description);
    div.appendChild(certificateUl);
    divGroupContainer.appendChild(div);
    certificationsAndCoursesContainer.appendChild(divGroupContainer);
    wrapper.appendChild(certificationsAndCoursesContainer);

    appendHrToElement(certificationsAndCoursesContainer);
}

function renderURLs(data) {
    if (!data.interestingUrls.sectionVisible) { return; }

    let interestingUrlsContainer = createElement('div');
    let divGroupContainer = createElement('div', ['group-container']);
    let sectionTitle = createElement('h2');
    let div = createElement('div');
    let description = createElement('p');
    let interestingUrlUl = createElement('ul');

    sectionTitle.innerHTML = data.interestingUrls.title;
    description.innerHTML = data.interestingUrls.description;

    data.interestingUrls.items.forEach(interestingUrl => {
        let url = createUrlElement(interestingUrl.name, interestingUrl.url, '_blank');
        let interestingUrlLi = createElement('li');

        interestingUrlLi.appendChild(url);
        interestingUrlUl.appendChild(interestingUrlLi);
    });

    interestingUrlsContainer.appendChild(sectionTitle);
    div.appendChild(description);
    div.appendChild(interestingUrlUl);
    divGroupContainer.appendChild(div);
    interestingUrlsContainer.appendChild(divGroupContainer);
    wrapper.appendChild(interestingUrlsContainer);

    appendHrToElement(interestingUrlsContainer);
}

function renderContact(data) {
    if (!data.contact.sectionVisible) { return; }

    let personalContainer = createElement('div');
    let divGroupContainer = createElement('div', ['group-container']);
    let sectionTitle = createElement('h2');
    let div = createElement('div');
    let description = createElement('p');
    let personalUl = createElement('ul');

    sectionTitle.innerHTML = data.contact.title;
    description.innerHTML = data.contact.description;

    data.contact.items.forEach(contact => {
        let url = createUrlElement(contact.name, contact.url, '_blank');
        let contactLi = createElement('li');

        contactLi.appendChild(url);
        personalUl.appendChild(contactLi);
    });

    personalContainer.appendChild(sectionTitle);
    div.appendChild(description);
    div.appendChild(personalUl);
    divGroupContainer.appendChild(div);
    personalContainer.appendChild(divGroupContainer);
    wrapper.appendChild(personalContainer);

    appendHrToElement(personalContainer);
}

function fetchResumeData() {
    return fetch('https://adriankurek.pl/resume.json').then(response => response.json());
}