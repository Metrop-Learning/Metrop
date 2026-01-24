import data from './data/jsonList.json' with { type: "json" };
import dataBorder from './country/boundary.json' with { type:"json"}
import * as util from "./city/asset/common.js"

const ver =  [0,7,5,"i"]
const verAPI = [0,5]

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
    document.getElementById("welcomeHeader").style.display = 'block';
    localStorage.setItem("lastVersionUsed",ver[0] + "." + ver[1] + "." + ver[2] + "." + ver[3])
}


//Get the list of the score :
let scoreList = localStorage.getItem("scoreList")
console.log(scoreList)
try{
    scoreList = JSON.parse(scoreList)
    if(scoreList == null){
        scoreList = {}
        localStorage.setItem("scoreList",JSON.stringify(scoreList)) 
    }
}
catch{
    scoreList = {}
    localStorage.setItem("scoreList",JSON.stringify(scoreList)) 
}



document.getElementById('verText').innerText = "Metrop Version " + ver[0] + "." + ver[1] + "." + ver[2] + "." + ver[3] + " (API : " + verAPI[0] + "." + verAPI[1] + ")"
console.info("Metrop ver\n"+ver[0]+"."+ver[1]+"."+ver[2]+"."+ver[3]+"\nMetrop API ver\n"+verAPI[0]+"."+verAPI[1])

if(!localStorage.getItem("DEBUG_STATUT")){
    localStorage.setItem("DEBUG_STATUT","false")
}
else if (localStorage.getItem("DEBUG_STATUT") == "true"){
    console.info("DEBUG MODE ACTIVATED")
    document.getElementById('betaTest').style.display = "block";
    document.getElementById('betaElement').style.display = "block";
}

let listCountryQuizInfo = []
let listCityQuizInfo = []

//Set up city
let cardList = []
const promisesCity = data.city.map(city => cityListSetUp(city, "city"));
listCityQuizInfo = await Promise.all(promisesCity);
//for(let i = 0; i < data.city.length; i++){
//    listCityQuizInfo.push(await cityListSetUp(data.city[i],"city"));
//}
const regex = /[\[\uFF3B]\s*(.*?)\s*[\]\uFF3D]/;

const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

cardList.sort((a, b) => {
  const textA = a[0];
  const textB = b[0];

  // 1. get title before []
  const titreA = textA.split("[")[0].trim();
  const titreB = textB.split("[")[0].trim();

  const titreCompare = normalize(titreA).localeCompare(normalize(titreB));
  if (titreCompare !== 0) return titreCompare;

  // 2. Same title → sort by []
  const mA = textA.match(regex);
  const mB = textB.match(regex);

  const niveauA = mA?.[1] ?? "__NO_LEVEL__";
  const niveauB = mB?.[1] ?? "__NO_LEVEL__";

  const ordre = ["__NO_LEVEL__", "Facile", "Intermédiaire", "Expert"];
  return ordre.indexOf(niveauA) - ordre.indexOf(niveauB);
});
document.getElementById('cityQuizList').innerHTML = "";
if(cardList.length == 0){
    document.getElementById('cityQuizList').innerHTML = '<div style="display: flex; flex-direction: column; align-items: center;"><svg class="svgErrorQuiz" xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#000000"><path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5Zm3.2-153q12.82 0 21.32-8.63 8.5-8.62 8.5-21.37v-193q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v193q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63Zm-2.91 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg><h2>Une erreur est survenue : aucune donnée trouvée.</h2></div>';
    document.getElementById('cityQuizList').className = 'none'
}
for(let i = 0; i < cardList.length; i++){
    document.getElementById('cityQuizList').appendChild(cardList[i][1]);
}
document.getElementById('nbrQuizCity').innerText =  cardList.length + " quiz"
//set up country
cardList = []
const promisesCountry = data.country.map(country => cityListSetUp(country, "country"));
listCountryQuizInfo = await Promise.all(promisesCountry);
//for(let i = 0; i < data.country.length; i++){
//    listCountryQuizInfo.push(await cityListSetUp(data.country[i],"country"));
//}
cardList.sort((a, b) => {
  const textA = a[0];
  const textB = b[0];

  // 1. get title before []
  const titreA = textA.split("[")[0].trim();
  const titreB = textB.split("[")[0].trim();

  const titreCompare = normalize(titreA).localeCompare(normalize(titreB));
  if (titreCompare !== 0) return titreCompare;

  // 2. Same title → sort by []
  const mA = textA.match(regex);
  const mB = textB.match(regex);

  const niveauA = mA?.[1] ?? "__NO_LEVEL__";
  const niveauB = mB?.[1] ?? "__NO_LEVEL__";

  const ordre = ["__NO_LEVEL__", "Facile", "Intermédiaire", "Expert"];
  return ordre.indexOf(niveauA) - ordre.indexOf(niveauB);
});
document.getElementById('countryQuizList').innerHTML = "";
if(cardList.length == 0){
    document.getElementById('countryQuizList').innerHTML = '<div style="display: flex; flex-direction: column; align-items: center;"><svg class="svgErrorQuiz" xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#000000"><path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5Zm3.2-153q12.82 0 21.32-8.63 8.5-8.62 8.5-21.37v-193q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v193q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63Zm-2.91 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg><h2>Une erreur est survenue : aucune donnée trouvée.</h2></div>';
    document.getElementById('countryQuizList').className = 'none'
}
for(let i = 0; i < cardList.length; i++){
    document.getElementById('countryQuizList').appendChild(cardList[i][1]);
}
document.getElementById('nbrQuizCountry').innerText =  cardList.length + " quiz"
//Set up flag
cardList = []
for(let i = 0; i < data.flag.length; i++){
    await cityListSetUp(data.flag[i],"flag");
}
cardList.sort((a, b) => {
  const textA = a[0];
  const textB = b[0];

  // 1. get title before []
  const titreA = textA.split("[")[0].trim();
  const titreB = textB.split("[")[0].trim();

  const titreCompare = normalize(titreA).localeCompare(normalize(titreB));
  if (titreCompare !== 0) return titreCompare;

  // 2. Same title → sort by []
  const mA = textA.match(regex);
  const mB = textB.match(regex);

  const niveauA = mA?.[1] ?? "__NO_LEVEL__";
  const niveauB = mB?.[1] ?? "__NO_LEVEL__";

  const ordre = ["__NO_LEVEL__", "Facile", "Intermédiaire", "Expert"];
  return ordre.indexOf(niveauA) - ordre.indexOf(niveauB);
});
document.getElementById('flagQuizList').innerHTML = "";
if(cardList.length == 0){
    document.getElementById('flagQuizList').innerHTML = '<div style="display: flex; flex-direction: column; align-items: center;"><svg class="svgErrorQuiz" xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#000000"><path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5Zm3.2-153q12.82 0 21.32-8.63 8.5-8.62 8.5-21.37v-193q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v193q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63Zm-2.91 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg><h2>Une erreur est survenue : aucune donnée trouvée.</h2></div>';
    document.getElementById('flagQuizList').className = 'none'
}
for(let i = 0; i < cardList.length; i++){
    document.getElementById('flagQuizList').appendChild(cardList[i][1]);
}
document.getElementById('nbrQuizFlag').innerText =  cardList.length + " quiz"

