export const progress = {
    update(nb){
        document.querySelectorAll('.progressLine').forEach((e)=>{e.style.setProperty('--percent', nb)});
    },
    set(nb){
        document.querySelectorAll('.progressLine').forEach((e)=>{e.style.setProperty('--total', nb)});
    }
}