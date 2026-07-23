export async function traductAll(path,codeLang){
    const response = await fetch(path + "trad_" + codeLang + ".json");
    const trad_file = await response.json();
    //spécial translation
    try{
      document.getElementById('searchInput').placeholder = trad_file["id-search-placeholder"]
      document.getElementById('mobileSearchInput').placeholder = trad_file["id-search-placeholder"]
    } catch{
      //nothing
    }
    //all translation :
    const trad_el = document.querySelectorAll('*[translation_id]');
    trad_el.forEach(el => {
      el.innerText = trad_file[el.getAttribute('translation_id')]
    });
}

export async function getTrad(path,codeLang,transId){
    const response = await fetch(path + "trad_" + codeLang + ".json");
    const trad_file = await response.json();
    //spécial translation
    return trad_file[transId]
}

export function lang(lang){
  if(["fr","en","jp","es","it"].includes(lang)){
    localStorage.setItem("LANG_SYS",lang)
    window.location.reload()
  } else {
    console.error("Not supported language")
  }
}

export function getLang(){
    console.log("Language nav: " + navigator.language)
    let supportedLangs = {
            "fr":"fr",
            "en":"en",
            "es":"es",
            "it":"it",
            "ja":"jp"
    }

    const primaryLang = navigator.language.split('-')[0].toLowerCase();
    if(primaryLang in supportedLangs){
        localStorage.setItem("LANG_SYS",supportedLangs[primaryLang])
        return supportedLangs[primaryLang]
    } else {
        localStorage.setItem("LANG_SYS","en")
        return "en"
    }
}

window.lang = lang