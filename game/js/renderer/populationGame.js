import * as ui from '../ui.js';
export async function init(bundle){
    ui.progress.set(bundle.length - 1)
    let selector = 0
    let allowed = true
    ui.progress.update(selector)
    document.querySelector('#populationGrid .score').innerText = 0
    function newturn(){
        allowed = true
        document.querySelectorAll('#populationGrid .down,.up').forEach((e)=>{
            e.classList.remove("disable-hover"); 
        })
        document.querySelector('#populationGrid .btnFail').style.display = "none"
        document.querySelector('#populationGrid .btnPC').style.display = "none"
        document.querySelector('#populationGrid .down').classList.remove('win')
        document.querySelector('#populationGrid .down').classList.remove('lose')
        document.querySelector('#populationGrid .up').classList.remove('win')
        document.querySelector('#populationGrid .up').classList.remove('lose')
        document.querySelector('#populationGrid .up .titleP').innerText = bundle[selector].name
        document.querySelector('#populationGrid .down .titleP').innerText = bundle[selector+1].name
        document.querySelector('#populationGrid .up .imgP').src = bundle[selector].flag
        document.querySelector('#populationGrid .down .imgP').src = bundle[selector+1].flag
        document.querySelectorAll('.counter').forEach(el => el.style.display = "none");
        document.querySelectorAll('.counter').forEach(el => el.innerText = 0);
        document.getElementById('1c').dataset.target = bundle[selector].population.replace(/[\s\u00A0\u202F]/g, '');
        document.getElementById('2c').dataset.target = bundle[selector+1].population.replace(/[\s\u00A0\u202F]/g, '');
    }

    newturn()

    document.querySelector('#populationGrid .btnPC').addEventListener('click',()=>{
        if(selector < bundle.length - 1){
            newturn()
        } else {
            window.location.assign("../")
        }
    })

    document.querySelector('#populationGrid .btnFail').addEventListener('click',()=>{
        window.location.assign("../")
    })
    
    document.querySelector('#populationGrid .up').addEventListener('click',()=>{
        if(!allowed){
            return
        }
        allowed = false
        document.querySelectorAll('#populationGrid .down, #populationGrid .up')
    .forEach(e => e.classList.add("disable-hover"));
        document.querySelectorAll('.counter').forEach(el => el.style.display = "block");
        document.querySelectorAll('.counter').forEach(el => animateCounter(el, 6500));
        setTimeout(()=>{
            const pop1 = Number(bundle[selector].population.replace(/[\s\u00A0\u202F]/g, ""));
            const pop2 = Number(bundle[selector + 1].population.replace(/[\s\u00A0\u202F]/g, ""));

            if (pop1 >= pop2) {
                selector++
                ui.progress.update(selector)
                document.querySelector('#populationGrid .score').innerText = selector
                document.querySelector('#populationGrid .btnPC').style.display = "flex"
                document.querySelector('#populationGrid .up').classList.add('win')
                document.querySelector('#populationGrid .down').classList.add('lose')
            } else {
                document.querySelector('#populationGrid .btnFail').style.display = "flex"
                document.querySelector('#populationGrid .up').classList.add('lose')
                document.querySelector('#populationGrid .down').classList.add('win')
            }
        },6500)
    })
    document.querySelector('#populationGrid .down').addEventListener('click',()=>{
        if(!allowed){
            return
        }
        allowed = false
        document.querySelectorAll('#populationGrid .down, #populationGrid .up')
    .forEach(e => e.classList.add("disable-hover"));
        document.querySelectorAll('.counter').forEach(el => el.style.display = "block");
        document.querySelectorAll('.counter').forEach(el => animateCounter(el, 6500));
        setTimeout(()=>{
            const pop1 = Number(bundle[selector].population.replace(/[\s\u00A0\u202F]/g, ""));
            const pop2 = Number(bundle[selector + 1].population.replace(/[\s\u00A0\u202F]/g, ""));

            if (pop2 >= pop1) {
                selector++
                ui.progress.update(selector)
                document.querySelector('#populationGrid .score').innerText = selector
                document.querySelector('#populationGrid .btnPC').style.display = "flex"
                document.querySelector('#populationGrid .down').classList.add('win')
                document.querySelector('#populationGrid .up').classList.add('lose')
            } else {
                document.querySelector('#populationGrid .btnFail').style.display = "flex"
                document.querySelector('#populationGrid .down').classList.add('lose')
                document.querySelector('#populationGrid .up').classList.add('win')
            }
        },6500)
    })
}

function formatNumber(n) {
  return Math.floor(n).toLocaleString('fr-FR');
}

async function animateCounter(el, duration = 3000) {
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
