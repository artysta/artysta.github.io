// TODO: Refactor for sure.

window.onload = () => {
    var isDarkThemeOn = true;
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

    function renderMessage(message) {
        content.innerHTML = '';
        let div = createElement('div');
        let p = createElement('p');
        p.innerText = message;
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.appendChild(p);
        content.appendChild(div);
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
        button.classList.toggle('button-light-mode');
        button.innerHTML = isDarkThemeOn ? LIGHT_THEME : DARK_THEME;

        let body = document.body;
        body.classList.toggle('body-light-mode');

        let groupContainers = document.getElementsByClassName('group-container');
        Array.from(groupContainers).forEach(container => container.classList.toggle('group-container-light-mode'));

        let urls = document.getElementsByTagName('a');
        Array.from(urls).forEach(url => url.classList.toggle('group-container-light-mode'));

        let hrs = document.getElementsByTagName('hr');
        Array.from(hrs).forEach(hr => hr.classList.toggle('group-container-light-mode'));

        let images = document.getElementsByTagName('img');
        Array.from(images).forEach(image => {
            let newSrc = image.src.split('-')[0];
            let extension = image.dataset.extension;
            image.src = isDarkThemeOn ? `${newSrc}-light.${extension}` : `${newSrc}-dark.${extension}`;
        });
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
        sectionTitle.innerHTML = data.about.title;
        aboutContainer.appendChild(sectionTitle);

        let description = createElement('p');
        description.innerHTML = data.about.description;

        divGroupContainer.appendChild(description);
        aboutContainer.appendChild(divGroupContainer);

        appendHrToElement(aboutContainer);

        wrapper.appendChild(aboutContainer);
    }

    function renderPersonal(data) {
        if (!data.personal.sectionVisible) { return; }

        let personalContainer = createElement('div');
        let divGroupContainer = createElement('div', ['group-container']);

        let sectionTitle = createElement('h2');
        sectionTitle.innerHTML = data.personal.title;
        personalContainer.appendChild(sectionTitle);

        let personalUl = createElement('ul');
        let nameLi = createElement('li');
        nameLi.innerHTML = data.personal.name;
        personalUl.appendChild(nameLi);

        let birthYearLi = createElement('li');
        birthYearLi.innerHTML = data.personal.birthYear;
        personalUl.appendChild(birthYearLi);

        let nationalityLi = createElement('li');
        nationalityLi.innerHTML = data.personal.nationality;
        personalUl.appendChild(nationalityLi);

        divGroupContainer.appendChild(personalUl);
        personalContainer.appendChild(divGroupContainer);

        appendHrToElement(personalContainer);

        wrapper.appendChild(personalContainer);
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
            img.src = workplace.logoUrl;
            let logoUrlParts = workplace.logoUrl.split('.');
            img.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

            let divPositionsContainer = createElement('div');

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

        appendHrToElement(workplacesContainer);

        wrapper.appendChild(workplacesContainer);
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
            img.src = school.logoUrl;
            let logoUrlParts = school.logoUrl.split('.');
            img.dataset.extension = logoUrlParts[logoUrlParts.length - 1];

            let divPositionsContainer = createElement('div');

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

        appendHrToElement(educationContainer);

        wrapper.appendChild(educationContainer);
    }

    function renderLanguages(data) {
        if (!data.languages.sectionVisible) { return; }

        let languagesContainer = createElement('div');
        let divGroupContainer = createElement('div', ['group-container']);

        let sectionTitle = createElement('h2');
        sectionTitle.innerHTML = data.languages.title;
        languagesContainer.appendChild(sectionTitle);

        let languageUl = createElement('ul');

        data.languages.items.forEach(language => {
            let languageLi = createElement('li');
            languageLi.innerHTML = `${language.name} (${language.level})`
            languageUl.appendChild(languageLi);
        });

        divGroupContainer.appendChild(languageUl);
        languagesContainer.appendChild(divGroupContainer);

        appendHrToElement(languagesContainer);

        wrapper.appendChild(languagesContainer);
    }

    function renderProgrammingLanguages(data) {
        if (!data.technologies.sectionVisible) { return; }

        let languagesContainer = createElement('div');
        let divGroupContainer = createElement('div', ['group-container']);

        let sectionTitle = createElement('h2');
        sectionTitle.innerHTML = data.technologies.title;
        languagesContainer.appendChild(sectionTitle);

        let div = createElement('div');

        let pDescription = createElement('p');
        pDescription.innerHTML = data.technologies.description;

        div.appendChild(pDescription);

        let divLanguagesWrapper = createElement('div', ['languages-wrapper']);

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

        div.appendChild(divLanguagesWrapper);
        divGroupContainer.appendChild(div);
        languagesContainer.appendChild(divGroupContainer);

        appendHrToElement(languagesContainer);

        wrapper.appendChild(languagesContainer);
    }

    function renderCertificatesAndCourses(data) {
        if (!data.certificates.sectionVisible) { return; }

        let certificationsAndCoursesContainer = createElement('div');
        let divGroupContainer = createElement('div', ['group-container']);

        let div = createElement('div');

        let pDescription = createElement('p');
        pDescription.innerHTML = data.certificates.description;

        div.appendChild(pDescription);

        let sectionTitle = createElement('h2');
        sectionTitle.innerHTML = data.certificates.title;
        certificationsAndCoursesContainer.appendChild(sectionTitle);

        let interestingUrlUl = createElement('ul');

        data.certificates.items.forEach(interestingUrl => {
            let url = createUrlElement(interestingUrl.name, interestingUrl.url, '_blank');
            let interestingUrlLi = createElement('li');
            interestingUrlLi.appendChild(url);
            interestingUrlUl.appendChild(interestingUrlLi);
        });

        div.appendChild(interestingUrlUl);
        divGroupContainer.appendChild(div);
        certificationsAndCoursesContainer.appendChild(divGroupContainer);

        appendHrToElement(certificationsAndCoursesContainer);

        wrapper.appendChild(certificationsAndCoursesContainer);
    }

    function renderURLs(data) {
        if (!data.interestingUrls.sectionVisible) { return; }

        let interestingUrlsContainer = createElement('div');
        let divGroupContainer = createElement('div', ['group-container']);

        let sectionTitle = createElement('h2');
        sectionTitle.innerHTML = data.interestingUrls.title;
        interestingUrlsContainer.appendChild(sectionTitle);

        let interestingUrlUl = createElement('ul');

        data.interestingUrls.items.forEach(interestingUrl => {
            let url = createUrlElement(interestingUrl.name, interestingUrl.url, '_blank');

            let interestingUrlLi = createElement('li');
            interestingUrlLi.appendChild(url);
            interestingUrlUl.appendChild(interestingUrlLi);
        });

        divGroupContainer.appendChild(interestingUrlUl);
        interestingUrlsContainer.appendChild(divGroupContainer);

        appendHrToElement(interestingUrlsContainer);

        wrapper.appendChild(interestingUrlsContainer);
    }

    function renderContact(data) {
        if (!data.contact.sectionVisible) { return; }

        let personalContainer = createElement('div');
        let divGroupContainer = createElement('div', ['group-container']);

        let sectionTitle = createElement('h2');
        sectionTitle.innerHTML = data.contact.title;
        personalContainer.appendChild(sectionTitle);

        let personalUl = createElement('ul');

        data.contact.items.forEach(contact => {
            let url = createUrlElement(contact.name, contact.url, '_blank');
            let contactLi = createElement('li');
            contactLi.appendChild(url);
            personalUl.appendChild(contactLi);
        });

        divGroupContainer.appendChild(personalUl);
        personalContainer.appendChild(divGroupContainer);

        appendHrToElement(personalContainer);

        wrapper.appendChild(personalContainer);
    }

    function fetchResumeData() {
        return fetch('https://adriankurek.pl/resume.json').then(response => response.json());
    }
}