async function cityListSetUp(nameJson,type){
    const obj = await loadJSON(nameJson,type);
    let dataToReturn = { "type":type }
    if (obj == undefined) return
    const wikimediaImageRegex = /^https:\/\/upload\.wikimedia\.org\/[^\s]+\.(?:jpg|jpeg|png|gif|svg|webp)$/;
    let img;
    let title;
    let text;
    let flagImg;
    if ('cardInfo' in obj) {
            if ('pictureURL' in obj.cardInfo) {
                if(obj.cardInfo.pictureURL != "None"){
                    if(wikimediaImageRegex.test(obj.cardInfo.pictureURL)){
                        img = obj.cardInfo.pictureURL
                    }
                    else{
                        console.error('METROP DATA API\n---\nFALSE DATA : "pictureURL"\nIN : '+ nameJson +' \n---\nThe URL are false or not comming from wikipedia\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', obj);
                    }
                }
            } else {
                console.warn('METROP DATA API\n---\nDATA MISSING : "pictureURL"\nIN : '+ nameJson +' \n---\npictureURL are not needed but recomended. The None parameters will be aplied.\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', obj);
            }
            //tilte
            if ('Title' in obj.cardInfo) {
                title = obj.cardInfo.Title;
                dataToReturn["name"] = title
            } else {
                title = "No Title"
                console.warn('METROP DATA API\n---\nDATA MISSING : "Title"\nIN : '+ nameJson +' \n---\nTitle are not needed but recomended. The title will be "No Title".\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', obj);
            }
            if ('Text' in obj.cardInfo) {
                text = obj.cardInfo.Text;
                dataToReturn["description"] = text
            } else {
                text = "No Texte"
                console.warn('METROP DATA API\n---\nDATA MISSING : "Text"\nIN : '+ nameJson +' \n---\nText are not needed but recomended. The text will be "No Text".\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', obj);
            }
            if ('lang' in obj.cardInfo) {
                //GOOD
            } else {
                //NOT GOOD
                console.warn('METROP DATA API\n---\nDATA MISSING : "lang"\nIN : '+ nameJson +' \n---\nlang are needed. The lang will be set to "EN".\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', obj);
            }
            if ('setInfo' in obj.cardInfo) {
                const id = obj.cardInfo.setInfo;
                let deep;
                        
                const [continent, country, region, subregion] = id.split("-");
                dataToReturn["countryID"] = country
                        
                if (continent && dataBorder[continent]) {
                  deep = dataBorder[continent];
                }
            
                if (deep?.get && country && deep.get[country]) {
                  deep = deep.get[country];
                  if ('namefr' in deep){
                    dataToReturn["countryName"] = deep.namefr
                  }
                }
            
                if (deep?.get && region && deep.get[region]) {
                  deep = deep.get[region];
                }
            
                if (deep?.get && subregion && deep.get[subregion]) {
                  deep = deep.get[subregion];
                }
                if ('flag' in deep) flagImg = deep.flag;
            } else {
                //NOT GOOD
            }
    } else {
      console.error('METROP DATA API\n---\nNEEDED DATA MISSING : "cardInfo"\nIN : '+ nameJson +' \n---\ncardInfo are used to give base information to Metrop\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', obj);
      return
    }
    if('type' in obj){
        //GOOD
    }
    else{
        console.error('METROP DATA API\n---\nNEEDED DATA MISSING : "type"\nIN : '+ nameJson +' \n---\ntype are used to give base information to Metrop\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', obj);
        return
    }
    //set up
    const div = document.createElement('div');
    div.className = 'card';
    const div_c = document.createElement('div');
    div_c.className = 'cardContent';
    const h3 = document.createElement('h3');
    h3.textContent = title;
    if(flagImg){
        h3.innerHTML = "<img class='flagOnCard' src='" + flagImg + "'><br>" + h3.innerHTML
    }
    else{
        h3.style.marginTop = "50px"
    }
    h3.className = 'top'
    const p = document.createElement('p');
    p.textContent = text;
    p.className = 'middle'
    if(img){
        const div_i = document.createElement('div');
        div_i.className = 'cardImage';
        const img_div = document.createElement('img');
        img_div.src = img
        div_i.appendChild(img_div)
        div.appendChild(div_i)
    }
    div_c.appendChild(h3);
    div_c.appendChild(p);
    let buttonWillAdded = "<div class='bottom'>"
    if(obj.type.includes("place")){
        buttonWillAdded += '<button class="btn" style="background-color: rgb(82, 82, 82); font-size: medium;" onclick="placeOnMap('+"'"+nameJson+"'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M480-80q-106 0-173-31.83-67-31.84-67-81.5 0-21 13.17-39.34 13.16-18.33 38.16-33 12-6.66 25.17-4Q329.67-267 336.33-255q6.67 12 3.84 25.17-2.84 13.16-14.84 19.83-5.33 4-10 8.33-4.66 4.34-8.66 8.34 15.66 18.66 67 32.66 51.33 14 106.33 14t106.33-14q51.34-14 67-32.66-4-4-8.66-8.34-4.67-4.33-10-8.33-12-6.67-14.84-19.83Q617-243 623.67-255q6.66-12 19.83-14.67 13.17-2.66 25.17 4 25 14.67 38.16 33Q720-214.33 720-193.33q0 49.66-67 81.5Q586-80 480-80Zm1-203.33q105.67-78.34 159-158.17 53.33-79.83 53.33-152.5 0-108.67-69-164T480-813.33q-74.67 0-144 55.33t-69.33 164q0 71 53 147.83 53 76.84 161.33 162.84Zm-1 67.66q-10 0-20-3.33t-18.67-10Q320-325 260-415.83 200-506.67 200-594q0-71 25.5-124.5t65.83-89.5q40.34-36 90-54Q431-880 480-880t99 18q50 18 90 54t65.5 89.5Q760-665 760-594q0 87.33-60 178.17Q640-325 518-229q-8.67 6.67-18.33 10-9.67 3.33-19.67 3.33ZM480-520q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z"/></svg>Place sur la carte</button><br>';
    }
    if(obj.type.includes("name")){
        buttonWillAdded += '<button class="btn" style="background-color: rgb(82, 82, 82);font-size: medium;" onclick="nameit('+"'"+nameJson+"'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M551.67-472.33q81-56.67 127-124.84 46-68.16 46-136.83 0-38.67-12.84-59Q699-813.33 677-813.33q-53.67 0-92.33 83.16Q546-647 546-537q0 18 1.17 34.17 1.16 16.16 4.5 30.5ZM150-306q-9.67 9.67-23.33 9.67-13.67 0-23.34-9.67-9.66-9.67-9.66-23.33 0-13.67 9.66-23.34L144-393.33 103.33-434q-9.66-9.67-9.66-23.33 0-13.67 9.66-23.34 9.67-9.66 23.34-9.66 13.66 0 23.33 9.66L190.67-440l40.66-40.67q9.67-9.66 23.34-9.66 13.66 0 23.33 9.66 9.67 9.67 9.67 23.34 0 13.66-9.67 23.33l-40.67 40.67L278-352.67q9.67 9.67 9.67 23.34 0 13.66-9.67 23.33-9.67 9.67-23.33 9.67-13.67 0-23.34-9.67l-40.66-40.67L150-306Zm468-14q-31.33 0-56.67-13.17Q536-346.33 518-373q-18 10-36.67 18.67-18.66 8.66-37.66 17.33-13.34 5.67-25.84.5T400-355q-5.33-13.33.83-26 6.17-12.67 19.5-18.33 19-8 36.67-16.5t34-17.84q-6.33-22.66-9.17-49Q479-509 479-539q0-145.33 56-243.17Q591-880 677-880q51.33 0 82.67 40.17Q791-799.67 791-730.67q0 87.34-56.5 171.34t-157.5 151q9 11 19.5 16.5t22.5 5.5q27 0 58-23t59-65.34q8.67-12 21.5-16.16 12.83-4.17 25.83 1.5 13 6.66 20 19.5 7 12.83 4.67 27.83-2 14-1.67 27.67.34 13.66 2.67 28.33 7.67-4 16.17-9.83 8.5-5.84 17.5-13.5 10.66-9 24.5-10.5 13.83-1.5 24.83 7.16 11.33 9 12.33 23t-8.66 23q-22.34 21.67-46.5 34.17Q825-320 803.33-320q-23 0-38.5-15.5T743.67-381Q715-351.33 683-335.67 651-320 618-320ZM153.33-120q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.34 0 23.84 9.5t9.5 23.84q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5Zm163.34 0q-14.34 0-23.84-9.5t-9.5-23.83q0-14.34 9.5-23.84t23.84-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5ZM480-120q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5Zm163.33 0q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.34 0 23.84 9.5t9.5 23.84q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5Zm163.34 0q-14.34 0-23.84-9.5t-9.5-23.83q0-14.34 9.5-23.84t23.84-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5Z"/></svg>Trouve les noms</button><br>';
    }
    if(obj.type.includes("guess")){
        buttonWillAdded += '<button class="btn" style="background-color: rgb(82, 82, 82);font-size: medium;" onclick="guessIt('+"'"+nameJson+"'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M264-199q21-19.33 46.83-46.83 25.84-27.5 48.84-58.84 23-31.33 39-63.97t16-62.69q0-67.89-42.38-112.28Q329.92-588 264-588q-65.92 0-108.29 44.4-42.38 44.4-42.38 112.3 0 30.3 16 62.8t39 63.83q23 31.34 48.84 58.84Q243-218.33 264-199ZM106.67-80q-11.34 0-19-7.67-7.67-7.66-7.67-19 0-11.33 7.67-19 7.66-7.66 19-7.66h130Q208-160 173-196t-65-78q-26-37.33-43.67-77-17.66-39.67-17.66-80.43 0-95.12 62.33-159.18t155-64.06q92.67 0 155 64.06t62.33 159.18q0 40.76-17.66 80.43Q446-311.33 420-274q-30 42.67-65.33 78.67-35.34 36-64 62h562.66q11.34 0 19 7.66 7.67 7.67 7.67 19 0 11.34-7.67 19-7.66 7.67-19 7.67H106.67ZM604-594.67Zm-10.67 315.34q-8.66 0-15.66-3.84-7-3.83-12.34-11.83L531-349q-8.33-13.33-4-26t14.67-20.33q10.33-7.67 23.16-6.84 12.84.84 21.84 15.17l6.66 11.33L619-416.33q5-7.67 12.34-11.67 7.35-4 16.33-4h165.66v-381.33h-422v52q0 14.16-9.58 23.75Q372.17-728 358-728q-14 0-23.67-9.83-9.66-9.84-9.66-23.5v-52q0-27 19.83-46.84Q364.33-880 391.33-880h422q27 0 46.84 19.83Q880-840.33 880-813.33V-432q0 27-19.83 46.83-19.84 19.84-46.84 19.84H665.67l-44.34 70.66Q616-286.67 609-283t-15.67 3.67ZM264-372.67q28.61 0 48.64-20.02 20.03-20.03 20.03-48.64t-20.03-48.64Q292.61-510 264-510t-48.64 20.03q-20.03 20.03-20.03 48.64t20.03 48.64q20.03 20.02 48.64 20.02Zm0-68.66Zm340-124.34 63.67 39q5.33 2.67 10.16-.44 4.84-3.11 2.84-8.56l-17.34-73 57.34-49.66Q725-662 723-667t-7.67-6l-74.82-6.39L611-748.67q-2-5.33-7.33-5.33-5.34 0-7.34 5.33l-29.51 69.28L492-673q-5.67 1-7.67 6t2.34 8.67L544-608.67l-17.33 73q-2 5.45 2.83 8.56 4.83 3.11 10.17.44l64.33-39Z"/></svg>Depuis la position</button><br>';
    }
    if(obj.type.includes("placeTerritory")){
        buttonWillAdded += '<button class="btn" style="background-color: rgb(82, 82, 82);font-size: medium;" onclick="placeTerritoryIt('+"'"+nameJson+"'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M638.67-527.33v-1 1-168 168ZM171.33-138.67q-18 8.67-34.66-2.16Q120-151.67 120-172v-558.67q0-13 7.5-23t19.83-15l183.34-63.66q11-4.34 22-4 11 .33 22 4L608-750.67 788.67-822q18-8 34.66 2.5Q840-809 840-788.67v338.34q0 14.33-9.5 23.5-9.5 9.16-23.83 9.16-14.34 0-23.84-9.5t-9.5-23.83v-295.67l-134.66 51.34v148q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83v-148L388-758v499.67q0 15.66-8.5 28.33-8.5 12.67-22.83 18.33l-185.34 73ZM186.67-214l134.66-51.33V-758l-134.66 44.67V-214Zm462.66-7.33q36.67 0 61.5-24 24.84-24 25.17-62.67.33-36.67-24.83-61.67-25.17-25-61.84-25-36.66 0-61.66 25t-25 61.67q0 36.67 25 61.67t61.66 25Zm0 66.66q-63.33 0-108.33-45T496-308q0-64 45-108.67 45-44.66 108.33-44.66 64 0 108.67 44.66Q802.67-372 802.67-308q0 23-6.17 43.83-6.17 20.84-17.83 38.84L858-146q9 9 9 22t-9 22q-9 9-22 9t-22-9l-79.33-78.67q-18.67 13-39.84 19.5-21.16 6.5-45.5 6.5ZM321.33-758v492.67V-758Z"/></svg>Place sur la carte</button><br>';
    }
    if(obj.type.includes("shadowTerritory")){
        buttonWillAdded += '<button class="btn" style="background-color: rgb(82, 82, 82);font-size: medium;" onclick="shadowTerritory('+"'"+nameJson+"'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M146.67-80q-27 0-46.84-19.83Q80-119.67 80-146.67v-498.66q0-27 19.83-46.84Q119.67-712 146.67-712H248v-101.33q0-27 19.83-46.84Q287.67-880 314.67-880h498.66q27 0 46.84 19.83Q880-840.33 880-813.33v498.66q0 27-19.83 46.84Q840.33-248 813.33-248H712v101.33q0 27-19.83 46.84Q672.33-80 645.33-80H146.67Zm168-234.67h498.66v-498.66H314.67v498.66Z"/></svg>Depuis son ombre</button><br>';
    }
    if(obj.type.includes("guessFromPosiTerritory")){
        buttonWillAdded += '<button class="btn" style="background-color: rgb(82, 82, 82);font-size: medium;" onclick="fromPosiTerritory('+"'"+nameJson+"'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M479.96-147.33q18.71 0 36.21-2t34.5-6.18l-50-75.16H355.33v-41.55q0-34.29 24.38-58.7 24.39-24.41 58.62-24.41h83V-480h-82.66q-17 0-29.5-12.5t-12.5-29.5v-83.33h-18.55q-26.79 0-45.79-18.17t-19-45.16q0-9.34 2.84-18.67 2.83-9.34 7.83-17.34l64.67-95q-105 29.67-173.17 117.3-68.17 87.62-68.17 202.37h41.34v-42q0-17 12.16-29.17Q213-563.33 230-563.33h83.33q17 0 29.5 12.16 12.5 12.17 12.5 29.17v42q0 17-12.5 29.17-12.5 12.16-29.5 12.16v41.83q0 34.51-24.43 58.67Q264.46-314 230.14-314h-38.47q44 75.33 119.88 121 75.89 45.67 168.41 45.67ZM796-378q8-24.33 12.33-49.79 4.34-25.46 4.34-52.48 0-116.4-70.65-205.35-70.64-88.96-178.69-117.05v114.35q34.34 0 58.79 24.43 24.45 24.43 24.45 58.73V-522q19.76 0 35.76 5.17 16 5.16 30 19.16L796-378ZM480.18-80q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Z"/></svg>Depuis la position</button><br>';
    }
    if('learning' in obj){
        buttonWillAdded += '<button class="btn" style="font-size: medium;" onclick="learning('+"'"+nameJson+"'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M448-259.33v-416q-43.67-28-94.08-43t-101.92-15q-37.33 0-73.5 8.66Q142.33-716 106.67-702v421.33Q139-294 176.83-300.33q37.84-6.34 75.17-6.34 51.38 0 100.02 11.84Q400.67-283 448-259.33Zm-408 14v-469.34q0-13.66 6.5-25.33Q53-751.67 66-758q43.33-21.33 90.26-31.67Q203.19-800 252-800q74.67 0 129 18.67 54.33 18.66 114.33 55.66 9 5.34 14.17 13.67t5.17 20v432.67q48-23.67 94.83-35.5 46.83-11.84 98.5-11.84 37.33 0 75.83 6t69.5 16.67v-457.67q0-14.16 9.62-23.75 9.62-9.58 23.83-9.58 14.22 0 23.72 9.58 9.5 9.59 9.5 23.75v496.34q0 26.26-21.5 39.96t-43.17.7q-35-16-71.98-25.33-36.99-9.33-75.35-9.33-52.68 0-102.67 15.83-50 15.83-94.66 43.83-6.67 4.34-14.17 6.17t-15.17 1.83q-7.66 0-15.16-1.83T452-179.67q-45.53-28.2-95.93-43.93-50.4-15.73-104.07-15.73-38.36 0-75.35 9.66-36.98 9.67-72.65 25-22.4 11-43.2-2.33Q40-220.33 40-245.33ZM614.67-426v-383q0-10.95 6.2-19.79T637-841l83.33-28q12-4.33 22.5 3.49t10.5 20.18V-461q0 10.95-6.39 19.79-6.38 8.84-16.61 12.21L647-402.33q-12 4.33-22.17-3.49-10.16-7.83-10.16-20.18Zm-337.34-70.33Z"/></svg>Apprentisage</button>';
    }
    div_c.innerHTML += buttonWillAdded + "</div>"
    div.appendChild(div_c)
    //Not ready yet
    //When active it switch height of .card to 560px and add : padding-bottom: 60px;
    //div.innerHTML += getScore(nameJson)
    cardList.push([title,div])
    dataToReturn["div"] = div
    return dataToReturn
}

