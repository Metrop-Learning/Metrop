//Name of country with the ISO 3166-2
//Country with 3 letter and not 2 in region
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
let missColor;
let missLightColor;

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
  missColor = "rgba(202, 154, 41, 1)"
  missLightColor = "rgba(255, 191, 30, 1)"
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
  missColor = "rgba(186, 140, 61, 1)"
  missLightColor = "rgba(228, 178, 107, 1)"
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

let selectedLayer = null;
let failLayer = null
let missLayer = null
let goodLayer = null
let selected = -1
let actual = 0
let geojsonLayer = [];
let circleTeri = []
document.getElementById('countryName').innerText = listCountry[actual].name

async function addABoundarie(link, ite) {
  let tlink;
  if (link.split(':')[0] === "useInstead" && link.split(':')[1] === "Circle") {

  const latlng = L.latLng(link.split(':')[2], link.split(':')[3]);

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

  const circle = L.circle(latlng, {
    radius: 16000,
    ...defaultStyle
  });

  circle.feature = { id: ite };

  const layer = L.layerGroup([circle]).addTo(map);

  layer.feature = { id: ite };

  circle.on("mouseover", function () {
    if (selectedLayer !== layer) {
      circle.lastHoverStyle = {
        color: circle.options.color,
        fillColor: circle.options.fillColor,
        weight: circle.options.weight,
        fillOpacity: circle.options.fillOpacity
      };
      circle.setStyle(hoverStyle);
    }
  });

  circle.on("mouseout", function () {
    if (selectedLayer !== layer) {
      circle.setStyle(circle.lastHoverStyle);
    }
  });

  circle.on("click", function () {
    if (play == -1) return;
    selected = ite;
    document.getElementById("btnP").disabled = false;

    if (selectedLayer) {
      selectedLayer.eachLayer(l => l.setStyle(defaultStyle));
    }

    layer.eachLayer(l => l.setStyle(selectedStyle));
    selectedLayer = layer;
    layer.eachLayer(l => {
    if (l.bringToFront) l.bringToFront();
  });
  });
  circleTeri.push(ite)
  geojsonLayer.push(layer);
  return;
}
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
        applyStyle(selectedLayer, defaultStyle)
        layer.setStyle(selectedStyle);
        selectedLayer = layer;
        layer.bringToFront();
      });
    }
  }).addTo(map);
  geojsonLayer.push(layer);
}

