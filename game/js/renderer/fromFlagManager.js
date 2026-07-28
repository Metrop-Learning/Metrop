import * as data from '../../../asset/dataManager.js'
import * as util from "../../../asset/common.js";
import * as ui from '../ui.js';
import * as resultManager from "../result.js";
import * as trad from "../../../trad/trad.js"
import { langSys } from '../main.js';

export async function init(dataSet, nameList){

    let tryTrad = await trad.getTrad("../trad/",langSys,"try-left")
    
    document.getElementById('mapArea').style.display = "none";
    document.getElementById('flagArea').style.display = "flex";

    let selector = 0;
    let reccords = []
    let trydone = 0;
    let trymax = 2;

    document.getElementById('flagIMG').src = data.findElementByPath(dataSet[selector].id).flag;

    document.querySelectorAll('.mainButton').forEach((e) => {
        e.addEventListener('click',()=>{
            if(util.checkDiff(document.getElementById('autoNaming').value,nameList[selector]) <= 1){
                if (trydone == 0){
                    document.getElementById('selectNameActionBar').style.display = 'none';
                    document.getElementById('showAnswer').style.display = 'flex';
                    reccords.push({"name":nameList[selector],"num":selector,"score":"GOOD"})
                    document.querySelectorAll('.errorTextArea').forEach((e)=>{e.style.setProperty('color', "var(--green-color)"); e.innerText = nameList[selector]});
                    //Style
                    document.getElementById('answerField').style.backgroundColor = 'var(--green-background)';
                    document.getElementById('answerField').style.borderColor = 'var(--green-outside)';
                    document.getElementById('answerIcon').setAttribute("d","m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z")
                } else {
                    document.getElementById('selectNameActionBar').style.display = 'none';
                    document.getElementById('showAnswer').style.display = 'flex';
                    reccords.push({"name":nameList[selector],"num":selector,"score":"MISS"})
                    document.querySelectorAll('.errorTextArea').forEach((e)=>{e.style.setProperty('color', "var(--orange-color)"); e.innerText = nameList[selector]});
                    //Style
                    document.getElementById('answerField').style.backgroundColor = 'var(--orange-background)';
                    document.getElementById('answerField').style.borderColor = 'var(--orange-outside)';
                    document.getElementById('answerIcon').setAttribute("d","M106-386q-6-6-6-14t6-14q6-6 14-6t14 6q6 6 6 14t-6 14q-6 6-14 6t-14-6Zm0-160q-6-6-6-14t6-14q6-6 14-6t14 6q6 6 6 14t-6 14q-6 6-14 6t-14-6Zm105.5 334.5Q200-223 200-240t11.5-28.5Q223-280 240-280t28.5 11.5Q280-257 280-240t-11.5 28.5Q257-200 240-200t-28.5-11.5Zm0-160Q200-383 200-400t11.5-28.5Q223-440 240-440t28.5 11.5Q280-417 280-400t-11.5 28.5Q257-360 240-360t-28.5-11.5Zm0-160Q200-543 200-560t11.5-28.5Q223-600 240-600t28.5 11.5Q280-577 280-560t-11.5 28.5Q257-520 240-520t-28.5-11.5Zm0-160Q200-703 200-720t11.5-28.5Q223-760 240-760t28.5 11.5Q280-737 280-720t-11.5 28.5Q257-680 240-680t-28.5-11.5Zm146 334Q340-375 340-400t17.5-42.5Q375-460 400-460t42.5 17.5Q460-425 460-400t-17.5 42.5Q425-340 400-340t-42.5-17.5Zm0-160Q340-535 340-560t17.5-42.5Q375-620 400-620t42.5 17.5Q460-585 460-560t-17.5 42.5Q425-500 400-500t-42.5-17.5Zm14 306Q360-223 360-240t11.5-28.5Q383-280 400-280t28.5 11.5Q440-257 440-240t-11.5 28.5Q417-200 400-200t-28.5-11.5Zm0-480Q360-703 360-720t11.5-28.5Q383-760 400-760t28.5 11.5Q440-737 440-720t-11.5 28.5Q417-680 400-680t-28.5-11.5ZM386-106q-6-6-6-14t6-14q6-6 14-6t14 6q6 6 6 14t-6 14q-6 6-14 6t-14-6Zm0-720q-6-6-6-14t6-14q6-6 14-6t14 6q6 6 6 14t-6 14q-6 6-14 6t-14-6Zm131.5 468.5Q500-375 500-400t17.5-42.5Q535-460 560-460t42.5 17.5Q620-425 620-400t-17.5 42.5Q585-340 560-340t-42.5-17.5Zm0-160Q500-535 500-560t17.5-42.5Q535-620 560-620t42.5 17.5Q620-585 620-560t-17.5 42.5Q585-500 560-500t-42.5-17.5Zm14 306Q520-223 520-240t11.5-28.5Q543-280 560-280t28.5 11.5Q600-257 600-240t-11.5 28.5Q577-200 560-200t-28.5-11.5Zm0-480Q520-703 520-720t11.5-28.5Q543-760 560-760t28.5 11.5Q600-737 600-720t-11.5 28.5Q577-680 560-680t-28.5-11.5ZM546-106q-6-6-6-14t6-14q6-6 14-6t14 6q6 6 6 14t-6 14q-6 6-14 6t-14-6Zm0-720q-6-6-6-14t6-14q6-6 14-6t14 6q6 6 6 14t-6 14q-6 6-14 6t-14-6Zm145.5 614.5Q680-223 680-240t11.5-28.5Q703-280 720-280t28.5 11.5Q760-257 760-240t-11.5 28.5Q737-200 720-200t-28.5-11.5Zm0-160Q680-383 680-400t11.5-28.5Q703-440 720-440t28.5 11.5Q760-417 760-400t-11.5 28.5Q737-360 720-360t-28.5-11.5Zm0-160Q680-543 680-560t11.5-28.5Q703-600 720-600t28.5 11.5Q760-577 760-560t-11.5 28.5Q737-520 720-520t-28.5-11.5Zm0-160Q680-703 680-720t11.5-28.5Q703-760 720-760t28.5 11.5Q760-737 760-720t-11.5 28.5Q737-680 720-680t-28.5-11.5ZM826-386q-6-6-6-14t6-14q6-6 14-6t14 6q6 6 6 14t-6 14q-6 6-14 6t-14-6Zm0-160q-6-6-6-14t6-14q6-6 14-6t14 6q6 6 6 14t-6 14q-6 6-14 6t-14-6Z")
                }
            }else {
                trydone++;
                if(trydone < trymax){
                    document.querySelectorAll('.errorTextArea').forEach((e)=>{e.style.setProperty('color', "var(--orange-color)"); e.innerText = (tryTrad + " " +(trymax-trydone))});
                    return
                } else{
                    document.getElementById('nameFlagEntity').innerText = nameList[selector]
                    document.getElementById('nameFlagEntity').style.display = "block"
                    document.getElementById('selectNameActionBar').style.display = 'none';
                    document.getElementById('showAnswer').style.display = 'flex';
                    reccords.push({"name":nameList[selector],"num":selector,"score":"FAIL"})
                    document.querySelectorAll('.errorTextArea').forEach((e)=>{e.style.setProperty('color', "var(--red-color)"); e.innerText = nameList[selector]});
                    //Style
                    document.getElementById('answerField').style.backgroundColor = 'var(--red-background)';
                    document.getElementById('answerField').style.borderColor = 'var(--red-outside)';
                    document.getElementById('answerIcon').setAttribute("d","M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z")
                }
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    ui.progress.update(selector + 1);
                });
            });
        })
    })

    document.querySelectorAll('.skipBtn').forEach((e) => {
        e.addEventListener('click',()=>{
            reccords.push({"name":nameList[selector],"num":selector,"score":"SKIP"})
            document.getElementById('selectNameActionBar').style.display = 'none';
            document.getElementById('nameFlagEntity').innerText = nameList[selector]
            document.getElementById('nameFlagEntity').style.display = "block"
            document.getElementById('showAnswer').style.display = 'flex';
            document.getElementById('answerField').style.backgroundColor = 'var(--card-background-color)';
            document.getElementById('answerField').style.borderColor = 'var(--header-top-color)';
            document.getElementById('answerIcon').setAttribute("d","M100-315v-330q0-18 12-29t28-11q5 0 11 1t11 5l248 166q9 6 13.5 14.5T428-480q0 10-4.5 18.5T410-447L162-281q-5 4-11 5t-11 1q-16 0-28-11t-12-29Zm400 0v-330q0-18 12-29t28-11q5 0 11 1t11 5l248 166q9 6 13.5 14.5T828-480q0 10-4.5 18.5T810-447L562-281q-5 4-11 5t-11 1q-16 0-28-11t-12-29ZM180-480Zm400 0Zm-400 90 136-90-136-90v180Zm400 0 136-90-136-90v180Z")
            
            document.querySelectorAll('.errorTextArea').forEach((e)=>{e.style.setProperty('color', "var(--text-color)"); e.innerText = nameList[selector]});
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    ui.progress.update(selector + 1);
                });
            });
          })
    })

    document.querySelectorAll('.continueBtn').forEach((e) => {
        e.addEventListener('click',()=>{
            document.getElementById('nameFlagEntity').style.display = "none"
            document.getElementById('selectNameActionBar').style.display = 'flex';
            document.getElementById('showAnswer').style.display = 'none';
            document.querySelectorAll('.errorTextArea').forEach((e)=>{e.style.setProperty('color', "var(--text-color)"); e.innerText = ""});
            //continue logic
            selector++;
            if(selector >= nameList.length){
                //Call the result here
                document.getElementById('selectNameActionBar').style.display= "none";
                document.getElementById('flagArea').style.display = "none";
                resultManager.show("fromFlag",reccords,dataSet)
                return
            }
            document.getElementById('flagIMG').src = data.findElementByPath(dataSet[selector].id).flag;
            document.getElementById('autoNaming').value = "";
            trydone = 0
        })
    })

}