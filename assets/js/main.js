typeColors = {
  normal: "#A8A878",
  fire: "#F08030",
  fighting: "#C03028",
  water: "#6890F0",
  flying: "#A890F0",
  grass: "#78C850",
  poison: "#A040A0",
  electric: "#F8D030",
  ground: "#E0C068",
  psychic: "#F85888",
  rock: "#B8A038",
  ice: "#98D8D8",
  bug: "#A8B820",
  dragon: "#7038F8",
  ghost: "#705898",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  unknown: "#68A090"
};

$(function() {
  // Inicializar Tabs
  $(".tabs").tabs();

  // Mostrar Pokemon al cargar página
  getPokemon(6, 1);

  // Listener del form
  $("#form1").submit(function(e) {
    let id1 = $("#input1").val();
    e.preventDefault();
    getPokemon(id1.toLowerCase(), 1);
    $("#input1").val("");
  });
});

function getPokemon(id, cardNumber) {
  $.ajax({
    type: "GET",
    url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
    dataType: "json",
    success: function(res) {
      console.log(res);
      setPokemonData(cardNumber, res);
    },
    error: function() {
      console.log("No se ha podido obtener la información");
    }
  });
}

async function setPokemonData(cardNumber, pokemonData) {
  const pokeNameElem = `#poke-name${cardNumber}`;
  const pokeNumberElem = `#poke-number${cardNumber}`;
  const pokeTypeElem = `#poke-type${cardNumber}`;
  const pokeImageElem = `#poke-image${cardNumber}`;

  const { name, types, sprites, id, stats } = pokemonData;

  let container = `#stats__graph`;

  $(pokeNameElem).text(name.toUpperCase());
  $(pokeNumberElem).text(id);
  $(pokeTypeElem).html(``);
  for (let type of types) {
    $(pokeTypeElem).append(`<span class="new badge" style="background-color: ${typeColors[type.type.name]}" data-badge-caption="">${type.type.name.toUpperCase()}</span>`);
  }
  $(pokeImageElem).attr("src", sprites.front_default);

  createChart(2, stats, container);
  $("#abilities").html("");
  await $("#abilities").append(crearAbility(pokemonData));
}

function createChart(cardNumber, stats, container) {
  let [spd, sdef, satk, def, atk, hp] = stats;
  let color = "#FF3D00";

  spd = spd.base_stat;
  sdef = sdef.base_stat;
  satk = satk.base_stat;
  def = def.base_stat;
  atk = atk.base_stat;
  hp = hp.base_stat;

  var options = {
    animationEnabled: true,
    height: 260,
    axisY: {
      tickThickness: 0,
      lineThickness: 0,
      valueFormatString: " ",
      gridThickness: 0
    },
    axisX: {
      tickThickness: 0,
      lineThickness: 0
    },
    data: [
      {
        indexLabelFontSize: 14,
        toolTipContent: '<span style="color:#CD853F"><strong>{y}</strong></span>',
        indexLabelPlacement: "inside",
        indexLabelFontColor: "white",
        indexLabelFontWeight: 400,
        indexLabelFontFamily: "Roboto",
        color: color,
        type: "bar",
        dataPoints: [
          { y: spd, label: "Speed" },
          { y: sdef, label: "Sp. Defense" },
          { y: satk, label: "Sp. Attack" },
          { y: def, label: "Defense" },
          { y: atk, label: "Attack" },
          { y: hp, label: "HP" }
        ]
      }
    ]
  };

  $(container).CanvasJSChart(options);
}

function crearAbility(pokemonData) {
  let abilitiesHTML = "";
  let abilityText = "";

  for (const item of pokemonData.abilities) {
    $.ajax({
      type: "GET",
      url: item.ability.url,
      dataType: "json",
      success: function(res) {
        abilityText = res.effect_entries[0].effect;
        console.log(abilityText);
      },
      error: function() {
        console.log("crearAbility(): No se ha podido obtener la información");
      }
    });

    abilitiesHTML += `<div class="row">
      <div class="card">
        <div class="card-content">
          <div class="card-title">
          ${item.ability.name.toUpperCase()}
          </div>
          <p id="abilityText${item}"></p>
        </div>
      </div>
    </div>`;
  }

  return abilitiesHTML;
}
