import * as main from "../index.js";
import * as data from "../asset/dataManager.js";
import * as util from "../asset/common.js"
import * as trad from "../trad/trad.js"

const links = document.querySelectorAll("#navBarTop a");
const indicator = document.querySelector("#navBarTop .indicator");

function moveIndicator(link){
    document.querySelectorAll('.menuCards').forEach((e)=>{
        e.style.display = "none"
        e.innerHTML = '<div class="cardLoader shimmer"></div>'.repeat(12);
    })
    document.getElementById(link.getAttribute('menutoshow')).style.display = "grid";    
    buildCardList(link.getAttribute('menutoshow'))
    indicator.style.width = link.offsetWidth + "px";
    indicator.style.left = link.offsetLeft + "px";
    link.scrollIntoView({
        behavior: "smooth",
        inline: "nearest", 
        block: "nearest"
    });
}

export function resetBar(){
    moveIndicator(links[0]);
}

links.forEach(link=>{
    link.addEventListener("click", e=>{
        e.preventDefault();
        moveIndicator(link);
    });
});

const exploreSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px"><path d="m335-310 202-58q20-6 34.5-20.5T592-423l58-202q3-11-5.5-19.5T625-650l-202 58q-20 6-34.5 20.5T368-537l-58 202q-3 11 5.5 19.5T335-310Zm145-110q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"/></svg>'
const playSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#e3e3e3"><path d="m272-440 208 120 208-120-168-97v137h-80v-137l-168 97Zm168-189v-17q-44-13-72-49.5T340-780q0-58 41-99t99-41q58 0 99 41t41 99q0 48-28 84.5T520-646v17l280 161q19 11 29.5 29.5T840-398v76q0 22-10.5 40.5T800-252L520-91q-19 11-40 11t-40-11L160-252q-19-11-29.5-29.5T120-322v-76q0-22 10.5-40.5T160-468l280-161Zm0 378L200-389v67l280 162 280-162v-67L520-251q-19 11-40 11t-40-11Zm82.5-486.5Q540-755 540-780t-17.5-42.5Q505-840 480-840t-42.5 17.5Q420-805 420-780t17.5 42.5Q455-720 480-720t42.5-17.5ZM480-160Z"/></svg>'

export async function buildCardList(filter){
    let allowed_type = ["place","name","guess","placeTerritory","shadowTerritory","guessFromPosiTerritory","fromFlag"];
    if(filter == "card_all"){
        //noting   
    } else if (filter == "card_country"){
        allowed_type = ["placeTerritory","shadowTerritory","guessFromPosiTerritory"];
    } else if (filter == "card_city"){
        allowed_type = ["place","name","guess"];
    } else if (filter == "card_flag"){
        allowed_type = ["fromFlag"];
    } else if (filter == "card_game"){
        allowed_type = [];
        document.getElementById(filter).innerHTML = ""
        let icons = '<svg class="svgCard" xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px" fill="#e3e3e3"><path d="M40-240q-17 0-28.5-11.5T0-280v-23q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H40Zm240 0q-17 0-28.5-11.5T240-280v-25q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v25q0 17-11.5 28.5T680-240H280Zm500 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v23q0 17-11.5 28.5T920-240H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>'
        document.getElementById(filter).insertAdjacentHTML('beforeend',
                    `<div class='card' onclick="playGames('populationGame')">${icons}<p class="titleCard">${await trad.getTrad("./trad/",main.langSys,"game-population")}</p><div class="exploreCard">${playSVG}<p>${await trad.getTrad("./trad/",main.langSys,"btn-play")}</p></div></div>`
                );
        return
    }
    try{
        main.quizList
    }catch{
        return
    }
    document.getElementById(filter).innerHTML = ""
    for(let i = 0; i < main.quizList.length; i++){
        if(allowed_type.some(element => main.quizList[i][0].type.includes(element))){
            if(typeof main.quizList[i][0].cardInfo.lang == "string"){
                if(main.quizList[i][0].cardInfo.lang.toLowerCase() != main.langSys){
                    
                } else {
                    const flagSrc = data.findElementByPath(main.quizList[i][0].cardInfo.setInfo)?.flag 
                        ?? data.findElementByPath("WD")?.flag;
                    document.getElementById(filter).insertAdjacentHTML('beforeend',
                        `<div class='card' onclick="explore(${main.quizList[i][1]},${main.quizList[i][2]})"><img class='flagCard' src='${flagSrc}'><p class="titleCard">${main.quizList[i][0].cardInfo.Title}</p><div class="exploreCard">${exploreSVG}<p>${await trad.getTrad("./trad/",main.langSys,"btn-explore")}</p></div></div>`
                    );
                }
            } else if (!main.quizList[i][0].cardInfo.lang.includes(main.langSys)){
                
            } else {
                const flagSrc = data.findElementByPath(main.quizList[i][0].cardInfo.setInfo)?.flag 
                        ?? data.findElementByPath("WD")?.flag;
                document.getElementById(filter).insertAdjacentHTML('beforeend',
                    `<div class='card' onclick="explore(${main.quizList[i][1]},${main.quizList[i][2]})"><img class='flagCard' src='${flagSrc}'><p class="titleCard">${main.quizList[i][0].cardInfo.Title[main.langSys]}</p><div class="exploreCard">${exploreSVG}<p>${await trad.getTrad("./trad/",main.langSys,"btn-explore")}</p></div></div>`
                );
            }
        }
    }
}


