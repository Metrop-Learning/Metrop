import * as util from "../../../asset/common.js";
import * as ui from '../ui.js';
import * as resultManager from "../result.js";

export function init(nameList){
    document.getElementById('mapArea').style.display = "none";
    document.getElementById('flagArea').style.display = "none";
    document.getElementById('guessNameArea').style.display = "flex";

    ui.progress.update(0);

    document.getElementById("guessNameArea").innerHTML = ""

    const intSVG = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M491-339q70 0 119-45t49-109q0-57-36.5-96.5T534-629q-47 0-79.5 30T422-525q0 19 6.5 37.5T451-455q16 14 32 11.5t26-13.5q10-11 11.5-26.5T508-512q-2-2-4-5t-2-7q0-11 9-17.5t23-6.5q20 0 33 16.5t13 39.5q0 31-25.5 52.5T492-418q-47 0-79.5-38T380-549q0-19 4.5-37t13.5-34q8-15 8-31.5T394-680q-12-12-29-11.5T339-677q-20 28-30 60t-10 67q0 88 56 149.5T491-339ZM280-80q-17 0-28.5-11.5T240-120v-132q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v40q0 17-11.5 28.5T560-80H280Z"/></svg>'

    let statutList = []

    for(let i = 0; i < nameList.length; i++){
        statutList.push("none")
        document.getElementById("guessNameArea").insertAdjacentHTML('beforeend', 
                        '<div class="guessNameElement" id="nameID'+i+'"><span class="guessNameText">?</span><span class="guessNameHint"></span><span class="guessNameResult"></span></div>'
        );
    }
    document.querySelector('#nameID'+0+" .guessNameResult").innerHTML = intSVG

    statutList[0] = "hint"
    let selector = 0
    let trydone = 0
    let trymax = 3
    let done = 0
    let hint = []
    let reccords = []

    document.querySelectorAll('.mainButton').forEach((e) => {
        e.addEventListener('click',()=>{
            let getOne = false
            let theOnes = []
            let newStatus = []
            const userEntry = document.getElementById('autoNaming').value
            if(userEntry.trim() == ""){
                document.getElementById('autoNaming').value = ""
                return
            }
            for(let i = 0; i < nameList.length; i++){
                if(statutList[i] != "hint" && statutList[i] != "none"){
                    continue
                }
                let scoreDif = util.checkDiff(userEntry,nameList[i])
                if(scoreDif < 2){
                    getOne = true
                    theOnes.push(i)
                    if(trydone == 0 && (hint.length == 0 || i != selector)){  
                        newStatus.push("good")
                    } else {
                        newStatus.push("miss")
                    }
                }
            }
            //detect fail
            if(getOne){
                trydone = 0
                document.getElementById('autoNaming').value = ""
            } else if (trydone >= trymax){
                theOnes.push(selector)
                newStatus.push("fail")
                trydone = 0
            } else {
                trydone++;
                //hint
                if(trydone == 1){
                    hint = Array(nameList[selector].length).fill("_");
                } else {
                    let letter = util.choose(nameList[selector])
                    while(hint.includes(letter)){
                        letter = util.choose(nameList[selector])
                    }
                    for (let i = 0; i < hint.length; i++) {
                        if(nameList[selector][i] == letter){
                            hint[i] = letter
                        }
                    }
                }
                document.querySelector('#nameID'+selector+" .guessNameHint").innerText = hint.join("")
            }
            //apply the selector
            if(theOnes.includes(selector)){
                hint = []
                document.querySelector('#nameID'+selector+" .guessNameHint").innerHTML = ""
                for(let i = selector + 1; i < nameList.length; i++){
                    if(statutList[i] == "none" && !theOnes.includes(i)){
                        selector = i
                        statutList[i] = "hint"
                        document.querySelector('#nameID'+i+" .guessNameResult").innerHTML = intSVG
                        break
                    }
                }
            }
            //apply the icons
            for(let i = 0; i < newStatus.length; i++){
                done++
                ui.progress.update(done)
                if(newStatus[i] == "good"){
                    statutList[theOnes[i]] = "good"
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameText").innerText = nameList[theOnes[i]]
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameResult").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>'
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameResult").style.color = "var(--green-color)"
                    reccords.push({"name":nameList[theOnes[i]],"num":theOnes[i],"score":"GOOD"})
                } else if(newStatus[i] == "miss"){
                    statutList[theOnes[i]] = "miss"
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameText").innerText = nameList[theOnes[i]]
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameResult").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5Zm0-160Q520-463 520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440q17 0 28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>'
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameResult").style.color = "var(--orange-color)"
                    reccords.push({"name":nameList[theOnes[i]],"num":theOnes[i],"score":"MISS"})
                } else if(newStatus[i] == "fail"){
                    statutList[theOnes[i]] = "fail"
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameText").innerText = nameList[theOnes[i]]
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameResult").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-424 116 116q11 11 28 11t28-11q11-11 11-28t-11-28L536-480l116-116q11-11 11-28t-11-28q-11-11-28-11t-28 11L480-536 364-652q-11-11-28-11t-28 11q-11 11-11 28t11 28l116 116-116 116q-11 11-11 28t11 28q11 11 28 11t28-11l116-116Zm0 344q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>'
                    document.querySelector('#nameID'+theOnes[i]+" .guessNameResult").style.color = "var(--red-color)"
                    reccords.push({"name":nameList[theOnes[i]],"num":theOnes[i],"score":"FAIL"})
                }
            }
            let end = true
            for(let i = 0; i < nameList.length; i++){
                if(statutList[i] == "hint"){
                    end = false
                }
            }
            if(end){
                resultManager.show("name",reccords)
            }
        })
    })
    document.querySelectorAll('.skipBtn').forEach((e) => {
            e.addEventListener('click',()=>{
                    if (trydone >= trymax){
                        hint = []
                        document.querySelector('#nameID'+selector+" .guessNameHint").innerHTML = ""
                        trydone = 0
                        document.querySelector('#nameID'+selector+" .guessNameText").innerText = nameList[selector]
                        document.querySelector('#nameID'+selector+" .guessNameResult").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path fill="currentColor" d="M100-315v-330q0-18 12-29t28-11q5 0 11 1t11 5l248 166q9 6 13.5 14.5T428-480q0 10-4.5 18.5T410-447L162-281q-5 4-11 5t-11 1q-16 0-28-11t-12-29Zm400 0v-330q0-18 12-29t28-11q5 0 11 1t11 5l248 166q9 6 13.5 14.5T828-480q0 10-4.5 18.5T810-447L562-281q-5 4-11 5t-11 1q-16 0-28-11t-12-29ZM180-480Zm400 0Zm-400 90 136-90-136-90v180Zm400 0 136-90-136-90v180Z"></path></svg>'
                        statutList[selector] = "pass"
                        reccords.push({"name":nameList[selector],"num":selector,"score":"PASS"})
                        for(let i = selector + 1; i < nameList.length; i++){
                            if(statutList[i] == "none"){
                                selector = i
                                statutList[i] = "hint"
                                document.querySelector('#nameID'+i+" .guessNameResult").innerHTML = intSVG
                                break
                            }
                        }
                        done++
                        ui.progress.update(done)
                        let end = true
                        for(let i = 0; i < nameList.length; i++){
                            if(statutList[i] == "hint"){
                                end = false
                            }
                        }
                        if(end){
                            resultManager.show("name",reccords)
                        }
                    } else {
                        trydone++;
                        //hint
                        if(trydone == 1){
                            hint = Array(nameList[selector].length).fill("_");
                        } else {
                            let letter = util.choose(nameList[selector])
                            while(hint.includes(letter)){
                                letter = util.choose(nameList[selector])
                            }
                            for (let i = 0; i < hint.length; i++) {
                                if(nameList[selector][i] == letter){
                                    hint[i] = letter
                                }
                            }
                        }
                        document.querySelector('#nameID'+selector+" .guessNameHint").innerText = hint.join("")
                    }
              })
    })
}