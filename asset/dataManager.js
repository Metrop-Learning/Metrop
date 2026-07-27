let geoDatabaseLink = localStorage.getItem("LINK_DATABASE_GEO") ?? "https://metrop-learning.github.io/metrop.geo.database/"
let quizDatabaseLink = localStorage.getItem("LINK_DATABASE_QUIZ") ?? "https://metrop-learning.github.io/metrop.quiz.database/" // JSON.stringify(['http...'])

const langSys = localStorage.getItem("LANG_SYS") ?? "fr"

let output = document.getElementById('output') ?? undefined
let outputNb = 0

export let quizdb = []
let geodb;
let listQuiz;

export let groupShowcase = [];

function initBoundaries(){

}

async function initQuizList(){
    try {
      listQuiz = JSON.parse(quizDatabaseLink);
    } catch (e) {
      listQuiz = [quizDatabaseLink];
    }
    for (let i = 0; i < listQuiz.length; i++){
        quizdb.push(await get("dbinfo.json",listQuiz[0]))
    }
}

async function initGeoDB(){
    geodb = await get("boundaries.json",geoDatabaseLink)
}

async function get(path, url=quizDatabaseLink){
    try {
        const response = await fetch(`${url}${path}`);
        const datat = await response.json();
        return datat;
    } catch (e) {
        console.error('METROP DATA API\n---\nIMPORT ERROR\nIN : '+ url + path +' \n---\n'+ e +'\n---\nDocumentation : https://metrop-learning.github.io/Tools-and-Documentation\n---')
    }
}

//function for the main menu
export const getQuizList = {
    name(nb){
        return quizdb[nb].NAME[langSys] ?? quizdb[nb].NAME.en ?? quizdb[nb].NAME.fr ?? "---"
    },
    id(nb){
        return quizdb[nb].ID
    },
    async getAQuiz(nb,num){
        return await get(quizdb[nb].QUIZ_LIST[num],listQuiz[nb] + "content/");
    }
}

export function getAllQuizInfo() {
    const promises = [];
    for (let i = 0; i < quizdb.length; i++) {
        groupShowcase.push({})
        for (let j = 0; j < quizdb[i].QUIZ_LIST.length; j++) {
            const promise = getQuizList.getAQuiz(i, j).then(quiz => {
                if("group" in quiz.cardInfo){
                    for(let y = 0; y < quiz.cardInfo.group.length; y++){
                        if(quiz.cardInfo.group[y] in groupShowcase[i]){
                            groupShowcase[i][quiz.cardInfo.group[y]].list.push([i,j])
                        }
                        else{
                            groupShowcase[i][quiz.cardInfo.group[y]] = {
                                list:[[i,j]]
                            }
                        }
                    }
                }
                return [quiz,i,j];
            });
            promises.push(promise);
        }
    }
    return Promise.all(promises);
}

export const use = {
    nameList(object){
        let list = []
        object.forEach(element => {
            if("name" in element){
                try{
                    list.push(element.name[langSys]);
                }
                catch{
                    return 1
                }
            } else {
                try{
                    let el = findElementByPath(element.id).name[langSys]
                    list.push(el)
                } catch {
                    return 1
                }
            }
        });
        return list
    },
    geojson(object,type="normal"){
        let list = []
        object.forEach(element => {
            if("id" in element){
                try{
                    let el = findElementByPath(element.id)
                    if("shadowContent" in el && type == "shadow"){
                        list.push(el.shadowContent);
                    }else{
                        list.push(el.content);
                    }
                }
                catch{
                    return 1
                }
            } else {
                return 1
            }
        });
        return list
    },
    geo: {
        ver(){
            return geodb["DB:INFO"].VER
        },
        api(){
            return geodb["DB:INFO"].API_VER
        },
        date(){
            return geodb["DB:INFO"].DATE
        },
        id(){
            return geodb["DB:INFO"].ID
        },
        name(){
            return geodb["DB:INFO"].NAME[langSys] ?? geodb["DB:INFO"].NAME["en"]
        },
        license(){
            if(typeof geodb["DB:INFO"].LICENSE == "string"){
                return [geodb["DB:INFO"].LICENSE]
            } else {
                return geodb["DB:INFO"].LICENSE
            }
        },
        license_link(){
            return geodb["DB:INFO"].LICENSE_LINK
        }
    }
}