function applyStyle(layer, style) {
  if (!layer) return;

  if (layer.setStyle) {
    layer.setStyle(style);
    return;
  }

  if (layer.eachLayer) {
    layer.eachLayer(l => {
      if (l.setStyle) l.setStyle(style);
    });
  }
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
    loaded += 1;
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

let play = 0;
document.getElementById("btnP").addEventListener("click", () => {
  if(play >= 0){
    test();
  }
  else{
    reset()
  }
});

let miss = []
let failed = []
let good = []

function test(){
  if(selected == actual){
    normalQuit = false
    if(play == 0){
      goodLayer = actual
      good.push(actual)
    }
    else{
      missLayer = actual
      miss.push(actual)
    }
    play = -1
    document.getElementById('btnP').innerText = "Continuer"
    refreshStyles();
  }
  else if (play + 1 <= (tryMax - 1)){
    document.getElementById("tryLeft").style.visibility = "visible"
    document.getElementById("tryLeft").innerText = tryMax - (play+1) + " Essai(s) restant(s)"
    play++
  }else{
    document.getElementById("tryLeft").style.visibility = "hidden"
    play = -1;
    document.getElementById('btnP').innerText = "Continuer"
    failLayer = selected
    goodLayer = actual
    refreshStyles();
    failed.push(actual)
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
  showResult()
  //window.location.replace(returned + "/index.html?" + params);
  return
  }
  document.getElementById('countryName').innerText = listCountry[actual].name
  selectedLayer = null;
  if (!isNaN(actual+1) && actual+1 >= 0 && actual+1 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = actual + 1;
  }
  failLayer = null
  goodLayer = null
  missLayer = null
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

document.getElementById("continueMenu").addEventListener("click", () => {
  back();
});

document.getElementById("retryMenu").addEventListener("click", () => {
  window.location.reload()
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
     const missStyle = { color: missColor, weight: 3, fillColor: missLightColor, fillOpacity: 0.6 };
geojsonLayer.forEach(g => {
  g.eachLayer(layer => {
    console.log(goodLayer)

    if (layer.feature.id === goodLayer) {
      layer.setStyle(nofailStyle);
      layer.bringToFront();
    } else if (layer.feature.id === failLayer) {
      layer.setStyle(failStyle);
      layer.bringToFront();
    } else if (layer.feature.id === missLayer) {
      layer.setStyle(missStyle);
      layer.bringToFront();
    }
    else if (layer === selectedLayer) {
      layer.setStyle(selectedStyle);
      layer.bringToFront();
    }
    else {
      layer.setStyle(defaultStyle);
    }
    if(circleTeri.includes(layer.feature.id)){
      layer.bringToFront()
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

function refreshStylesResult() {
  const defaultStyle = { color: grey, weight: 1, fillColor: lightGrey, fillOpacity: 0.3 };
  const missStyle = { color: grey, weight: 1, fillColor: missLightColor, fillOpacity: 0.6 };
  const nofailStyle = { color: grey, weight: 1, fillColor: lightGreen, fillOpacity: 0.6 };
  const failStyle = { color: grey, weight: 1, fillColor: failLightColor, fillOpacity: 0.6 };

  geojsonLayer.forEach(g => {
    g.eachLayer(layer => {
      if (good.includes(layer.feature.id)) layer.setStyle(nofailStyle).bringToFront();
      else if (failed.includes(layer.feature.id)) layer.setStyle(failStyle).bringToFront();
      else if (miss.includes(layer.feature.id)) layer.setStyle(missStyle).bringToFront();
      else layer.setStyle(defaultStyle);

      if (circleTeri.includes(layer.feature.id)) layer.bringToFront();
    });
  });
  let bounds = L.latLngBounds([]);

geojsonLayer.forEach(g => {
    g.eachLayer(layer => {    
        if (layer.getBounds) {
            bounds.extend(layer.getBounds());
        } else if (layer.getLatLng) { 
            bounds.extend(layer.getLatLng());
        }
    });
});

if (!bounds.isValid()) {
    bounds = L.latLngBounds([[-85, -180], [85, 180]]);
}

const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const latDiff = ne.lat - sw.lat;
    const lngDiff = ne.lng - sw.lng;

    const maxLatDiff = 40;
    const maxLngDiff = 80;

    const worldBounds = L.latLngBounds([[-85, -180], [85, 180]]);

    if (latDiff > maxLatDiff || lngDiff > maxLngDiff) {
        map.fitBounds(worldBounds, { padding: [20, 20], maxZoom: 2 });
    } else {
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 6 });
    }
}


//Result Shadow :
function showResult() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("map").style.width = "60%";
  document.getElementById("map").style.aspectRatio = "16 / 12";
  document.getElementById("map").style.height = "auto";
  document.getElementById('mapsArea').style.display = "flex";
  document.getElementById('mapsArea').style.justifyContent = "center";
  document.getElementById('mapsArea').style.marginBottom = "75px"
  document.getElementById('resultArea').style.display = "block";

  console.log("Country : " +  listCountry.length + "\nGood : " + good.length + "\nMiss : " + miss.length + "\nFail : " + failed.length)

  if(failed.length == 0 && miss.length == 0){
    document.getElementById('logo').style.color = "rgb(84, 100, 218)"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="m363-310 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM481-29 346-160H160v-186L26-480l134-134v-186h186l135-134 133 134h186v186l134 134-134 134v186H614L481-29Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Parfait !"
  }
  else if((good.length + (miss.length * 0.3))/listCountry.length >= 0.95){
    document.getElementById('logo').style.color = "rgb(84, 185, 218)"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="m437-433-73-76q-9-10-22-10t-23 9q-10 10-10 23t10 23l97 96q9 9 21 9t21-9l183-182q9-9 9-22t-10-22q-9-8-21.5-7.5T598-593L437-433ZM332-84l-62-106-124-25q-11-2-18.5-12t-5.5-21l14-120-79-92q-8-8-8-20t8-20l79-91-14-120q-2-11 5.5-21t18.5-12l124-25 62-107q6-10 17-14t22 1l109 51 109-51q11-5 22-1.5t17 13.5l63 108 123 25q11 2 18.5 12t5.5 21l-14 120 79 91q8 8 8 20t-8 20l-79 92 14 120q2 11-5.5 21T814-215l-123 25-63 107q-6 10-17 13.5T589-71l-109-51-109 51q-11 5-22 1t-17-14Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Excellent !"
  }
  else if((good.length + (miss.length * 0.3))/listCountry.length >= 0.85){
    document.getElementById('logo').style.color = "#43a548"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Très bien !"
  }
  else if((good.length + (miss.length * 0.3))/listCountry.length >= 0.70){
    document.getElementById('logo').style.color = "#d79716"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="M360-266h230q14 0 23.5-6t16.5-18l78-182q2-5 3.5-15t1.5-15v-24q0-14-6.5-20.5T686-553H472l29-138q2-8 0-15t-7-12l-21-22-161 174-8 16q-4 8-4 17v207q0 23 18 41.5t42 18.5ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Pas si mal !"
  }
  else if((good.length + (miss.length * 0.3))/listCountry.length >= 0.50){
    document.getElementById('logo').style.color = "#f2651f"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5ZM453-433h60v-253h-60v253Zm27.27 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Encore un petit effort !"
  }
  else if((good.length + (miss.length * 0.3))/listCountry.length >= 0.25){
    document.getElementById('logo').style.color = "#e23437"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="m369-480 62 85q5 6 12 6t12-6l62-85 61 85q5 6 12.5 6t12.5-6l85-118q8-10 6-22t-12-20q-10-8-22-5.5T640-548l-50 68-61-85q-5-6-12.5-6t-12.5 6l-61 85-62-85q-5-6-12-6t-12 6l-86 118q-8 10-5.5 22t12.5 20q10 8 22 5.5t20-12.5l49-68ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Tu es sur la bonne voie, mais il reste encore un peu de travail !"
  }
  else{
    document.getElementById('logo').style.color = "#b82f31"
    document.getElementById('logo').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="75px" viewBox="0 -960 960 960" width="75px" fill="#e3e3e3"><path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm27-195 123-123 123 123 42-42-123-123 123-123-42-42-123 123-123-123-42 42 123 123-123 123 42 42Z"/></svg>'
    document.getElementById('nameOfCategory').innerText = "Ce n’est pas encore ça… mais ne lâche rien !"
  }
  document.getElementById('scorePrc').innerText = "Score : " + (parseInt(((good.length + (miss.length * 0.3))/listCountry.length)*10000))/100 + "%"
  console.info(((good.length * 3) + (miss.length * 1)))
  console.info((listCountry.length * 3) * 0.3)
  for (let i = 0; i < listCountry.length; i++) {
          document.getElementById("tbody").innerHTML +=
            '<tr id="tra' + i + '"></tr>';
        }
        for (let i = 0; i < listCountry.length; i++) {
          document.getElementById("tra" + i).innerHTML =
            '<th id="tid' +
            i +
            '">' +
            (i + 1) +
            ".</th>" +
            "<th>" +
            listCountry[i].name +
            "</th>"
        }
        for (let i = 0; i < listCountry.length; i++) {
          let color = "";
          if (good.includes(i)) {
            color = "43a548";
          } else if (failed.includes(i)) {
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

  refreshStylesResult();
}

function getIsTheBestScore(hightScore,score){
  if(score > hightScore){

  }
}