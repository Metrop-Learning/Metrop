import * as util from "../asset/common.js"
const params = new URLSearchParams(window.location.search);
const jsonName = params.get("json");
const learningID = parseInt(params.get("learningID"));
const returned = params.get("return")
console.log(jsonName)
console.log(learningID)
console.log(returned)

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
  5
); 

let dist;
let listCity;
if(learningID == -1){
  listCity = data.listCity;
}
else{
  listCity = data.listCity.filter(item => data.learning[learningID].listID.includes(item.name));
  console.log(listCity)
}

// ****************************
// *Dark/Light mode + map load*
// ****************************
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
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
        document.getElementById('menu').style.color = '#000000ff'
        document.getElementById('map').style.backgroundColor = '#ffffffff'
        document.body.style.backgroundColor = '#ffffffff'

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
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
  if(playable == false){
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


document.getElementById("btnP").addEventListener("click", () => {
  test();
});


function test() {
  if(playable == false){
    const params = new URLSearchParams({
      return: returned,
      learningID: learningID,
      json: jsonName
    });
    window.location.replace(`../result/index.html?${params.toString()}`);
  }
  if (!isNaN(posilist+1) && posilist+1 >= 0 && posilist+1 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = posilist + 1;
}
  document.getElementById("btnP").disabled = true;
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
    localStorage.setItem("SCORE",JSON.stringify(score))
    document.getElementById("cityName").innerText = "Terminer";
    document.getElementById("btnP").innerText = "Voir les resultat";
    document.getElementById("btnP").disabled = false;
    playable = false
    return
  }
  document.getElementById("cityName").innerText = listCity[posilist].name;
}

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
  L.marker([listCity[posilist].lat, listCity[posilist].lng], {
    icon: util.redIcon,
  })
    .addTo(map)
    .bindPopup(`<b>${listCity[posilist].name}</b>`)
    .openPopup();
  map.setView([listCity[posilist].lat, listCity[posilist].lng], 6);
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
