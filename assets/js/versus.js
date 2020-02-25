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

function setPokemonData(cardNumber, pokemonData) {
  const pokeNameElem = `#poke-name${cardNumber}`;
  const pokeNumberElem = `#poke-number${cardNumber}`;
  const pokeTypeElem = `#poke-type${cardNumber}`;
  const pokeImageElem = `#poke-image${cardNumber}`;

  const { name, types, sprites, id, stats } = pokemonData;

  let container = `#chartContainer${cardNumber}`;

  $(pokeNameElem).text(name.toUpperCase());
  $(pokeNumberElem).text(id);
  $(pokeTypeElem).html(``);
  for (let type of types) {
    $(pokeTypeElem).append(`<span class="new badge" style="background-color: ${typeColors[type.type.name]}" data-badge-caption="">${type.type.name.toUpperCase()}</span>`);
  }
  $(pokeImageElem).attr("src", sprites.front_default);

  createChart(cardNumber, stats, container);
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

  if (cardNumber == 1) {
    spd = -spd;
    sdef = -sdef;
    satk = -satk;
    def = -def;
    atk = -atk;
    hp = -hp;
    color = "#2196F3";
  }
  var options = {
    animationEnabled: true,
    height: 320,
    axisY: {
      tickThickness: 0,
      lineThickness: 0,
      valueFormatString: " ",
      gridThickness: 0
    },
    axisX: {
      tickThickness: 0,
      lineThickness: 0,
      labelFormatter: function() {
        return " ";
      }
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
        dataPoints: [{ y: spd }, { y: sdef }, { y: satk }, { y: def }, { y: atk }, { y: hp }]
      }
    ]
  };

  $(container).CanvasJSChart(options);
}

$(function() {
  getPokemon(6, 1);
  getPokemon(150, 2);
  $("#form1").submit(function(e) {
    let id1 = $("#input1").val();
    e.preventDefault();
    getPokemon(id1.toLowerCase(), 1);
    $("#input1").val("");
  });

  $("#form2").submit(function(e) {
    let id2 = $("#input2").val();
    e.preventDefault();

    getPokemon(id2.toLowerCase(), 2);
    $("#input2").val("");
  });
});
