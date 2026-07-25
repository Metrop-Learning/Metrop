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