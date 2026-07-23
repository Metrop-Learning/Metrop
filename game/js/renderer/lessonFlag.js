import * as util from "../../../asset/common.js";
import * as data from '../../../asset/dataManager.js'
import * as ui from '../ui.js';

export function init(dataSet, nameList){
    document.getElementById('mapArea').style.display = "none";
    document.getElementById('flagArea').style.display = "flex";

    ui.progress.update(0);

    let selector = 0

    document.getElementById('flagIMG').src = data.findElementByPath(dataSet[selector].id).flag;
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
            document.getElementById('flagIMG').src = data.findElementByPath(dataSet[selector].id).flag;
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
                    document.getElementById('flagIMG').src = data.findElementByPath(dataSet[selector].id).flag;
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