export async function getGeojson(link,type="normal") {
    const parts = link.split(':');

    if (parts[0] === "useInstead" && parts[1] === "Circle") {
        
        const lat = Number(parts[2]);
        const lng = Number(parts[3]);
        const radiusKm = parts[4] ? Number(parts[4]) : 20;

        const points = 64;
        const coordinates = [];
        
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;

            const dx = (radiusKm / 6371) * Math.sin(angle);
            const dy = (radiusKm / 6371) * Math.cos(angle);

            const pointLng = lng + (dx / Math.cos(lat * Math.PI / 180)) * (180 / Math.PI);
            const pointLat = lat + dy * (180 / Math.PI);

            coordinates.push([pointLng, pointLat]);
        }
        coordinates.push(coordinates[0]);

        return {
            type: "Feature",
            properties: { 
                isCircle: true
            },
            geometry: {
                type: "Polygon",
                coordinates: [coordinates]
            }
        };
    } else if (parts[0] === "useInstead" && parts[1] === "OSMB") {
        let tlink = geoDatabaseLink + "boundaries/" + parts[2];
        
        const response = await fetch(tlink);
        let raw = await response.json(); 
        
        const geojson = raw.data || raw;
        return geojson;

    } else {
        // Wikipédia / Wikimedia Commons
        let tlink = "https://commons.wikimedia.org/w/api.php?action=query&prop=revisions&titles=" + encodeURIComponent(link) + "&rvprop=content&rvslots=main&format=json&origin=*";
        
        const response = await fetch(tlink);
        const data = await response.json();
        
        const page = Object.values(data.query.pages)[0];
        if (!page || !page.revisions) {
            throw new Error("Imposible to get the wikipedia ressource");
        }

        let raw = page.revisions[0].slots.main["*"];
        raw = JSON.parse(raw);
        
        const geojson = raw.data || raw;
        return geojson;
    }
}

await initGeoDB()
await initQuizList()

export function findElementByPath(fullCodeString) {
  if(!fullCodeString){
    return null
  }
  let current = geodb;
  const codeSegments = fullCodeString.split("-").filter(Boolean);

  for (const code of codeSegments) {
    if (current && current[code]) {
      current = current[code];
    } else if (current && current.get && current.get[code]) {
      current = current.get[code];
    } else {
      return 1;
    }
  }
  if("link" in current){
    return findElementByPath(current.link)
  }
  return current;
}



export function createPopulationBundle(containers = "all") {
  const results = [];

  const technicalKeys = new Set([
    "get",
    "name",
    "population",
    "flag"
  ]);

  const filters =
    containers === "all"
      ? null
      : Array.isArray(containers)
        ? containers
        : [containers];
  function traverse(node, path = []) {
    if (!node || typeof node !== "object") return;

    if (node.population !== undefined && node.name) {
      const code = path.join("-");
      const level = path.length;

      let matches = false;

      if (filters === null) {
        matches = level === 2;
      } else {

        matches = filters.some(filter => {
  const child = code.startsWith(filter + "-");

  return child;
});
      }

      if (matches) {
        const name = node.name?.[langSys];

        if (name !== undefined) {
          results.push({
            name,
            population: node.population,
            flag: node.flag ?? null
          });
        }
      }
    }

    for (const key in node) {
  if (!Object.prototype.hasOwnProperty.call(node, key))
    continue;
  if (
    key === "name" ||
    key === "population" ||
    key === "flag"
  ) {
    continue;
  }
  if (key === "get") {

    traverse(node[key], path);
    continue;
  }

  traverse(node[key], [...path, key]);
}
  }

  traverse(geodb);

  return results;
}