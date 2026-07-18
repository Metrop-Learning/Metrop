//Import
import * as theme from './theme.js';
import * as ui from './ui.js';
import * as datalistHTML from './datalist.js';
import * as util from "../../asset/common.js";
import * as data from '../../asset/dataManager.js'
import * as placeCity from './renderer/placeCityManager.js'
import * as placeTerritory from './renderer/placeTerritoriesManager.js'
import * as guessTerritory from './renderer/guessFromPosiTerritory.js'
import * as shadowTerritory from './renderer/shadowTerritory.js'
import * as guessCity from './renderer/guessCityManager.js'
import * as fromFlag from './renderer/fromFlagManager.js'
import * as geojson from './geojson.js'

//Get the info
const params = new URLSearchParams(window.location.search);
const quizListId = params.get("quizListId");
const quizId = params.get("quizId");
export const type = params.get("type");

export let langSys = "fr"

let normalQuit = true;

if(["place", "placeTerritory"].includes(type)){
    document.getElementById('simpleActionBar').style.display= "flex";
} else if (["guess", "shadowTerritory", "guessFromPosiTerritory","fromFlag"].includes(type)){
    document.getElementById('selectNameActionBar').style.display= "flex";
} else if (["lessonCity", "lessonTerritories", "lessonFlag"].includes(type)){
    document.getElementById('lessonActionBar').style.display= "flex";
}

export const config = {
    isTerritoryLock(){
        //To do
        return false
    }
}

//=======================//
//     Quiz list init    //
//=======================//

let quiz;

try{
   quiz = await data.getQuizList.getAQuiz(quizListId,quizId)
   if (!quiz.type.includes(type)){
        throw "error"
   }
   if (typeof(quiz.cardInfo.lang) == String){
        if(quiz.cardInfo.lang.toLowerCase() != langSys){
            throw "error"
        }
   } else {
        if(!quiz.cardInfo.lang.includes(langSys) && !quiz.cardInfo.lang.includes(langSys.toUpperCase())){
            throw "error"
        }   
   }
} catch {
    document.getElementById('actionBar').style.display= "none";
    document.getElementById('mapArea').style.display= "none";
    document.getElementById('errorInfo').style.display= "flex";
}

ui.progress.set(quiz.list.length)

console.info("Quiz used : '" + quiz.cardInfo.Title+"'")

let quizListElement = util.shuffle(quiz.list)

export let nameList = await data.use.nameList(quizListElement)

if(type == "place"){
    placeCity.init(quizListElement,nameList)
}

if (type === "placeTerritory") {
    placeTerritory.init(quizListElement,nameList)
}

if (type === "fromFlag") {
    fromFlag.init(quizListElement,nameList)
}

if (type === "guessFromPosiTerritory") {
    guessTerritory.init(quizListElement,nameList)
}

if (type === "shadowTerritory") {
    shadowTerritory.init(quizListElement,nameList)
}

if (type === "guess") {
    guessCity.init(quizListElement,nameList)
}

//=======================//
//  Listener Management  //
//=======================//

window.addEventListener('beforeunload', function (e) {
      if(normalQuit == false){
      const message = "Do you really want to quit this page ?";
      
      e.preventDefault();
      e.returnValue = message; // Chrome, Edge
      return message; // Firefox
    }
});

document.querySelectorAll('.homeBtn').forEach((e) => {
    e.addEventListener('click',()=>{
        if(confirm("Do you want to quit ?")){
            normalQuit = true
            window.location.assign('../')
        }
    })
})

document.querySelectorAll('.reportBtn').forEach((e) => {
    e.addEventListener('click',()=>{
        alert("Report is not available yet")
    })
})

datalistHTML.autocomplete(document.getElementById("autoNaming"), nameList);