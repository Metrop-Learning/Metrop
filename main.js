let base;
      if (window.location.hostname.includes("github.io")) {
        base = "/Metrop";
      } else {
        base = "";
      }
      function placeOnMap(jsonName) {
        const params = new URLSearchParams({
          json: jsonName,
          learningID: -1,
          return: base,
        });
        window.location.replace(`./city/place/index.html?${params.toString()}`);
      }
      function nameit(jsonName) {
        const params = new URLSearchParams({
          json: jsonName,
          learningID: -1,
          return: base,
        });
        window.location.replace(`./city/name/index.html?${params.toString()}`);
      }
      function guessIt(jsonName) {
        const params = new URLSearchParams({
          json: jsonName,
          learningID: -1,
          return: base,
        });
        window.location.replace(`./city/guess/index.html?${params.toString()}`);
      }
      function placeTerritoryIt(jsonName) {
        const params = new URLSearchParams({
          json: jsonName,
          learningID: -1,
          return: base,
        });
        window.location.replace(
          `./country/place/index.html?${params.toString()}`
        );
      }
      function fromPosiTerritory(jsonName) {
        const params = new URLSearchParams({
          json: jsonName,
          learningID: -1,
          return: base,
        });
        window.location.replace(
          `./country/fromPosi/index.html?${params.toString()}`
        );
      }
      function shadowTerritory(jsonName) {
        const params = new URLSearchParams({
          json: jsonName,
          learningID: -1,
          return: base,
        });
        window.location.replace(
          `./country/shadow/index.html?${params.toString()}`
        );
      }
      function learning(jsonName) {
        window.location.replace(`./learning_prgm/index.html?json=${jsonName}`);
      }
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.body.style.backgroundColor = "#1a1a1aff";
        document.body.style.color = "#ffffff";
      } else {
        document.body.style.backgroundColor = "#ffffffff";
        document.body.style.color = "#000000";
      }
      const dropZone = document.getElementById("drop-zone");