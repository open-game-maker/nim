({
    //ニム（石取りゲーム）のチャットリストから現在のゲーム状態を表示する
    /**
     * 画面にUIを表示する
     * @param {*} ui 汎用関数
     * @param {*} chat プレイヤーに送信されているチャット
     */
    drawCurrent: function(ui, chat) {
        if (chat == null) {
            return
        }
        for (var index = chat.length - 1; index >= 0; index--) {
            var shareState = chat[index].rawBody.shareState;
            if (shareState != null) {
                //画面要素の登録処理
                ui.register(0, 10, 10, 300, 30);
                //現在のターンプレイヤーを表示
                ui.addFillText(0, "black", "プレイヤー" + shareState[0][0] + "のターン", null);

                //各数字の表示
                for (var index2 = 0; index2 < shareState[0][1].length; index2++) {
                    ui.register(index2 + 1, 60 * index2 + 10, 50, 50, 50);
                    //丸を表示
                    ui.addFillOval(index2 + 1, "gray");
                    //数字を表示
                    ui.addFillText(index2 + 1, "black", shareState[0][1][index2], null);
                    var i = ui.deepCopy(index2);
                    var s = ui.deepCopy(shareState[0][1][index2]);
                    ui.setOnClickListener(index2 + 1, [i, s], function(obj){
                        //数字をタップしたときの処理
                        if (obj[1] > 0) {
                            //ダイアログを表示
                            var dialog = ui.createDialog(obj[0] + "から取り出す", [ui.createNumberContent("", 1, obj[1])], "Yes", "No");
                            dialog.setOnClickPositiveListener(
                                function(i, list) {
                                    //ダイアログが選択されたときの処理
                                    //選択を送信する
                                    ui.sendSlectionChat(null, 0, [i, list[0]], null)
                                }
                                , obj[0]
                            )
                            dialog.show(ui)
                        }
                        else {
                            ui.makeDialog("値が0より大きいものを選択してください", [], "Yes", "");
                        }
                    });
                }

                break;
            }
        }

        ui.show();
    },
    /**
     * Canvas要素をクリックしたときのイベント
     * @param ui 汎用関数
     * @param {*} pageX キャンバスの左端からクリック位置まで距離
     * @param {*} pageY キャンバスの上端からクリック位置まで距離
     */
    onClick: function(ui, pageX, pageY) {
        //クリックした位置に存在するviewのリストを取得
        var ids = ui.getViews(pageX, pageY)
        ui.execViewProcess(ids);
    }
})