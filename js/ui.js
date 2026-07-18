import * as main from "../index.js";
import * as data from "../asset/dataManager.js";
import * as util from "../asset/common.js"

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

moveIndicator(links[0]);

links.forEach(link=>{
    link.addEventListener("click", e=>{
        e.preventDefault();
        moveIndicator(link);
    });
});

const exploreSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px"><path d="m335-310 202-58q20-6 34.5-20.5T592-423l58-202q3-11-5.5-19.5T625-650l-202 58q-20 6-34.5 20.5T368-537l-58 202q-3 11 5.5 19.5T335-310Zm145-110q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"/></svg>'

export function buildCardList(filter){
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
    }
    try{
        main.quizList
    }catch{
        return
    }
    document.getElementById(filter).innerHTML = ""
    for(let i = 0; i < main.quizList.length; i++){
        if(allowed_type.some(element => main.quizList[i][0].type.includes(element))){
            const flagSrc = data.findElementByPath(main.quizList[i][0].cardInfo.setInfo)?.flag 
                        ?? data.findElementByPath("WD")?.flag;
            document.getElementById(filter).insertAdjacentHTML('beforeend',
                `<div class='card' onclick="explore(${main.quizList[i][1]},${main.quizList[i][2]})"><img class='flagCard' src='${flagSrc}'><p class="titleCard">${main.quizList[i][0].cardInfo.Title}</p><div class="exploreCard">${exploreSVG}<p>Explore</p></div></div>`
            );
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


export function searchPreparation(textResearch) {
    // 1. Réinitialisation de l'interface
    document.body.scrollTop = 0;
    
    const errorDiv = document.getElementById('researchEmptyOrError');
    const resultContainer = document.getElementById('card_search'); // <--- Corrigé ici !
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (resultContainer) resultContainer.innerHTML = "";

    // Sécurité si main.quizList n'est pas encore chargé
    try { main.quizList } catch { return; }

    // 2. Gestion des commandes globales ("all")
    let isCountryAll = textResearch === "r:country:all";
    let isCityAll = textResearch === "r:city:all";

    if (isCountryAll || isCityAll) {
        let allowedTypes = isCountryAll 
            ? ["placeTerritory", "shadowTerritory", "guessFromPosiTerritory"]
            : ["place", "name", "guess"];

        // Filtrer la liste globale
        let final = main.quizList.filter(quiz => 
            quiz[0]?.type && allowedTypes.some(type => quiz[0].type.includes(type))
        );

        // Tri (Continent -> Nom du Pays en FR/EN -> Titre du Quiz)
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

        // Affichage du nombre de résultats
        document.getElementById('NbResult').innerText = final.length + (final.length > 1 ? " résultats" : " résultat");

        // Rendu HTML dans #card_search
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

    // 3. Moteur de recherche par mots-clés (Système de points de pertinence)
    let finalResults = [];
    const words = textResearch.split(" ");

    for (let i = 0; i < main.quizList.length; i++) {
        const quiz = main.quizList[i];
        const cardInfo = quiz[0]?.cardInfo;
        
        if (!cardInfo) continue;

        let points = 0;

        // Récupération des données
        const countryData = data.findElementByPath(cardInfo.setInfo);
        
        // On récupère toutes les traductions du pays sous forme de tableau : ["Nunavut", "Nunavut", ...]
        const countryTranslations = countryData?.name ? Object.values(countryData.name) : [];
        
        const countryID = cardInfo.setInfo || "";
        const title = cardInfo.Title || "";
        const description = cardInfo.Text || ""; 

        // Vérification 1 : Nom du pays proche (+50 pts) - ICI ON CHERCHE DANS TOUTES LES LANGUES
        if (words.some(word => 
            countryTranslations.some(translation => 
                translation && util.checkDiff(word, translation) <= word.length / 2
            )
        )) {
            points += 50;
        }

        // Vérification 2 : ID du pays exact (+50 pts)
        if (words.some(word => word.toUpperCase() === countryID.toUpperCase())) {
            points += 50;
        }

        // Vérification 3 : Présence dans le Titre du Quiz (+10 pts par mot trouvé)
        if (words.some(word => title.toLowerCase().includes(word.toLowerCase()))) {
            points += words.filter(word => title.toLowerCase().includes(word.toLowerCase())).length * 10;
        }

        // Vérification 4 : Présence dans la Description (+2 pts par mot trouvé)
        if (words.some(word => description.toLowerCase().includes(word.toLowerCase()))) {
            points += words.filter(word => description.toLowerCase().includes(word.toLowerCase())).length * 2;
        }

        // Si le quiz a cumulé des points, on le garde
        if (points > 0) {
            finalResults.push({ quiz: quiz, points: points });
        }
    }

    // Tri des résultats par score de pertinence décroissant
    finalResults.sort((a, b) => b.points - a.points);

    // Affichage des résultats par mots-clés
    document.getElementById('textInfoField').innerText = finalResults.length + (finalResults.length > 1 ? " résultats" : " résultat");

    // Rendu HTML final dans #card_search
    finalResults.forEach(item => {
        const quiz = item.quiz;
        const flagSrc = data.findElementByPath(quiz[0].cardInfo.setInfo)?.flag ?? data.findElementByPath("WD")?.flag;
        resultContainer.insertAdjacentHTML('beforeend', `
            <div class='card' onclick="explore(${quiz[1]}, ${quiz[2]})">
                <img class='flagCard' src='${flagSrc}'>
                <p class="titleCard">${quiz[0].cardInfo.Title}</p>
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