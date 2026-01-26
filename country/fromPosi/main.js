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
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap, © CartoDB, Made by @Jimmxyz on github",
      maxZoom: 18,
      noWrap: true,
    }
  ).addTo(map);
}

let selectedLayer = 0;
let failLayer = false
let goodLayer = false
let selected = -1
let actual = 0
let geojsonLayer = [];

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
    }
  }).addTo(map);
  geojsonLayer.push(layer);
}

let loaded = 0;
const promises = listCountry.map((countryItem, i) => {
  return (async () => {
    const id = countryItem.id;
    let deep;

    const [continent, country, region, subregion] = id.split("-");

    if (continent && dataBorder[continent]) {
      deep = dataBorder[continent];
    }

    if (deep?.get && country && deep.get[country]) {
      deep = deep.get[country];
    }

    if (deep?.get && region && deep.get[region]) {
      deep = deep.get[region];
    }

    if (deep?.get && subregion && deep.get[subregion]) {
      deep = deep.get[subregion];
    }

    const link = deep.content;

    await addABoundarie(link, i);
    console.log(
      "Loading..." + 100 * ((loaded + 1) / listCountry.length) + "%"
    );

    document.getElementById("loadingBar").value = loaded + 1;
    loaded += 1;
  })();
});
await Promise.all(promises);
document.getElementById("btnP").disabled = true;
document.getElementById("loading").style.display = "none";
document.getElementById("menu").style.visibility = "visible";
document.getElementById("map").style.visibility = "visible";
refreshStyles()

for(let i = 0; i < listCountry.length; i++){
  let option = new Option(data.listCountry[i].name, data.listCountry[i].id)
  document.getElementById('nameArea').appendChild(option)
}

let play = 0;
document.getElementById("btnP").addEventListener("click", () => {
  if(play >= 0){
    test();
  }
  else{
    reset()
  }
});

document.getElementById("nameArea").addEventListener('change', (e) => {
  e.target.blur();
});

document.getElementById('btnP').disabled = false;


let lastInput = ""
function test(){
  if(lastInput == document.getElementById('nameArea').value){
    document.getElementById("errorText").style.color = "rgb(241, 186, 109)";
    document.getElementById("errorText").innerHTML = "Cette entrée est trop proche de la dernière et n’est donc pas comptabilisée."
  }
  if(document.getElementById('nameArea').value == listCountry[selectedLayer].id){
    document.getElementById('errorText').style.color = "rgba(109, 241, 118, 1)"
    document.getElementById("errorText").innerHTML = "Bonne Réponsse !"
    lastInput = document.getElementById('nameArea').value
    normalQuit = false
    play = -1
    document.getElementById('btnP').innerText = "Continuer"
    goodLayer = true
    refreshStyles();
    goodLayer = false
  }
  else if (play + 1 <= (tryMax - 1)){
    document.getElementById("errorText").style.color = "rgb(241, 186, 109)";
    document.getElementById("errorText").innerHTML = tryMax - (play+1) + " Essai(s) restant(s)"
    lastInput = document.getElementById('nameArea').value
    play++
  }else{
    document.getElementById('errorText').style.color = "rgb(241, 109, 109)"
    document.getElementById("errorText").innerHTML = "Vous n'avez pas trouver : " + listCountry[selectedLayer].name
    play = -1;
    document.getElementById('btnP').innerText = "Continuer"
    failLayer = true
    refreshStyles();
    failLayer = false
  }
}
function reset(){
  document.getElementById("errorText").innerHTML = ""
  actual++
  selectedLayer++;
  if(listCountry.length == actual){
    const params = new URLSearchParams({
      json: jsonName
  });
  normalQuit = true
  window.location.replace(returned + "/index.html?" + params);
  }
  if (!isNaN(actual+1) && actual+1 >= 0 && actual+1 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = actual + 1;
  }
  refreshStyles()
  document.getElementById('btnP').innerText = "Proposer cette position"
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
     const failStyle = {
       color: failColor,
       weight: 3,
       fillColor: failLightColor,
       fillOpacity: 0.6
     }
geojsonLayer.forEach(g => {
  g.eachLayer(layer => {
    if (layer.feature.id === selectedLayer) {
      if(failLayer == true){
        layer.setStyle(failStyle);
      }else if(goodLayer == true){
        layer.setStyle(nofailStyle);
      }else{
        layer.setStyle(selectedStyle);
      }
      layer.bringToFront();
    } else {
      layer.setStyle(defaultStyle);
    }
  });
});
const bounds = L.latLngBounds([]);

map.eachLayer(layer => {
  if (layer instanceof L.Polygon) {
    bounds.extend(layer.getBounds());
  }
});

if (bounds.isValid()) {
  map.fitBounds(bounds, {
    padding: [20, 20]
  });
}
}