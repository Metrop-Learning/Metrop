//Name of country with the ISO 3166-2
//Country with 3 letter and not 2 in region

//WIP not ready
import * as util from "../../city/asset/common.js"
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

let listCountry = data.listCountry
listCountry = util.shuffle(listCountry);

if (!isNaN(listCountry.length) && (listCountry.length) > 0) {
        document.getElementById('prgs').max = (listCountry.length);
}
if (!isNaN(0) && 0 >= 0 && 0 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = 0;
}


import dataBorder from '../boundary.json' with { type: "json" };

const map = L.map("map",  { minZoom: 3, maxZoom: 10 }).setView([46.5, 2.5], 6);

let tryMax;
let EliminateSelected;
try{
  tryMax = data.cardInfo.option.tryMax
  if(tryMax <= 0){
    tryMax = 1
  }
}
catch{
  tryMax = 3
}
try{
  EliminateSelected = data.cardInfo.option.EliminateSelected
  if(EliminateSelected != true && EliminateSelected != false){
    EliminateSelected = true
  }
}
catch{
  EliminateSelected = true
}

let grey;
let lightGrey;
let mainColor;
let mainLightColor;
let green;
let lightGreen;
let failColor;
let failLightColor;

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  grey = "#545454ff"   
  lightGrey = "#6b6b6bff"
  green = "#379442ff"
  lightGreen = "#5cc368ff"
  mainColor = "rgba(61, 61, 186, 1)"
  mainLightColor = "rgba(73, 73, 191, 1)"
  failColor = "rgba(168, 79, 74, 1)"
  failLightColor = "rgba(205, 98, 96, 1)"
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
  grey = "#8F8F8F"   
  lightGrey = "#A8A8A8"
  green = "#56c563ff"
  lightGreen = "#82e18dff"
  mainColor = "rgb(81, 81, 227)"
  mainLightColor = "rgba(120, 120, 218, 1)"
  failColor = "rgba(186, 67, 61, 1)"
  failLightColor = "rgba(228, 109, 107, 1)"
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

let selectedLayer = null;
let failLayer = null
let selected = -1
let actual = 0
let geojsonLayer = [];
document.getElementById('countryName').innerText = listCountry[actual].name

async function addABoundarie(link, ite) {
  let tlink;
  if (link.split(':')[0] == "useInstead") {
    if (link.split(':')[1] == "OSMB") {
      tlink = "../OSMB/" + link.split(':')[2];
    }
    document.getElementById("loadedR").innerText = "Fetching resource: " + link.split(':')[2] + " from " + link.split(':')[2]  + " local file"
  } else {
    tlink = "https://commons.wikimedia.org/w/api.php?action=query&prop=revisions&titles=" + link + "&rvprop=content&rvslots=main&format=json&origin=*";
    document.getElementById("loadedR").innerText = "Fetching resource: " + link + " from Wikimedia"
  }
  const response = await fetch(tlink);
  let raw;

  if (link.split(':')[0] == "useInstead" && link.split(':')[1] == "OSMB") {
    raw = await response.json(); 
  } else {
    const data = await response.json();
    const page = Object.values(data.query.pages)[0];
    raw = page.revisions[0].slots.main["*"];
    raw = JSON.parse(raw);
  }
  const geojson = raw.data || raw;

  // --- style ---
  const defaultStyle = {
    color: grey,
    weight: 2,
    fillColor: lightGrey,
    fillOpacity: 0.3
  };
  const hoverStyle = {
    weight: 3,
    fillOpacity: 0.5
  };
  const selectedStyle = {
    color: mainColor,
    weight: 3,
    fillColor: mainLightColor,
    fillOpacity: 0.6
  };

  const layer = L.geoJSON(geojson, {
    style: defaultStyle,
    onEachFeature: (feature, layer) => {
      feature.id = ite;
      // HOVER
      layer.on("mouseover", function () {
        if (selectedLayer !== layer) {
          layer.lastHoverStyle = {
            color: layer.options.color,
            fillColor: layer.options.fillColor,
            weight: layer.options.weight,
            fillOpacity: layer.options.fillOpacity
          };
          layer.setStyle(hoverStyle);
        }
      });
      layer.on("mouseout", function () {
        if (selectedLayer !== layer) layer.setStyle(layer.lastHoverStyle);
      });
      // SELECT
      layer.on("click", function () {
        if (play == -1) return;
        selected = ite;
        document.getElementById("btnP").disabled = false;
        if (selectedLayer) selectedLayer.setStyle(defaultStyle);
        layer.setStyle(selectedStyle);
        selectedLayer = layer;
        layer.bringToFront();
      });
    }
  }).addTo(map);
  geojsonLayer.push(layer);
}

