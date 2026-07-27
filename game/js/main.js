//Import
import * as theme from './theme.js';
import * as ui from './ui.js';
import * as datalistHTML from './datalist.js';
import * as util from "../../asset/common.js";
import * as data from '../../asset/dataManager.js'
import * as placeCity from './renderer/placeCityManager.js'
import * as placeTerritory from './renderer/placeTerritoriesManager.js'
import * as guessTerritory from './renderer/guessFromPosiTerritory.js'
import * as name from './renderer/nameManager.js'
import * as shadowTerritory from './renderer/shadowTerritory.js'
import * as guessCity from './renderer/guessCityManager.js'
import * as fromFlag from './renderer/fromFlagManager.js'
import * as lessonFlag from "./renderer/lessonFlag.js"
import * as lessonCity from "./renderer/lessonCity.js"
import * as lessonTerritory from "./renderer/lessonTerritory.js"
import * as geojson from './geojson.js'
import * as trad from "../../trad/trad.js"
import * as population from "./renderer/populationGame.js"


document.querySelectorAll('.homeBtn').forEach((e) => {
    e.addEventListener('click',()=>{
        if(confirm("Do you want to quit ?")){
            normalQuit = true
            window.location.assign('../')
        }
    })
})

//Get the info
const params = new URLSearchParams(window.location.search);
const quizListId = params.get("quizListId") ?? "none" ;
const quizId = params.get("quizId") ?? "none";
export const type = params.get("type");

export const langSys = localStorage.getItem("LANG_SYS") ?? "fr"

await trad.traductAll("../trad/",langSys)

let normalQuit = true;

if(["place", "placeTerritory"].includes(type)){
    document.getElementById('simpleActionBar').style.display= "flex";
} else if (["guess", "shadowTerritory", "guessFromPosiTerritory","fromFlag","name"].includes(type)){
    document.getElementById('selectNameActionBar').style.display= "flex";
} else if (["lessonCity", "lessonTerritories", "lessonFlag"].includes(type)){
    document.getElementById('lessonActionBar').style.display= "flex";
} else if(type == "populationGame"){
    document.getElementById('mapArea').style.display = "none"
}

export const config = {
    isTerritoryLock(){
        //To do
        if(localStorage.getItem("GAME_SETTINGS_TERRITORY_LOCK") == "false"){
            return false
        }
        return true
    }
}

//=======================//
//     Quiz list init    //
//=======================//

export let nameList

if(type == "populationGame"){
    let bundle = data.createPopulationBundle()
    bundle = util.shuffle(bundle)
    population.init(bundle)
} 
else {
let quiz;

try{
   quiz = await data.getQuizList.getAQuiz(quizListId,quizId)
   if (!quiz.type.includes(type)){
        if(type != "name"){
            if(type == "lessonCity" && !(quiz.type.includes("place") || quiz.type.includes("guess"))){
                throw "error"
            }
            else if(type == "lessonTerritory" && !(quiz.type.includes("placeTerritory") || quiz.type.includes("shadowTerritory") || quiz.type.includes("guessFromPosiTerritory"))){
                throw "error"
            } else if(type == "lessonFlag" && !(quiz.type.includes("fromFlag") || quiz.type.includes("fromName"))){
                throw "error"
            } else if(!["lessonCity","lessonTerritory","lessonFlag"].includes(type)) {
                throw "error"
            }
        }
        
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

nameList = await data.use.nameList(quizListElement)

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

if (type === "name") {
    name.init(nameList)
}

if (type === "lessonFlag") {
    lessonFlag.init(quizListElement,nameList)
}

if (type === "lessonCity") {
    lessonCity.init(quizListElement,nameList)
}

if (type === "lessonTerritory") {
    lessonTerritory.init(quizListElement,nameList)
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

document.querySelectorAll('.reportBtn').forEach((e) => {
    e.addEventListener('click',()=>{
        alert("Report is not available yet")
    })
})

if(type != "name"){
    datalistHTML.autocomplete(document.getElementById("autoNaming"), nameList);
}


}