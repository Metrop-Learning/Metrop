import {map} from "./theme.js";
import * as placeTerritory from './renderer/placeTerritoriesManager.js'
import * as guessTerritory from './renderer/guessFromPosiTerritory.js'
import * as geojson from './geojson.js'
import * as data from '../../asset/dataManager.js'
import * as util from "../../asset/common.js";
import { langSys, nameList } from "./main.js";
import * as trad from "../../trad/trad.js"

let listOfMarker = [];
let listOfSelfMarker = [];
let listOfLine = [];

export async function show(type,result,dataset){
    if(["guess","place", "placeTerritory", "guessFromPosiTerritory"].includes(type)){
        document.getElementById('mapArea').style.display = "flex";
        document.getElementById('mapArea').style.setProperty('--margin-map', '0');
    } else{
        document.getElementById('flexMenu').style.display = "none";
    }

    const svgImgBtn = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M520-207v127q0 17-11.5 28.5T480-40q-17 0-28.5-11.5T440-80v-127l-16 16q-11 11-27.5 11T368-192q-11-11-11-28t11-28l84-84q12-12 28-12t28 12l84 84q11 11 11.5 27.5T592-192q-11 11-27.5 11.5T536-191l-16-16ZM207-440H80q-17 0-28.5-11.5T40-480q0-17 11.5-28.5T80-520h127l-16-16q-11-11-11-27.5t12-28.5q11-11 28-11t28 11l84 84q12 12 12 28t-12 28l-84 84q-11 11-27.5 11.5T192-368q-11-11-11.5-27.5T191-424l16-16Zm546 0 16 16q11 11 11 27.5T768-368q-11 11-28 11t-28-11l-84-84q-12-12-12-28t12-28l84-84q11-11 27.5-11.5T768-592q11 11 11.5 27.5T769-536l-16 16h127q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440H753Zm-273 20q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420Zm-40-333v-127q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v127l16-16q11-11 27.5-11t28.5 12q11 11 11 28t-11 28l-84 84q-12 12-28 12t-28-12l-84-84q-11-11-11.5-27.5T368-768q11-11 27.5-11.5T424-769l16 16Z"/></svg>'

    document.getElementById('resultContainer').style.display = "flex";
    document.getElementById('flexMenu').style.height = "50vh"
    let score = 0
    for (let i = 0; i < result.length; i++){
        let color = "#7c7c7c"
        let colorVar = "var(--header-top-color)"
        let colorState = "default"
        if(result[i].score == "GOOD"){
            score += 1
            color = "#32da49"
            colorVar = "var(--green-color)"
            colorState = "correct"
        } else if (result[i].score == "MISS"){
            score += 0.5
            color = "#d3732f"
            colorVar = "var(--orange-color)"
            colorState = "missed"
        } else if (result[i].score == "FAIL"){
            color = "#d32f2f"
            colorVar = "var(--red-color)"
            colorState = "wrong"
        }
        if(["guess", "placeTerritory", "guessFromPosiTerritory"].includes(type)){
            document.getElementById("tbody").insertAdjacentHTML('beforeend', 
                '<tr id="element' + i + '"><th style="color:'+colorVar+';">' + (i+1) + '</th><th>'+result[i].name+'</th><th><button id="btnResultNb'+i+'">'+svgImgBtn+'</button></th></tr>'
            );
        } else if (["fromFlag"].includes(type)){
            let flagImg = data.findElementByPath(dataset[i].id).flag 
            document.getElementById("tbody").insertAdjacentHTML('beforeend', 
                '<tr id="element' + i + '"><th style="color:'+colorVar+';">' + (i+1) + '</th><th class="minimalColumn"><img src="'+flagImg+'"></th><th>'+result[i].name+'</th><th></th></tr>'
            );
        } else if (type == "place" && result[i].score != "SKIP"){
            document.getElementById("tbody").insertAdjacentHTML('beforeend', 
                '<tr id="element' + i + '"><th style="color:'+colorVar+';">' + (i+1) + '</th></th><th>'+result[i].name+'</th><th class="kmCounter">'+util.getDistShow(result[i].distKm)+'</th><th><button id="btnResultNb'+i+'">'+svgImgBtn+'</button></th></tr>'
            );
        } else if(type == "place") {
            document.getElementById("tbody").insertAdjacentHTML('beforeend', 
                '<tr id="element' + i + '"><th style="color:'+colorVar+';">' + (i+1) + '</th></th><th>'+result[i].name+'</th><th class="kmCounter">--</th><th><button id="btnResultNb'+i+'">'+svgImgBtn+'</button></th></tr>'
            );
        } else {
            document.getElementById("tbody").insertAdjacentHTML('beforeend', 
                '<tr id="element' + i + '"><th style="color:'+colorVar+';">' + (i+1) + '</th></th><th>'+result[i].name+'</th><th></th></tr>'
            );
        }
        if(type == "guess" || (type == "place" && result[i].score == "SKIP")){
            listOfMarker.push(new maplibregl.Marker({ color: color })
                          .setLngLat([dataset[i].lng,dataset[i].lat])
                          .addTo(map));
            listOfSelfMarker.push(null)
            listOfLine.push(null)
            document.getElementById('btnResultNb'+i).addEventListener('click',()=>{
                document.body.scrollTo(0, document.body.scrollHeight);
                map.flyTo({
                    center: [dataset[i].lng, dataset[i].lat],
                    minZoom:5,
                    essential: true,
                    duration: 2000
                });
            })
        }
        else if(type == "place"){
            const popup = new maplibregl.Popup({ 
                offset: 25,              
                closeButton: true,       
                closeOnClick: false      
            })
            .setHTML(`
                    <h3 style="color:var(--invert-color);">${nameList[i]}</h3>
            `);
            listOfMarker.push(new maplibregl.Marker({ color: color })
                          .setLngLat([dataset[i].lng,dataset[i].lat])
                          .addTo(map));
            listOfSelfMarker.push(new maplibregl.Marker({ color: "#3190d2" })
                          .setLngLat([result[i].lng,result[i].lat])
                          .setPopup(popup).addTo(map))
            listOfLine.push(createALine(result[i],dataset[i],util.getDistShow(result[i].distKm)))
            document.getElementById('btnResultNb'+i).addEventListener('click',()=>{
                document.body.scrollTo(0, document.body.scrollHeight);
                const bounds = new maplibregl.LngLatBounds()
                .extend([result[i].lng, result[i].lat])
                .extend([dataset[i].lng, dataset[i].lat]);

                map.fitBounds(bounds, { padding: 40 });
            })
        }
        if(type == "placeTerritory"){
            document.getElementById('btnResultNb'+i).addEventListener('click',()=>{
                document.body.scrollTo(0, document.body.scrollHeight);
                geojson.adjustCamCountry(i,placeTerritory.geoInfo)
            })
            geojson.changeState(i,colorState)
        }
        if(type == "guessFromPosiTerritory"){
            document.getElementById('btnResultNb'+i).addEventListener('click',()=>{
                document.body.scrollTo(0, document.body.scrollHeight);
                geojson.adjustCamCountry(i,guessTerritory.geoInfo)
            })
            geojson.changeState(i,colorState)
        }
    }

    //Cam adjust
    if(type == "guess" || type == "place"){
        adjustCam(dataset)
    } else if(type == "placeTerritory"){
        setTimeout(()=>{
            map.fitBounds(placeTerritory.boundsScheme, {
                padding: 50,
                minZoom: 3,
                duration: 1200 
            });
        },150)
    } else if(type == "guessFromPosiTerritory"){
        setTimeout(()=>{
            map.fitBounds(guessTerritory.boundsScheme, {
                padding: 50,
                minZoom: 3,
                duration: 1200 
            });
            
        },150)
    }

    // The selection !!!
    const maxScore = result.length
    document.getElementById('prcnt').innerText = Number(((score / maxScore) * 100).toFixed(2)) + "%";
    if(score==maxScore){
        document.getElementById('svgContainer').style.setProperty('--backgrd', 'var(--btn-color)');
        document.getElementById('svgResult').setAttribute("d","m363-310 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM481-29 346-160H160v-186L26-480l134-134v-186h186l135-134 133 134h186v186l134 134-134 134v186H614L481-29Z")
        document.getElementById('svgResult').style.color = "var(--btn-color-outline)"
        document.getElementById('resultTitle').innerText = await trad.getTrad("../trad/",langSys,"score-1")
    }
    else if (score >= (maxScore*0.95) || (maxScore < 20 && score >= maxScore-1)) {
        document.getElementById('svgContainer').style.setProperty('--backgrd', 'var(--green-color)');
        document.getElementById('svgResult').setAttribute("d","m437-433-73-76q-9-10-22-10t-23 9q-10 10-10 23t10 23l97 96q9 9 21 9t21-9l183-182q9-9 9-22t-10-22q-9-8-21.5-7.5T598-593L437-433ZM332-84l-62-106-124-25q-11-2-18.5-12t-5.5-21l14-120-79-92q-8-8-8-20t8-20l79-91-14-120q-2-11 5.5-21t18.5-12l124-25 62-107q6-10 17-14t22 1l109 51 109-51q11-5 22-1.5t17 13.5l63 108 123 25q11 2 18.5 12t5.5 21l-14 120 79 91q8 8 8 20t-8 20l-79 92 14 120q2 11-5.5 21T814-215l-123 25-63 107q-6 10-17 13.5T589-71l-109-51-109 51q-11 5-22 1t-17-14Z")
        document.getElementById('svgResult').style.color = "var(--green-background)"
        document.getElementById('resultTitle').innerText = await trad.getTrad("../trad/",langSys,"score-2")
    }
    else if (score >= (maxScore*0.85) || (maxScore < 20 && score >= (maxScore*0.8))) {
        document.getElementById('svgContainer').style.setProperty('--backgrd', 'var(--green-background)');
        document.getElementById('svgResult').setAttribute("d","m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z")
        document.getElementById('svgResult').style.color = "var(--green-outside)"
        document.getElementById('resultTitle').innerText = await trad.getTrad("../trad/",langSys,"score-3")
    }
    else if (score >= (maxScore*0.6)) {
        document.getElementById('svgContainer').style.setProperty('--backgrd', 'var(--orange-color)');
        document.getElementById('svgResult').setAttribute("d","M360-266h230q14 0 23.5-6t16.5-18l78-182q2-5 3.5-15t1.5-15v-24q0-14-6.5-20.5T686-553H472l29-138q2-8 0-15t-7-12l-21-22-161 174-8 16q-4 8-4 17v207q0 23 18 41.5t42 18.5ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z")
        document.getElementById('svgResult').style.color = "var(--orange-background)"
        document.getElementById('resultTitle').innerText = await trad.getTrad("../trad/",langSys,"score-4")
    }
    else if (score >= (maxScore*0.4)) {
        document.getElementById('svgContainer').style.setProperty('--backgrd', 'var(--orange-background)');
        document.getElementById('svgResult').setAttribute("d","M479.98-280q14.02 0 23.52-9.48t9.5-23.5q0-14.02-9.48-23.52t-23.5-9.5q-14.02 0-23.52 9.48t-9.5 23.5q0 14.02 9.48 23.52t23.5 9.5ZM453-433h60v-253h-60v253Zm27.27 353q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Z")
        document.getElementById('svgResult').style.color = "var(--orange-outside)"
        document.getElementById('resultTitle').innerText = await trad.getTrad("../trad/",langSys,"score-5")
    }
    else if (score >= (maxScore*0.2)) {
        document.getElementById('svgContainer').style.setProperty('--backgrd', 'var(--red-color)');
        document.getElementById('svgResult').setAttribute("d","m369-480 62 85q5 6 12 6t12-6l62-85 61 85q5 6 12.5 6t12.5-6l85-118q8-10 6-22t-12-20q-10-8-22-5.5T640-548l-50 68-61-85q-5-6-12.5-6t-12.5 6l-61 85-62-85q-5-6-12-6t-12 6l-86 118q-8 10-5.5 22t12.5 20q10 8 22 5.5t20-12.5l49-68ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z")
        document.getElementById('svgResult').style.color = "var(--red-background)"
        document.getElementById('resultTitle').innerText = await trad.getTrad("../trad/",langSys,"score-6")
    }
    else{
        document.getElementById('svgContainer').style.setProperty('--backgrd', 'var(--red-background)');
        document.getElementById('svgResult').setAttribute("d","M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm27-195 123-123 123 123 42-42-123-123 123-123-42-42-123 123-123-123-42 42 123 123-123 123 42 42Z")
        document.getElementById('svgResult').style.color = "var(--red-outside)"
        document.getElementById('resultTitle').innerText = await trad.getTrad("../trad/",langSys,"score-6")
    }
}

