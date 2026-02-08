import * as util from "../asset/common.js"
const params = new URLSearchParams(window.location.search);
const jsonName = params.get("json");
const learningID = parseInt(params.get("learningID"));
const returned = params.get("return")
console.log(jsonName)
console.log(learningID)
console.log(returned)

let normalQuit = true;

window.addEventListener('beforeunload', function (e) {
      if(normalQuit == false){
        // The modern browser 
      const message = "Êtes-vous sûr de vouloir quitter cette page ?";
      
      e.preventDefault();
      e.returnValue = message; // Chrome, Edge
      return message; // Firefox
    }
});

async function loadJSON() {
    try {
        const response = await fetch(`../quiz/${jsonName}`);
        const data = await response.json();
        console.log("Contenu reçu:", data);
        return data;
    } catch (e) {
        console.error("Erreur:", e);
    }
}

const data = await loadJSON();

// Map init
const map = L.map("map", { minZoom: 3, maxZoom: 8 }).setView(
  [48.8566, 2.3522],
  3
); 

let dist;
let listCity;
if(learningID == -1){
  listCity = data.listCity;
}else if(data.learning[learningID].listID == "auto"){
  let lastHeader = -1
  for(let i = 0; i <= learningID;i++){
    if(data.learning[i].listID && data.learning[i].listID != "auto"){
      lastHeader = i
    }
  }
  if(lastHeader == -1) throw "Metrop Error : No list city";
  listCity = data.listCity.filter(item => data.learning[lastHeader].listID.includes(item.name));
  console.log(lastHeader)
}
else{
  listCity = data.listCity.filter(item => data.learning[learningID].listID.includes(item.name));
  console.log(listCity)
}

// ****************************
// *Dark/Light mode + map load*
// ****************************
let lineColor;
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    lineColor = "white"
    document.getElementById('menu').style.color = '#ffffff'
    document.getElementById('map').style.backgroundColor = '#000000ff'
    document.body.style.backgroundColor = '#1a1a1aff'

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap, © CartoDB, Made by @Jimmxyz on github",
      maxZoom: 18,
      noWrap: true,
    }
  ).addTo(map);
} else {
        lineColor = "black"
        document.getElementById('menu').style.color = '#000000ff'
        document.getElementById('map').style.backgroundColor = '#ffffffff'
        document.body.style.backgroundColor = '#ffffffff'

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap, © CartoDB, Made by @Jimmxyz on github",
      maxZoom: 18,
      noWrap: true,
    }
  ).addTo(map);
}

// *******************
// *random city order*
// *******************


listCity = util.shuffle(listCity);
localStorage.setItem("CITY",JSON.stringify(listCity))

if (!isNaN(listCity.length) && (listCity.length) > 0) {
        document.getElementById('prgs').max = (listCity.length);
}
if (!isNaN(0) && 0 >= 0 && 0 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = 0;
}

//init
let posilist = 0;
let marker;
let posilat = 0;
let posilng = 0;
let playable = true
let score = []
document.getElementById("cityName").innerText = listCity[posilist].name;

// When click
map.on("click", function (e) {
  if(playable == false || play == false){
    return
  }
  document.getElementById("btnP").disabled = false;
  const { lat, lng } = e.latlng;
  posilat = lat;
  posilng = lng;
  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(map);
  }
  marker.addTo(map);
  console.log("Posi selected :", lat, lng);
});

let play = true
let lastIsFail = false
let playerGuess;
let truePosition;
let line;
document.getElementById("btnP").addEventListener("click", () => {
  if(play){
    test();
  }
  else{
    if(posilist == listCity.length){
      showResult()
      return
    }
    play = true
    if(lastIsFail){
      map.removeLayer(playerGuess);
      map.removeLayer(truePosition);
      map.removeLayer(line);
      L.marker([listCity[posilist - 1].lat, listCity[posilist - 1].lng], {
        icon: util.redIcon,
      })
      .addTo(map)
      .bindPopup(`<b>${listCity[posilist - 1].name}</b>`)
      lastIsFail = false
    }
    document.getElementById("btnP").disabled = true;
    document.getElementById("btnP").innerText = "Proposer cette position";
    document.getElementById("cityName").innerText = listCity[posilist].name;
    map.setView(
  [48.8566, 2.3522],
  3
); 
  }
});

