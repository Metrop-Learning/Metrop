import { CARTO_KEY } from '../../env.js';
import * as trad from '../../trad/trad.js';
const lightStyleUrl = `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=${CARTO_KEY}`;

export const langSys = localStorage.getItem("LANG_SYS") ?? "fr"
await trad.traductAll("../trad/",langSys)

export const map = new maplibregl.Map({
    container: 'map',
    style: lightStyleUrl,
    zoom: 1,
    center: [150.16546137527212, -35.017179237129994],
    pitch: 0,
    maxPitch: 85,
    canvasContextAttributes: { antialias: true },
    attributionControl: false
});

map.dragRotate.disable();
map.keyboard.disable();
map.touchZoomRotate.disableRotation();
map.addControl(new maplibregl.AttributionControl(), 'top-left');

map.on('style.load', () => {
    map.setProjection({ type: 'globe' });
});

let nbOfElement = 0;
const elementsMap = new Map();

let targetLang = langSys

let baseKEYexisting; // used to not duplicate same quiz

const params = new URLSearchParams(window.location.search);
const file = params.get("file");
if(file){
    decompile(file)
}

document.getElementById('languageSelect').value = targetLang
document.getElementById('languageSelect').addEventListener("change",(e)=>{
    targetLang = e.target.value
})   


let activeSelectionElement = null;

async function getCities(lat,lng,range=1){
    let response = await fetch(`https://countries.dev/cities/near?lat=${lat}&lng=${lng}&limit=${range}`);
    let info = await response.json();
    let cities = "none"
    let lastLevel = "none"
    for(let i = 0; i < info.length; i++){
        if(info[i].featureCode == "PPL" && lastLevel == "none"){
            cities = info[i].name
            lastLevel = "PPL"
        }
        else if(info[i].featureCode == "PPLA2" && (lastLevel == "PPL" || lastLevel == "none")){
            cities = info[i].name
            lastLevel = "PPLA2"
        }
        else if(info[i].featureCode == "PPLA" && (lastLevel == "PPLA2" || lastLevel == "PPL" || lastLevel == "none")){
            cities = info[i].name
            lastLevel = "PPLA"
        }
        else if(info[i].featureCode == "PPLC" && (lastLevel == "PPLA" || lastLevel == "PPLA2" || lastLevel == "PPL" || lastLevel == "none")){
            cities = info[i].name
            lastLevel = "PPLC"
            return cities
        }
    }
    if(cities == "none"){
        if(range == 1){
            range = 5
        }
        if (range > 100){
            return "ERROR:NO CITIES"
        }
        cities = getCities(lat,lng,range*2)
    }
    return cities
}

async function getCitiesCoord(name,range=1){
    let response = await fetch(`https://countries.dev/cities?q=${name}&limit=${range}`);
    let info = await response.json();
    let cities = []
    let lastLevel = "none"
    for(let i = 0; i < info.length; i++){
        if(info[i].featureCode == "PPL" && lastLevel == "none"){
            cities = [info[i].latitude,info[i].longitude]
            lastLevel = "PPL"
        }
        else if(info[i].featureCode == "PPLA2" && (lastLevel == "PPL" || lastLevel == "none")){
            cities = [info[i].latitude,info[i].longitude]
            lastLevel = "PPLA2"
        }
        else if(info[i].featureCode == "PPLA" && (lastLevel == "PPLA2" || lastLevel == "PPL" || lastLevel == "none")){
            cities = [info[i].latitude,info[i].longitude]
            lastLevel = "PPLA"
        }
        else if(info[i].featureCode == "PPLC" && (lastLevel == "PPLA" || lastLevel == "PPLA2" || lastLevel == "PPL" || lastLevel == "none")){
            cities = [info[i].latitude,info[i].longitude]
            lastLevel = "PPLC"
            return cities
        }
    }
    if(cities == []){
        if(range == 1){
            range = 5
        }
        if (range > 100){
            return "ERROR:NO CITIES"
        }
        cities = getCities(name,range*2)
    }
    return cities
}

map.on('click', async (e) => {
    if (!activeSelectionElement) return;
    const { lat, lng } = e.lngLat;
    activeSelectionElement.setCoordinates(lat, lng);
    map.getCanvas().style.cursor = '';
    activeSelectionElement.setName(await getCities(lat,lng));
    activeSelectionElement = null;
});

