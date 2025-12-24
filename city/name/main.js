import * as util from "../asset/common.js"
const params = new URLSearchParams(window.location.search);
const jsonName = params.get("json");
const learningID = parseInt(params.get("learningID"));
const returned = params.get("return");
const posi = parseInt(localStorage.getItem(jsonName + "_learn"))
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

let normalQuit = true;

window.addEventListener('beforeunload', function (e) {
      if(normalQuit == false){
        // The modern browser 
      const message = "Êtes-vous sûr de vouloir quitter cette page ?";
      
      e.preventDefault();
      e.returnValue = message; // Chrome, Edge
      return message; // Firefox
    }
});

let miss = 0
let fail = 0
let good = 0 

const data = await loadJSON();
let listCity;
if(learningID == -1){
  listCity = data.listCity;
}
else if(data.learning[learningID].listID == "auto"){
  let lastHeader = -1
  for(let i = 0; i <= learningID;i++){
    if(data.learning[i].listID && data.learning[i].listID != "auto"){
      lastHeader = i
    }
  }
  if(lastHeader == -1) throw "Metrop Error : No list city";
  listCity = data.listCity.filter(item => data.learning[lastHeader].listID.includes(item.name));
  console.log(lastHeader)
}
else{
  listCity = data.listCity.filter(item => data.learning[learningID].listID.includes(item.name));
  console.log(listCity)
}
let foundedCity = []

// ****************************
// *Dark/Light mode + map load*
// ****************************
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    document.getElementById('menu').style.color = '#ffffff'
    document.getElementById('map').style.backgroundColor = '#000000ff'
    document.body.style.backgroundColor = '#1a1a1aff'
} else {
        document.getElementById('menu').style.color = '#000000ff'
        document.getElementById('map').style.backgroundColor = '#ffffffff'
        document.body.style.backgroundColor = '#ffffffff'
}

// *******************
// *random city order*
// *******************

localStorage.setItem("CITY",JSON.stringify(listCity))

if (!isNaN(listCity.length) && (listCity.length) > 0) {
        document.getElementById('prgs').max = (listCity.length);
}
if (!isNaN(0) && 0 >= 0 && 0 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = 0;
}

document.getElementById("back").disabled = false;

//init
let loseStrick = 0;

function back() {
  const params = new URLSearchParams({
      json: jsonName
  });
  normalQuit = true
  window.location.replace(returned + "/index.html?" + params);
}

document.getElementById("back").addEventListener("click", () => {
  back();
});

document.getElementById("continue").addEventListener("click", () => {
  if(miss / (fail + miss + good) < 0.1 && fail == 0 && posi == learningID){
          localStorage.setItem(jsonName + "_learn",posi+1)
  }
  back();
});

document.getElementById('nameArea').addEventListener('blur', function() {
    textVerified()
});

document.getElementById('nameArea').addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    document.getElementById('nameArea').blur();
  }
});
let lastInput = ""

