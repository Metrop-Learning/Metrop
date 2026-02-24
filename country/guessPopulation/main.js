import dataBorder from '../boundary.json' with { type: "json" };

let countryList = []
let alreadyChoosenCouuntry = []

function getCountry(){
  for(let element in dataBorder){
    for (let country in dataBorder[element].get){
      if("population" in dataBorder[element].get[country] && "namefr" in dataBorder[element].get[country] && "flag" in dataBorder[element].get[country]){
        countryList.push(dataBorder[element].get[country])
      }
    }
  }
  console.log(countryList)
}

getCountry()

let end = false
let actual = countryList[Math.floor(Math.random() * countryList.length)];
alreadyChoosenCouuntry.push(actual)
function game(){
    document.querySelectorAll('.counter').forEach(el => el.style.display = "none");
    document.querySelectorAll('.counter').forEach(el => el.innerText = 0);
    allowed = true
    document.getElementById('scoremsg').innerText = "Score"
    document.getElementById('cont').disabled = true;
    document.getElementById('a').style.backgroundColor = "rgb(8, 8, 8)"
    document.getElementById('b').style.backgroundColor = "rgb(8, 8, 8)"
    let choosen = countryList[Math.floor(Math.random() * countryList.length)];
    while(alreadyChoosenCouuntry.some(obj => obj.namefr === choosen.namefr)){
      choosen = countryList[Math.floor(Math.random() * countryList.length)];
    }
    alreadyChoosenCouuntry.push(choosen)
    document.getElementById('imgA').src = actual.flag
    document.getElementById('TA').innerText = actual.namefr
    document.getElementById('1c').dataset.target = actual.population.replace(/[\s\u00A0\u202F]/g, '');
    document.getElementById('imgB').src = choosen.flag
    document.getElementById('TB').innerText = choosen.namefr
    document.getElementById('2c').dataset.target = choosen.population.replace(/[\s\u00A0\u202F]/g, '');
    if(countryList.length == alreadyChoosenCouuntry.length){
      end = true
      return
    }
    actual = countryList[Math.floor(Math.random() * countryList.length)];
    while(alreadyChoosenCouuntry.some(obj => obj.namefr === actual.namefr)){
      actual = countryList[Math.floor(Math.random() * countryList.length)];
    }
    alreadyChoosenCouuntry.push(actual)
    if(countryList.length == alreadyChoosenCouuntry.length){
      end = true
      return
    }
}





function formatNumber(n) {
  return Math.floor(n).toLocaleString('fr-FR');
}

function animateCounter(el, duration = 3000) {
  const target = +el.dataset.target;
  const start = 10;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    const value = start + (target - start) * eased;

    el.textContent = formatNumber(value);

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = formatNumber(target);
  }

  requestAnimationFrame(update);
}




let allowed = true
let score = 0;

document.getElementById("a").addEventListener("click", () => {
  if(allowed){
    allowed = false
    document.querySelectorAll('.counter').forEach(el => el.style.display = "block");
    setTimeout(()=>{
        document.querySelectorAll('.counter').forEach(el => animateCounter(el, 6500));
        setTimeout(()=>{
            if(parseInt(document.getElementById('1c').dataset.target.replace(/[\s\u00A0\u202F]/g, '')) >= parseInt(document.getElementById('2c').dataset.target.replace(/[\s\u00A0\u202F]/g, ''))){
                document.getElementById('a').style.backgroundColor = "rgb(8, 80, 30)"
                document.getElementById('b').style.backgroundColor = "rgb(137, 40, 33)"
                score++;
                document.getElementById('score').innerText = score
                document.getElementById('scoremsg').innerText = "Victoire !"
                document.getElementById('cont').disabled = false;
            }
            else{
                document.getElementById('b').style.backgroundColor = "rgb(8, 80, 30)"
                document.getElementById('a').style.backgroundColor = "rgb(137, 40, 33)"
                document.getElementById('scoremsg').innerText = "Score : " + document.getElementById('score').innerText
                document.getElementById('score').innerText = "Perdu !"
            }
        },7000)
    },500)
  }
});


document.getElementById("b").addEventListener("click", () => {
  if(allowed){
    allowed = false
    document.querySelectorAll('.counter').forEach(el => el.style.display = "block");
    setTimeout(()=>{
        document.querySelectorAll('.counter').forEach(el => animateCounter(el, 6500));
        setTimeout(()=>{
            if(parseInt(document.getElementById('2c').dataset.target.replace(/[\s\u00A0\u202F]/g, '')) >= parseInt(document.getElementById('1c').dataset.target.replace(/[\s\u00A0\u202F]/g, ''))){
                document.getElementById('b').style.backgroundColor = "rgb(8, 80, 30)"
                document.getElementById('a').style.backgroundColor = "rgb(137, 40, 33)"
                score++;
                document.getElementById('score').innerText = score
                document.getElementById('scoremsg').innerText = "Victoire !"
                document.getElementById('cont').disabled = false;
            }
            else{
                document.getElementById('a').style.backgroundColor = "rgb(8, 80, 30)"
                document.getElementById('b').style.backgroundColor = "rgb(137, 40, 33)"
                document.getElementById('scoremsg').innerText = "Score : " + document.getElementById('score').innerText
                document.getElementById('score').innerText = "Perdu !"
            }
        },7000)
    },500)
  }
});


document.getElementById("cont").addEventListener("click", () => {
  game()
});

game()