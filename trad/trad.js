export async function traductAll(path,codeLang){
    const response = await fetch(path + "trad_" + codeLang + ".json");
    const trad_file = await response.json();
    //spécial translation
    document.getElementById('searchInput').placeholder = trad_file["id-search-placeholder"]
    //all translation :
    const trad_el = document.querySelectorAll('*[trad-i18n]');
    trad_el.forEach(el => {
      el.innerText = trad_file[el.getAttribute('trad-i18n')]
    });
}