document.getElementById('searchInput').addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    document.getElementById('searchInput').blur();
  }
});

document.getElementById('searchInput').addEventListener('blur', function() {
    if(document.getElementById('searchInput').value.trimStart() == ""){
        document.getElementById('searchInput').value = ""
        return
    }
    document.getElementById('home').style.display = "none"
    document.getElementById('search').style.display = "block"
    document.getElementById('settings').style.display = "none"
    searchPreparation(document.getElementById('searchInput').value)
    document.getElementById('searchBtnNavBar').style.color = "var(--btn-color-outline)"
});

document.getElementById('mobileSearchInput').addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    document.getElementById('mobileSearchInput').blur();
  }
});

document.getElementById('mobileSearchInput').addEventListener('blur', function() {
    if(document.getElementById('mobileSearchInput').value.trimStart() == ""){
        document.getElementById('mobileSearchInput').value = ""
        return
    }
    document.getElementById('home').style.display = "none"
    document.getElementById('search').style.display = "block"
    searchPreparation(document.getElementById('mobileSearchInput').value)
    document.getElementById('searchBtnNavBar').style.color = "var(--btn-color-outline)"
});

document.getElementById('returnHomeBtn').addEventListener('click',()=>{
    document.getElementById('home').style.display = "block"
    document.getElementById('search').style.display = "none"
    document.getElementById('mobileSearchInput').value = ""
    document.getElementById('searchInput').value = ""
    document.getElementById('searchBtnNavBar').style.color = "var(--text-color)"
})

document.getElementById('searchBtnNavBar').addEventListener('click',()=>{
    if(document.getElementById('searchBtnNavBar').style.color == "var(--btn-color-outline)"){
        document.getElementById('mobileSearchInput').focus()
        return
    }
    document.getElementById('home').style.display = "none"
    document.getElementById('search').style.display = "block"
    document.getElementById('searchBtnNavBar').style.color = "var(--btn-color-outline)"
    document.querySelector('#homeBtnNavBar .fullHomeIcon').style.display = "none"
    document.querySelector('#homeBtnNavBar .emptyHomeIcon').style.display = "block"
    document.querySelector('#settingsBtnNavBar .fullSettingsIcon').style.display = "none"
    document.querySelector('#settingsBtnNavBar .emptySettingsIcon').style.display = "block"
    document.getElementById('researchEmptyOrError').style.display = "none"
    document.getElementById('btn-settings-id-svg-open').style.display = "flex"
    document.getElementById('btn-settings-id-svg-close').style.display = "none"
    document.getElementById('settings').style.display = "none"
})

