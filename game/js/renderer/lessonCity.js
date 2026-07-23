import * as util from "../../../asset/common.js";
import * as data from '../../../asset/dataManager.js'
import * as ui from '../ui.js';
import {map} from "../theme.js";

export function init(dataSet, nameList){
    document.getElementById('mapArea').style.display = "flex";

    ui.progress.update(0);

    let listOfMarker = [""]
    let marker;

    for (let i = 1; i < nameList.length; i++){  
          listOfMarker.push(new maplibregl.Marker({ color: "#7c7c7c" })
                  .setLngLat([dataSet[i].lng,dataSet[i].lat])
                  .addTo(map));
    }

    adjustCam(dataSet)

    let selector = 0

    marker = new maplibregl.Marker({ color: "#3190d2" })
              .setLngLat([dataSet[0].lng,dataSet[0].lat])
              .addTo(map)

    document.querySelectorAll('.nameArea').forEach((e)=>{
        e.innerText = nameList[selector]
    })


    document.querySelector(".lessonBack").style.display = "none"
    document.querySelector(".lessonEnd").style.display = "none"


    setTimeout(()=>{
        map.flyTo({
        center: [dataSet[selector].lng, dataSet[selector].lat],
        essential: true,
        duration: 2000
    });
    },2000)

    document.querySelectorAll('.lessonNext').forEach((e) => {
        e.addEventListener('click',()=>{
            selector++
            if(selector >= nameList.length){
                selector = nameList.length - 1
            } else if(selector == nameList.length - 1){
                document.querySelector(".lessonNext").style.display = "none"
                document.querySelector(".lessonEnd").style.display = "flex"
            } else {
                document.querySelector(".lessonBack").style.display = "flex"
                document.querySelector(".lessonNext").style.display = "flex"
                document.querySelector(".lessonEnd").style.display = "none"
            }
            ui.progress.update(selector);
            marker.remove()
            marker = new maplibregl.Marker({ color: "#3190d2" })
              .setLngLat([dataSet[selector].lng,dataSet[selector].lat])
              .addTo(map)
            document.querySelectorAll('.nameArea').forEach((e)=>{
                e.innerText = nameList[selector]
            })
            map.flyTo({
                    center: [dataSet[selector].lng, dataSet[selector].lat],
                    essential: true,
                    duration: 2000
                });
        })
    })
    document.querySelectorAll('.lessonBack').forEach((e) => {
            e.addEventListener('click',()=>{
                    selector--
                    if(selector < 0){
                        selector = 0
                    } else if(selector == 0){
                        document.querySelector(".lessonBack").style.display = "none"
                    } else {
                        document.querySelector(".lessonBack").style.display = "flex"
                        document.querySelector(".lessonNext").style.display = "flex"
                        document.querySelector(".lessonEnd").style.display = "none"
                    }
                    ui.progress.update(selector);
                    marker.remove()
                    marker = new maplibregl.Marker({ color: "#3190d2" })
                      .setLngLat([dataSet[selector].lng,dataSet[selector].lat])
                      .addTo(map)
                    document.querySelectorAll('.nameArea').forEach((e)=>{
                        e.innerText = nameList[selector]
                    })
                    map.flyTo({
                        center: [dataSet[selector].lng, dataSet[selector].lat],
                        essential: true,
                        duration: 2000
                    });
              })
    })
    document.querySelectorAll('.lessonEnd').forEach((e) => {
            e.addEventListener('click',()=>{
                    window.location.assign("../")
              })
    })
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