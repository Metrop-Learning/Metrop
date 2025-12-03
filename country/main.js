//Name of country with the ISO 3166-2
//Country with 3 letter and not 2 in region

//WIP not ready
import * as util from "../city/asset/common.js"
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

const listCountry = data.listCountry


import dataBorder from './boundary.json' with { type: "json" };

const map = L.map("map").setView([46.5, 2.5], 6);

let grey;
let lightGrey;
let mainColor;
let mainLightColor;

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  grey = "#545454ff"   
  lightGrey = "#6b6b6bff"
  mainColor = "rgba(61, 61, 186, 1)"
  mainLightColor = "rgba(73, 73, 191, 1)"
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
  mainColor = "rgb(81, 81, 227)"
  mainLightColor = "rgba(120, 120, 218, 1)"
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

function addABoundarie(link){
  fetch("https://commons.wikimedia.org/w/api.php?action=query&prop=revisions&titles="+link+"&rvprop=content&rvslots=main&format=json&origin=*")
  .then(r => r.json())
  .then(data => {
    const page = Object.values(data.query.pages)[0];
    const raw = page.revisions[0].slots.main["*"];
    const parsed = JSON.parse(raw);

    // --- GET GEOJSON ---
    const geojson = parsed.data;

    //style
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
        // HOVER
        layer.on("mouseover", function () {
          if (selectedLayer !== layer) layer.setStyle(hoverStyle);
        });
        layer.on("mouseout", function () {
          if (selectedLayer !== layer) layer.setStyle(defaultStyle);
        });
        // SELECT
        layer.on("click", function () {
          // reset ancienne sélection
          if (selectedLayer) selectedLayer.setStyle(defaultStyle);
          // applique style sélection
          layer.setStyle(selectedStyle);
          selectedLayer = layer;
          layer.bringToFront();
        });
      }
    }).addTo(map);
    map.fitBounds(layer.getBounds());
  });
}

addABoundarie(dataBorder.EU.get.FRA.content)
addABoundarie(dataBorder.EU.get.DEU.content)
addABoundarie(dataBorder.EU.get.CHE.content)
addABoundarie(dataBorder.EU.get.ITA.content)
addABoundarie(dataBorder.EU.get.ESP.content)
addABoundarie(dataBorder.EU.get.PRT.content)
addABoundarie(dataBorder.EU.get.UK.content)
addABoundarie(dataBorder.EU.get.IRL.content)
addABoundarie(dataBorder.EU.get.ISL.content)
addABoundarie(dataBorder.EU.get.BEL.content)
addABoundarie(dataBorder.EU.get.NLD.content)
addABoundarie(dataBorder.EU.get.LUX.content)
addABoundarie(dataBorder.EU.get.DNK.content)
addABoundarie(dataBorder.EU.get.SWE.content)
addABoundarie(dataBorder.EU.get.NOR.content)



