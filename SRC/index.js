// Archivo index.js con estilo corporativo actualizado para tarjetas

const apiGob = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/";
const container = document.getElementById("container");

// IDs de municipios que quieres consultar
const municipios = ["717", "732"];

// Orden deseado de logos
const ordenLogos = [
  "MERCOENERGY",
  "BALLENOIL",
  "TIERRASGORDAS",
  "PETROCAR",
  "SAD. COOP. VEGAS BAJAS",
  "EXPLOTACIONES GASOAL SL"
];
const ultimas = ["CEPSA", "REPSOL"];

async function getPetrolStations() {
  container.innerHTML = "";

  let gasofas = [];

  for (let id of municipios) {
    let API = apiGob + id;
    let res = await fetch(API);
    let data = await res.json();
    let gasolineras = data.ListaEESSPrecio;

    gasolineras.forEach((gasolinera) => {
      let price = gasolinera["Precio Gasolina 95 E5"];
      let priceGasolinaPlus = gasolinera["Precio Gasolina 95 E5 Premium"];
      let direction = gasolinera["Dirección"];
      let priceDiesel = gasolinera["Precio Gasoleo A"];
      let priceDieselPlus = gasolinera["Precio Gasoleo Premium"];
      let priceAdBlue = gasolinera["Precio Adblue"];
      let logo = gasolinera["Rótulo"];
      let localidad = gasolinera["Localidad"];

      if (
        price == "" &&
        priceGasolinaPlus == "" &&
        priceDiesel == "" &&
        priceDieselPlus == "" &&
        priceAdBlue == ""
      ) {
        return;
      }

      let obj = {
        price: parseFloat(price.replace(/,/g, ".")) || null,
        priceGasolinaPlus: parseFloat(priceGasolinaPlus.replace(/,/g, ".")) || null,
        direction: direction,
        priceDiesel: parseFloat(priceDiesel.replace(/,/g, ".")) || null,
        priceDieselPlus: parseFloat(priceDieselPlus.replace(/,/g, ".")) || null,
        priceAdBlue: parseFloat(priceAdBlue.replace(/,/g, ".")) || null,
        logo: logo,
        localidad: localidad,
      };

      gasofas.push(obj);
    });
  }

  // Ordenar personalizadamente
  gasofas.sort((a, b) => {
    const idxA = ordenLogos.indexOf(a.logo);
    const idxB = ordenLogos.indexOf(b.logo);

    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;

    if (ultimas.includes(a.logo) && ultimas.includes(b.logo)) {
      return ultimas.indexOf(a.logo) - ultimas.indexOf(b.logo);
    }
    if (ultimas.includes(a.logo)) return 1;
    if (ultimas.includes(b.logo)) return -1;

    return 0;
  });

  gasofas.forEach((gasolinera) => {
    let card = document.createElement("div");
    const precios = [];

    if (gasolinera.price)
      precios.push(`<span class="font-semibold text-xl text-green-700">Gasolina 95: <span class="font-bold">${gasolinera.price} €/L</span></span>`);
    if (gasolinera.priceGasolinaPlus)
      precios.push(`<span class="font-semibold text-xl text-green-700">Gasolina 95+: <span class="font-bold">${gasolinera.priceGasolinaPlus} €/L</span></span>`);
    if (gasolinera.priceDiesel)
      precios.push(`<span class="font-semibold text-xl text-gray-700">Gasóleo A: <span class="font-bold">${gasolinera.priceDiesel} €/L</span></span>`);
    if (gasolinera.priceDieselPlus)
      precios.push(`<span class="font-semibold text-xl text-gray-700">Gasóleo A+: <span class="font-bold">${gasolinera.priceDieselPlus} €/L</span></span>`);
    if (gasolinera.priceAdBlue)
      precios.push(`<span class="font-semibold text-xl text-blue-600">AdBlue: <span class="font-bold">${gasolinera.priceAdBlue} €/L</span></span>`);

    // Estilo corporativo general
    card.classList.add(
      "p-6",
      "rounded-xl",
      "shadow-md",
      "hover:shadow-xl",
      "transition",
      "duration-300",
      "border",
      "bg-white",
      "space-y-3"
    );

    // Estilo especial para MERCOENERGY
    if (gasolinera.logo === "MERCOENERGY") {
      card.classList.add(
        "border-green-600",
        "shadow-2xl",
        "bg-green-50",
        "ring-2",
        "ring-green-400"
      );
    } else {
      card.classList.add(
        "border-gray-200",
        "hover:border-green-400"
      );
    }

    card.innerHTML = `
      <div class="flex flex-col items-center mb-2 text-center">
        <h2 class="font-bold text-2xl text-green-700">${gasolinera.logo}</h2>
        <h3 class="text-gray-600 text-xl italic">${gasolinera.localidad}</h3>
        <p class="text-gray-500 text-sm">${gasolinera.direction}</p>
      </div>

      <div class="flex flex-col items-start space-y-1 w-full text-sm">
        ${precios.join("")}
      </div>
    `;

    container.appendChild(card);
  });
}

getPetrolStations();