function textVerified(){
    let input = document.getElementById('nameArea').value;
    if(input.replace(/\s+/g, '').trim() == ''){
      document.getElementById("nameArea").value = ''
      return
    }
    if(util.checkDiff(input, lastInput) == 0){
        document.getElementById("errorText").style.color = "rgb(241, 186, 109)";
        document.getElementById("errorText").innerHTML = "Cette entrée est trop proche de la dernière et n’est donc pas comptabilisée."
        return
      }
      lastInput = input
    for(let i = 0; i <= listCity.length-1;i++){
      let error_margin = util.checkDiff(input,listCity[i].name)
      if(error_margin <= 1){
        console.log(i + "\n" + listCity[i].name)
        for(let j = 0; j <= foundedCity.length-1;j++){
          if(foundedCity[j] == listCity[i].name){
            document.getElementById('errorText').style.color = "rgb(241, 186, 109)"
            document.getElementById('errorText').innerHTML = "Tu as déja trouvée : " + listCity[i].name
            return
          }
        }
        document.getElementById('errorText').style.color = "rgb(241, 186, 109)"
        if(error_margin == 0){
          document.getElementById('errorText').style.color = "rgba(109, 241, 118, 1)"
        }
        document.getElementById('errorText').innerHTML = "Tu as trouvée : " + listCity[i].name
        document.getElementById('intArea').style.visibility = 'hidden'
        if(loseStrick >=1){
          miss++;
        }
        else{
          good++
        }
        lastInt = []
        indexInt++;
        loseStrick = 0;
        normalQuit = false
        document.getElementById("nameArea").value = "";
        foundedCity.push(listCity[i].name);
        if (!isNaN(foundedCity.length) && foundedCity.length >= 0 && foundedCity.length <= document.getElementById('prgs').max) {
          document.getElementById('prgs').value = foundedCity.length;
        }
        if(document.getElementById('prgs').max == document.getElementById('prgs').value){
          document.getElementById('back').disabled = true;
          document.getElementById('continue').disabled = false;
        }
        return
      }
    }
    document.getElementById('errorText').style.color = "rgb(241, 109, 109)"
    document.getElementById('errorText').innerHTML = "Nom invalide"
    loseStrick++;
    if(loseStrick % 2 == 0 && loseStrick <= 6){
      intmaker();
    }
    else if(loseStrick >= 6){
      console.log("(failed)\n" + intCityList[indexInt].name)
      document.getElementById('errorText').style.color = "rgb(241, 109, 109)"
      document.getElementById('errorText').innerHTML = "Tu n'as pas trouvée : " + intCityList[indexInt].name
      document.getElementById('intArea').style.visibility = 'hidden'
      fail++;
      lastInt = []
      indexInt++;
      loseStrick = 0;
      document.getElementById("nameArea").value = "";
      foundedCity.push(intCityList[indexInt].name);
      if (!isNaN(foundedCity.length) && foundedCity.length >= 0 && foundedCity.length <= document.getElementById('prgs').max) {
        document.getElementById('prgs').value = foundedCity.length;
      }
      if(document.getElementById('prgs').max == document.getElementById('prgs').value){
        document.getElementById('back').disabled = true;
        document.getElementById('continue').disabled = false;
      }
      return
    }
    return
}


let intCityList = util.shuffle(data.listCity);
let indexInt = 0


function intmaker(){
  let choosenInt = intCityList[indexInt]; 
  while (searchFounded(choosenInt) == true){
    if(indexInt >= intCityList.length){
      document.getElementById('intArea').style.visibility = 'hidden';
      return
    }
    choosenInt = intCityList[indexInt]
  }
  document.getElementById('intField').innerText = intDisplay(choosenInt.name);
  document.getElementById('intArea').style.visibility = 'visible';
}

function searchFounded(a){
  for(let i = 0;i < foundedCity.length; i++){
    if(a == foundedCity[i]){
      return true
    }
  }
  return false
}

let lastInt = [];

function intDisplay(str){
  let divised = str.split("");
  //init
  if(lastInt.length == 0){
    for(let i = 0; i < divised.length; i++){
      lastInt.push("_")
    }
  }
  //continue
  let alpha = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
  let rng =  alpha[Math.floor(Math.random() * alpha.length)];
  let noEternal = 50
  while (!str.normalize("NFD").toLowerCase().includes(rng) || lastInt.join("").normalize("NFD").toLowerCase().includes(rng)){
    rng =  alpha[Math.floor(Math.random() * alpha.length)];
    noEternal--
    if(noEternal <= 0){
      break
    }
  }

  let checkDifAfter = lastInt;
  for(let i = 0; i < divised.length; i++){
    console.log(rng)  
    if(util.checkDiff(divised[i],rng) == 0){
        lastInt[i] = divised[i];
      }
  }


  let returnedInt = ""
  for(let i = 0; i < lastInt.length; i++){
      returnedInt += lastInt[i] + " "
  }
  return returnedInt
}