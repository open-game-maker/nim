//GAME_V3
({
    //ニム（石取りゲーム）のゲームを実行する
    /**
     * ゲームの初期化処理
     * @param {*} ogm 汎用関数
     * @param {*} random 乱数生成
     * @param {*} rule ルール
     */
    initialize: function(ogm, random, rule, mode) {
        //ゲームの状態
        var state;

        //ルールがあれば、それをセットする
        state = [0, []];
        if (ogm.isArray(rule)) {
            for (var i = 0; i < rule.length; i++) {
                if (ogm.isNumber(rule[i])) {
                    state[1].push(rule[i]);
                }
            }
        } 

        if (state[1].length <=  0) {
            //ルールの初期状態がなければ、1~10までの値をランダムに3つ入力
            for (var i = 0; i < 3; i++) {
                state[1].push((random.next() % 10) + 1)
            }
        }

        //選択の情報をプレイヤーに送信
        var selections = ogm.newArray(2);
        selections[state[0]].push(ogm.createPlayerSelect(0, 0, [state[0]]));

        //すべてのゲーム状態をプレイヤーに共有する（完全情報ゲームとなる）
        var shares = ogm.newArray(2);
        shares[0].push([]);
        shares[1].push([]);

        //ゲームの情報をプレイヤーに送信する
        var signal = ogm.newArray(2);
        for (var index = 0; index < mode.numberOfPlayer; index++) {
            //プレイヤーIDを送る（シグナルIDの-1番目をプレイヤーIDを送る用とする）
            signal[index].push([ogm.PLAYER_ID_SIGNAL_ID, index]);
            //プレイヤー数を送る（シグナルIDの-2番目をプレイヤー数を送る用とする）
            signal[index].push([ogm.PLAYER_NUMBER_SIGNAL_ID, mode.numberOfPlayer]);
        }

        return ogm.createGameNextResult(
            state,
            selections,
            shares,
            null,
            signal,
            null
        );
    },
    /**
     * ゲームの次状態の生成
     * @param {*} ogm 汎用関数
     * @param {*} random 乱数生成
     * @param {*} state ゲームの状態
     * @param {*} selectList プレイヤーの選択
     */
    next: function(ogm, random, state, selectList, mode) {
        //プレイヤーの選択を処理
        for (var playerIndex = 0; playerIndex < selectList.length; playerIndex++) {
            for (var selectIndex = 0; selectIndex < selectList[playerIndex].length; selectIndex++) {
                var select = selectList[playerIndex][selectIndex].playersSelection;
                state[1][select[0]] = state[1][select[0]] - select[1];
            }
        }

        //ゲームの勝者を表す変数（nullの場合はゲームは続く）
        var winnerSet = null;

        var finishFlag = true;
        //一つでも0でない、数字があるならば、ゲームは続く
        for (var index = 0; index < state[1].length; index++) {
            if (state[1][index] != 0) {
                finishFlag = false;
                break;
            }
        }

        if (finishFlag) {
            //ゲームが終了している場合、勝利プレイヤーに1、敗北プレイヤーに0
            winnerSet = [0, 0];
            winnerSet[state[0]] = 1;
        }

        //手番の入れ替え
        if (state[0] == 0) {
            state[0] = 1;
        } else {
            state[0] = 0;
        }

        var selections = ogm.newArray(2);
        selections[state[0]].push(ogm.createPlayerSelect(0, 0, [state[0]]));

        var shares = ogm.newArray(2);
        shares[0].push([]);
        shares[1].push([]);

        return ogm.createGameNextResult(
            state,
            selections,
            shares,
            null,
            null,
            winnerSet
        );
    },
    /**
     * 選択肢の制御
     */
    selectionConstraintsList: [{
        /**
         * プレイヤーが選択できるすべての選択肢の生成
         * @param {*} ogm 汎用関数
         * @param {*} shareState プレイヤーに渡されているゲームの状態の情報
         * @param {*} selectionSignal 選択に紐づけられている情報
         */
        createAll: function(
            ogm,
            shareState,
            selectionSignal
        ) {
            var state = shareState.getState([1]);
            var selections = []
            for (var count = 0; count < state.length; count++) {
                for (var count2 = 1; count2 <= state[count]; count2++) {
                    selections.push([
                        [count, count2], null
                    ]);
                }
            }
            return selections;
        }
    }]
})