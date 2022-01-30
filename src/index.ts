import 'phaser';

import './index.css';

import { DayScene } from 'scenes/DayScene';
import { BootScene } from './scenes/BootScene';
import { LoadingScene } from './scenes/LoadingScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { HUDScene } from './scenes/HUDScene';
import { HowToPlayScene } from './scenes/HowToPlayScene';
import { CreditsScene } from './scenes/CreditsScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  banner: true,
  width: 1920,
  height: 1080,
  scene: [
    BootScene,
    // LoadingScene,
    // MainMenuScene,
    DayScene,
    GameScene,
    // HowToPlayScene,
    // CreditsScene,
    HUDScene,
  ],
  scale: {
    parent: 'app',
    mode: Phaser.Scale.FIT,
    width: 1280,
    height: 720,
  },
  zoom: 5,
  physics: {
    default: 'arcade',
  },
  maxLights: 15,
});

window.addEventListener('load', (): Phaser.Game => game);
