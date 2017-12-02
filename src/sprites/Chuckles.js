import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, context }) {
    super(game, x, y, 'chuckles', 0)
    this.animations.add('dance', [0, 1], 3, true)
    this.anchor.setTo(0.5)
    this.animations.play('dance')
    this.context = context
  }

  leftHand(){
	const ball = this.context.getBallAt(this.x - 30, this.y - 20)
  	if (ball) {
  		ball.body.velocity.y = -400
  		ball.body.velocity.x = 40
  	}  	
  }

  rightHand(){
  	const ball = this.context.getBallAt(this.x + 30, this.y - 20)
  	if (ball) {
  		ball.body.velocity.y = -60
  		ball.body.velocity.x = -200
  	}
  }
}