function getScore(jsonName){
    if(scoreList[jsonName] == undefined){
        return '<div class="cardFooter"><svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#e3e3e3"><path d="M320.67-160q-27 0-46.84-19.83Q254-199.67 254-226.67V-300q0-14.17 9.58-23.75 9.59-9.58 23.75-9.58h89.34V-448q-34 1.33-66.84-10.17Q277-469.67 251-492q-5.38-5.05-8.53-11.36-3.14-6.31-3.14-13.64v-38.33h-35q-6.37 0-12.35-2.34-5.98-2.33-11.31-7.66l-95.34-95.34q-10.66-10.66-10.33-25 .33-14.33 11.67-23.66 31-27 77-41.5t87-14.5q29 0 63.16 7.66Q348-750 376.67-732.33v-9.34q0-24.39 16.97-41.36T435-800h338.33q27.5 0 47.09 19.58Q840-760.83 840-733.33V-270q0 45.83-32.08 77.92Q775.83-160 730-160H320.67Zm122.66-173.33h210q14.17 0 23.75 9.58 9.59 9.58 9.59 23.75v30q0 19 12.16 31.17Q711-226.67 730-226.67t31.17-12.16Q773.33-251 773.33-270v-463.33h-330v46l231 231q8.34 8.33 9.67 17.83 1.33 9.5-2.33 18.5-3.67 9-11.32 14.83-7.65 5.84-19.55 5.84-6.8 0-12.97-2.5-6.16-2.5-11.16-7.5l-112-112-14 16q-13.34 14.66-27.17 23.66-13.83 9-30.17 15.67v132.67ZM220-622h52.67q14.16 0 23.75 9.58 9.58 9.59 9.58 23.75V-534q15.33 10 30.5 14.67 15.17 4.66 31.5 4.66 24.33 0 47.83-11.33t37.5-26.67l14-16-64.66-64.66q-31-31-69.55-48.17t-82.45-17.17q-24.67 0-45.34 5.34-20.66 5.33-42 14.66L220-622Zm400 355.33H320.67v40h310.66q-5-7-8.16-17.33-3.17-10.33-3.17-22.67Zm-299.33 40v-40 40Z"/></svg> <p>Pas encore de record</p></div>'
    }
    else if(scoreList[jsonName] == "7"){
        return '<div class="cardFooter" style="background-color: rgb(84, 100, 218);"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="m480-381 83.33 50.67q9 5.66 18-.84t6.67-17.5L566-443l74-64.33q8.67-7.67 5-17.84-3.67-10.16-15-11.16L533-544l-37.67-89.33q-4.24-10-15.29-10-11.04 0-15.37 10L427-544l-97 7.67q-11.33 1-15 11.16-3.67 10.17 5 17.84L394-443l-22 94.33q-2.33 11 6.67 17.5t18 .84L480-381ZM346.11-160H226.67q-27.5 0-47.09-19.58Q160-199.17 160-226.67v-119.05l-87-87.61q-9.67-10-14.33-22.05Q54-467.42 54-479.88q0-12.45 4.67-24.62 4.66-12.17 14.33-22.17l87-87.61v-119.05q0-27.5 19.58-47.09Q199.17-800 226.67-800h119.05l87.61-87q10-9.67 22.5-14.33 12.5-4.67 24.97-4.67 12.46 0 24.51 5.13t22.02 14.54L614-800h119.33q27.5 0 47.09 19.58Q800-760.83 800-733.33v119.05l87 87.61q9.67 10 14.33 22.05 4.67 12.04 4.67 24.5 0 12.45-4.67 24.62-4.66 12.17-14.33 22.17l-87 87.61v119.05q0 27.5-19.58 47.09Q760.83-160 733.33-160H614l-86.67 85.67q-9.97 9.08-22.02 14.04-12.05 4.96-24.51 4.96-12.47 0-24.61-4.96-12.14-4.96-22.19-14.04L346.11-160Zm27.22-66.67L480.67-122l105.27-104.67h147.39V-374l106-106-106-106v-147.33H586l-105.33-106-106.67 106H226.67V-586l-106 106 106 106v147.33h146.66Zm107.34-254Z"/></svg> <p>Score Parfait</p></div>'
    }
    else if(scoreList[jsonName] == "6"){
        return '<div class="cardFooter" style="background-color: rgba(65, 136, 160);"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="m437.33-439.33-68-69.67q-9.66-10.33-23.83-10.33-14.17 0-24.83 10-10.34 10.33-10.34 24.66 0 14.34 10.34 24.67L414-367.33q10 10 23.33 10 13.34 0 23.34-10l178.66-178q10-10 9.84-24-.17-14-10.5-24-10-9.34-23.84-9.17-13.83.17-23.16 9.5L437.33-439.33ZM330-86l-60.67-103.33L150-214q-12.33-2.33-20.33-13.17-8-10.83-6-23.16l13-117.67L59-458q-8.67-9-8.67-22T59-502l77.67-89.33-13-117.67q-2-12.33 6-23.17 8-10.83 20.33-13.16L269.33-770 330-874q6.67-11 18.67-15.17 12-4.16 24 1.17L480-839.33 587.33-888q12-5.33 24-1.5T630-874.67L691.33-770 810-745.33q12.33 2.33 20.33 13.16 8 10.84 6 23.17l-13 117.67L901-502q8.67 9 8.67 22T901-458l-77.67 90 13 117.67q2 12.33-6 23.16-8 10.84-20.33 13.17l-118.67 24.67-61.33 104q-6.67 11-18.67 14.83-12 3.83-24-1.5L480-120.67 372.67-72q-12 5.33-24 1.17Q336.67-75 330-86Zm44.67-60.67L480-191.33l108 44.66 63.33-98.66L766-274l-11.33-116.67L833.33-480l-78.66-91.33L766-688l-114.67-26.67L586-813.33l-106 44.66-108-44.66-63.33 98.66L194-688l11.33 116.67L126.67-480l78.66 89.33L194-272l114.67 26.67 66 98.66ZM480-480Z"/></svg><p>Score Excellent</p></div>'
    }
    else if(scoreList[jsonName] == "5"){
        return '<div class="cardFooter" style="background-color: #43a548;"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="m422-395.33-94-94q-9.67-9.67-24-9.67t-24.67 10.33q-9.66 9.67-9.66 24 0 14.34 9.66 24l119.34 120q10 10 23.33 10 13.33 0 23.33-10L680-555.33q10.33-10.34 10.33-24.67 0-14.33-10.33-24.67-10.33-9.66-25-9.33-14.67.33-24.33 10L422-395.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg><p>Score Très bien</p></div>'
    }
    else if(scoreList[jsonName] == "4"){
        return '<div class="cardFooter" style="background-color: #97883e;"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="M360-257.33h226.67q15 0 26.16-6.84Q624-271 630.67-284l80-186.67q2-5 3.33-13.33t1.33-13.33V-524q0-15-8.16-23.17-8.17-8.16-23.17-8.16H480l27.33-137.34q2-8.66-.33-16.33-2.33-7.67-8-13.33l-23.67-24.34L306.67-564q-5.34 8-9.34 16.67-4 8.66-4 18.66V-324q0 26.33 19.84 46.5Q333-257.33 360-257.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg><p>Score Pas si mal</p></div>'
    }
    else if(scoreList[jsonName] == "3"){
        return '<div class="cardFooter" style="background-color: #da5d1f;"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="M479.99-280q15.01 0 25.18-10.15 10.16-10.16 10.16-25.17 0-15.01-10.15-25.18-10.16-10.17-25.17-10.17-15.01 0-25.18 10.16-10.16 10.15-10.16 25.17 0 15.01 10.15 25.17Q464.98-280 479.99-280Zm2.13-155.33q14.21 0 23.71-9.59 9.5-9.58 9.5-23.75v-182q0-14.16-9.61-23.75-9.62-9.58-23.84-9.58-14.21 0-23.71 9.58-9.5 9.59-9.5 23.75v182q0 14.17 9.61 23.75 9.62 9.59 23.84 9.59ZM480.18-80q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Zm.15-66.67q139 0 236-97.33t97-236.33q0-139-96.87-236-96.88-97-236.46-97-138.67 0-236 96.87-97.33 96.88-97.33 236.46 0 138.67 97.33 236 97.33 97.33 236.33 97.33ZM480-480Z"/></svg><p>Score Encore un effort</p></div>'
    }
    else if(scoreList[jsonName] == "2"){
        return '<div class="cardFooter" style="background-color: #e23437;"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="m369-474.33 60.67 83q5.33 6.66 13.33 6.66t13.33-6.66l60.67-83 59.67 83q5.33 6.66 13.83 6.66t13.83-6.66L691-511q8.67-11.33 6.5-24.67-2.17-13.33-13.5-22-11.33-8.66-24.67-6.16-13.33 2.5-22 13.83L590-485.67l-59.67-83q-5.33-6.66-13.83-6.66t-13.83 6.66l-59.67 83-60.67-83q-5.33-6.66-13.33-6.66t-13.33 6.66L268.33-449q-8.66 11.33-6.16 24.67 2.5 13.33 13.83 22 11.33 8.66 24.67 6.16 13.33-2.5 22-13.83L369-474.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg><p>Score Echec Acceptable</p></div>'
    }
    else if(scoreList[jsonName] == "1"){
        return '<div class="cardFooter" style="background-color: #b82f31;"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="m480-433.33 124.67 124.66Q614.33-299 628-299q13.67 0 23.33-9.67Q661-318.33 661-332q0-13.67-9.67-23.33L526.67-480l124.66-124.67Q661-614.33 661-628q0-13.67-9.67-23.33Q641.67-661 628-661q-13.67 0-23.33 9.67L480-526.67 355.33-651.33Q345.67-661 332-661q-13.67 0-23.33 9.67Q299-641.67 299-628q0 13.67 9.67 23.33L433.33-480 308.67-355.33Q299-345.67 299-332q0 13.67 9.67 23.33Q318.33-299 332-299q13.67 0 23.33-9.67L480-433.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg><p>Score Echec</p></div>'
    }
    else{
        return '<div class="cardFooter" style="background-color: #b82f31;"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e3e3e3"><path d="m480-433.33 124.67 124.66Q614.33-299 628-299q13.67 0 23.33-9.67Q661-318.33 661-332q0-13.67-9.67-23.33L526.67-480l124.66-124.67Q661-614.33 661-628q0-13.67-9.67-23.33Q641.67-661 628-661q-13.67 0-23.33 9.67L480-526.67 355.33-651.33Q345.67-661 332-661q-13.67 0-23.33 9.67Q299-641.67 299-628q0 13.67 9.67 23.33L433.33-480 308.67-355.33Q299-345.67 299-332q0 13.67 9.67 23.33Q318.33-299 332-299q13.67 0 23.33-9.67L480-433.33ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/></svg><p>Erreur Inconue</p></div>'
    }
}


