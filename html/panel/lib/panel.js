window.onload = function() {
  // 行と列数を取得
  var rowNum = document.querySelectorAll(".row").length;
  var colNum = document.querySelectorAll(".row:first-of-type .panel").length;

  // container クラス要素の幅を調整
  var panelsAtFirstRow = document.querySelectorAll(".row:first-of-type .panel");
  var sumOfWidth = 0;
  panelsAtFirstRow.forEach(function(p) {
    var s = window.getComputedStyle(p);
    sumOfWidth += parseInt(s.width.substr(0, s.width.length - 2));
    sumOfWidth += parseInt(s.marginLeft.substr(0, s.marginLeft.length - 2));
  });
  document.querySelector(".container").style.width = sumOfWidth + "px";

  // カバーを取得
  var covers = document.querySelectorAll(".cover");

  // カバーにイベントハンドラーを設定
  covers.forEach(function(cover) {
    cover.addEventListener("click", function(e) {
      var gift = cover.previousElementSibling;

      // クラスを切り替えてカバーと景品画像を i 回ターンする
      function turn(i, callback) {
        if (i <= 0) {
          return callback();
        }

        // front と back を交互に切り替える
        cover.classList.toggle("front");
        cover.classList.toggle("back");
        gift.classList.toggle("back");
        gift.classList.toggle("front");

        // 次のターンをセット
        setTimeout(function() {
          turn(i - 1, callback);
        }, 600);
      }

      // 3 回ターンしてから景品画像を強調表示
      turn(3, function() {
        // 協調表示用の景品画像 (元画像のクローン)
        var giftClone = gift.cloneNode();

        // 元画像と同じ座標にセット
        var pos = gift.getBoundingClientRect();
        giftClone.style.top = pos.top + "px";
        giftClone.style.left = pos.left + "px";
        giftClone.style.width = gift.width + "px";
        giftClone.style.height = gift.height + "px";

        giftClone.className = "gift-emphasize";

        document.body.appendChild(giftClone);

        // 強調表示
        var w = gift.width * colNum;
        var h = gift.height * rowNum;
        giftClone.style.top = (window.innerHeight - h) / 2 + "px";
        giftClone.style.left = (window.innerWidth - w) / 2 + "px";
        giftClone.style.width = w + "px";
        giftClone.style.height = h + "px";

        // クリックしたら強調を解除
        giftClone.addEventListener("click", function(e) {
          var giftClone = e.target;

          // 元画像と同じ座標に戻す
          giftClone.style.top = pos.top + "px";
          giftClone.style.left = pos.left + "px";
          giftClone.style.width = gift.width + "px";
          giftClone.style.height = gift.height + "px";

          // 戻ったら要素を削除
          setTimeout(function() {
            giftClone.remove();
          }, 1000);
        });
      });
    });
  });
};