document.getElementById('homeBtnNavBar').addEventListener('click',()=>{
    document.getElementById('searchInput').value = ""
    document.getElementById('card_search').innerHTML = ""
    document.getElementById('mobileSearchInput').value = ""
    document.getElementById('home').style.display = "block"
    document.getElementById('search').style.display = "none"
    document.getElementById('searchBtnNavBar').style.color = "var(--text-color)"
    document.querySelector('#homeBtnNavBar .fullHomeIcon').style.display = "block"
    document.querySelector('#homeBtnNavBar .emptyHomeIcon').style.display = "none"
    document.querySelector('#settingsBtnNavBar .fullSettingsIcon').style.display = "none"
    document.querySelector('#settingsBtnNavBar .emptySettingsIcon').style.display = "block"
    document.getElementById('btn-settings-id-svg-open').style.display = "flex"
    document.getElementById('btn-settings-id-svg-close').style.display = "none"
    document.getElementById('settings').style.display = "none"
})

document.getElementById('settingsBtnNavBar').addEventListener('click',()=>{
    document.getElementById('searchInput').value = ""
    document.getElementById('card_search').innerHTML = ""
    document.getElementById('mobileSearchInput').value = ""
    document.getElementById('home').style.display = "none"
    document.getElementById('search').style.display = "none"
    document.getElementById('settings').style.display = "block"
    document.getElementById('searchBtnNavBar').style.color = "var(--text-color)"
    document.querySelector('#homeBtnNavBar .fullHomeIcon').style.display = "none"
    document.querySelector('#homeBtnNavBar .emptyHomeIcon').style.display = "block"
    document.querySelector('#settingsBtnNavBar .fullSettingsIcon').style.display = "block"
    document.querySelector('#settingsBtnNavBar .emptySettingsIcon').style.display = "none"
    document.getElementById('btn-settings-id-svg-open').style.display = "none"
    document.getElementById('btn-settings-id-svg-close').style.display = "flex"
})

document.getElementById('btn-settings-id').addEventListener('click',()=>{
    if(document.getElementById('btn-settings-id-svg-open').style.display != "none"){
        document.getElementById('searchInput').value = ""
        document.getElementById('card_search').innerHTML = ""
        document.getElementById('mobileSearchInput').value = ""
        document.getElementById('home').style.display = "none"
        document.getElementById('search').style.display = "none"
        document.getElementById('settings').style.display = "block"
        document.getElementById('searchBtnNavBar').style.color = "var(--text-color)"
        document.querySelector('#homeBtnNavBar .fullHomeIcon').style.display = "none"
        document.querySelector('#homeBtnNavBar .emptyHomeIcon').style.display = "block"
        document.querySelector('#settingsBtnNavBar .fullSettingsIcon').style.display = "block"
        document.querySelector('#settingsBtnNavBar .emptySettingsIcon').style.display = "none"
        document.getElementById('btn-settings-id-svg-open').style.display = "none"
        document.getElementById('btn-settings-id-svg-close').style.display = "flex"
    } else {
        document.getElementById('searchInput').value = ""
        document.getElementById('card_search').innerHTML = ""
        document.getElementById('mobileSearchInput').value = ""
        document.getElementById('home').style.display = "block"
        document.getElementById('search').style.display = "none"
        document.getElementById('settings').style.display = "none"
        document.getElementById('searchBtnNavBar').style.color = "var(--text-color)"
        document.querySelector('#homeBtnNavBar .fullHomeIcon').style.display = "block"
        document.querySelector('#homeBtnNavBar .emptyHomeIcon').style.display = "none"
        document.querySelector('#settingsBtnNavBar .fullSettingsIcon').style.display = "none"
        document.querySelector('#settingsBtnNavBar .emptySettingsIcon').style.display = "block"
        document.getElementById('btn-settings-id-svg-open').style.display = "flex"
        document.getElementById('btn-settings-id-svg-close').style.display = "none"
    }
})


