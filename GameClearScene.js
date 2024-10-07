export default class GameClearScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameClearScene' });
    }

    create() {
        // 背景を白に設定
        this.cameras.main.setBackgroundColor('#ffffff');

        // "ゲームクリア"のメッセージを表示
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 80, '遊んでいただきありがとうございます。\r\n\r\n真っ白なキャンバス\r\nラストライブの情報は', {
            fontSize: '36px',
            fill: '#000',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        // URLの表示（クリック可能にする）
        const urlText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'こちらから', {
            fontSize: '48px',
            fill: '#0000ff',
            align: 'center',
            backgroundColor: '#007bff',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        // ボタンの見た目にするために、少しスタイルを変更
        urlText.setStyle({
            backgroundColor: '#007bff',
            borderRadius: '10px'
        });

        // スマホ版でも確実にリンクをクリック・タッチ可能にする
        urlText.on('pointerup', () => {
            window.open('https://shirokyan.com/news/3632/', '_blank');
        });

        // ユーザーが視覚的にタッチ可能だと認識できるようにボタンのエフェクト
        urlText.on('pointerover', () => {
            urlText.setStyle({ backgroundColor: '#0056b3' });
        });

        urlText.on('pointerout', () => {
            window.open('https://shirokyan.com/news/3632/', '_blank');
        });
    }
}
