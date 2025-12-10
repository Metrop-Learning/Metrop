import data from './data/jsonList.json' with { type: "json" };

const ver =  [0,7,1,"a"]
const verAPI = [0,4]
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


//Set up city
document.getElementById('cityQuizList').innerHTML = "";
let cardList = []
for(let i = 0; i < data.city.length; i++){
    await cityListSetUp(data.city[i],"city");
}
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
for(let i = 0; i < cardList.length; i++){
    document.getElementById('cityQuizList').appendChild(cardList[i][1]);
}
//set up country
document.getElementById('countryQuizList').innerHTML = "";
cardList = []
for(let i = 0; i < data.country.length; i++){
    await cityListSetUp(data.country[i],"country");
}
if(cardList.length == 0){
    document.getElementById('countryQuizList').innerHTML = '<div style="display: flex; flex-direction: column; align-items: center;"><svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#000000"><path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5Zm3.2-153q12.82 0 21.32-8.63 8.5-8.62 8.5-21.37v-193q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v193q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63Zm-2.91 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg><h2>Une erreur est survenue : aucune donnée trouvée.</h2></div>';
    document.getElementById('countryQuizList').className = 'none'
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
for(let i = 0; i < cardList.length; i++){
    document.getElementById('countryQuizList').appendChild(cardList[i][1]);
}

async function cityListSetUp(nameJson,type){
    const obj = await loadJSON(nameJson,type);
    if (obj == undefined) return
    const wikimediaImageRegex = /^https:\/\/upload\.wikimedia\.org\/[^\s]+\.(?:jpg|jpeg|png|gif|svg|webp)$/;
    let img;
    let title;
    let text;
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
            } else {
                title = "No Title"
                console.warn('METROP DATA API\n---\nDATA MISSING : "Title"\nIN : '+ nameJson +' \n---\nTitle are not needed but recomended. The title will be "No Title".\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', obj);
            }
            if ('Text' in obj.cardInfo) {
                text = obj.cardInfo.Text;
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
    const p = document.createElement('p');
    p.textContent = text;
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
    if(obj.type.includes("place")){
        div_c.innerHTML += '<button class="btn" style="background-color: rgb(82, 82, 82); font-size: medium;" onclick="placeOnMap('+"'"+nameJson+"'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M480-80q-106 0-173-31.83-67-31.84-67-81.5 0-21 13.17-39.34 13.16-18.33 38.16-33 12-6.66 25.17-4Q329.67-267 336.33-255q6.67 12 3.84 25.17-2.84 13.16-14.84 19.83-5.33 4-10 8.33-4.66 4.34-8.66 8.34 15.66 18.66 67 32.66 51.33 14 106.33 14t106.33-14q51.34-14 67-32.66-4-4-8.66-8.34-4.67-4.33-10-8.33-12-6.67-14.84-19.83Q617-243 623.67-255q6.66-12 19.83-14.67 13.17-2.66 25.17 4 25 14.67 38.16 33Q720-214.33 720-193.33q0 49.66-67 81.5Q586-80 480-80Zm1-203.33q105.67-78.34 159-158.17 53.33-79.83 53.33-152.5 0-108.67-69-164T480-813.33q-74.67 0-144 55.33t-69.33 164q0 71 53 147.83 53 76.84 161.33 162.84Zm-1 67.66q-10 0-20-3.33t-18.67-10Q320-325 260-415.83 200-506.67 200-594q0-71 25.5-124.5t65.83-89.5q40.34-36 90-54Q431-880 480-880t99 18q50 18 90 54t65.5 89.5Q760-665 760-594q0 87.33-60 178.17Q640-325 518-229q-8.67 6.67-18.33 10-9.67 3.33-19.67 3.33ZM480-520q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z"/></svg>Place sur la carte</button><br>';
    }
    if(obj.type.includes("name")){
        div_c.innerHTML += '<button class="btn" style="background-color: rgb(82, 82, 82);font-size: medium;" onclick="nameit('+"'"+nameJson+"'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M551.67-472.33q81-56.67 127-124.84 46-68.16 46-136.83 0-38.67-12.84-59Q699-813.33 677-813.33q-53.67 0-92.33 83.16Q546-647 546-537q0 18 1.17 34.17 1.16 16.16 4.5 30.5ZM150-306q-9.67 9.67-23.33 9.67-13.67 0-23.34-9.67-9.66-9.67-9.66-23.33 0-13.67 9.66-23.34L144-393.33 103.33-434q-9.66-9.67-9.66-23.33 0-13.67 9.66-23.34 9.67-9.66 23.34-9.66 13.66 0 23.33 9.66L190.67-440l40.66-40.67q9.67-9.66 23.34-9.66 13.66 0 23.33 9.66 9.67 9.67 9.67 23.34 0 13.66-9.67 23.33l-40.67 40.67L278-352.67q9.67 9.67 9.67 23.34 0 13.66-9.67 23.33-9.67 9.67-23.33 9.67-13.67 0-23.34-9.67l-40.66-40.67L150-306Zm468-14q-31.33 0-56.67-13.17Q536-346.33 518-373q-18 10-36.67 18.67-18.66 8.66-37.66 17.33-13.34 5.67-25.84.5T400-355q-5.33-13.33.83-26 6.17-12.67 19.5-18.33 19-8 36.67-16.5t34-17.84q-6.33-22.66-9.17-49Q479-509 479-539q0-145.33 56-243.17Q591-880 677-880q51.33 0 82.67 40.17Q791-799.67 791-730.67q0 87.34-56.5 171.34t-157.5 151q9 11 19.5 16.5t22.5 5.5q27 0 58-23t59-65.34q8.67-12 21.5-16.16 12.83-4.17 25.83 1.5 13 6.66 20 19.5 7 12.83 4.67 27.83-2 14-1.67 27.67.34 13.66 2.67 28.33 7.67-4 16.17-9.83 8.5-5.84 17.5-13.5 10.66-9 24.5-10.5 13.83-1.5 24.83 7.16 11.33 9 12.33 23t-8.66 23q-22.34 21.67-46.5 34.17Q825-320 803.33-320q-23 0-38.5-15.5T743.67-381Q715-351.33 683-335.67 651-320 618-320ZM153.33-120q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.34 0 23.84 9.5t9.5 23.84q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5Zm163.34 0q-14.34 0-23.84-9.5t-9.5-23.83q0-14.34 9.5-23.84t23.84-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5ZM480-120q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5Zm163.33 0q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.34 0 23.84 9.5t9.5 23.84q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5Zm163.34 0q-14.34 0-23.84-9.5t-9.5-23.83q0-14.34 9.5-23.84t23.84-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5Z"/></svg>Trouve les nom</button><br>';
    }
    if(obj.type.includes("guess")){
        div_c.innerHTML += '<button class="btn" style="background-color: rgb(82, 82, 82);font-size: medium;" onclick="guessIt('+"'"+nameJson+"'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M264-199q21-19.33 46.83-46.83 25.84-27.5 48.84-58.84 23-31.33 39-63.97t16-62.69q0-67.89-42.38-112.28Q329.92-588 264-588q-65.92 0-108.29 44.4-42.38 44.4-42.38 112.3 0 30.3 16 62.8t39 63.83q23 31.34 48.84 58.84Q243-218.33 264-199ZM106.67-80q-11.34 0-19-7.67-7.67-7.66-7.67-19 0-11.33 7.67-19 7.66-7.66 19-7.66h130Q208-160 173-196t-65-78q-26-37.33-43.67-77-17.66-39.67-17.66-80.43 0-95.12 62.33-159.18t155-64.06q92.67 0 155 64.06t62.33 159.18q0 40.76-17.66 80.43Q446-311.33 420-274q-30 42.67-65.33 78.67-35.34 36-64 62h562.66q11.34 0 19 7.66 7.67 7.67 7.67 19 0 11.34-7.67 19-7.66 7.67-19 7.67H106.67ZM604-594.67Zm-10.67 315.34q-8.66 0-15.66-3.84-7-3.83-12.34-11.83L531-349q-8.33-13.33-4-26t14.67-20.33q10.33-7.67 23.16-6.84 12.84.84 21.84 15.17l6.66 11.33L619-416.33q5-7.67 12.34-11.67 7.35-4 16.33-4h165.66v-381.33h-422v52q0 14.16-9.58 23.75Q372.17-728 358-728q-14 0-23.67-9.83-9.66-9.84-9.66-23.5v-52q0-27 19.83-46.84Q364.33-880 391.33-880h422q27 0 46.84 19.83Q880-840.33 880-813.33V-432q0 27-19.83 46.83-19.84 19.84-46.84 19.84H665.67l-44.34 70.66Q616-286.67 609-283t-15.67 3.67ZM264-372.67q28.61 0 48.64-20.02 20.03-20.03 20.03-48.64t-20.03-48.64Q292.61-510 264-510t-48.64 20.03q-20.03 20.03-20.03 48.64t20.03 48.64q20.03 20.02 48.64 20.02Zm0-68.66Zm340-124.34 63.67 39q5.33 2.67 10.16-.44 4.84-3.11 2.84-8.56l-17.34-73 57.34-49.66Q725-662 723-667t-7.67-6l-74.82-6.39L611-748.67q-2-5.33-7.33-5.33-5.34 0-7.34 5.33l-29.51 69.28L492-673q-5.67 1-7.67 6t2.34 8.67L544-608.67l-17.33 73q-2 5.45 2.83 8.56 4.83 3.11 10.17.44l64.33-39Z"/></svg>Depuis la position</button><br>';
    }
    if(obj.type.includes("placeTerritory")){
        div_c.innerHTML += '<button class="btn" style="background-color: rgb(82, 82, 82);font-size: medium;" onclick="placeTerritoryIt('+"'"+nameJson+"'"+')"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M638.67-527.33v-1 1-168 168ZM171.33-138.67q-18 8.67-34.66-2.16Q120-151.67 120-172v-558.67q0-13 7.5-23t19.83-15l183.34-63.66q11-4.34 22-4 11 .33 22 4L608-750.67 788.67-822q18-8 34.66 2.5Q840-809 840-788.67v338.34q0 14.33-9.5 23.5-9.5 9.16-23.83 9.16-14.34 0-23.84-9.5t-9.5-23.83v-295.67l-134.66 51.34v148q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83v-148L388-758v499.67q0 15.66-8.5 28.33-8.5 12.67-22.83 18.33l-185.34 73ZM186.67-214l134.66-51.33V-758l-134.66 44.67V-214Zm462.66-7.33q36.67 0 61.5-24 24.84-24 25.17-62.67.33-36.67-24.83-61.67-25.17-25-61.84-25-36.66 0-61.66 25t-25 61.67q0 36.67 25 61.67t61.66 25Zm0 66.66q-63.33 0-108.33-45T496-308q0-64 45-108.67 45-44.66 108.33-44.66 64 0 108.67 44.66Q802.67-372 802.67-308q0 23-6.17 43.83-6.17 20.84-17.83 38.84L858-146q9 9 9 22t-9 22q-9 9-22 9t-22-9l-79.33-78.67q-18.67 13-39.84 19.5-21.16 6.5-45.5 6.5ZM321.33-758v492.67V-758Z"/></svg>Place sur la carte</button><br>';
    }
    if('learning' in obj){
        div_c.innerHTML += '<button class="btn" style="font-size: medium;" onclick="learning('+"'"+nameJson+"'"+')"><svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M448-259.33v-416q-43.67-28-94.08-43t-101.92-15q-37.33 0-73.5 8.66Q142.33-716 106.67-702v421.33Q139-294 176.83-300.33q37.84-6.34 75.17-6.34 51.38 0 100.02 11.84Q400.67-283 448-259.33Zm-408 14v-469.34q0-13.66 6.5-25.33Q53-751.67 66-758q43.33-21.33 90.26-31.67Q203.19-800 252-800q74.67 0 129 18.67 54.33 18.66 114.33 55.66 9 5.34 14.17 13.67t5.17 20v432.67q48-23.67 94.83-35.5 46.83-11.84 98.5-11.84 37.33 0 75.83 6t69.5 16.67v-457.67q0-14.16 9.62-23.75 9.62-9.58 23.83-9.58 14.22 0 23.72 9.58 9.5 9.59 9.5 23.75v496.34q0 26.26-21.5 39.96t-43.17.7q-35-16-71.98-25.33-36.99-9.33-75.35-9.33-52.68 0-102.67 15.83-50 15.83-94.66 43.83-6.67 4.34-14.17 6.17t-15.17 1.83q-7.66 0-15.16-1.83T452-179.67q-45.53-28.2-95.93-43.93-50.4-15.73-104.07-15.73-38.36 0-75.35 9.66-36.98 9.67-72.65 25-22.4 11-43.2-2.33Q40-220.33 40-245.33ZM614.67-426v-383q0-10.95 6.2-19.79T637-841l83.33-28q12-4.33 22.5 3.49t10.5 20.18V-461q0 10.95-6.39 19.79-6.38 8.84-16.61 12.21L647-402.33q-12 4.33-22.17-3.49-10.16-7.83-10.16-20.18Zm-337.34-70.33Z"/></svg>Apprentisage</button>';
    }
    div.appendChild(div_c)
    cardList.push([title,div])
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



const slider = document.querySelector('.quizList');

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