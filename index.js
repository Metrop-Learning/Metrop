if(window.location == "https://metrop-learning.github.io/Metrop/"){
    window.location = "https://app.metrop-geo.fr/"
}

import * as data from "./asset/dataManager.js";
import * as util from "./asset/common.js"
import * as trad from "./trad/trad.js"

import * as setting from "./js/settings.js"
import * as ui from "./js/ui.js"

// INIT

const ver =  [0,8,1,"d"]
const verDate = [2026,7,28]
const license_link = "https://app.metrop-geo.fr/LICENSE"
const license = "MIT License"
const verGeoDatabase =  data.use.geo.ver();
const verGeoDatabaseDate = data.use.geo.date();
const verGeoDatabaseID = data.use.geo.id();

const verAPI = [1,0]

export const langSys = localStorage.getItem("LANG_SYS") ?? trad.getLang()


await trad.traductAll("./trad/",langSys)

ui.resetBar()

setting.init()

console.info("Metrop App\n----------\nVER : "+ver[0]+"."+ver[1]+"."+ver[2]+"."+ver[3]+"\nRELEASED : " + verDate[0] + " / " + verDate[1] + " / " + verDate[2] + "\n\n\nGEO DATABASE\n------------\nID : " + verGeoDatabaseID + "\nVER : " + verGeoDatabase[0] + "." + verGeoDatabase[1] + "." + verGeoDatabase[2] + "\nRELEASED : " + verGeoDatabaseDate[0] + " / " + verGeoDatabaseDate[1] + " / " + verGeoDatabaseDate[2] + "\n\n\nMETROP API\n----------\nVER : " + verAPI[0]+"."+verAPI[1])

document.getElementById('verText').innerHTML = "🌍 Metrop Version " + ver[0] + "." + ver[1] + "." + ver[2] + "." + ver[3] + " (API : " + verAPI[0] + "." + verAPI[1] + ")<br><br>Updated the : " + verDate[0] + " / "+verDate[1]+" / " + verDate[2] +"<br><br>🗺️ Metrop Geo Database Version : " + verGeoDatabase[0] + "." + verGeoDatabase[1] + "." + verGeoDatabase[2] + "<br><br>Updated the : " + verGeoDatabaseDate[0] + "/" + verGeoDatabaseDate[1] + "/" + verGeoDatabaseDate[2]

// Info App
document.getElementById('verText').innerText = `${ver[0]} . ${ver[1]} . ${ver[2]} . ${ver[3]}`
document.getElementById('verApiText').innerText = `${verAPI[0]} . ${verAPI[1]}`
document.getElementById('verDateText').innerText = `${verDate[0]} / ${verDate[1]} / ${verDate[2]}`
document.getElementById('licenseName').innerText = license
document.getElementById('licenseLink').innerText = license_link
document.getElementById('licenseLink').href = license_link

// Info Geo Database
document.getElementById('geoDataId').innerText = data.use.geo.id()
document.getElementById('geoDataLList').innerText = data.use.geo.license_link()
document.getElementById("verApiGeoText").innerText = `${data.use.geo.api()[0]} . ${data.use.geo.api()[1]}`
document.getElementById('geoDataName').innerText = data.use.geo.name()
document.getElementById('geoDataVer').innerText = `${data.use.geo.ver()[0]} . ${data.use.geo.ver()[1]} . ${data.use.geo.ver()[2]}`
document.getElementById('geoDataDate').innerText = `${data.use.geo.date()[0]} / ${data.use.geo.date()[1]} / ${data.use.geo.date()[2]}`
let geoLicense = data.use.geo.license()
document.getElementById('GeolicenseList').innerHTML = ""
for(let i = 0; i < geoLicense.length; i++){
    document.getElementById('GeolicenseList').innerHTML += "<span>"+geoLicense[i]+"</span>"
}

