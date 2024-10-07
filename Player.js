export default class Player {
    constructor(scene, baseGridX, baseGridY, collisionPositions, gridSize) {
        this.scene = scene;

        // 基準点を設定
        this.baseGridX = baseGridX; // 基準点 x (マス単位)
        this.baseGridY = baseGridY; // 基準点 y (マス単位)
        this.gridSize = gridSize;   // 1マスのサイズ（ピクセル単位）
        this.collisionPositions = collisionPositions;

        // プレイヤーの画像位置設定
        const x = this.baseGridX * this.gridSize;
        const y = this.baseGridY * this.gridSize;

        // 画像スプライトの配置
        this.sprite = scene.physics.add.sprite(x, y, 'player').setOrigin(0.5, 1);

        // プレイヤーの当たり判定設定（下半分の1マス分）
        const xOffsetCol = 0;
        const yOffsetCol = 0;
        const widthCol = 1;
        const heightCol = 1;

        // 当たり判定の範囲を設定
        this.sprite.body.setSize(widthCol * this.gridSize, heightCol * this.gridSize);
        this.sprite.body.setOffset(xOffsetCol * this.gridSize, yOffsetCol * this.gridSize);

        // キーボード入力もサポート
        this.cursors = scene.input.keyboard.createCursorKeys();

        // 仮想ジョイスティックの取得（カメラ倍率に依らず固定位置に表示）
        // スクリーンの右下にジョイスティックを固定
        const joystickRadius = 100;
        const joystickX = scene.scale.width - 150; // 固定されたx位置
        const joystickY = scene.scale.height - 150; // 固定されたy位置（画面の下から150ピクセル）

        this.joystick = scene.rexVirtualJoystick.add(scene, {
            x: joystickX,
            y: joystickY,
            radius: joystickRadius,
            base: scene.add.circle(0, 0, joystickRadius, 0x888888).setAlpha(0.5).setScrollFactor(0),
            thumb: scene.add.circle(0, 0, joystickRadius / 2, 0xcccccc).setAlpha(0.7).setScrollFactor(0),
            dir: '4dir', // 4方向（上下左右）
            forceMin: 16,
            fixed: true
        });

        // 仮想ジョイスティック全体のスクロールを無効にする
        this.joystick.base.setScrollFactor(0);
        this.joystick.thumb.setScrollFactor(0);

        // 移動フラグ
        this.isMoving = false;

        // アニメーションの作成
        this.createAnimations();

        // 当たり判定の可視化のために青い四角形を追加
        /*
        this.debugRect = scene.add.rectangle(
            x, y - (this.gridSize * heightCol) / 2,
            widthCol * this.gridSize, heightCol * this.gridSize,
            0x0000ff, 0.3
        ).setOrigin(0.5, 0.5);

        // 基準点の可視化のために小さな円を追加
        this.originMarker = scene.add.circle(
            this.baseGridX * this.gridSize,
            this.baseGridY * this.gridSize,
            4, // 半径4ピクセルの小さな円
            0x00ff00, // 緑色で表示
            1 // 不透明
        );
        */
    }

    createAnimations() {
        // アニメーションの設定
        this.scene.anims.create({
            key: 'walk_left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk_right',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk_up',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk_down',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        // キャラクターが移動中でない場合にのみ次の移動を受け付ける
        if (this.isMoving) return;

        let direction = null;

        // キーボードの入力で移動方向を決定
        if (this.cursors.left.isDown) {
            direction = 'left';
        } else if (this.cursors.right.isDown) {
            direction = 'right';
        } else if (this.cursors.up.isDown) {
            direction = 'up';
        } else if (this.cursors.down.isDown) {
            direction = 'down';
        }

        // ジョイスティックの入力で移動方向を決定
        let forceX = this.joystick.forceX;
        let forceY = this.joystick.forceY;

        if (forceX !== 0 || forceY !== 0) {
            if (Math.abs(forceX) > Math.abs(forceY)) {
                if (forceX < 0) {
                    direction = 'left';
                } else {
                    direction = 'right';
                }
            } else {
                if (forceY < 0) {
                    direction = 'up';
                } else {
                    direction = 'down';
                }
            }
        }

        if (direction) {
            if (!this.isColliding(direction)) {
                this.moveInDirection(direction);
            } else {
                this.changeDirectionOnly(direction);
            }
        }

        // 当たり判定の可視化用四角形をプレイヤーに合わせて移動
        //this.debugRect.setPosition(this.sprite.x, this.sprite.y - (this.gridSize / 2));

        // 基準点の可視化用円をプレイヤーの基準点に合わせて移動
        //this.originMarker.setPosition(this.baseGridX * this.gridSize, this.baseGridY * this.gridSize);
    }


    isColliding(direction) {
        // 次の移動先のグリッド位置を計算
        let targetGridX = this.baseGridX;
        let targetGridY = this.baseGridY;
    
        if (direction === 'left') {
            targetGridX -= 1;
        } else if (direction === 'right') {
            targetGridX += 1;
        } else if (direction === 'up') {
            targetGridY -= 1;
        } else if (direction === 'down') {
            targetGridY += 1;
        }
    
        // NPCや壁との衝突を確認
        for (let position of this.collisionPositions) {
            if (position.x === targetGridX && position.y === targetGridY) {
                return true; // 衝突あり
            }
        }
    
        // 衝突がなければ false
        return false;
    }
    
    

    moveInDirection(direction) {
        this.isMoving = true;

        // 現在位置から次の移動先を決定
        let targetGridX = this.baseGridX;
        let targetGridY = this.baseGridY;

        if (direction === 'left') {
            targetGridX -= 1;
            this.sprite.anims.play('walk_left', true);
        } else if (direction === 'right') {
            targetGridX += 1;
            this.sprite.anims.play('walk_right', true);
        } else if (direction === 'up') {
            targetGridY -= 1;
            this.sprite.anims.play('walk_up', true);
        } else if (direction === 'down') {
            targetGridY += 1;
            this.sprite.anims.play('walk_down', true);
        }

        // 新しい座標をピクセル座標に変換して移動
        const targetX = targetGridX * this.gridSize;
        const targetY = targetGridY * this.gridSize;

        // Tweenを使ってスムーズに移動
        this.scene.tweens.add({
            targets: this.sprite,
            x: targetX,
            y: targetY,
            duration: 200,
            onComplete: () => {
                // 新しい位置を基準点として更新
                this.baseGridX = targetGridX;
                this.baseGridY = targetGridY;

                this.isMoving = false;
                this.sprite.anims.stop();
            }
        });
    }

    changeDirectionOnly(direction) {
        // 衝突しているが、向きを変える
        if (direction === 'left') {
            this.sprite.anims.play('walk_left', true);
        } else if (direction === 'right') {
            this.sprite.anims.play('walk_right', true);
        } else if (direction === 'up') {
            this.sprite.anims.play('walk_up', true);
        } else if (direction === 'down') {
            this.sprite.anims.play('walk_down', true);
        }
        this.scene.time.delayedCall(100, () => {
            // 少しだけ向きのアニメーションを再生してから停止
            this.sprite.anims.stop();
        });
    }
}
