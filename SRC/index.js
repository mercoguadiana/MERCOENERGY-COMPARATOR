const apiGob = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/";
const container = document.getElementById("container");

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
  let card = document.createElement("div");
  const precios = [];

  if (gasolinera.price)
    precios.push(`<span class=" font-extrabold text-lime-600 ">Gasolina 95: <span class=" font-bold">${gasolinera.price} €/L&nbsp;</span></span>`);
  if (gasolinera.priceGasolinaPlus)
    precios.push(`<span class="font-extrabold text-lime-600 ">Gasolina 95+: <span class=" font-bold">${gasolinera.priceGasolinaPlus} €/L&nbsp;</span></span>`);
  if (gasolinera.priceDiesel)
    precios.push(`<span class="font-extrabold ">Gasóleo A: <span class="font-bold">${gasolinera.priceDiesel} €/L&nbsp;</span></span>`);
  if (gasolinera.priceDieselPlus)
    precios.push(`<span class="font-extrabold ">Gasóleo A+: <span class="font-bold">${gasolinera.priceDieselPlus} €/L&nbsp;</span></span>`);
  if (gasolinera.priceAdBlue)
    precios.push(`<span class="font-extrabold text-blue-900 ">AdBlue: <span class="font-bold">${gasolinera.priceAdBlue} €/L&nbsp;</span>  </span>`);

card.classList.add(
  "bg-green-200",
  "p-4",
  "text-green-700",
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
  "max-w-md",         // Tamaño base
  "md:max-w-lg",      // Más grande en pantallas medianas
  "lg:max-w-xl",      // Aún más grande en pantallas grandes
  "xl:max-w-2xl",     // Extra grande en pantallas muy grandes
  "mx-auto",
  "border-2",
  "border-green-500"
);


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
