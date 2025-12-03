import * as util from "../asset/common.js"
const params = new URLSearchParams(window.location.search);
const jsonName = params.get("json");
const learningID = parseInt(params.get("learningID"));
const returned = params.get("return");
const posi = parseInt(localStorage.getItem(jsonName + "_learn"));
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
if (learningID == -1) {
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
} else {
  listCity = data.listCity.filter((item) =>
    data.learning[learningID].listID.includes(item.name)
  );
  console.log(listCity);
}


// ****************************
// *Dark/Light mode + map load*
// ****************************
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.getElementById("info").style.color = "#ffffff";
  document.getElementById("map").style.backgroundColor = "#000000ff";
  document.body.style.backgroundColor = "#1a1a1aff";

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap, © CartoDB, Made by @Jimmxyz on github",
      maxZoom: 18,
      noWrap: true,
    }
  ).addTo(map);
} else {
  document.getElementById("info").style.color = "#000000ff";
  document.getElementById("map").style.backgroundColor = "#ffffffff";
  document.body.style.backgroundColor = "#ffffffff";

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
localStorage.setItem("CITY", JSON.stringify(listCity));

if (!isNaN(listCity.length) && listCity.length > 0) {
  document.getElementById("prgs").max = listCity.length;
}
if (!isNaN(0) && 0 >= 0 && 0 <= document.getElementById("prgs").max) {
  document.getElementById("prgs").value = 0;
}

//init
let posilist = 0;
let markers = [];
let actual;

//point every city :
for (let i = 0; i < listCity.length; i++) {
  const marker = L.marker([listCity[i].lat, listCity[i].lng], {
    icon: util.greyIcon,
  }).addTo(map);
  markers.push(marker);
}

function showCity() {
  if (actual) {
    map.removeLayer(actual);
  }
  if (markers[posilist]) {
    map.removeLayer(markers[posilist]);
    actual = L.marker([listCity[posilist].lat, listCity[posilist].lng], {
      icon: util.blueIcon,
    }).addTo(map);
    map.setView([listCity[posilist].lat, listCity[posilist].lng], 6);
  }
}

showCity();

function intmaker() {
  let choosenInt = listCity[posilist];
  document.getElementById("intField").innerText = intDisplay(choosenInt.name);
  document.getElementById("intArea").style.visibility = "visible";
}

let lastInt = [];

function intDisplay(str) {
  let divised = str.split("");
  //init
  if (lastInt.length == 0) {
    for (let i = 0; i < divised.length; i++) {
      lastInt.push("_");
    }
  }
  //continue
  let alpha = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let rng = alpha[Math.floor(Math.random() * alpha.length)];
  let noEternal = 50;
  while (
    !str.normalize("NFD").toLowerCase().includes(rng) ||
    lastInt.join("").normalize("NFD").toLowerCase().includes(rng)
  ) {
    rng = alpha[Math.floor(Math.random() * alpha.length)];
    noEternal--;
    if (noEternal <= 0) {
      break;
    }
  }

  for (let i = 0; i < divised.length; i++) {
    console.log(rng);
    if (util.checkDiff(divised[i], rng) == 0) {
      lastInt[i] = divised[i];
    }
  }

  let returnedInt = "";
  for (let i = 0; i < lastInt.length; i++) {
    returnedInt += lastInt[i] + " ";
  }
  return returnedInt;
}

document.getElementById("back").disabled = false;

//init
let loseStrick = 0;

function back() {
  const params = new URLSearchParams({
    json: jsonName,
  });
  window.location.replace(returned + "/index.html?" + params);
}

document.getElementById("back").addEventListener("click", () => {
  back();
});

document.getElementById("continue").addEventListener("click", () => {
  if(miss / (fail + miss + good) < 0.1 && fail == 0 && posi == learningID){
          localStorage.setItem(jsonName + "_learn",posi+1)
  }
  back();
});

document.getElementById("nameArea").addEventListener("blur", function () {
  textVerified();
});

document
  .getElementById("nameArea")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      document.getElementById("nameArea").blur();
    }
  });

let miss = 0;
let fail = 0;
let good = 0;

function textVerified() {
  let input = document.getElementById("nameArea").value;
  let error_margin = util.checkDiff(input, listCity[posilist].name);
  if (error_margin <= 2) {
    console.log(posilist + "\n" + listCity[posilist].name);
    let icon = util.orangeIcon;
    document.getElementById("errorText").style.color = "rgb(241, 186, 109)";
    if (error_margin <= 1 && loseStrick <= 1) {
      document.getElementById("errorText").style.color =
        "rgba(109, 241, 118, 1)";
      icon = util.greenIcon;
    }
    document.getElementById("errorText").innerHTML =
      "Tu as trouvée : " + listCity[posilist].name;
    document.getElementById("intArea").style.visibility = "hidden";
    if (loseStrick >= 1) {
      miss++;
    } else {
      good++;
    }
    lastInt = [];
    loseStrick = 0;
    posilist++;
    if (
      !isNaN(posilist) &&
      posilist >= 0 &&
      posilist <= document.getElementById("prgs").max
    ) {
      document.getElementById("prgs").value = posilist;
    }
    if (
      document.getElementById("prgs").max ==
      document.getElementById("prgs").value
    ) {
      document.getElementById("back").disabled = true;
      document.getElementById("continue").disabled = false;
      return
    }
    showCity();
    markers[posilist - 1] = L.marker(
      [listCity[posilist - 1].lat, listCity[posilist - 1].lng],
      {
        icon: icon,
      }
    )
      .addTo(map)
      .bindPopup(`<b>${listCity[posilist].name}</b>`);
    return;
  }
  document.getElementById("errorText").style.color = "rgb(241, 109, 109)";
  document.getElementById("errorText").innerHTML = "Nom invalide";
  loseStrick++;
  if (loseStrick >= 2 && loseStrick <= 6) {
    intmaker();
  } else if (loseStrick >= 6) {
    fail++;
    document.getElementById("errorText").style.color = "rgb(241, 109, 109)";
    document.getElementById("errorText").innerHTML =
      "Tu n'as pas trouvée : " + listCity[posilist].name;
    document.getElementById("intArea").style.visibility = "hidden";
    lastInt = [];
    loseStrick = 0;
    posilist++;
    if (
      !isNaN(posilist) &&
      posilist >= 0 &&
      posilist <= document.getElementById("prgs").max
    ) {
      document.getElementById("prgs").value = posilist;
    }
    if (
      document.getElementById("prgs").max ==
      document.getElementById("prgs").value
    ) {
      document.getElementById("back").disabled = true;
      document.getElementById("continue").disabled = false;
      return
    }
    showCity();
    markers[posilist - 1] = L.marker(
      [listCity[posilist - 1].lat, listCity[posilist - 1].lng],
      {
        icon: util.redIcon,
      }
    )
      .addTo(map)
      .bindPopup(`<b>${listCity[posilist].name}</b>`);
  }
  return;
}