let good = []
let miss = []
let fail = []

function test() {
  normalQuit = false
  play = false
  if (!isNaN(posilist+1) && posilist+1 >= 0 && posilist+1 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = posilist + 1;
}
  document.getElementById("btnP").innerText = "Continuer";
  dist = distKm(
    posilat,
    posilng,
    listCity[posilist].lat,
    listCity[posilist].lng
  );
  score.push(Math.floor(dist))
  if (dist < 100) {
    revealGood();
    good.push(posilist);
  } else if(dist < 300){
    revealSemiGood();
    miss.push(posilist);
  } 
  else {
    reveal();
    fail.push(posilist);
  }
  posilist++;
  if(posilist == listCity.length){
    normalQuit = true
    localStorage.setItem("SCORE",JSON.stringify(score))
    document.getElementById("cityName").innerText = "Terminer";
    document.getElementById("btnP").innerText = "Voir les resultat";
    document.getElementById("btnP").disabled = false;
    document.getElementById("back").disabled = true;
    playable = false
    return
  }
}

function back() {
  const params = new URLSearchParams({
      json: jsonName
  });
  normalQuit = true
  window.location.replace(returned + "/index.html?" + params);
}
document.getElementById("back").addEventListener("click", () => {
  back();
});


function revealGood() {
  L.marker([listCity[posilist].lat, listCity[posilist].lng], {
    icon: util.greenIcon,
  })
    .addTo(map)
    .bindPopup(`<b>${listCity[posilist].name}</b>`)
    .openPopup();
  map.setView([listCity[posilist].lat, listCity[posilist].lng], 6);
  map.removeLayer(marker);
}

function revealSemiGood() {
  L.marker([listCity[posilist].lat, listCity[posilist].lng], {
    icon: util.orangeIcon,
  })
    .addTo(map)
    .bindPopup(`<b>${listCity[posilist].name}</b>`)
    .openPopup();
  map.setView([listCity[posilist].lat, listCity[posilist].lng], 6);
  map.removeLayer(marker);
}

function reveal() {
  lastIsFail = true
  playerGuess = L.marker([marker._latlng.lat, marker._latlng.lng], {
    icon: util.redIcon,
  })
    .addTo(map)
    .bindPopup(`<b>Votre proposition</b>`)
    .openPopup();
  truePosition = L.marker([listCity[posilist].lat, listCity[posilist].lng], {
    icon: util.greenIcon,
  })
    .addTo(map)
    .bindPopup(`<b>${listCity[posilist].name}</b>`)
    .openPopup();
  line = L.polyline([[marker._latlng.lat, marker._latlng.lng], [listCity[posilist].lat, listCity[posilist].lng]], {color: lineColor,dashArray: '10, 10'}).addTo(map);
  map.fitBounds(line.getBounds());
  map.removeLayer(marker);
}

function distKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function showResult() {
  if(lastIsFail){
      map.removeLayer(playerGuess);
      map.removeLayer(truePosition);
      map.removeLayer(line);
      L.marker([listCity[posilist - 1].lat, listCity[posilist - 1].lng], {
        icon: util.redIcon,
      })
      .addTo(map)
      .bindPopup(`<b>${listCity[posilist - 1].name}</b>`)
      lastIsFail = false
    }
  document.getElementById("menu").style.display = "none";
  document.getElementById("map").style.width = "60%";
  document.getElementById("map").style.aspectRatio = "16 / 12";
  document.getElementById("map").style.height = "auto";
  document.getElementById('mapsArea').style.display = "flex";
  document.getElementById('mapsArea').style.justifyContent = "center";
  document.getElementById('mapsArea').style.marginBottom = "75px"
  document.getElementById('resultArea').style.display = "block";

  console.log("Country : " +  listCity.length + "\nGood : " + good.length + "\nMiss : " + miss.length + "\nFail : " + fail.length)

  if(fail.length == 0 && miss.length == 0){
    document.getElementById('logo').style.color = "rgb(84, 100, 218)"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="m363-310 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM481-29 346-160H160v-186L26-480l134-134v-186h186l135-134 133 134h186v186l134 134-134 134v186H614L481-29Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Parfait !"
  }
  else if((good.length + (miss.length * 0.3))/listCity.length >= 0.95){
    document.getElementById('logo').style.color = "rgb(84, 185, 218)"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="m437-433-73-76q-9-10-22-10t-23 9q-10 10-10 23t10 23l97 96q9 9 21 9t21-9l183-182q9-9 9-22t-10-22q-9-8-21.5-7.5T598-593L437-433ZM332-84l-62-106-124-25q-11-2-18.5-12t-5.5-21l14-120-79-92q-8-8-8-20t8-20l79-91-14-120q-2-11 5.5-21t18.5-12l124-25 62-107q6-10 17-14t22 1l109 51 109-51q11-5 22-1.5t17 13.5l63 108 123 25q11 2 18.5 12t5.5 21l-14 120 79 91q8 8 8 20t-8 20l-79 92 14 120q2 11-5.5 21T814-215l-123 25-63 107q-6 10-17 13.5T589-71l-109-51-109 51q-11 5-22 1t-17-14Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Excellent !"
  }
  else if((good.length + (miss.length * 0.3))/listCity.length >= 0.85){
    document.getElementById('logo').style.color = "#43a548"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Très bien !"
  }
  else if((good.length + (miss.length * 0.3))/listCity.length >= 0.70){
    document.getElementById('logo').style.color = "#d79716"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="M360-266h230q14 0 23.5-6t16.5-18l78-182q2-5 3.5-15t1.5-15v-24q0-14-6.5-20.5T686-553H472l29-138q2-8 0-15t-7-12l-21-22-161 174-8 16q-4 8-4 17v207q0 23 18 41.5t42 18.5ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Pas si mal !"
  }
  else if((good.length + (miss.length * 0.3))/listCity.length >= 0.50){
    document.getElementById('logo').style.color = "#f2651f"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5ZM453-433h60v-253h-60v253Zm27.27 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Encore un petit effort !"
  }
  else if((good.length + (miss.length * 0.3))/listCity.length >= 0.25){
    document.getElementById('logo').style.color = "#e23437"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="m369-480 62 85q5 6 12 6t12-6l62-85 61 85q5 6 12.5 6t12.5-6l85-118q8-10 6-22t-12-20q-10-8-22-5.5T640-548l-50 68-61-85q-5-6-12.5-6t-12.5 6l-61 85-62-85q-5-6-12-6t-12 6l-86 118q-8 10-5.5 22t12.5 20q10 8 22 5.5t20-12.5l49-68ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Tu es sur la bonne voie, mais il reste encore un peu de travail !"
  }
  else{
    document.getElementById('logo').style.color = "#b82f31"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm27-195 123-123 123 123 42-42-123-123 123-123-42-42-123 123-123-123-42 42 123 123-123 123 42 42Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Ce n’est pas encore ça… mais ne lâche rien !"
  }
  document.getElementById('scorePrc').innerText = "Score : " + (parseInt(((good.length + (miss.length * 0.3))/listCity.length)*10000))/100 + "%"
  console.info(((good.length * 3) + (miss.length * 1)))
  console.info((listCity.length * 3) * 0.3)
  for (let i = 0; i < listCity.length; i++) {
          document.getElementById("tbody").innerHTML +=
            '<tr id="tra' + i + '"></tr>';
        }
        for (let i = 0; i < listCity.length; i++) {
          document.getElementById("tra" + i).innerHTML =
            '<th id="tid' +
            i +
            '">' +
            (i + 1) +
            ".</th>" +
            "<th>" +
            listCity[i].name +
            "</th>"
        }
        for (let i = 0; i < listCity.length; i++) {
          let color = "";
          if (good.includes(i)) {
            color = "43a548";
          } else if (fail.includes(i)) {
            color = "e23437";
          } else {
            color = "f2651f";
          }
          document.getElementById("tid" + i).style.backgroundColor =
            "#" + color;
        }
  //document.getElementById('logo').innerHTML = ''
  map.invalidateSize();
  map.setMinZoom(2);
}

document.getElementById("continueMenu").addEventListener("click", () => {
  if(miss.length / (fail.length + miss.length + good.length) < 0.1 && fail.length == 0 && posi.length == learningID){
          localStorage.setItem(jsonName + "_learn",posi+1)
  }
  back();
});

document.getElementById("retryMenu").addEventListener("click", () => {
  window.location.reload()
});