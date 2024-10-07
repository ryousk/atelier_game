export default class NPC {
    constructor(scene, baseGridX, baseGridY, gridSize, texture, dialogue) {
        this.scene = scene;

        // 基準点を設定
        this.baseGridX = baseGridX; // 基準点 x (マス単位)
        this.baseGridY = baseGridY; // 基準点 y (マス単位)

        // NPCの画像位置設定（例: 2マス分 - 下の1マスとその上の1マス）
        const xOffsetImg = 0;
        const yOffsetImg = -2;
        const widthImg = 1;  // 横に1マス分
        const heightImg = 2; // 縦に2マス分

        // 画像スプライトの配置（テクスチャは引数から設定）
        const x = (this.baseGridX + xOffsetImg) * gridSize;
        const y = (this.baseGridY + yOffsetImg + heightImg) * gridSize; // 基準点を下端に合わせる
        this.sprite = scene.physics.add.sprite(x, y, texture).setOrigin(0.5, 1);

        // NPCの当たり判定設定（例: 1マス分 - 基準点の1マス下）
        const xOffsetCol = 0;
        const yOffsetCol = 0;
        const widthCol = 1;
        const heightCol = 1;

        // 当たり判定の範囲を設定
        this.sprite.body.setSize(widthCol * gridSize, heightCol * gridSize);
        this.sprite.body.setOffset(xOffsetCol * gridSize, yOffsetCol * gridSize);

        this.sprite.body.immovable = true;

        // 各NPCの会話内容
        this.dialogue = dialogue;

        // 吹き出しのテキストオブジェクトを作成
        this.dialogueBox = scene.add.text(this.sprite.x, this.sprite.y - 70, '', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 },
            align: 'center'
        }).setOrigin(0.5).setVisible(false);
    }

    update() {
        // 当たり判定の可視化用オブジェクトをNPCに合わせて移動（省略）
    }

    showDialogue() {
        if (this.dialogueBox) {
            // 吹き出しに設定するテキスト
            this.dialogueBox.setText(this.dialogue);

            // 吹き出しの改行数をカウント
            const lineCount = this.dialogue.split('\n').length;

            // 吹き出しの位置を改行数に応じて上に調整
            const baseYOffset = 70; // 基本のY方向のオフセット
            const lineHeightOffset = 6; // 1行ごとのオフセット（フォントサイズに合わせる）
            const totalYOffset = baseYOffset + (lineCount - 1) * lineHeightOffset;

            this.dialogueBox.setPosition(this.sprite.x, this.sprite.y - totalYOffset);
            this.dialogueBox.setVisible(true);
        }
    }

    hideDialogue() {
        if (this.dialogueBox) {
            this.dialogueBox.setVisible(false);
        }
    }
}
