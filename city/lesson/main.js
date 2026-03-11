import * as util from "../asset/common.js"
const params = new URLSearchParams(window.location.search);
const jsonName = params.get("json");
const learningID = parseInt(params.get("learningID"));
const replaced = params.get("return");
const posi = parseInt(localStorage.getItem(jsonName + "_learn"))
console.log(posi)
console.log(learningID)

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

let dist;
let listCity;
if(learningID == -1){
  listCity = data.listCity;
}
else if(data.learning[learningID].listID == "auto"){
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
let tilesLayer;
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.getElementById("info").style.color = "#ffffff";
  document.getElementById("map").style.backgroundColor = "rgb(18, 18, 18)";
  document.body.style.backgroundColor = "#1a1a1aff";

  tilesLayer = [
                    'https://a.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png',
                    'https://b.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png',
                    'https://c.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png'
                ]
} else {
  document.getElementById("info").style.color = "#000000ff";
  document.getElementById("map").style.backgroundColor = "rgb(244, 244, 244)";
  document.body.style.backgroundColor = "#ffffffff";

  tilesLayer = [
                    'https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
                    'https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
                    'https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'
                ]
}


const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            carto: {
                type: 'raster',
                tiles: tilesLayer,
                tileSize: 256,
                attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Created by <a href="https://github.com/Jimmxyz">@Jimmxyz</a>'
            }
        },
        layers: [
            {
                id: 'carto-base',
                type: 'raster',
                source: 'carto'
            }
        ]
    },
    zoom: 1,
    center: [150.16546137527212, -35.017179237129994],
    pitch: 0,
    maxPitch: 85,
    canvasContextAttributes: { antialias: true }
});
map.on('style.load', () => {
     map.setProjection({ type: 'globe' });
});

// *******************
// *random city order*
// *******************

listCity = util.shuffle(listCity);
localStorage.setItem("CITY",JSON.stringify(listCity))

if (!isNaN(listCity.length - 1) && (listCity.length - 1) > 0) {
        document.getElementById('prgs').max = (listCity.length - 1);
}
if (!isNaN(0) && 0 >= 0 && 0 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = 0;
}

//init
let posilist = 0;
let markers = [];
let actual;

document.getElementById("next").addEventListener("click", () => {
  next();
});

//point every city :
for(let i = 0; i < listCity.length; i++){
  const marker = new maplibregl.Marker({ color: "#7c7c7c" })
        .setLngLat([listCity[i].lng, listCity[i].lat])
        .addTo(map);
  markers.push(marker);
}


function showCity() {
  document.getElementById('cityName').innerText = listCity[posilist].name;
  if (actual) {
    actual.remove();
  }
  if (markers[posilist]) {
    markers[posilist].remove();
    actual = new maplibregl.Marker({ color: "#3190d2" })
      .setLngLat([listCity[posilist].lng, listCity[posilist].lat])
      .addTo(map);

    map.flyTo({
      center: [listCity[posilist].lng, listCity[posilist].lat],
      zoom: 6
    });
  }
}

showCity();

document.getElementById("back").disabled = false;

function back() {
  const params = new URLSearchParams({
      json: jsonName
  });
  window.location.replace(replaced + "/index.html?" + params)
}
document.getElementById("back").addEventListener("click", () => {
  back();
});

function next(){
  if(markers.length == posilist + 1){
    if(posi == learningID){
      localStorage.setItem(jsonName + "_learn",posi+1)
    }
    const params = new URLSearchParams({
      json: jsonName
    });
    window.location.replace(replaced + "/index.html?" + params)
    return
  }      
  posilist++;
        showCity();
        markers[posilist - 1] = new maplibregl.Marker({ color: "#7c7c7c" })
      .setLngLat([listCity[posilist - 1].lng, listCity[posilist - 1].lat])
      .setPopup(
         new maplibregl.Popup().setHTML(`<b>${listCity[posilist - 1].name}</b>`)
       )
      .addTo(map);
        if (!isNaN(posilist) && posilist >= 0 && posilist <= document.getElementById('prgs').max) {
          document.getElementById('prgs').value = posilist;
        }
        if(document.getElementById('prgs').max == document.getElementById('prgs').value){
          document.getElementById('back').disabled = true;
          document.getElementById('continue').disabled = true;
        }
        return
}