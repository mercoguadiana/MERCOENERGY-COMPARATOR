const apiGob = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/";
let container = document.querySelector(".container");

// IDs de municipios que quieres consultar
const municipios = ["717", "732"];

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

  gasofas.forEach((gasolinera) => {
    let div = document.createElement("div");

    div.classList.add(
      "flex",
      "flex-col",
      "justify-between",
      "p-4",
      "border-2",
      "border-green-700",
      "bg-green-300",
      "text-gray-900",
      "shadow-lg",
      "rounded-xl",
      "transition",
      "duration-300",
      "hover:scale-105"
    );

    div.innerHTML = `
      
      <h2 class="mt-4 font-bold text-center">${gasolinera.logo} - ${gasolinera.localidad}</h2>
      <ul class="space-y-1">
        <li class="font-bold text-green-800">Gasolina: ${gasolinera.price ? gasolinera.price + "€/l" : "No disponible"}</li>
        <li class="font-bold text-green-800">Gasolina Plus: ${gasolinera.priceGasolinaPlus ? gasolinera.priceGasolinaPlus + "€/l" : "No disponible"}</li>
        <li class="font-bold text-green-900">Gasóleo A: ${gasolinera.priceDiesel ? gasolinera.priceDiesel + "€/l" : "No disponible"}</li>
        <li class="font-bold text-green-900">Gasóleo A Plus: ${gasolinera.priceDieselPlus ? gasolinera.priceDieselPlus + "€/l" : "No disponible"}</li>
        <li class="font-bold text-blue-600">AdBlue: ${gasolinera.priceAdBlue ? gasolinera.priceAdBlue + "€/l" : "No disponible"}</li>
      </ul>
      <h1 class="text-lg font-semibold mb-2 text-center">${gasolinera.direction}</h1>
    `;

    div.style.backgroundImage = `url(./src/img/${gasolinera.logo}.png)`;
    div.style.backgroundSize = "contain";
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundPosition = "center top";

    container.appendChild(div);
  });
}

getPetrolStations();
