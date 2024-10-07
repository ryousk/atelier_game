import Player from './Player.js';
import NPC from './NPC.js';
import GameClearScene from './GameClearScene.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.collisionPositions = []; // 当たり判定の座標を記録する配列
        this.npcs = []; // 複数のNPCを管理する配列
        this.goalPosition = { x: 12, y: 3 };
    }

    preload() {
        // 画像の読み込み
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 64 });
        
        // 複数のNPC画像を読み込み
        this.load.image('Radio','assets/Radio.png')

        this.load.image('Azusa', 'assets/AzusaOnodera2.png');
        this.load.image('Ema', 'assets/EmaSuzuki2.png');
        this.load.image('Hikaru', 'assets/HikaruMugita2.png');
        this.load.image('Nanako', 'assets/NanakoMiura2.png');
        this.load.image('Mio', 'assets/MioHashimoto2.png');
        this.load.image('Chiaki', 'assets/ChiakiNishino2.png');
        this.load.image('Yurina', 'assets/YurinaHamabe2.png');

    }

    create() {
        // マスサイズを宣言
        const GRID_SIZE = 32;

        // 背景を配置
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.setDisplaySize(800, 8000);

        // 複数のNPCを初期化
        const npcData = [
            { x: 5, y: 225, texture: 'Radio', dialogue: "SHOUT\r\n自由帳\r\nアイデンティティ\r\nモノクローム\r\nPART-TIME-DREAMER\r\nWhatever happens,happens.\r\n清涼飲料水\r\n白祭\r\nBegin\r\nHAPPY HAPPY TOMORROW\r\nMy fake world\r\nuntune\r\n全身全霊"},
            { x: 5, y: 190, texture: 'Radio', dialogue: "闘う門には幸来たる\r\nセルフエスティーム\r\nいま踏み出せ夏\r\nパーサヴィア"},
            { x: 5, y: 155, texture: 'Radio', dialogue: "桜色カメラロール\r\nダンスインザライン\r\nらしさとidol\r\nくるくる愛して\r\n共に描く"},
            { x: 5, y: 120, texture: 'Radio', dialogue: "ルーザーガール\r\nレガシー\r\n空色パズルピース\r\nレイ\r\nオーバーセンシティブ\r\n朝露草\r\nReplica\r\nポイポイパッ"},
            { x: 5, y: 85, texture: 'Radio', dialogue: "わたしとばけもの\r\n光になって\r\nキャンディタフト"},
            { x: 5, y: 50, texture: 'Radio', dialogue: "メンションガール\r\n世界犯\r\nぼっち\r\nダウター\r\nHeroism\r\nBye my summer\r\nプロテア"},
            { x: 5, y: 15, texture: 'Radio', dialogue: "マイクレイジー\r\nHeroine hour\r\nSummer Echoes\r\n???"},

            { x: 20, y: 240, texture: 'Azusa', dialogue: "真っ白なキャンバスの\r\n小野寺梓です。\r\nうまい棒食べ放題のカラオケで\r\n元取りたい！" },
            { x: 5, y: 243, texture: 'Ema', dialogue: "真っ白なキャンバスの\r\n鈴木えまです。\r\n大好きなのは(はいせーの)\r\nひまわりのたね(俺もー！)" },
            { x: 9, y: 240, texture: 'Hikaru', dialogue: "真っ白なキャンバスの\r\n麦田ひかるです。\r\nよろしくお願いします。" },
            { x: 19, y: 230, texture: 'Nanako', dialogue: "真っ白なキャンバス2期生の\r\n三浦菜々子です。\r\nピュリッピンピャピャミンです。" },

            { x: 6, y: 203, texture: 'Azusa', dialogue: "メインステージに立つのが\r\n当たり前のようなグループになりたいです。" },
            { x: 5, y: 208, texture: 'Ema', dialogue: "去年に比べて来てくれる人が増えて\r\nとても嬉しいです。" },
            { x: 20, y: 205, texture: 'Hikaru', dialogue: "今年は恩を返したいな。" },
            { x: 19, y: 200, texture: 'Nanako', dialogue: "成長できたかな\r\n役に立ててるかな\r\n長かった気もするし\r\nあっという間だったきもするなぁ\r\nありがとう" },
            { x: 5, y: 213, texture: 'Mio', dialogue: "真っ白なキャンバス3期生の\r\n橋本美桜です。\r\n優しく迎えてくださって\r\nとても嬉しかったです！。" },
            { x: 20, y: 210, texture: 'Chiaki', dialogue: "真っ白なキャンバス3期生の\r\n西野千明です。\r\nダンスと歌が未経験ですが\r\n精一杯頑張って\r\nみんなに追いつけるように頑張ります。" },

            { x: 20, y: 163, texture: 'Azusa', dialogue: "大丈夫？扶養入る？" },
            { x: 5, y: 175, texture: 'Ema', dialogue: "初期からやって来て\r\n色々あったけど楽しかったです。\r\n自分は卒業しちゃうんですけど\r\nこれからも白キャンを\r\nよろしくお願いします。。" },
            { x: 20, y: 173, texture: 'Hikaru', dialogue: "今日で最後のライブだったんですけど、\r\n最初の頃から白キャンに\r\n関わることができて\r\nとても良かったと思います。\r\n今まで本当にありがとうございました。" },
            { x: 19, y: 178, texture: 'Nanako', dialogue: "真っ白なキャンバス\r\nキングレコードから\r\nメジャーデビューが決定しました！" },
            { x: 18, y: 168, texture: 'Mio', dialogue: "きゅるるん爆誕！" },
            { x: 6, y: 165, texture: 'Chiaki', dialogue: "最近歳のせいか涙脆いんだ〜\r\n強くなります！\r\nこれからも白キャンを\r\nよろしくお願いします！" },
            { x: 5, y: 170, texture: 'Yurina', dialogue: "真っ白なキャンバス4期生の\r\n浜辺ゆりなです。\r\n最初はすごく緊張していたんですけど\r\n暖かい目で見守ってくれたので\r\n楽しむことができました" },

            { x: 20, y: 145, texture: 'Azusa', dialogue: "ファンのみんなが\r\n自信をつけさせてくれた" },
            { x: 5, y: 133, texture: 'Ema', dialogue: "自分とひかるが加わって\r\nよかったなって思って\r\nもらうように頑張ります。\r\nまたみんなの前でステージに\r\n立てて嬉しいです。" },
            { x: 20, y: 130, texture: 'Hikaru', dialogue: "またこうやって新メンバーとして\r\nえまとみんなとこのステージに立てて\r\nとても嬉しいです。\r\nこれから精一杯頑張ります。\r\nよろしくお願いします。" },
            { x: 5, y: 143, texture: 'Nanako', dialogue: "環境を自分で変えていかなきゃいけない" },
            { x: 5, y: 138, texture: 'Mio', dialogue: "かわいいだけじゃないアイドルがいい" },
            { x: 20, y: 140, texture: 'Chiaki', dialogue: "目の前のことをコツコツやっていくのが大事" },
            { x: 20, y: 135, texture: 'Yurina', dialogue: "不安もあるけどやるしかない" },

            { x: 20, y: 90, texture: 'Azusa', dialogue: "アイドルの終わりを考えちゃう\r\n時も会ったりしたけど、\r\n今日一生アイドルしよっかなって\r\n思いました。" },
            { x: 5, y: 93, texture: 'Ema', dialogue: "今はみんなが居場所\r\n作ってくれてるなと思っちゃって、\r\nもっともっと頑張って\r\nみんなの居場所になれるように\r\n頑張ります。" },
            { x: 20, y: 95, texture: 'Hikaru', dialogue: "今日はみんなが少しでも\r\n晴れた気持ちになれるような\r\nライブにしたいなと\r\n思ってたんですけど、どうかな？" },
            { x: 5, y: 98, texture: 'Nanako', dialogue: "今年の夏をみんなが振り返った時に\r\n白キャンのフリーライブ\r\nめちゃめちゃ楽しかったなって\r\n思い出してもらえるような\r\nライブになってたら\r\n私たちもすごくすごく嬉しいです。" },
            { x: 20, y: 100, texture: 'Mio', dialogue: "7人いることも\r\nみんなが声を出して応援してくれるのも\r\n当たり前じゃないなって思って…" },
            { x: 5, y: 103, texture: 'Chiaki', dialogue: "前までの声を出せた時期が\r\nすごく恋しかったので、\r\n今こうやってみんなの声が\r\nすごい聞こえて\r\n本当に本当に嬉しいです。" },
            { x: 20, y: 105, texture: 'Yurina', dialogue: "コロナ渦で加入したので\r\nみんなの声を聴くのが初めてで\r\n今こうやって反応を\r\nもらえるだけでめっちゃ嬉しいです。" },

            { x: 5, y: 55, texture: 'Azusa', dialogue: "わがままですけど、\r\nもっと大きいステージも立ちたいです。\r\nだからこれからも頑張ります。" },
            { x: 20, y: 68, texture: 'Ema', dialogue: "みんな辛いこととか\r\n生きててあると思うんですけど、\r\n今日のライブ来て少しでも\r\n幸せになってもらえたら嬉しいです。\r\nえまは今日本当にめっちゃ幸せでした。" },
            { x: 5, y: 70, texture: 'Hikaru', dialogue: "本当に感謝しかなくて、\r\nこんな景色見れるなんて\r\n思ってなかったです。\r\nやっぱりもっとこれからも\r\n白キャンが続いてほしいなって\r\n思いました。" },
            { x: 20, y: 58, texture: 'Nanako', dialogue: "私の今日からの残りの\r\nアイドル人生全部懸けて\r\n皆さんの居場所を守っていくので\r\n私たちのことを信じて\r\nこれからもついてきてください。" },
            { x: 5, y: 60, texture: 'Mio', dialogue: "2周年とか3周年とかで\r\nどんどん大きくなっていくことに\r\n怖さを感じてて、でも今日\r\nみんながぶわーっているの\r\n見たらまだ自分大丈夫だなって\r\n強くなれた気がします。" },
            { x: 20, y: 63, texture: 'Chiaki', dialogue: "白キャンはまだ\r\nここで終わるグループじゃないよ！\r\nもっともっと上に行きたいです！" },
            { x: 5, y: 65, texture: 'Yurina', dialogue: "改めてこんなに沢山の人が\r\n白キャンの5周年をお祝いしてくれるって\r\n本当にすごいことだなって思うし、\r\n応援してくれるファンの人とか\r\nスタッフさんとかメンバーとか\r\n全員にすごい感謝だなって思いました。" },

            { x: 19, y: 23, texture: 'Azusa', dialogue: "最後の日まで\r\n真っ白なキャンバスを\r\nよろしくお願いします！" },
            { x: 19, y: 28, texture: 'Ema', dialogue: "白キャンの\r\n最後見に来て欲しいです。" },
            { x: 19, y: 33, texture: 'Hikaru', dialogue: "最後の最後まで\r\n沢山の方と出会いたいです。" },
            { x: 19, y: 38, texture: 'Nanako', dialogue: "今まで何度も何度も\r\n歌ってきた曲たちを歌う\r\n最後の日です" },
            { x: 6, y: 35, texture: 'Mio', dialogue: "みんなと創りあげる\r\n最後のライブが今までで\r\n1番の景色・思い出になるといいなあ" },
            { x: 6, y: 25, texture: 'Chiaki', dialogue: "最後までついてきてくれたら\r\n嬉しいです。\r\n応援よろしくお願いします！" },
            { x: 6, y: 30, texture: 'Yurina', dialogue: "最後のライブみんなが\r\n来たいと思ってもらえるように\r\nがんばります！！" },

        ];

        for (let data of npcData) {
            const npc = new NPC(this, data.x, data.y, GRID_SIZE, data.texture,data.dialogue);
            this.npcs.push(npc);
            this.collisionPositions.push({ x: data.x, y: data.y }); // 各NPCの位置を記録
        }

        // 壁の当たり判定の座標を追加（例: 左側の壁）
        for (let y = 0; y < 250; y++) {
            this.collisionPositions.push({ x: 10, y: y });
            this.collisionPositions.push({ x: 15, y: y });
        }
        for (let x = 10; x < 15; x++) {
            this.collisionPositions.push({ x: x, y: 0 });
            this.collisionPositions.push({ x: x, y: 250 });
        }
        // 例: 他の壁の追加も同様に行う

        // プレイヤーを初期化（グリッド座標 (20, 20) に配置）
        const playerBaseGridX = 12;
        const playerBaseGridY = 10;
        this.player = new Player(this, playerBaseGridX, playerBaseGridY, this.collisionPositions, GRID_SIZE);

        // カメラ設定
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight);

        // カメラ倍率の設定用の変数（自由に調整可能）
        const zoomLevel = 1; // 倍率を調整したい値に設定（例：1.5倍）
        this.cameras.main.setZoom(zoomLevel);
    
            // ゴールエリアの位置を追加
            this.goalMarker = this.add.rectangle(
                this.goalPosition.x * GRID_SIZE,
                this.goalPosition.y * GRID_SIZE,
                GRID_SIZE,
                GRID_SIZE,
                0x00ff00,
                0.5
            ).setOrigin(0.5);
    }

    update() {
        // プレイヤーの更新
        if (!this.isGameCleared) {
            this.player.update();

            // 奥行きによる重なりの優先順位を設定（プレイヤーと各NPCの重なり順を管理）
            this.player.sprite.setDepth(this.player.sprite.y);
            for (let npc of this.npcs) {
                npc.sprite.setDepth(npc.sprite.y);

                // 各NPCとの距離を測り、吹き出しを表示
                const distance = Phaser.Math.Distance.Between(0, this.player.sprite.y, 0, npc.sprite.y);
                if (distance < 100) {
                    npc.showDialogue();
                } else {
                    npc.hideDialogue();
                }
            }

            // ゴールエリアに到達したかのチェック
            if (this.player.baseGridX === this.goalPosition.x && this.player.baseGridY === this.goalPosition.y) {
                this.triggerGameClear();
            }
        }
    }

    triggerGameClear() {
        // ゴールに到達したら操作を無効化
        this.isGameCleared = true;

        // 徐々に画面を白くするフェードエフェクト
        this.cameras.main.fadeOut(2000, 255, 255, 255);

        // フェードアウト後にゲームクリアシーンに遷移
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameClearScene');
        });
    }
}