if(localStorage.getItem("lastVersionUsed")){
    let verS = localStorage.getItem("lastVersionUsed").split(".")
    verS = [parseInt(verS[0]), parseInt(verS[1]), parseInt(verS[2]), verS[3]]
    if(ver[0] > verS[0]){
        //document.getElementById('updateHeader').style.display = 'block'
    }else if(ver[1] > verS[1]){
        //document.getElementById('updateHeader').style.display = 'block'
    }else if(ver[2] > verS[2]){
        //document.getElementById('updateHeader').style.display = 'block'
    }else if(ver[3] > verS[3]){
        //document.getElementById('updateHeader').style.display = 'block'
    }
    localStorage.setItem("lastVersionUsed",ver[0] + "." + ver[1] + "." + ver[2] + "." + ver[3])
    
}
else{
    localStorage.setItem("lastVersionUsed",ver[0] + "." + ver[1] + "." + ver[2] + "." + ver[3])
}


//Init card
export const quizList = await data.getAllQuizInfo()

ui.buildCardList("card_all")

// Init showcase
let listOfShowcase = []
document.getElementById('widgetList').innerHTML = ""
const exploreSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="35px"><path d="m335-310 202-58q20-6 34.5-20.5T592-423l58-202q3-11-5.5-19.5T625-650l-202 58q-20 6-34.5 20.5T368-537l-58 202q-3 11 5.5 19.5T335-310Zm145-110q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm0 340q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-320Z"/></svg>'
for(let i = 0; i < data.groupShowcase.length; i++){
    for(let j = 0; j < data.quizdb[i].SHOWCASE_GROUP.length ;j++){
        let group = data.groupShowcase[i][data.quizdb[i].SHOWCASE_GROUP[j].group_id]
        group["info"] = data.quizdb[i].SHOWCASE_GROUP[j]
        if(!group.info.lang.includes(langSys)){
            continue
        }
        //create the div
        const widget = document.createElement('div');
        widget.classList.add('widget');

        widget.style.backgroundImage = "radial-gradient(circle at bottom left, var(--invert-color) 0%, transparent 70%),url('"+group.info.img+"')";
        widget.innerHTML = `
            <div class="widget-content">
                <img class="showcase_flag" src='${data.findElementByPath(group.info.flag).flag}'>
                <h1 class="showcase_name">${group.info.NAME[langSys] ?? group.info.NAME.en ?? "ERROR_NAME_NOT_FOUND"}</h1>
            </div>
        `

        listOfShowcase.push([widget,group])
    }
}

listOfShowcase = util.shuffle(listOfShowcase)
let dotneeded = 0
for(let i = 0; i < Math.min(6,listOfShowcase.length);i++){
    //create the cards...
    const cards = document.createElement('div');
    cards.classList.add('cards_showcase');
    for(let j = 0; j < listOfShowcase[i][1].list.length; j++){
        let info = await data.getQuizList.getAQuiz(listOfShowcase[i][1].list[j][0],listOfShowcase[i][1].list[j][1])
        if(typeof info.cardInfo.lang == "string"){
            if(info.cardInfo.lang.toLowerCase() != langSys){
                
            } else {
                const flagSrc = data.findElementByPath(info.cardInfo.setInfo)?.flag 
                    ?? data.findElementByPath("WD")?.flag;
                cards.innerHTML +=
                    `<div class='card' onclick="explore(${listOfShowcase[i][1].list[j][0]},${listOfShowcase[i][1].list[j][1]})"><img class='flagCard' src='${flagSrc}'><p class="titleCard">${info.cardInfo.Title}</p><div class="exploreCard">${exploreSVG}<p>${await trad.getTrad("./trad/",langSys,"btn-explore")}</p></div></div>`
            }
        } else if (!info.cardInfo.lang.includes(langSys)){
            
        } else {
            const flagSrc = data.findElementByPath(info.cardInfo.setInfo)?.flag 
                    ?? data.findElementByPath("WD")?.flag;
            cards.innerHTML +=
                `<div class='card' onclick="explore(${listOfShowcase[i][1].list[j][0]},${listOfShowcase[i][1].list[j][1]})"><img class='flagCard' src='${flagSrc}'><p class="titleCard">${info.cardInfo.Title[langSys]}</p><div class="exploreCard">${exploreSVG}<p>${await trad.getTrad("./trad/",langSys,"btn-explore")}</p></div></div>`
        }
    }
    const contentDiv = listOfShowcase[i][0].querySelector('.widget-content');
    contentDiv.appendChild(cards);

    document.getElementById('widgetList').appendChild(listOfShowcase[i][0]);
    dotneeded++;

    setupSwipeToFullscreen(listOfShowcase[i][0]);
}