async function loadJSON(jsonName,type) {
    let path;
    if(type == "country") path = "./country/quiz/"
    if(type == "city") path = "./city/quiz/"
    try {
        const response = await fetch(`${path}${jsonName}`);
        const datat = await response.json();
        //console.log("Contenu reçu:", datat);
        return datat;
    } catch (e) {
        console.error('METROP DATA API\n---\nIMPORT ERROR\nIN : '+ jsonName +' \n---\n'+ e +'\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---')
    }
}



const sliders = document.querySelectorAll('.quizList');

sliders.forEach(slider => {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // speed
    slider.scrollLeft = scrollLeft - walk;
  });
});


//SEARCH LOGIC HERE will be moved to an another file
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
    document.getElementById('menu').style.display = "none"
    document.getElementById('searchResult').style.display = "block"
    searchPreparation(document.getElementById('searchInput').value)
});

function searchPreparation(textResearch){
    document.getElementById('researchEmptyOrError').style.display = 'none'
    document.getElementById('searchResultCard').innerHTML = ""
    let final = []
    for(let i = 0; i < listCityQuizInfo.length; i++){
        const words = textResearch.split(" ");
        //name country vérif
        if(words.some( word => util.checkDiff(word, listCityQuizInfo[i].countryName) <= word.length / 2)){
            let objExistant = final.find(obj => obj.name === listCityQuizInfo[i].name)
            if(objExistant){
                objExistant.point += 50;
            }
            else{
                final.push({name: listCityQuizInfo[i].name, point: 50,div: listCityQuizInfo[i].div})
            }
        }
        //id country vérif
        if(words.some(word => word.toUpperCase() === listCityQuizInfo[i].countryID)){
            let objExistant = final.find(obj => obj.name === listCityQuizInfo[i].name)
            if(objExistant){
                objExistant.point += 50;
            }
            else{
                final.push({name: listCityQuizInfo[i].name, point: 50,div: listCityQuizInfo[i].div})
            }
        }
        //Title
        if(words.some(word => listCityQuizInfo[i].name.toLowerCase().includes(word.toLowerCase()))){
            let objExistant = final.find(obj => obj.name === listCityQuizInfo[i].name)
            if(objExistant){
                objExistant.point += words.filter(word => listCityQuizInfo[i].name.toLowerCase().includes(word.toLowerCase())).length * 10;
            }
            else{
                final.push({name: listCityQuizInfo[i].name, point: 50,div: listCityQuizInfo[i].div})
            }
        }
        //Description
        if(words.some(word => listCityQuizInfo[i].description.toLowerCase().includes(word.toLowerCase()))){
            let objExistant = final.find(obj => obj.name === listCityQuizInfo[i].name)
            if(objExistant){
                objExistant.point += words.filter(word => listCityQuizInfo[i].description.toLowerCase().includes(word.toLowerCase())).length * 2;
            }
            else{
                final.push({name: listCityQuizInfo[i].name, point: 50,div: listCityQuizInfo[i].div})
            }
        }
    }
    for(let i = 0; i < listCountryQuizInfo.length; i++){
        const words = textResearch.split(" ");
        //name country vérif
        if(words.some( word => util.checkDiff(word, listCountryQuizInfo[i].countryName) <= word.length / 2)){
            let objExistant = final.find(obj => obj.name === listCountryQuizInfo[i].name)
            if(objExistant){
                objExistant.point += 50;
            }
            else{
                final.push({name: listCountryQuizInfo[i].name, point: 50,div: listCountryQuizInfo[i].div})
            }
        }
        //id country vérif
        if(words.some(word => word.toUpperCase() === listCountryQuizInfo[i].countryID)){
            let objExistant = final.find(obj => obj.name === listCountryQuizInfo[i].name)
            if(objExistant){
                objExistant.point += 50;
            }
            else{
                final.push({name: listCountryQuizInfo[i].name, point: 50,div: listCountryQuizInfo[i].div})
            }
        }
        //Title
        if(words.some(word => listCountryQuizInfo[i].name.toLowerCase().includes(word.toLowerCase()))){
            let objExistant = final.find(obj => obj.name === listCountryQuizInfo[i].name)
            if(objExistant){
                objExistant.point += words.filter(word => listCountryQuizInfo[i].name.toLowerCase().includes(word.toLowerCase())).length * 10;
            }
            else{
                final.push({name: listCountryQuizInfo[i].name, point: 50,div: listCountryQuizInfo[i].div})
            }
        }
        //Description
        if(words.some(word => listCountryQuizInfo[i].description.toLowerCase().includes(word.toLowerCase()))){
            let objExistant = final.find(obj => obj.name === listCountryQuizInfo[i].name)
            if(objExistant){
                objExistant.point += words.filter(word => listCountryQuizInfo[i].description.toLowerCase().includes(word.toLowerCase())).length * 2;
            }
            else{
                final.push({name: listCountryQuizInfo[i].name, point: 50,div: listCountryQuizInfo[i].div})
            }
        }
    }
    final.sort((a, b) => b.point - a.point);
    for(let i = 0; i < final.length; i++){
        document.getElementById('searchResultCard').appendChild(final[i].div);
    }
    if(final.length == 0){
        document.getElementById('researchEmptyOrError').style.display = 'block'
    }
}