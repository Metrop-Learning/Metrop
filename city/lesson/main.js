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

const map = L.map("map", { minZoom: 3, maxZoom: 8 }).setView(
  [48.8566, 2.3522],
  5
); 

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
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    document.getElementById('info').style.color = '#ffffff'
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
        document.getElementById('info').style.color = '#000000ff'
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
  const marker = L.marker([listCity[i].lat, listCity[i].lng], {
    icon: util.greyIcon,
  }).addTo(map)
  markers.push(marker);
}


function showCity() {
  document.getElementById('cityName').innerText = listCity[posilist].name;
  if(actual){
    map.removeLayer(actual)
  }
  if(markers[posilist]){
    map.removeLayer(markers[posilist])
    actual = L.marker([listCity[posilist].lat, listCity[posilist].lng], {
    icon: util.blueIcon,
  }).addTo(map)
  map.setView([listCity[posilist].lat, listCity[posilist].lng], 6);}
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
        markers[posilist - 1] = L.marker([listCity[posilist - 1].lat, listCity[posilist - 1].lng], {
    icon: util.greyIcon,
  })
    .addTo(map)
    .bindPopup(`<b>${listCity[posilist].name}</b>`)
        if (!isNaN(posilist) && posilist >= 0 && posilist <= document.getElementById('prgs').max) {
          document.getElementById('prgs').value = posilist;
        }
        if(document.getElementById('prgs').max == document.getElementById('prgs').value){
          document.getElementById('back').disabled = true;
          document.getElementById('continue').disabled = true;
        }
        return
}