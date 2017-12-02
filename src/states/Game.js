/* globals __DEV__ */
import Phaser from 'phaser'
import Chuckles from '../sprites/Chuckles'
import Ball from '../sprites/Ball'
import {dist} from '../utils'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    const bannerText = 'Life of Chuckles'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.zKey = this.game.input.keyboard.addKey(Phaser.KeyCode.Z)
    this.xKey = this.game.input.keyboard.addKey(Phaser.KeyCode.X)

    this.chuckles = new Chuckles({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      context: this
    })

    this.balls = [];

    const ball = new Ball({
      game: this.game,
      x: this.world.centerX + 40,
      y: this.world.centerY - 100
    })

    this.balls.push(ball)

    this.game.add.existing(this.chuckles)
    this.game.add.existing(ball)

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 400

    this.game.physics.arcade.enable([ball]);
  }

  getBallAt(x,y) {
  	return this.balls.find(b => {
  		return dist(x,y,b.x,b.y) < 20
  	})
  }

  update () {
  	const cursors = this.cursors;
	if (cursors.left.isDown) {
	    this.chuckles.leftHand()
	} else if (cursors.right.isDown) {
	    this.chuckles.rightHand()
	} else if (this.zKey.isDown) {
	    this.chuckles.x --;
	} else if (this.xKey.isDown) {
	    this.chuckles.x ++;
	}
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.chuckles, 32, 32)
    }
  }
}
