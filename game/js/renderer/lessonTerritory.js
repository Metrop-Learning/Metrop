import * as geojson from '../geojson.js'
import * as theme from '../theme.js';
import * as data from '../../../asset/dataManager.js'
import * as ui from '../ui.js';
import * as util from "../../../asset/common.js";
import * as main from "../main.js";

export let boundsScheme;
export let geoInfo;

export async function init(dataSet, nameList){
    document.getElementById('mapArea').style.display = "none";
    document.getElementById('lessonActionBar').style.display = "none";
    document.getElementById('loadingScreen').style.display = "flex";

    document.getElementById('loadingBar').max = dataSet.length + 5;
    document.getElementById('loadingBar').value = 2;
    document.getElementById('loadingBarInfo').innerText = "Loading border files...";
    let val = 2;

    const promises = data.use.geojson(dataSet).map(async (link) => {
        const geojsonResult = await data.getGeojson(link);
        console.log(geojsonResult);
        val++;
        document.getElementById('loadingBar').value = val;
        return geojsonResult;
    });

    const results = await Promise.all(promises);
    geoInfo = results

    document.getElementById('loadingBarInfo').innerText = "Applying border on the map...";

    const applyMapData = () => {
        const bounds = geojson.addGeojsonListToExistingMap(results);
        boundsScheme = bounds
        document.getElementById('mapArea').style.display = "flex";
        document.getElementById('lessonActionBar').style.display = "flex";
        document.getElementById('loadingScreen').style.display = "none";

        if (bounds) {
            setTimeout(()=>{
                theme.map.fitBounds(bounds, {
                    padding: 50,
                    minZoom: 3,
                    duration: 1200 
                });
            },150)
        }
    };
    if (theme.map.style && theme.map.style._loaded) {
        applyMapData();
    } else {
        theme.map.once('styledata', applyMapData);
    }
    
    ui.progress.update(0);

    let selector = 0

    geojson.changeState(selector,"selected")
    document.querySelectorAll('.nameArea').forEach((e)=>{
        e.innerText = nameList[selector]
    })

    document.querySelector(".lessonBack").style.display = "none"
    document.querySelector(".lessonEnd").style.display = "none"

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
            geojson.changeState(selector,"selected")
            geojson.changeState(selector - 1,"default")
            geojson.adjustCamCountry(selector,results);
            document.querySelectorAll('.nameArea').forEach((e)=>{
                e.innerText = nameList[selector]
            })
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
                    geojson.changeState(selector,"selected")
                    geojson.changeState(selector + 1,"default")
                    geojson.adjustCamCountry(selector,results);
                    document.querySelectorAll('.nameArea').forEach((e)=>{
                        e.innerText = nameList[selector]
                    })
              })
    })
    document.querySelectorAll('.lessonEnd').forEach((e) => {
            e.addEventListener('click',()=>{
                    window.location.assign("../")
              })
    })
}