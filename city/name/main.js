const params = new URLSearchParams(window.location.search);
const jsonName = params.get("json");
console.log(jsonName)

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

const data = await loadJSON();
let listCity = data.listCity;
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
        document.getElementById('info').style.color = '#000000ff'
        document.getElementById('map').style.backgroundColor = '#ffffffff'
        document.body.style.backgroundColor = '#ffffffff'
}

// *******************
// *random city order*
// *******************

localStorage.setItem("CITY",JSON.stringify(listCity))

if (!isNaN(listCity.length - 1) && (listCity.length - 1) > 0) {
        document.getElementById('prgs').max = (listCity.length - 1);
}
if (!isNaN(0) && 0 >= 0 && 0 <= document.getElementById('prgs').max) {
    document.getElementById('prgs').value = 0;
}

document.getElementById("back").disabled = false;

//init
let loseStrick = 0;

function back() {
  window.location.replace("../../");
}
document.getElementById("back").addEventListener("click", () => {
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

function textVerified(){
    let input = document.getElementById('nameArea').value;
    for(let i = 0; i <= listCity.length-1;i++){
      let error_margin = checkDiff(input,listCity[i].name)
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
        lastInt = []
        indexInt++;
        loseStrick = 0;
        foundedCity.push(listCity[i].name);
        if (!isNaN(foundedCity.length) && foundedCity.length >= 0 && foundedCity.length <= document.getElementById('prgs').max) {
          document.getElementById('prgs').value = foundedCity.length;
        }
        if(document.getElementById('prgs').max == document.getElementById('prgs').value){
          document.getElementById('back').disabled = true;
          document.getElementById('continue').disabled = true;
        }
        return
      }
    }
    document.getElementById('errorText').style.color = "rgb(241, 109, 109)"
    document.getElementById('errorText').innerHTML = "Nom invalide"
    loseStrick++;
    if(loseStrick % 3 == 0){
      intmaker();
    }
    return
}

function checkDiff(str1,str2){
  if(!str1 || !str2) return
  let a = str1.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  let b = str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,     
        dp[i][j - 1] + 1,     
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}

let intCityList = shuffle(data.listCity);
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

function shuffle(list) {
  const arr = [...list]; 
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
    if(checkDiff(divised[i],rng) == 0){
        lastInt[i] = divised[i];
      }
  }


  let returnedInt = ""
  for(let i = 0; i < lastInt.length; i++){
      returnedInt += lastInt[i] + " "
  }
  return returnedInt
}