document.getElementById('loadingBar').max = (listCountry.length);
for(let i = 0; i < listCountry.length; i++){
  let id = listCountry[i].id
  let deep;
  const [continent, country, region, subregion] = id.split("-");
  if(continent in dataBorder && continent){
    deep = dataBorder[continent];
  }
  if(deep.get && country){
  if(country in deep.get && country){
    deep = deep.get[country];
  }
}
  if(deep.get && region){
  if(region in deep.get && region){
    deep = deep.get[region];
  }
}
  if(deep.get && subregion){
    if(subregion in deep.get){
      deep = deep.get[subregion];
    }
  }
  let link = deep.content
  await addABoundarie(link,i)
  console.log("Loading..." + 100*((i+1)/listCountry.length) + "%")
  document.getElementById('loadingBar').value = i + 1;
  //addABoundarie(dataBorder.EU.get.FRA.get.ARA.content)
}
document.getElementById("btnP").disabled = true;
document.getElementById("loading").style.display = "none";
document.getElementById("menu").style.visibility = "visible";
document.getElementById("map").style.visibility = "visible";

let play = 0;
document.getElementById("btnP").addEventListener("click", () => {
  if(play >= 0){
    test();
  }
  else{
    reset()
  }
});


function test(){
  if(selected == actual){
    normalQuit = false
    play = -1
    document.getElementById('btnP').innerText = "Continuer"
    let old = [mainColor, mainLightColor];
    mainColor = green;
    mainLightColor = lightGreen;
    refreshStyles();
    [mainColor, mainLightColor] = old
  }
  else if (play + 1 <= (tryMax - 1)){
    document.getElementById("tryLeft").style.visibility = "visible"
    document.getElementById("tryLeft").innerText = tryMax - (play+1) + " Essai(s) restant(s)"
    play++
  }else{
    document.getElementById("tryLeft").style.visibility = "hidden"
    play = -1;
    document.getElementById('btnP').innerText = "Continuer"
    failLayer = actual
    let old = [mainColor, mainLightColor];
    mainColor = failColor;
    mainLightColor = failLightColor;
    refreshStyles();
    [mainColor, mainLightColor] = old
  }
}
function reset(){
  document.getElementById("btnP").disabled = true;
  actual++
  if(listCountry.length == actual){
    const params = new URLSearchParams({
      json: jsonName
  });
  normalQuit = true
  window.location.replace(returned + "/index.html?" + params);
  }
  document.getElementById('countryName').innerText = listCountry[actual].name
  selectedLayer = null;
  if (!isNaN(actual+1) && actual+1 >= 0 && actual+1 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = actual + 1;
  }
  failLayer = null
  refreshStyles()
  document.getElementById('btnP').innerText = "Proposer cet position"
  play = 0
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


function refreshStyles() {
  const defaultStyle = {
       color: grey,
       weight: 2,
       fillColor: lightGrey,
       fillOpacity: 0.3
     };
     const hoverStyle = {
       weight: 3,
       fillOpacity: 0.5
     };
     const selectedStyle = {
       color: mainColor,
       weight: 3,
       fillColor: mainLightColor,
       fillOpacity: 0.6
     };
     const nofailStyle = {
       color: green,
       weight: 3,
       fillColor: lightGreen,
       fillOpacity: 0.6
     }
geojsonLayer.forEach(g => {
  g.eachLayer(layer => {
    if (layer === selectedLayer) {
      layer.setStyle(selectedStyle);
      layer.bringToFront();
    } else if (layer.feature.id === failLayer) {
      layer.setStyle(nofailStyle);
      layer.bringToFront();
    } else {
      layer.setStyle(defaultStyle);
    }
  });
});
}


