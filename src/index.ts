import 'phaser';

import './index.css';

import { DayScene } from 'scenes/DayScene';
import { HowToPlayScene } from 'scenes/HowToPlayScene';
import { CreditsScene } from 'scenes/CreditsScene';
import { debugMap } from 'packages/utils/shouldSkipIntro';
import { BootScene } from './scenes/BootScene';
import { LoadingScene } from './scenes/LoadingScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { HUDScene } from './scenes/HUDScene';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  banner: true,
  width: 1920,
  height: 1080,
  scene: [
    BootScene,
    LoadingScene,
    MainMenuScene,
    GameScene,
    DayScene,
    HowToPlayScene,
    CreditsScene,
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
    arcade: debugMap()
      ? {
          debug: true,
          debugShowBody: true,
          debugShowStaticBody: true,
          debugShowVelocity: true,
          debugVelocityColor: 0xffff00,
          debugBodyColor: 0x0000ff,
          debugStaticBodyColor: 0xffffff,
          debugWorldBounds: true,
        }
      : {},
  },
  maxLights: 15,
} as Phaser.Types.Core.GameConfig);

window.addEventListener('load', (): Phaser.Game => game);