document.getElementById('addACity').addEventListener('click', () => {
    createAnElement()
});

function createAnElement(elementAlreadyExisting){
    const copy = document.querySelector("#toBeCloned .element");
    const paste = copy.cloneNode(true);
    const currentId = "idE" + nbOfElement;
    if(elementAlreadyExisting){
        elementsMap.set(currentId, { name:elementAlreadyExisting.name[targetLang], lng:elementAlreadyExisting.lng,lat:elementAlreadyExisting.lat});
    } else {
        elementsMap.set(currentId, { name:"", lng:0,lat:0});
    }
    paste.id = currentId;
    nbOfElement++;
    
    let list = document.getElementById('listOfElement')
    if (list.lastElementChild) {
        list.insertBefore(paste, list.lastElementChild);
    } else {
        list.appendChild(paste);
    }

    //auto scroll
    if(!elementAlreadyExisting){
        const listOfElement = document.getElementById('listOfElement');
        listOfElement.scrollTo({
            top: listOfElement.scrollHeight,
            behavior: 'smooth'
        });
    }
    let coords = [null, null];
    let marker = null;
    let nameVal = "No Name";
    if(elementAlreadyExisting){
        coords = [elementAlreadyExisting.lat, elementAlreadyExisting.lng];
        nameVal = elementAlreadyExisting.name[targetLang];
    }
    

    const latInput = paste.querySelector(".coords-group #lat");
    const lngInput = paste.querySelector(".coords-group #lng");
    const nameInput = paste.querySelector(".form-group input[type='text']");
    const deleteBtn = paste.querySelector(".element-actions .buttonRed");
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`<h3>${nameVal}</h3>`);
    const updateMarker = () => {
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
            if (!marker) {
                marker = new maplibregl.Marker()
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(map);
            } else {
                marker.setLngLat([lng, lat]);
            }
        }
    };
    if(elementAlreadyExisting){
        latInput.value = coords[0]
        lngInput.value = coords[1]
        nameInput.value = nameVal
        updateMarker();
    }
    latInput.addEventListener("input", () => {
        coords[0] = latInput.value;
        Object.assign(elementsMap.get(currentId), {lat:coords[0]});
        updateMarker();
    });
    lngInput.addEventListener("input", () => {
        coords[1] = lngInput.value;
        Object.assign(elementsMap.get(currentId), {lng:coords[1]});
        updateMarker();
    });
    if (nameInput) {
        nameInput.addEventListener("input", () => {
            nameVal = nameInput.value.trim() || "No Name";
            popup.setHTML(`<h3>${nameVal}</h3>`);
            Object.assign(elementsMap.get(currentId), {name:nameVal});
        });
        nameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                nameInput.blur();
            }
        });
        nameInput.addEventListener("blur", async () => {
            if(latInput.value == "" && lngInput.value == ""){
                let coordNew = await getCitiesCoord(nameVal)
                coords[0] = coordNew[0];
                latInput.value = coordNew[0]
                coords[1] = coordNew[1];
                lngInput.value = coordNew[1]
                Object.assign(elementsMap.get(currentId), {lat:coords[0]});
                Object.assign(elementsMap.get(currentId), {lng:coords[1]});
                updateMarker();
                map.flyTo({
                    center: [coords[1], coords[0]],
                    essential: true
                });
            }
        });
    }
    deleteBtn.addEventListener("click", () => {
        if (marker) {
            marker.remove();
        }
        elementsMap.delete(currentId);
        paste.remove();
    });


    const mapSelectBtn = paste.querySelector(".element-actions .btn-map-select");

    const setCoordinates = (lat, lng) => {
        const formattedLat = lat.toFixed(5);
        const formattedLng = lng.toFixed(5);

        latInput.value = formattedLat;
        lngInput.value = formattedLng;
        coords[0] = formattedLat;
        coords[1] = formattedLng;
        Object.assign(elementsMap.get(currentId), {lat:coords[0]});
        Object.assign(elementsMap.get(currentId), {lng:coords[1]});

        updateMarker();
    };
    const setName = (name) => {
        if(nameInput.value == ""){
            nameInput.value = name
            nameVal = name
            popup.setHTML(`<h3>${nameVal}</h3>`);
            Object.assign(elementsMap.get(currentId), {name:nameVal});
        };
    };

    mapSelectBtn.addEventListener("click", () => {
        activeSelectionElement = {
            setCoordinates: setCoordinates,
            setName: setName
        };

        map.getCanvas().style.cursor = 'crosshair';
    });

    deleteBtn.addEventListener("click", () => {
        if (activeSelectionElement && activeSelectionElement.setCoordinates === setCoordinates) {
            activeSelectionElement = null;
            map.getCanvas().style.cursor = '';
        }
        if (marker) marker.remove();
        paste.remove();
    });
}

