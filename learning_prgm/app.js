const params = new URLSearchParams(window.location.search);
const jsonName = params.get("json");
console.log(jsonName)
let progress = parseInt(localStorage.getItem(jsonName + "_learn"))
progress = Number.isInteger(progress) ? progress : 0;
localStorage.setItem(jsonName + "_learn",progress)


async function loadJSON() {
    try {
        const response = await fetch(`../city/quiz/${jsonName}`);
        const data = await response.json();
        console.log("Contenu reçu:", data);
        return data;
    } catch (e) {
        console.error("Erreur:", e);
    }
}

const data = await loadJSON();

document.getElementById('name_learn').innerText = data.cardInfo.Title;

let learningPath = data.learning
document.getElementById('learningList').innerHTML = "";
for(let i = 0; i < learningPath.length; i++){
    let div;
    if ('type' in learningPath[i]) {
        //LESSON
        if(data.learning[i].type == "lesson"){
            div = document.createElement('button');
            div.className = 'card';
            div.onclick = () => {
                lessonIt(jsonName,i)
            };
            if(progress > i && !window.matchMedia('(prefers-color-scheme: dark)').matches){
                div.style.backgroundColor = 'rgba(109, 241, 118, 1)'
            }
            else if(progress > i){
                div.style.backgroundColor = 'rgba(64, 146, 69, 1)'
            }
            else if(progress < i){
                div.disabled = "true";
            }
            div.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M186.67-79.33q-27 0-46.84-19.84Q120-119 120-146v-667.33q0-27 19.83-46.84Q159.67-880 186.67-880h506.66q27 0 46.84 19.83Q760-840.33 760-813.33V-530q0 14.17-9.62 23.75-9.61 9.58-23.83 9.58-14.22 0-23.72-9.58-9.5-9.58-9.5-23.75v-283.33H468v249q0 9.4-8.33 14.53-8.34 5.13-17-.2l-72-44-72 44q-8.67 5.33-17 .2-8.34-5.13-8.34-14.53v-249h-86.66V-146h244.66q14.17 0 23.75 9.62 9.59 9.61 9.59 23.83 0 14.22-9.59 23.72-9.58 9.5-23.75 9.5H186.67ZM725.33-40q-81.66 0-138.16-56.5t-56.5-138.17q0-81.66 56.5-138.16t138.16-56.5q81.67 0 138.17 56.5 56.5 56.5 56.5 138.16Q920-153 863.5-96.5 807-40 725.33-40Zm-23.66-116.33 100.66-64q8-5 8-14.17t-8-14.5l-100.66-64q-8.67-5.33-17.17-.79-8.5 4.54-8.5 14.46V-170q0 9.91 8.5 14.46 8.5 4.54 17.17-.79Zm-425-657H471.33 276.67Zm-90 667.33v-667.33 263.96V-594v44.63-263.96V-146Z"/></svg>'
        }
        //Place
        if(data.learning[i].type == "placeCity"){
            div = document.createElement('button');
            div.className = 'card';
            div.onclick = () => {
                placeOnMap(jsonName,i)
            };
            if(progress > i && !window.matchMedia('(prefers-color-scheme: dark)').matches){
                div.style.backgroundColor = 'rgba(109, 241, 118, 1)'
            }
            else if(progress > i){
                div.style.backgroundColor = 'rgba(64, 146, 69, 1)'
            }
            else if(progress < i){
                div.disabled = "true";
            }
            div.innerHTML += '<svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M480-80q-106 0-173-31.83-67-31.84-67-81.5 0-21 13.17-39.34 13.16-18.33 38.16-33 12-6.66 25.17-4Q329.67-267 336.33-255q6.67 12 3.84 25.17-2.84 13.16-14.84 19.83-5.33 4-10 8.33-4.66 4.34-8.66 8.34 15.66 18.66 67 32.66 51.33 14 106.33 14t106.33-14q51.34-14 67-32.66-4-4-8.66-8.34-4.67-4.33-10-8.33-12-6.67-14.84-19.83Q617-243 623.67-255q6.66-12 19.83-14.67 13.17-2.66 25.17 4 25 14.67 38.16 33Q720-214.33 720-193.33q0 49.66-67 81.5Q586-80 480-80Zm1-203.33q105.67-78.34 159-158.17 53.33-79.83 53.33-152.5 0-108.67-69-164T480-813.33q-74.67 0-144 55.33t-69.33 164q0 71 53 147.83 53 76.84 161.33 162.84Zm-1 67.66q-10 0-20-3.33t-18.67-10Q320-325 260-415.83 200-506.67 200-594q0-71 25.5-124.5t65.83-89.5q40.34-36 90-54Q431-880 480-880t99 18q50 18 90 54t65.5 89.5Q760-665 760-594q0 87.33-60 178.17Q640-325 518-229q-8.67 6.67-18.33 10-9.67 3.33-19.67 3.33ZM480-520q33 0 56.5-23.5T560-600q0-33-23.5-56.5T480-680q-33 0-56.5 23.5T400-600q0 33 23.5 56.5T480-520Zm0-80Z"/></svg>';
        }
        if(data.learning[i].type == "name"){
            div = document.createElement('button');
            div.className = 'card';
            div.onclick = () => {
                nameIt(jsonName,i)
            };
            if(progress > i && !window.matchMedia('(prefers-color-scheme: dark)').matches){
                div.style.backgroundColor = 'rgba(109, 241, 118, 1)'
            }
            else if(progress > i){
                div.style.backgroundColor = 'rgba(64, 146, 69, 1)'
            }
            else if(progress < i){
                div.disabled = "true";
            }
            div.innerHTML += '<svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M551.67-472.33q81-56.67 127-124.84 46-68.16 46-136.83 0-38.67-12.84-59Q699-813.33 677-813.33q-53.67 0-92.33 83.16Q546-647 546-537q0 18 1.17 34.17 1.16 16.16 4.5 30.5ZM150-306q-9.67 9.67-23.33 9.67-13.67 0-23.34-9.67-9.66-9.67-9.66-23.33 0-13.67 9.66-23.34L144-393.33 103.33-434q-9.66-9.67-9.66-23.33 0-13.67 9.66-23.34 9.67-9.66 23.34-9.66 13.66 0 23.33 9.66L190.67-440l40.66-40.67q9.67-9.66 23.34-9.66 13.66 0 23.33 9.66 9.67 9.67 9.67 23.34 0 13.66-9.67 23.33l-40.67 40.67L278-352.67q9.67 9.67 9.67 23.34 0 13.66-9.67 23.33-9.67 9.67-23.33 9.67-13.67 0-23.34-9.67l-40.66-40.67L150-306Zm468-14q-31.33 0-56.67-13.17Q536-346.33 518-373q-18 10-36.67 18.67-18.66 8.66-37.66 17.33-13.34 5.67-25.84.5T400-355q-5.33-13.33.83-26 6.17-12.67 19.5-18.33 19-8 36.67-16.5t34-17.84q-6.33-22.66-9.17-49Q479-509 479-539q0-145.33 56-243.17Q591-880 677-880q51.33 0 82.67 40.17Q791-799.67 791-730.67q0 87.34-56.5 171.34t-157.5 151q9 11 19.5 16.5t22.5 5.5q27 0 58-23t59-65.34q8.67-12 21.5-16.16 12.83-4.17 25.83 1.5 13 6.66 20 19.5 7 12.83 4.67 27.83-2 14-1.67 27.67.34 13.66 2.67 28.33 7.67-4 16.17-9.83 8.5-5.84 17.5-13.5 10.66-9 24.5-10.5 13.83-1.5 24.83 7.16 11.33 9 12.33 23t-8.66 23q-22.34 21.67-46.5 34.17Q825-320 803.33-320q-23 0-38.5-15.5T743.67-381Q715-351.33 683-335.67 651-320 618-320ZM153.33-120q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.34 0 23.84 9.5t9.5 23.84q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5Zm163.34 0q-14.34 0-23.84-9.5t-9.5-23.83q0-14.34 9.5-23.84t23.84-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5ZM480-120q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5Zm163.33 0q-14.33 0-23.83-9.5-9.5-9.5-9.5-23.83 0-14.34 9.5-23.84t23.83-9.5q14.34 0 23.84 9.5t9.5 23.84q0 14.33-9.5 23.83-9.5 9.5-23.84 9.5Zm163.34 0q-14.34 0-23.84-9.5t-9.5-23.83q0-14.34 9.5-23.84t23.84-9.5q14.33 0 23.83 9.5 9.5 9.5 9.5 23.84 0 14.33-9.5 23.83-9.5 9.5-23.83 9.5Z"/></svg>';
        }
        if(data.learning[i].type == "guessFromPosi"){
            div = document.createElement('button');
            div.className = 'card';
            div.onclick = () => {
                guessIt(jsonName,i)
            };
            if(progress > i && !window.matchMedia('(prefers-color-scheme: dark)').matches){
                div.style.backgroundColor = 'rgba(109, 241, 118, 1)'
            }
            else if(progress > i){
                div.style.backgroundColor = 'rgba(64, 146, 69, 1)'
            }
            else if(progress < i){
                div.disabled = "true";
            }
            div.innerHTML += '<svg style="fill: currentColor;" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M264-199q21-19.33 46.83-46.83 25.84-27.5 48.84-58.84 23-31.33 39-63.97t16-62.69q0-67.89-42.38-112.28Q329.92-588 264-588q-65.92 0-108.29 44.4-42.38 44.4-42.38 112.3 0 30.3 16 62.8t39 63.83q23 31.34 48.84 58.84Q243-218.33 264-199ZM106.67-80q-11.34 0-19-7.67-7.67-7.66-7.67-19 0-11.33 7.67-19 7.66-7.66 19-7.66h130Q208-160 173-196t-65-78q-26-37.33-43.67-77-17.66-39.67-17.66-80.43 0-95.12 62.33-159.18t155-64.06q92.67 0 155 64.06t62.33 159.18q0 40.76-17.66 80.43Q446-311.33 420-274q-30 42.67-65.33 78.67-35.34 36-64 62h562.66q11.34 0 19 7.66 7.67 7.67 7.67 19 0 11.34-7.67 19-7.66 7.67-19 7.67H106.67ZM604-594.67Zm-10.67 315.34q-8.66 0-15.66-3.84-7-3.83-12.34-11.83L531-349q-8.33-13.33-4-26t14.67-20.33q10.33-7.67 23.16-6.84 12.84.84 21.84 15.17l6.66 11.33L619-416.33q5-7.67 12.34-11.67 7.35-4 16.33-4h165.66v-381.33h-422v52q0 14.16-9.58 23.75Q372.17-728 358-728q-14 0-23.67-9.83-9.66-9.84-9.66-23.5v-52q0-27 19.83-46.84Q364.33-880 391.33-880h422q27 0 46.84 19.83Q880-840.33 880-813.33V-432q0 27-19.83 46.83-19.84 19.84-46.84 19.84H665.67l-44.34 70.66Q616-286.67 609-283t-15.67 3.67ZM264-372.67q28.61 0 48.64-20.02 20.03-20.03 20.03-48.64t-20.03-48.64Q292.61-510 264-510t-48.64 20.03q-20.03 20.03-20.03 48.64t20.03 48.64q20.03 20.02 48.64 20.02Zm0-68.66Zm340-124.34 63.67 39q5.33 2.67 10.16-.44 4.84-3.11 2.84-8.56l-17.34-73 57.34-49.66Q725-662 723-667t-7.67-6l-74.82-6.39L611-748.67q-2-5.33-7.33-5.33-5.34 0-7.34 5.33l-29.51 69.28L492-673q-5.67 1-7.67 6t2.34 8.67L544-608.67l-17.33 73q-2 5.45 2.83 8.56 4.83 3.11 10.17.44l64.33-39Z"/></svg>';
        }
        //HEADER
        if(data.learning[i].type == "header"){
            div = document.createElement('div');
            div.className = 'cardName';
            if(progress == i){
                localStorage.setItem(jsonName + "_learn",i + 1)
                progress += 1
            }
            if(progress < i){
                div.style.backgroundColor = "#6464641c"
            }
            div.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M226.67-80q-27 0-46.84-19.83Q160-119.67 160-146.67v-666.66q0-27 19.83-46.84Q199.67-880 226.67-880h506.66q27 0 46.84 19.83Q800-840.33 800-813.33v666.66q0 27-19.83 46.84Q760.33-80 733.33-80H226.67Zm0-66.67h506.66v-666.66h-66.66V-571q0 9.33-8.34 14.17-8.33 4.83-17 .16L585-590q-8.06-4.67-16.53-4.67T552-590l-56.33 33.33q-8.67 4.67-16.84-.16-8.16-4.84-8.16-14.17v-242.33h-244v666.66Zm0 0v-666.66 666.66Zm244-424.33q0 9.33 8.16 14.17 8.17 4.83 16.84.16L552-590q8.07-4.67 16.53-4.67 8.47 0 17.14 4.67l55.66 33.33q8.67 4.67 17-.16 8.34-4.84 8.34-14.17 0 10.26-8.34 14.96-8.33 4.71-17-.63L585-589.33q-8.06-5.34-16.53-5.34T552-589.33l-56.33 32.66q-8.67 5.34-16.84.63-8.16-4.7-8.16-14.96Z"/></svg>'
        }
        if(data.learning[i].type == "end"){
            div = document.createElement('div');
            div.className = 'cardName';
            div.style.marginRight = "50px";
            if(progress == i && !window.matchMedia('(prefers-color-scheme: dark)').matches){
                div.style.backgroundColor = "#ff9900ff"
            }
            else if(progress == i){
                //div.style.backgroundColor = "#ad6800ff"
            }
            div.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M380-733.33h66.67V-800H380v66.67Zm133.33 0V-800H580v66.67h-66.67ZM380-466.67v-66.66h66.67v66.66H380ZM646.67-600v-66.67h66.66V-600h-66.66Zm0 133.33v-66.66h66.66v66.66h-66.66Zm-133.34 0v-66.66H580v66.66h-66.67Zm133.34-266.66V-800h66.66v66.67h-66.66Zm-200 66.66v-66.66h66.66v66.66h-66.66ZM279.88-160q-14.21 0-23.71-9.58-9.5-9.59-9.5-23.75v-573.34q0-14.16 9.61-23.75 9.62-9.58 23.84-9.58 14.21 0 23.78 9.58 9.56 9.59 9.56 23.75v33.34H380v66.66h-66.67V-600H380v66.67h-66.67v340q0 14.16-9.61 23.75-9.62 9.58-23.84 9.58ZM580-533.33V-600h66.67v66.67H580Zm-133.33 0V-600h66.66v66.67h-66.66ZM380-600v-66.67h66.67V-600H380Zm133.33 0v-66.67H580V-600h-66.67ZM580-666.67v-66.66h66.67v66.66H580Z"/></svg>'
        }
    } else {
        console.error('METROP DATA API\n---\nNEEDED DATA MISSING (FATAL ERROR) : "type"\nIN : '+ jsonName +' under "learning" properties \n---\ntype are needed to choose a card type.\nThis is a Fatal Error.\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', learningPath[i]);
        break
    }
    if ('name' in learningPath[i]) {
        const p = document.createElement('p');
        p.textContent = data.learning[i].name;
        div.appendChild(p);
    } else {
        console.warn('METROP DATA API\n---\nDATA MISSING : "name"\nIN : '+ jsonName +' under "learning" properties \n---\nname are not needed but recomended. The name will be "No Name".\n---\nDocumentation : https://github.com/Metrop-Learning/Metrop/blob/main/documentaion/data.md\n---', learningPath[i]);
    }
    document.getElementById('learningList').appendChild(div);
}

const slider = document.querySelector('.quizList');

let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
  isDown = true;
  slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
  isDown = false;
});

slider.addEventListener('mouseup', () => {
  isDown = false;
});

slider.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5; // vitesse du défilement
  slider.scrollLeft = scrollLeft - walk;
});