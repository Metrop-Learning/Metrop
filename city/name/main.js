import '../quiz/Megacity.js';
import { listCityDefault } from '../quiz/Megacity.js';
let listCity = listCityDefault;
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

//init
let playable = true
let score = []

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
        foundedCity.push(listCity[i].name);
        if (!isNaN(foundedCity.length) && foundedCity.length >= 0 && foundedCity.length <= document.getElementById('prgs').max) {
          document.getElementById('prgs').value = foundedCity.length;
        }
        return
      }
    }
    document.getElementById('errorText').style.color = "rgb(241, 109, 109)"
    document.getElementById('errorText').innerHTML = "Nom invalide"
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