export async function searchPreparation(textResearch) {
    document.body.scrollTop = 0;
    
    const errorDiv = document.getElementById('researchEmptyOrError');
    const resultContainer = document.getElementById('card_search');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (resultContainer) resultContainer.innerHTML = "";

    try { main.quizList } catch { return; }

    let isCountryAll = textResearch === "r:country:all";
    let isCityAll = textResearch === "r:city:all";

    if (isCountryAll || isCityAll) {
        let allowedTypes = isCountryAll 
            ? ["placeTerritory", "shadowTerritory", "guessFromPosiTerritory"]
            : ["place", "name", "guess"];

        let final = main.quizList.filter(quiz => 
            quiz[0]?.type && allowedTypes.some(type => quiz[0].type.includes(type))
        );
        final.sort((a, b) => {
            if (a[0].continent < b[0].continent) return -1;
            if (a[0].continent > b[0].continent) return 1;
            
            const countryDataA = data.findElementByPath(a[0].cardInfo?.setInfo);
            const countryDataB = data.findElementByPath(b[0].cardInfo?.setInfo);
            const countryA = countryDataA?.name?.fr || countryDataA?.name?.en || "";
            const countryB = countryDataB?.name?.fr || countryDataB?.name?.en || "";
            
            if (countryA < countryB) return -1;
            if (countryA > countryB) return 1;

            const titleA = a[0].cardInfo?.Title || "";
            const titleB = b[0].cardInfo?.Title || "";
            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
            return 0;
        });

        document.getElementById('NbResult').innerText = final.length + " " + (final.length > 1 ? await trad.getTrad("./trad/",main.langSys,"results") : await trad.getTrad("./trad/",main.langSys,"result"));

        final.forEach(quiz => {
            const flagSrc = data.findElementByPath(quiz[0].cardInfo.setInfo)?.flag ?? data.findElementByPath("WD")?.flag;
            resultContainer.insertAdjacentHTML('beforeend', `
                <div class='card' onclick="explore(${quiz[1]}, ${quiz[2]})">
                    <img class='flagCard' src='${flagSrc}'>
                    <p class="titleCard">${quiz[0].cardInfo.Title}</p>
                    <div class="exploreCard">${exploreSVG}<p>Explore</p></div>
                </div>
            `);
        });

        if (final.length === 0 && errorDiv) errorDiv.style.display = 'block';
        return;
    }

    let finalResults = [];
    const words = textResearch.split(" ");

    for (let i = 0; i < main.quizList.length; i++) {
        const quiz = main.quizList[i];
        const cardInfo = quiz[0]?.cardInfo;
        
        if (!cardInfo) continue;

        let points = 0;

        const countryData = data.findElementByPath(cardInfo.setInfo);
        
        const countryTranslations = countryData?.name ? Object.values(countryData.name) : [];
        
        const countryID = cardInfo.setInfo || "";
        const title = cardInfo.Title || "";
        const description = cardInfo.Text || ""; 

        if (words.some(word => 
            countryTranslations.some(translation => 
                translation && util.checkDiff(word, translation) <= word.length / 2
            )
        )) {
            points += 50;
        }

        if (words.some(word => word.toUpperCase() === countryID.toUpperCase())) {
            points += 50;
        }

        const getTextValue = (field) => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') {
            return Object.values(field).filter(val => typeof val === 'string').join(' ');
        }
        return '';
        };

        const titleText = getTextValue(title).toLowerCase();
        const descriptionText = getTextValue(description).toLowerCase();

        const matchingTitleWords = words.filter(word => 
            titleText.includes(word.toLowerCase())
        );
        points += matchingTitleWords.length * 10;

        const matchingDescWords = words.filter(word => 
            descriptionText.includes(word.toLowerCase())
        );
        points += matchingDescWords.length * 2;

        if(typeof cardInfo.lang == "string"){
            if(cardInfo.lang.toLowerCase() != main.langSys){
                continue
            }
        } else if (!cardInfo.lang.includes(main.langSys)){
            continue
        }

        if (points > 0) {
            finalResults.push({ quiz: quiz, points: points });
        }
    }

    finalResults.sort((a, b) => b.points - a.points);

    document.getElementById('textInfoField').innerText = finalResults.length + " " + (finalResults.length > 1 ? await trad.getTrad("./trad/",main.langSys,"results") : await trad.getTrad("./trad/",main.langSys,"result"));

    finalResults.forEach(item => {
        const quiz = item.quiz;
        const flagSrc = data.findElementByPath(quiz[0].cardInfo.setInfo)?.flag ?? data.findElementByPath("WD")?.flag;
        let tilt = ""
        if(typeof quiz[0].cardInfo.Title == "string"){
            tilt = quiz[0].cardInfo.Title
        } else {
            tilt = quiz[0].cardInfo.Title[main.langSys]
        }
        resultContainer.insertAdjacentHTML('beforeend', `
            <div class='card' onclick="explore(${quiz[1]}, ${quiz[2]})">
                <img class='flagCard' src='${flagSrc}'>
                <p class="titleCard">${tilt}</p>
                <div class="exploreCard">${exploreSVG}<p>Explore</p></div>
            </div>
        `);
    });

    if (finalResults.length === 0 && errorDiv) errorDiv.style.display = 'flex';
    else document.getElementById('card_search').style.display = 'grid'
}



