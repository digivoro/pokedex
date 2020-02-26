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
  getPokemon(1, 1);

  // Listener del form
  $("#form1").submit(function(e) {
    let id1 = $("#input1").val();
    e.preventDefault();
    getPokemon(id1.toLowerCase(), 1);
    $("#input1").val("");
  });

  $("#btnRandom1").click(function(e) {
    getPokemon(Math.floor(Math.random() * 807), 1);
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
      $("#abilities").html("");
      $("#abilities").append(crearAbility(res));
    },
    error: function() {
      console.log("No se ha podido obtener la información");
    },
    complete: function(e) {
      let i = 1;
      let effectTexts = [];
      for (const item of e.responseJSON.abilities) {
        $.ajax({
          type: "GET",
          url: item.ability.url,
          dataType: "json",
          success: function(response) {
            effectTexts.push(response.effect_entries[0].effect);
            document.getElementById(`abilityText${i}`).innerHTML = effectTexts[i - 1];
            i++;
          },
          error: function() {
            console.log("No se ha podido obtener la información");
          }
        });
      }
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
    backgroundColor: "",
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
          { y: spd, label: "SPEED" },
          { y: sdef, label: "SP. DEFENSE" },
          { y: satk, label: "SP. ATTACK" },
          { y: def, label: "DEFENSE" },
          { y: atk, label: "ATTACK" },
          { y: hp, label: "HP" }
        ]
      }
    ]
  };

  $(container).CanvasJSChart(options);
}

function crearAbility(pokemonData) {
  let abilitiesHTML = "";
  let i = 1;

  for (const item of pokemonData.abilities) {
    abilitiesHTML += `<div class="row">
      <div class="card hoverable">
        <div class="card-content">

          <div class="card-title">
          ${item.ability.name.toUpperCase()}
          </div>
          <div id="abilityText${i}"></div>
        </div>
      </div>
    </div>`;
    i++;
  }

  return abilitiesHTML;
}
