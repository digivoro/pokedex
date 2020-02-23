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

  const pokeHPElem = `#poke-hp${cardNumber}`;
  const pokeAtkElem = `#poke-atk${cardNumber}`;
  const pokeDefElem = `#poke-def${cardNumber}`;
  const pokeSAtkElem = `#poke-satk${cardNumber}`;
  const pokeSDefElem = `#poke-sdef${cardNumber}`;
  const pokeSpdElem = `#poke-spd${cardNumber}`;
  const { name, types, sprites, id, stats } = pokemonData;

  const [spd, sdef, satk, def, atk, hp] = stats;
  let container = `#chartContainer${cardNumber}`;

  $(pokeNameElem).text(name.toUpperCase());
  $(pokeNumberElem).text(id);
  $(pokeTypeElem).html(``);
  for (let type of types) {
    $(pokeTypeElem).append(`<span class="new badge" data-badge-caption="">${type.type.name.toUpperCase()}</span>`);
  }
  $(pokeImageElem).attr("src", sprites.front_default);
  // $(pokeHPElem).text(hp.base_stat);
  // $(pokeAtkElem).text(atk.base_stat);
  // $(pokeDefElem).text(def.base_stat);
  // $(pokeSAtkElem).text(satk.base_stat);
  // $(pokeSDefElem).text(sdef.base_stat);
  // $(pokeSpdElem).text(spd.base_stat);

  createChart(cardNumber, stats, container);
}

$(function() {
  getPokemon(151, 1);
  getPokemon(150, 2);
});

$("#btn1").click(function() {
  getPokemon(
    $("#input1")
      .val()
      .toLowerCase(),
    1
  );
});
$("#btn2").click(function() {
  getPokemon(
    $("#input2")
      .val()
      .toLowerCase(),
    2
  );
});

window.onload = function() {};

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
    // dataPointMaxWidth: 30,
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