function adjustCam(listPoint) {
    const bounds = new maplibregl.LngLatBounds();

    listPoint.forEach(point => {
        bounds.extend([point.lng, point.lat]);
    });
    map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1000    
    });
}

document.getElementById('retry').addEventListener('click',()=>{
    window.location.reload()
})

document.getElementById('done').addEventListener('click',()=>{
    window.location.assign('../')
})

function createALine(guess, city, dist) {
    // On génère un ID unique (ex: guess-line-171829382)
    const uniqueId = `guess-${listOfLine.length}`;

    const lineGeoJSON = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [guess.lng, guess.lat],
          [city.lng, city.lat]
        ]
      },
      properties: {
        "distance_text": dist 
      }
    };

    // On utilise l'ID unique pour la source et les layers
    map.addSource(`${uniqueId}-source`, {
      type: "geojson",
      data: lineGeoJSON
    });

    map.addLayer({
      id: `${uniqueId}-layer`,
      type: "line",
      source: `${uniqueId}-source`,
      paint: {
        "line-color": "#777777",
        "line-width": 3
      }
    });

    map.addLayer({
      id: `${uniqueId}-label`,
      type: "symbol",
      source: `${uniqueId}-source`,
      layout: {
        "symbol-placement": "line",
        "text-field": ["get", "distance_text"],
        "text-font": ["Momo Trust Display", "Arial Unicode MS Regular"],
        "text-size": 16,
        "text-keep-upright": true,
        "text-offset": [0, -0.7],
        "text-anchor": "center",
        "symbol-spacing": 500
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1
      }
    });
}