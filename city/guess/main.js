const params = new URLSearchParams(window.location.search);
const jsonName = params.get("json");
console.log(jsonName)

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
let listCity = data.listCity;

// **********
// *Map icon*
// **********

const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greyIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

function shuffle(list) {
  const arr = [...list]; 
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
listCity = shuffle(listCity);
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


//point every city :
for(let i = 0; i < listCity.length; i++){
  const marker = L.marker([listCity[i].lat, listCity[i].lng], {
    icon: greyIcon,
  }).addTo(map)
  markers.push(marker);
}


function showCity() {
  if(actual){
    map.removeLayer(actual)
  }
  if(markers[posilist]){
    map.removeLayer(markers[posilist])
    actual = L.marker([listCity[posilist].lat, listCity[posilist].lng], {
    icon: blueIcon,
  }).addTo(map)
  map.setView([listCity[posilist].lat, listCity[posilist].lng], 6);}
  }

showCity();


function intmaker(){
  let choosenInt = listCity[posilist]; 
  document.getElementById('intField').innerText = intDisplay(choosenInt.name);
  document.getElementById('intArea').style.visibility = 'visible';
}

let lastInt = []

function intDisplay(str){
  let divised = str.split("");
  //init
  if(lastInt.length == 0){
    for(let i = 0; i < divised.length; i++){
      lastInt.push("_")
    }
  }
  //continue
  let alpha = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
  let rng =  alpha[Math.floor(Math.random() * alpha.length)];
  let noEternal = 50
  while (!str.normalize("NFD").toLowerCase().includes(rng) || lastInt.join("").normalize("NFD").toLowerCase().includes(rng)){
    rng =  alpha[Math.floor(Math.random() * alpha.length)];
    noEternal--
    if(noEternal <= 0){
      break
    }
  }

  for(let i = 0; i < divised.length; i++){
    console.log(rng)  
    if(checkDiff(divised[i],rng) == 0){
        lastInt[i] = divised[i];
      }
  }


  let returnedInt = ""
  for(let i = 0; i < lastInt.length; i++){
      returnedInt += lastInt[i] + " "
  }
  return returnedInt
}

document.getElementById("back").disabled = false;

//init
let loseStrick = 0;

function back() {
  window.location.replace("../../");
}
document.getElementById("back").addEventListener("click", () => {
  back();
});


document.getElementById('nameArea').addEventListener('blur', function() {
    textVerified()
});

document.getElementById('nameArea').addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    document.getElementById('nameArea').blur();
  }
});


function textVerified(){
    let input = document.getElementById('nameArea').value;
    let error_margin = checkDiff(input,listCity[posilist].name)
    if(error_margin <= 2){
        console.log(posilist + "\n" + listCity[posilist].name)
        let icon = orangeIcon
        document.getElementById('errorText').style.color = "rgb(241, 186, 109)"
        if(error_margin <= 1 && loseStrick <= 1){
          document.getElementById('errorText').style.color = "rgba(109, 241, 118, 1)"
          icon = greenIcon
        }
        document.getElementById('errorText').innerHTML = "Tu as trouvée : " + listCity[posilist].name
        document.getElementById('intArea').style.visibility = 'hidden'
        lastInt = []
        loseStrick = 0;
        posilist++;
        showCity();
        markers[posilist - 1] = L.marker([listCity[posilist - 1].lat, listCity[posilist - 1].lng], {
    icon: icon,
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
    document.getElementById('errorText').style.color = "rgb(241, 109, 109)"
    document.getElementById('errorText').innerHTML = "Nom invalide"
    loseStrick++;
    if(loseStrick >= 3 && loseStrick <= 6){
      intmaker();
    }
    else if(loseStrick >= 6){
      document.getElementById('errorText').style.color = "rgb(241, 109, 109)"
      document.getElementById('errorText').innerHTML = "Tu n'as pas trouvée : " + listCity[posilist].name
        document.getElementById('intArea').style.visibility = 'hidden'
        lastInt = []
        loseStrick = 0;
        posilist++;
        showCity();
        markers[posilist - 1] = L.marker([listCity[posilist - 1].lat, listCity[posilist - 1].lng], {
    icon: redIcon,
  }).addTo(map)
    .bindPopup(`<b>${listCity[posilist].name}</b>`)
    }
    return
}


function checkDiff(str1,str2){
  if(!str1 || !str2) return
  let a = str1.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  let b = str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,     
        dp[i][j - 1] + 1,     
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}