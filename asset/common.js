export function shuffle(list) {
  const arr = [...list]; 
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function checkDiff(str1, str2) {
  if (!str1 || !str2) return;
  let a = str1
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ \-\_\(\)\/\\\[\]\{\}',.;:!><=\+]/g, "")
    .toLowerCase();
  let b = str2
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ \-\_\(\)\/\\\[\]\{\}',.;:!><=\+]/g, "")
    .toLowerCase();
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function distKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateDifficultyThresholds(cityList) {
    if (!cityList || cityList.length < 3) {
        return { x: 10, y: 30 }; 
    }
    const getCoords = (city) => {
        const lat = Number(city.lat ?? 0);
        const lon = Number(city.lng ?? city.lon ?? city.longitude ?? 0);
        return { lat, lon };
    };

    const localDistances = [];
    cityList.forEach((cityA) => {
        const allDistances = [];
        const coordsA = getCoords(cityA);

        cityList.forEach((cityB) => {
            if (cityA !== cityB) {
                const coordsB = getCoords(cityB);
                const distance = distKm(coordsA.lat, coordsA.lon, coordsB.lat, coordsB.lon);
                
                if (!isNaN(distance)) {
                    allDistances.push(distance);
                }
            }
        });

        if (allDistances.length < 2) return;

        allDistances.sort((a, b) => a - b);
        const average2Closest = (allDistances[0] + allDistances[1]) / 2;
        
        cityA.proximityDistance = average2Closest;
        localDistances.push(average2Closest);
    });

    if (localDistances.length === 0) {
        return { x: 10, y: 30 };
    }
    localDistances.sort((a, b) => a - b);
    const middleIndex = Math.floor(localDistances.length / 2);
    const globalMedian = localDistances[middleIndex];
    
    const isolationThreshold = globalMedian * 2.5;
    const validCities = cityList.filter(city => city.proximityDistance <= isolationThreshold);
    const citiesForCalculation = validCities.length > 0 ? validCities : cityList;
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    citiesForCalculation.forEach(city => {
        const coords = getCoords(city);
        if (coords.lat < minLat) minLat = coords.lat;
        if (coords.lat > maxLat) maxLat = coords.lat;
        if (coords.lon < minLon) minLon = coords.lon;
        if (coords.lon > maxLon) maxLon = coords.lon;
    });
    const zoneDiagonal = distKm(minLat, minLon, maxLat, maxLon);
    const goodDistance = zoneDiagonal * 0.02;
    const missDistance = zoneDiagonal * 0.06;
    cityList.forEach(city => delete city.proximityDistance);

    return {
        x: isNaN(goodDistance) ? 10 : Math.round(goodDistance * 10) / 10,
        y: isNaN(missDistance) ? 30 : Math.round(missDistance * 10) / 10
    };
}

export function getDistShow(km){
    if(km < 10){
      return Math.floor(km * 1000).toLocaleString('fr-FR') + " m"
    } else {
      return Math.floor(km).toLocaleString('fr-FR') + " km"
    }
}

export const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];