let actualwidget = 0
let maxWidget;
const carousel = document.getElementById('widgetList');

export function addDots(nb) {
    maxWidget = nb
    const listDots = document.querySelector('#listDots');
    if (!listDots) return;
    listDots.innerHTML = '';

    for (let i = 0; i < nb; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        
        dot.dataset.index = i; 
        
        dot.addEventListener('click', () => {
            scrollToWidget(i);
        });

        listDots.appendChild(dot);
    }

    if (nb > 0) {
        listDots.children[0].classList.add('active');
    }
}

function scrollToWidget(index) {
    actualwidget = index - 1
    const widgets = carousel.querySelectorAll('.widget');
    const targetWidget = widgets[index];
    
    if (targetWidget) {
        const carouselLeft = carousel.getBoundingClientRect().left;
        const widgetLeft = targetWidget.getBoundingClientRect().left;
        
        const widgetWidth = targetWidget.offsetWidth;
        const carouselWidth = carousel.offsetWidth;
        
        const targetScrollLeft = carousel.scrollLeft + (widgetLeft - carouselLeft) - (carouselWidth / 2) + (widgetWidth / 2);

        carousel.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
    }
}

carousel.addEventListener('scroll', () => {
    const widget = carousel.querySelector('.widget');
    if (!widget) return;
    
    const widgetWidth = widget.getBoundingClientRect().width;
    
    const style = window.getComputedStyle(widget);
    const marginLeft = parseFloat(style.marginLeft);
    const marginRight = parseFloat(style.marginRight);
    const totalWidgetWidth = widgetWidth + marginLeft + marginRight;

    const scrollPosition = carousel.scrollLeft;
    const currentIndex = Math.round(scrollPosition / totalWidgetWidth);
    actualwidget = currentIndex
    
    updateDots(currentIndex);
});

document.getElementById('right').addEventListener("click",()=>{
    if(actualwidget >= maxWidget - 1) actualwidget = -1
    scrollToWidget(actualwidget + 1)
})

document.getElementById('left').addEventListener("click",()=>{
    if(actualwidget <= 0) actualwidget = maxWidget
    scrollToWidget(actualwidget - 1)
})

function updateDots(index) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}