ui.addDots(dotneeded)


// It work so don't touch it
function setupSwipeToFullscreen(widget) {
    const content = widget.querySelector('.widget-content');
    let touchStartY = 0;
    widget.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    widget.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const diffY = touchStartY - touchY;
        const isFullscreen = widget.classList.contains('is-fullscreen');
        if (diffY > 40 && !isFullscreen) {
            animateFLIP(widget, true);
        }
        if (diffY < -40 && isFullscreen && content.scrollTop <= 0) {
            animateFLIP(widget, false);
        }
        if (isFullscreen) {
            if (content.scrollTop <= 0 && diffY < 0) {
                if(e.cancelable) e.preventDefault();
            }
        }
    }, { passive: false });
    widget.addEventListener('wheel', (e) => {
        const isFullscreen = widget.classList.contains('is-fullscreen');
        if (e.deltaY > 0 && !isFullscreen) {
            e.preventDefault();
            animateFLIP(widget, true);
        }
        if (e.deltaY < 0 && isFullscreen && content.scrollTop <= 0) {
            e.preventDefault(); 
            animateFLIP(widget, false);
        }
        if (isFullscreen) {
            const isScrollingUp = e.deltaY < 0;
            const isScrollingDown = e.deltaY > 0;

            if (isScrollingUp && content.scrollTop <= 0) {
                e.preventDefault();
            }
            if (isScrollingDown && content.scrollHeight - content.clientHeight <= content.scrollTop) {
                e.preventDefault();
            }
        }
    }, { passive: false });
}

// It work so don't touch it
function animateFLIP(widget, toFullscreen) {
    if (widget.classList.contains('is-animating')) return;

    const widgetList = document.getElementById('widgetList');
    const firstBounds = widget.getBoundingClientRect();
    const firstCenterX = firstBounds.left + firstBounds.width / 2;
    const firstCenterY = firstBounds.top + firstBounds.height / 2;
    if (toFullscreen) {
        widget.classList.add('is-fullscreen');
        widgetList.classList.add('lock-horizontal');
        document.body.style.overflow = 'hidden'; 
    } else {
        widget.classList.remove('is-fullscreen');
        widgetList.classList.remove('lock-horizontal');
        document.body.style.overflow = ''; 
    }
    const lastBounds = widget.getBoundingClientRect();
    const lastCenterX = lastBounds.left + lastBounds.width / 2;
    const lastCenterY = lastBounds.top + lastBounds.height / 2;
    const invertX = firstCenterX - lastCenterX;
    const invertY = firstCenterY - lastCenterY;
    const invertScaleX = firstBounds.width / lastBounds.width;
    const invertScaleY = firstBounds.height / lastBounds.height;
    widget.style.transformOrigin = 'center center';
    widget.style.transform = `translate(${invertX}px, ${invertY}px) scale(${invertScaleX}, ${invertScaleY})`;
    widget.offsetHeight; 
    widget.classList.add('is-animating');
    widget.style.transform = 'translate(0, 0) scale(1)';
    widget.addEventListener('transitionend', function handler() {
        widget.classList.remove('is-animating');
        widget.style.transform = '';
        widget.style.transformOrigin = '';
        widget.removeEventListener('transitionend', handler);
    }, { once: true });
}


// Show card info

