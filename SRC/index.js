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

      let priceParsed = parseFloat(price.replace(/,/g, ".")) || null;
      let priceGasolinaPlusParsed = parseFloat(priceGasolinaPlus.replace(/,/g, ".")) || null;
      let priceDieselParsed = parseFloat(priceDiesel.replace(/,/g, ".")) || null;
      let priceDieselPlusParsed = parseFloat(priceDieselPlus.replace(/,/g, ".")) || null;
      let priceAdBlueParsed = parseFloat(priceAdBlue.replace(/,/g, ".")) || null;

      let obj = {
        price: priceParsed,
        priceGasolinaPlus: priceGasolinaPlusParsed,
        direction: direction,
        priceDiesel: priceDieselParsed,
        priceDieselPlus: priceDieselPlusParsed,
        priceAdBlue: priceAdBlueParsed,
        logo: logo,
        localidad: localidad,
      };
      gasofas.push(obj);
    });
  }

  // Ordenar: primero los de ordenLogos, luego los que no están en ninguna lista, luego CEPSA y REPSOL
  gasofas.sort((a, b) => {
    const idxA = ordenLogos.indexOf(a.logo);
    const idxB = ordenLogos.indexOf(b.logo);

    const isUltimaA = ultimas.indexOf(a.logo);
    const isUltimaB = ultimas.indexOf(b.logo);

    // Si ambos están en ordenLogos
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    // Si solo a está en ordenLogos
    if (idxA !== -1) return -1;
    // Si solo b está en ordenLogos
    if (idxB !== -1) return 1;

    // Si ambos están en ultimas
    if (ultimas.includes(a.logo) && ultimas.includes(b.logo)) {
      return ultimas.indexOf(a.logo) - ultimas.indexOf(b.logo);
    }
    // Si solo a está en ultimas
    if (ultimas.includes(a.logo)) return 1;
    // Si solo b está en ultimas
    if (ultimas.includes(b.logo)) return -1;

    // Si ninguno está en ninguna lista, mantener el orden original
    return 0;
  });

  gasofas.forEach((gasolinera) => {
    let card = document.createElement("div");
    const precios = [];

    if (gasolinera.price)
      precios.push(`<span class="font-extrabold text-black">Gasolina 95: <span class="font-bold">${gasolinera.price} €/L&nbsp;</span></span>`);
    if (gasolinera.priceGasolinaPlus)
      precios.push(`<span class="font-extrabold text-black">Gasolina 95+: <span class="font-bold">${gasolinera.priceGasolinaPlus} €/L&nbsp;</span></span>`);
    if (gasolinera.priceDiesel)
      precios.push(`<span class="font-extrabold">Gasóleo A: <span class="font-bold">${gasolinera.priceDiesel} €/L&nbsp;</span></span>`);
    if (gasolinera.priceDieselPlus)
      precios.push(`<span class="font-extrabold">Gasóleo A+: <span class="font-bold">${gasolinera.priceDieselPlus} €/L&nbsp;</span></span>`);
    if (gasolinera.priceAdBlue)
      precios.push(`<span class="font-extrabold text-blue-900">AdBlue: <span class="font-bold">${gasolinera.priceAdBlue} €/L&nbsp;</span></span>`);

    // Clases base para todas las cards
    card.classList.add(
      "p-4",
      "rounded-lg",
      "shadow-md",
      "hover:shadow-lg",
      "hover:scale-105",
      "transform",
      "transition-transform",
      "transition-shadow",
      "duration-300",
      "ease-in-out",
      "w-full",
      "max-w-md",
      "md:max-w-lg",
      "lg:max-w-xl",
      "xl:max-w-2xl",
      "mx-auto",
      "border-2"
    );

    // Solo MERCOENERGY con estilo único
    if (gasolinera.logo !== "MERCOENERGY") {
      card.classList.add("bg-green-600", "text-white", "border-green-900", "ring-4", "ring-green-300");
    } else {
      card.classList.add("bg-green-200", "text-green-900", "border-green-400");
    }

    card.innerHTML = `
      <div class="flex flex-col items-center mb-2">
        <h2 class="font-bold text-center">${gasolinera.logo} - ${gasolinera.localidad}</h2>
        <h1 class="text-center font-extralight italic">${gasolinera.direction}</h1>
      </div>
      <div class="flex flex-col items-start space-y-1 w-full">
        ${precios.join("")}
      </div>
    `;

    container.appendChild(card);
  });
}

getPetrolStations();