document.getElementById("scrollBotom").addEventListener('click',()=>{
    const listOfElement = document.getElementById('listOfElement');
    listOfElement.scrollTo({
        top: listOfElement.scrollHeight,
        behavior: 'smooth'
    });
})


function compile(){
    let title = document.getElementById('projectName').value
    let desc = document.getElementById('projectDesc').value
    if(!title || !desc){
        alert("The quiz need a title and a description.")
        return
    }
    let langQ = targetLang
    let listdb = []
    elementsMap.forEach((item, id) => {
        listdb.push({
            name:{
                [langQ]:item.name
            },
            lat:item.lat,
            lng:item.lng
        })
    });
    const finalFiles = {
        list:listdb,
        cardInfo:{
            Title:title,
            Text:desc,
            lang:langQ
        },
        type:["place","guess"]
    }
    return finalFiles
}


document.getElementById('saveBtn').addEventListener('click',()=>{
    const newObject = compile()

    const rawList = localStorage.getItem("LOCALDB_QUIZLIST");
    let keysList = rawList ? JSON.parse(rawList) : [];

    const rawData = localStorage.getItem("LOCALDB_QUIZDATA");
    let dataStore = {};

    if (rawData) {
        try {
            dataStore = JSON.parse(rawData);
        } catch (error) {
            console.error("Error parsing json :", error);
            dataStore = {};
        }
    }
    let modifyKey = true
    if(baseKEYexisting){
        modifyKey = false
    }
    const itemKey = generateUniqueKey(newObject.cardInfo.Title, keysList);

    dataStore[itemKey] = newObject;
    if(modifyKey){
        keysList.push(itemKey);
    }

    localStorage.setItem("LOCALDB_QUIZDATA", JSON.stringify(dataStore));
    localStorage.setItem("LOCALDB_QUIZLIST", JSON.stringify(keysList));
})

document.getElementById('downloadBtn').addEventListener('click',()=>{
    const jsonString = JSON.stringify(compile(), null);

    //download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "city_quiz.metrop";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
})



function generateUniqueKey(title, existingKeys) {
    if(baseKEYexisting){
        return baseKEYexisting
    }
    const baseKey = "qd" + title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^a-z0-9]/g, "");

    if (!existingKeys.includes(baseKey)) {
        baseKEYexisting = baseKey
        return baseKey;
    }

    let counter = 1;
    while (existingKeys.includes(`${baseKey}_${counter}`)) {
        counter++;
    }
    baseKEYexisting = `${baseKey}_${counter}`
    return `${baseKey}_${counter}`;
}

function decompile(nameIdQuiz){
    const rawData = localStorage.getItem("LOCALDB_QUIZDATA");
    let dataStore = {};

    if (rawData) {
        try {
            dataStore = JSON.parse(rawData);
        } catch (error) {
            console.error("Error parsing json :", error);
            dataStore = {};
        }
    }
    console.log(dataStore[nameIdQuiz])

    //set var
    targetLang = dataStore[nameIdQuiz].cardInfo.lang
    baseKEYexisting = nameIdQuiz

    //set info
    document.getElementById('projectName').value = dataStore[nameIdQuiz].cardInfo.Title
    document.getElementById('projectDesc').value = dataStore[nameIdQuiz].cardInfo.Text

    //print element
    for(let i = 0; i < dataStore[nameIdQuiz].list.length; i++){
        createAnElement(dataStore[nameIdQuiz].list[i])
    }
}


document.querySelectorAll('.homeBtn').forEach((e) => {
    e.addEventListener('click',()=>{
        if(confirm("Do you want to quit ?")){
            window.location.assign('../')
        }
    })
})