// nb = quizlist
//num = quiz
async function explore(nb,num){
  document.getElementById('popupMainInfoQuiz').style.display = 'block'
  const obj = await data.getQuizList.getAQuiz(nb,num)
  if (obj == undefined) return
  if(typeof obj.cardInfo.Title == "string"){
    document.getElementById('cardInfoPopUp_title').innerText = obj.cardInfo.Title
  } else {
    document.getElementById('cardInfoPopUp_title').innerText = obj.cardInfo.Title[langSys]
  }
  if(typeof obj.cardInfo.Text == "string"){
    document.getElementById('cardInfoPopUp_shortResume').innerText = obj.cardInfo.Text
  } else {
    document.getElementById('cardInfoPopUp_shortResume').innerText = obj.cardInfo.Text[langSys]
    console.log(obj.cardInfo.Text[langSys])
  }
  document.getElementById('cardInfoPopUp_info_lenght_txt').innerText = obj.list.length
  document.getElementById('cardInfoPopUp_imgFlag').src = data.findElementByPath(obj.cardInfo.setInfo)?.flag ?? data.findElementByPath("WD")?.flag
  let pict = obj.cardInfo.pictureURL
  if (pict == "None"){ pict = "https://upload.wikimedia.org/wikipedia/commons/9/97/ISS-42_Waning_sun.jpg" }
  document.getElementById('cardInfoPopUp_MainBox').style.setProperty(
    '--bg-image-bg-card',
    'url("'+ pict +'")'
  );

  if("conflic_type" in obj.cardInfo){
    if(obj.cardInfo.conflic_type.includes("exi")){
        document.getElementById('exi').style.display = "block"
    } else {document.getElementById('exi').style.display = "none"}
    if(obj.cardInfo.conflic_type.includes("pos")){
        document.getElementById('pos').style.display = "block"
    } else {document.getElementById('pos').style.display = "none"}
    if(obj.cardInfo.conflic_type.includes("ter")){
        document.getElementById('ter').style.display = "block"
    } else {document.getElementById('ter').style.display = "none"}
    if(obj.cardInfo.conflic_type.includes("war")){
        document.getElementById('war').style.display = "block"
    } else {document.getElementById('war').style.display = "none"}
    if(obj.cardInfo.conflic_type.includes("abz")){
        document.getElementById('abz').style.display = "block"
    } else {document.getElementById('abz').style.display = "none"}


    document.querySelectorAll('.involvedList').forEach((e)=>{
        e.innerHTML = ""
        if("involved" in obj.cardInfo){
            document.querySelectorAll('invlolved').forEach((e)=>{
                e.style.display = "block"
            })
            for(let i = 0; i < obj.cardInfo.involved.length; i++){
                e.innerHTML += `<div class="element">
                    <img src="${data.findElementByPath(obj.cardInfo.involved[i]).flag}">
                    <span>${data.findElementByPath(obj.cardInfo.involved[i]).name[langSys]}</span>
                </div>`
            }
        } else {
            document.querySelectorAll('invlolved').forEach((e)=>{
                e.style.display = "none"
            })
        }
    })
  } else {
    document.getElementById('exi').style.display = "none"
    document.getElementById('pos').style.display = "none"
    document.getElementById('ter').style.display = "none"
    document.getElementById('war').style.display = "none"
    document.getElementById('abz').style.display = "none"
  }


  let buttonWillAdded = ""
  if(obj.type.includes("placeTerritory") || obj.type.includes("shadowTerritory") || obj.type.includes("guessFromPosiTerritory")){
        buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="openquiz('+nb+","+num+",'lessonTerritory'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M200-80q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h480q33 0 56.5 23.5T760-800v240q0 17-11.5 28.5T720-520q-17 0-28.5-11.5T680-560v-240H480v245q0 11-10 17t-20 0l-70-42-70 42q-10 6-20 0t-10-17v-245h-80v640h200q17 0 28.5 11.5T440-120q0 17-11.5 28.5T400-80H200Zm378.5-18.5Q520-157 520-240t58.5-141.5Q637-440 720-440t141.5 58.5Q920-323 920-240T861.5-98.5Q803-40 720-40T578.5-98.5ZM701-159l102-64q10-6 10-17t-10-17l-102-64q-10-6-20.5-.5T670-304v128q0 12 10.5 17.5t20.5-.5ZM290-800h200-200Zm-90 640v-640 262.5-42.5 42.5V-800v640Z"/></svg>'+await trad.getTrad("./trad/",langSys,"btn-lesson-territory")+'</button>';
  }
  if(obj.type.includes("place") || obj.type.includes("guess")){
        buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="openquiz('+nb+","+num+",'lessonCity'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M200-80q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h480q33 0 56.5 23.5T760-800v240q0 17-11.5 28.5T720-520q-17 0-28.5-11.5T680-560v-240H480v245q0 11-10 17t-20 0l-70-42-70 42q-10 6-20 0t-10-17v-245h-80v640h200q17 0 28.5 11.5T440-120q0 17-11.5 28.5T400-80H200Zm378.5-18.5Q520-157 520-240t58.5-141.5Q637-440 720-440t141.5 58.5Q920-323 920-240T861.5-98.5Q803-40 720-40T578.5-98.5ZM701-159l102-64q10-6 10-17t-10-17l-102-64q-10-6-20.5-.5T670-304v128q0 12 10.5 17.5t20.5-.5ZM290-800h200-200Zm-90 640v-640 262.5-42.5 42.5V-800v640Z"/></svg>'+await trad.getTrad("./trad/",langSys,"btn-lesson-city")+'</button>';
  }
  if(obj.type.includes("fromFlag") || obj.type.includes("fromName")){
        buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="openquiz('+nb+","+num+",'lessonFlag'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M200-80q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T200-880h480q33 0 56.5 23.5T760-800v240q0 17-11.5 28.5T720-520q-17 0-28.5-11.5T680-560v-240H480v245q0 11-10 17t-20 0l-70-42-70 42q-10 6-20 0t-10-17v-245h-80v640h200q17 0 28.5 11.5T440-120q0 17-11.5 28.5T400-80H200Zm378.5-18.5Q520-157 520-240t58.5-141.5Q637-440 720-440t141.5 58.5Q920-323 920-240T861.5-98.5Q803-40 720-40T578.5-98.5ZM701-159l102-64q10-6 10-17t-10-17l-102-64q-10-6-20.5-.5T670-304v128q0 12 10.5 17.5t20.5-.5ZM290-800h200-200Zm-90 640v-640 262.5-42.5 42.5V-800v640Z"/></svg>'+await trad.getTrad("./trad/",langSys,"btn-lesson-flag")+'</button>';
  }
  if(obj.type.includes("place")){
    let btnPlace1 = '<button class="btn" onclick="openquiz('+nb+","+num+",'place'"+')"'
    let btnPlace2 = '><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M480-80q-106 0-173-31.83-67-31.84-67-81.5 0-21 13.17-39.34 13.16-18.33 38.16-33 12-6.66 25.17-4Q329.67-267 336.33-255q6.67 12 3.84 25.17-2.84 13.16-14.84 19.83-5.33 4-10 8.33-4.66 4.34-8.66 8.34 15.66 18.66 67 32.66 51.33 14 106.33 14t106.33-14q51.34-14 67-32.66-4-4-8.66-8.34-4.67-4.33-10-8.33-12-6.67-14.84-19.83Q617-243 623.67-255q6.66-12 19.83-14.67 13.17-2.66 25.17 4 25 14.67 38.16 33Q720-214.33 720-193.33q0 49.66-67 81.5Q586-80 480-80Zm1-203.33q105.67-78.34 159-158.17 53.33-79.83 53.33-152.5 0-108.67-69-164T480-813.33q-74.67 0-144 55.33t-69.33 164q0 71 53 147.83 53 76.84 161.33 162.84Zm-1 67.66q-10 0-20-3.33t-18.67-10Q320-325 260-415.83 200-506.67 200-594q0-71 25.5-124.5t65.83-89.5q40.34-36 90-54Q431-880 480-880t99 18q50 18 90 54t65.5 89.5Q760-665 760-594q0 87.33-60 178.17Q640-325 518-229q-8.67 6.67-18.33 10-9.67 3.33-19.67 3.33ZM480-520q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z"/></svg><span>'+await trad.getTrad("./trad/",langSys,"btn-place-on-map")+'</span></button>';
    buttonWillAdded += btnPlace1 + 'style="font-size: medium;"' + btnPlace2
  }
  //name
  buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="openquiz('+nb+","+num+",'name'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M551.67-472.33q81-56.67 127-124.84 46-68.16 46-136.83 0-38.67-12.84-59Q699-813.33 677-813.33q-53.67 0-92.33 83.16Q546-647 546-537q0 18 1.17 34.17 1.16 16.16 4.5 30.5ZM150-306q-9.67 9.67-23.33 9.67-13.67 0-23.34-9.67-9.66-9.67-9.66-23.33 0-13.67 9.66-23.34L144-393.33 103.33-434q-9.66-9.67-9.66-23.33 0-13.67 9.66-23.34 9.67-9.66 23.34-9.66 13.66 0 23.33 9.66L190.67-440l40.66-40.67q9.67-9.66 23.34-9.66 13.66 0 23.33 9.66 9.67 9.67 9.67 23.34 0 13.66-9.67 23.33l-40.67 40.67L278-352.67q9.67 9.67 9.67 23.34 0 13.66-9.67 23.33-9.67 9.67-23.33 9.67-13.67 0-23.34-9.67l-40.66-40.67L150-306Zm468-14q-31.33 0-56.67-13.17Q536-346.33 518-373q-18 10-36.67 18.67-18.66 8.66-37.66 17.33-13.34 5.67-25.84.5T400-355q-5.33-13.33.83-26 6.17-12.67 19.5-18.33 19-8 36.67-16.5t34-17.84q-6.33-22.66-9.17-49Q479-509 479-539q0-145.33 56-243.17Q591-880 677-880q51.33 0 82.67 40.17Q791-799.67 791-730.67q0 87.34-56.5 171.34t-157.5 151q9 11 19.5 16.5t22.5 5.5q27 0 58-23t59-65.34q8.67-12 21.5-16.16 12.83-4.17 25.83 1.5 13 6.66 20 19.5 7 12.83 4.67 27.83-2 14-1.67 27.67.34 13.66 2.67 28.33 7.67-4 16.17-9.83 8.5-5.84 17.5-13.5 10.66-9 24.5-10.5 13.83-1.5 24.83 7.16 11.33 9 12.33 23t-8.66 23q-22.34 21.67-46.5 34.17Q825-320 803.33-320q-23 0-38.5-15.5T743.67-381Q715-351.33 683-335.67 651-320 618-320ZM153.33-120q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.34 0 23.84 9.5t9.5 23.84q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5Zm163.34 0q-14.34 0-23.84-9.5t-9.5-23.83q0-14.34 9.5-23.84t23.84-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5ZM480-120q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5Zm163.33 0q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.34 0 23.84 9.5t9.5 23.84q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5Zm163.34 0q-14.34 0-23.84-9.5t-9.5-23.83q0-14.34 9.5-23.84t23.84-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5Z"/></svg>'+await trad.getTrad("./trad/",langSys,"btn-name-element")+'</button>';
  if(obj.type.includes("guess")){
      buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="openquiz('+nb+","+num+",'guess'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M264-199q21-19.33 46.83-46.83 25.84-27.5 48.84-58.84 23-31.33 39-63.97t16-62.69q0-67.89-42.38-112.28Q329.92-588 264-588q-65.92 0-108.29 44.4-42.38 44.4-42.38 112.3 0 30.3 16 62.8t39 63.83q23 31.34 48.84 58.84Q243-218.33 264-199ZM106.67-80q-11.34 0-19-7.67-7.67-7.66-7.67-19 0-11.33 7.67-19 7.66-7.66 19-7.66h130Q208-160 173-196t-65-78q-26-37.33-43.67-77-17.66-39.67-17.66-80.43 0-95.12 62.33-159.18t155-64.06q92.67 0 155 64.06t62.33 159.18q0 40.76-17.66 80.43Q446-311.33 420-274q-30 42.67-65.33 78.67-35.34 36-64 62h562.66q11.34 0 19 7.66 7.67 7.67 7.67 19 0 11.34-7.67 19-7.66 7.67-19 7.67H106.67ZM604-594.67Zm-10.67 315.34q-8.66 0-15.66-3.84-7-3.83-12.34-11.83L531-349q-8.33-13.33-4-26t14.67-20.33q10.33-7.67 23.16-6.84 12.84.84 21.84 15.17l6.66 11.33L619-416.33q5-7.67 12.34-11.67 7.35-4 16.33-4h165.66v-381.33h-422v52q0 14.16-9.58 23.75Q372.17-728 358-728q-14 0-23.67-9.83-9.66-9.84-9.66-23.5v-52q0-27 19.83-46.84Q364.33-880 391.33-880h422q27 0 46.84 19.83Q880-840.33 880-813.33V-432q0 27-19.83 46.83-19.84 19.84-46.84 19.84H665.67l-44.34 70.66Q616-286.67 609-283t-15.67 3.67ZM264-372.67q28.61 0 48.64-20.02 20.03-20.03 20.03-48.64t-20.03-48.64Q292.61-510 264-510t-48.64 20.03q-20.03 20.03-20.03 48.64t20.03 48.64q20.03 20.02 48.64 20.02Zm0-68.66Zm340-124.34 63.67 39q5.33 2.67 10.16-.44 4.84-3.11 2.84-8.56l-17.34-73 57.34-49.66Q725-662 723-667t-7.67-6l-74.82-6.39L611-748.67q-2-5.33-7.33-5.33-5.34 0-7.34 5.33l-29.51 69.28L492-673q-5.67 1-7.67 6t2.34 8.67L544-608.67l-17.33 73q-2 5.45 2.83 8.56 4.83 3.11 10.17.44l64.33-39Z"/></svg>'+await trad.getTrad("./trad/",langSys,"btn-from-posi")+'</button>';
  }
  if(obj.type.includes("placeTerritory")){
      let btnPlace1 = '<button class="btn" onclick="openquiz('+nb+","+num+",'placeTerritory'"+')"'
      let btnPlace2 = '><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M638.67-527.33v-1 1-168 168ZM171.33-138.67q-18 8.67-34.66-2.16Q120-151.67 120-172v-558.67q0-13 7.5-23t19.83-15l183.34-63.66q11-4.34 22-4 11 .33 22 4L608-750.67 788.67-822q18-8 34.66 2.5Q840-809 840-788.67v338.34q0 14.33-9.5 23.5-9.5 9.16-23.83 9.16-14.34 0-23.84-9.5t-9.5-23.83v-295.67l-134.66 51.34v148q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83v-148L388-758v499.67q0 15.66-8.5 28.33-8.5 12.67-22.83 18.33l-185.34 73ZM186.67-214l134.66-51.33V-758l-134.66 44.67V-214Zm462.66-7.33q36.67 0 61.5-24 24.84-24 25.17-62.67.33-36.67-24.83-61.67-25.17-25-61.84-25-36.66 0-61.66 25t-25 61.67q0 36.67 25 61.67t61.66 25Zm0 66.66q-63.33 0-108.33-45T496-308q0-64 45-108.67 45-44.66 108.33-44.66 64 0 108.67 44.66Q802.67-372 802.67-308q0 23-6.17 43.83-6.17 20.84-17.83 38.84L858-146q9 9 9 22t-9 22q-9 9-22 9t-22-9l-79.33-78.67q-18.67 13-39.84 19.5-21.16 6.5-45.5 6.5ZM321.33-758v492.67V-758Z"/></svg><span>'+await trad.getTrad("./trad/",langSys,"btn-place-on-map")+'</span></button>';
      buttonWillAdded += btnPlace1 + 'style="font-size: medium;"' + btnPlace2
  }
  if(obj.type.includes("shadowTerritory")){
      buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="openquiz('+nb+","+num+",'shadowTerritory'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M146.67-80q-27 0-46.84-19.83Q80-119.67 80-146.67v-498.66q0-27 19.83-46.84Q119.67-712 146.67-712H248v-101.33q0-27 19.83-46.84Q287.67-880 314.67-880h498.66q27 0 46.84 19.83Q880-840.33 880-813.33v498.66q0 27-19.83 46.84Q840.33-248 813.33-248H712v101.33q0 27-19.83 46.84Q672.33-80 645.33-80H146.67Zm168-234.67h498.66v-498.66H314.67v498.66Z"/></svg>'+await trad.getTrad("./trad/",langSys,"btn-from-shadow")+'</button>';
  }
  if(obj.type.includes("guessFromPosiTerritory")){
      buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="openquiz('+nb+","+num+",'guessFromPosiTerritory'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M479.96-147.33q18.71 0 36.21-2t34.5-6.18l-50-75.16H355.33v-41.55q0-34.29 24.38-58.7 24.39-24.41 58.62-24.41h83V-480h-82.66q-17 0-29.5-12.5t-12.5-29.5v-83.33h-18.55q-26.79 0-45.79-18.17t-19-45.16q0-9.34 2.84-18.67 2.83-9.34 7.83-17.34l64.67-95q-105 29.67-173.17 117.3-68.17 87.62-68.17 202.37h41.34v-42q0-17 12.16-29.17Q213-563.33 230-563.33h83.33q17 0 29.5 12.16 12.5 12.17 12.5 29.17v42q0 17-12.5 29.17-12.5 12.16-29.5 12.16v41.83q0 34.51-24.43 58.67Q264.46-314 230.14-314h-38.47q44 75.33 119.88 121 75.89 45.67 168.41 45.67ZM796-378q8-24.33 12.33-49.79 4.34-25.46 4.34-52.48 0-116.4-70.65-205.35-70.64-88.96-178.69-117.05v114.35q34.34 0 58.79 24.43 24.45 24.43 24.45 58.73V-522q19.76 0 35.76 5.17 16 5.16 30 19.16L796-378ZM480.18-80q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Z"/></svg>'+await trad.getTrad("./trad/",langSys,"btn-from-posi")+'</button>';
  }
  if(obj.type.includes("fromFlag")){
      buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="openquiz('+nb+","+num+",'fromFlag'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M500-572ZM208.5-128.63Q200-137.25 200-150v-620q0-12.75 8.63-21.38Q217.25-800 230-800h218q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H260v251h292q10.5 0 18.75 6T581-466l14 62h145v-44q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v74q0 12.75-8.62 21.37Q782.75-344 770-344H568q-10.5 0-18.75-6T539-367l-14-62H260v279q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63Zm654-729.87Q919-802 919-721t-56.5 137.5Q806-527 725-527t-137.5-56.5Q531-640 531-721t56.5-137.5Q644-915 725-915t137.5 56.5ZM698-692l-45-45q-6-6-14-6t-14 6q-6 6-6 14t6 14l52 52q9 9 21 9t21-9l106-107q6-5.82 6-13.91T825-792q-6-6-14-6t-14 6l-99 100Z"/></svg>'+await trad.getTrad("./trad/",langSys,"btn-with-flag")+'</button>';
  }
  document.getElementById('cardInfoPopUp_listGameMode').innerHTML = buttonWillAdded
}

function openquiz(nb,num,type) {
  const params = new URLSearchParams({
    quizListId: nb,
    quizId: num,
    type: type,
  });
  window.location.assign(`./game/index.html?${params.toString()}`);
}

function playGames(type) {
  const params = new URLSearchParams({
    type: type,
  });
  window.location.assign(`./game/index.html?${params.toString()}`);
}

document.getElementById('cardInfoPopUp_exitBtn').addEventListener('click',()=>{
    document.getElementById('popupMainInfoQuiz').style.display = 'none'
})

window.explore = explore;
window.openquiz = openquiz;
window.playGames = playGames;