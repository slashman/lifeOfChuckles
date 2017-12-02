import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    this.load.spritesheet('chuckles', 'assets/images/chuckles.png', 100, 100)
    this.load.spritesheet('arrows', 'assets/images/arrows.png', 35, 35)
    this.load.image('ball', 'assets/images/ball.png')
  }

  create () {
    this.state.start('Game')
  }
}
