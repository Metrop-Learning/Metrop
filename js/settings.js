import * as main from "../index.js"


export function init(){
    document.getElementById('selectLang').value = main.langSys

    document.getElementById('selectLang').addEventListener("change",(e)=>{
        if(confirm("Change language to : " + e.target.value +" ?\nThe page will reload.")){
            localStorage.setItem("LANG_SYS",e.target.value)
            window.location.reload()
        } else{
            e.target.value = main.langSys
        }
    })   

    const savedIndex = localStorage.getItem('SETTINGS_UNITS_SYSTEM') ?? "M.i.s";
    let idSaveIndex;
    if(savedIndex == "US.c.u"){
        idSaveIndex = 1
    } else {
        idSaveIndex = 0
    }

    const radios = document.querySelectorAll('#unitSelector input[name="units"]');
    const targetRadio = radios[parseInt(idSaveIndex, 10)];
  
    if (targetRadio) {
        targetRadio.checked = true;
    }

    const selector = document.getElementById('unitSelector');

    selector.addEventListener('change', (event) => {
        if (event.target.name === 'units') {
            const radios = Array.from(selector.querySelectorAll('input[name="units"]'));
            const selectedIndex = radios.indexOf(event.target);
            let idSelectedIndex;
            if(selectedIndex == 1){
                idSelectedIndex = "US.c.u"
            } else {
                idSelectedIndex = "M.i.s"
            }
            localStorage.setItem('SETTINGS_UNITS_SYSTEM', idSelectedIndex);
        }
    });

    document.querySelectorAll('.settings-line .switch').forEach((switchEl) => {
    const setId = switchEl.getAttribute('settings_id');
    const setDef = switchEl.getAttribute('default_settings_value') === 'true';

    const savedValue = localStorage.getItem(setId);

    if (savedValue === null) {
        switchEl.checked = setDef;
    } else {
        switchEl.checked = (savedValue === 'true');
    }
    switchEl.addEventListener('change', (event) => {
        localStorage.setItem(setId, event.target.checked);
    });
});
}