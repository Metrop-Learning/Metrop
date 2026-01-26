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
      const params = new URLSearchParams({
        return: returned,
        learningID: learningID,
        json: jsonName
      });
      window.location.replace(`../result/index.html?${params.toString()}`);
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
  } else if(dist < 300){
    revealSemiGood();
  } 
  else {
    reveal();
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
