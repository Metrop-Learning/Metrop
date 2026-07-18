//the following code is from : https://www.w3schools.com/howto/howto_js_autocomplete.asp

import * as utils from "../../asset/common.js"

function cleanString(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ \-\_\(\)\/\\\[\]\{\}',.;:!><=\+]/g, "")
    .toLowerCase();
}

export function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;

  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;

      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);

      // Sorting system
      let matches = [];
      const valClean = cleanString(val);

      for (i = 0; i < arr.length; i++) {
        const country = arr[i];
        const countryClean = cleanString(country);
        
        if (countryClean.startsWith(valClean)) {
          matches.push({ country: country, score: 0 });
        } 
        else if (countryClean.includes(valClean)) {
          matches.push({ country: country, score: 1 });
        } 
        else {
          const diffScore = utils.checkDiff(val, country);
          
          const maxAllowedErrors = Math.ceil(countryClean.length * 0.25);
          
          if (diffScore <= maxAllowedErrors) {
            matches.push({ country: country, score: 2 + (diffScore / 10) }); 
          }
        }
      }

      matches.sort((x, y) => x.score - y.score);

      const maxSuggestions = Math.min(matches.length, 15);

      for (i = 0; i < maxSuggestions; i++) {
        const currentCountry = matches[i].country;
        b = document.createElement("DIV");

        const countryClean = cleanString(currentCountry);
        if (countryClean.startsWith(valClean)) {
          b.innerHTML = "<strong>" + currentCountry.substr(0, val.length) + "</strong>";
          b.innerHTML += currentCountry.substr(val.length);
        } else {
          b.innerHTML = currentCountry;
        }

        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.value = currentCountry;
        b.appendChild(hiddenInput);
        
        b.addEventListener("click", function(e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
        });
        a.appendChild(b);
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
          document.getElementById("autoNaming").blur();
        }
      } else if (e.keyCode == 27) { 
        document.getElementById("autoNaming").blur();
        closeAllLists();
      }

  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    const activeElement = x[currentFocus];
    activeElement.classList.add("autocomplete-active");

    activeElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
} 

