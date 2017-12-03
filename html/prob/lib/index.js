window.addEventListener("load", function() {
  var SIMULATION_SAMPLES = 50000;

  // Update sample card
  function updateSampleCard() {
    var scale = parseInt(document.querySelector("#scale").value);
    var blank = document.querySelector("#blank").checked;

    var sample = document.querySelector("#sample");
    sample.innerHTML = "";
    for (let i = 0; i < scale; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < scale; j++) {
        let cell = document.createElement("td");

        if (blank &&
            i * 2 + 1 === scale &&
            j * 2 + 1 === scale) {
          cell.classList.add("blank");
        }

        row.appendChild(cell);
      }
      sample.appendChild(row);
    }
  }

  document.querySelector("#scale").addEventListener("change", updateSampleCard);
  document.querySelector("#blank").addEventListener("change", updateSampleCard);

  updateSampleCard();

  // Start calculation
  document.querySelector("#start").addEventListener("click", function() {
    var result = document.querySelector("#result");
    var thead = result.querySelector("thead");
    var tbody = result.querySelector("tbody");
    thead.innerHTML = "<tr><th>数字を引いた回数</th><th>ビンゴになった人の数</th></tr>";
    tbody.innerHTML = "";

    var scale = parseInt(document.querySelector("#scale").value);
    var blank = document.querySelector("#blank").checked;
    var num = parseInt(document.querySelector("#num").value);
    var players = parseInt(document.querySelector("#players").value);

    // Setup bingo patterns
    var bingos = [];
    for (let i = 0; i < scale; i++) {
      let horizontal = [], vertical = [];
      for (let j = 0; j < scale; j++) {
        horizontal.push(i * scale + j);
        vertical.push(i + j * scale);
      }
      bingos.push(horizontal);
      bingos.push(vertical);
    }

    // Add slant bingo patterns
    if (scale % 2 === 1) {
      let s = [], t = [];
      for (let i = 0; i < scale; i++) {
        s.push(i + i * scale);
        t.push((i + 1) * scale - 1 - i);
      }
      bingos.push(s);
      bingos.push(t);
    }

    // Generate many random bingo cards
    var numbers = Array(num).fill(0).map(function(v, i) { return i + 1 });
    var cards = [];
    for (let i = 0; i < SIMULATION_SAMPLES; i++) {
      let shuffled = shuffle(numbers);
      cards.push(shuffled.slice(0, scale**2));
    }

    // Mark the center space if blank specified
    if (blank && scale % 2 === 1) {
      cards.forEach(function(card) {
        card[(scale**2 - 1) / 2] = -1;
      });
    }

    // Start simulation
    numbers = shuffle(numbers);
    numbers.forEach(function(n, i) {
      cards.forEach(function(card) {
        for (var idx = 0; idx < card.length; idx++) {
          if (card[idx] === n) {
            card[idx] = -1 // Setting -1 means that space is marked
          }
        }
      });

      // Check bingo state
      var cnt = 0;
      cards.forEach(function(card) {
        for (let bi = 0; bi < bingos.length; bi++) {
          if (bingos[bi].every(function(bn) { return card[bn] === -1 })) {
            cnt++;
            break;
          }
        }
      });

      // Add result to table
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + (i + 1) + "</td>" +
        "<td>" + Math.floor(players * cnt / SIMULATION_SAMPLES) + "</td>";
      tbody.appendChild(tr);
    });
  });
});

// Fisher-Yates (aka Knuth) Shuffle
// (from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
