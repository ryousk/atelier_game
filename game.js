/*
 * This project uses Phaser.js.
 * Copyright (c) 2013-2023 Photon Storm Ltd.
 * Licensed under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MainScene from './MainScene.js';
import GameClearScene from './GameClearScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene, GameClearScene],  // MainScene を利用
    plugins: {
        scene: [
            {
                key: 'rexVirtualJoystick',
                plugin: rexvirtualjoystickplugin,
                mapping: 'rexVirtualJoystick'
            }
        ]
    }
};

const game = new Phaser.Game(config);
