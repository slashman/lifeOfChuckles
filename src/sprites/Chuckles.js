import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, context }) {
    super(game, x, y, 'chuckles', 0)
    this.animations.add('dance', [0, 1], 3, true)
    this.anchor.setTo(0.5)
    this.animations.play('dance')
    this.context = context
    this.leftHanded = true
    this.leftThrower = game.make.sprite(-40, 10, 'arrows', 1)
    this.rightThrower = game.make.sprite(40, 10, 'arrows', 0)
    this.leftThrower.anchor.setTo(0.5)
    this.rightThrower.anchor.setTo(0.5)
    this.addChild(this.leftThrower)
    this.addChild(this.rightThrower)
    this.age = 0
  }

  toogleHand () {
  	this.leftHanded = !this.leftHanded;
    if (this.leftHanded){
    	this.leftThrower.loadTexture('arrows', 1)
    	this.rightThrower.loadTexture('arrows', 0)
    } else {
    	this.leftThrower.loadTexture('arrows', 3)
    	this.rightThrower.loadTexture('arrows', 2)
    }
  }

  leftHand(){
	const ball = this.context.getBallAt(this.x - 30, this.y - 20)
  	if (ball) {
  		if (this.leftHanded) {
	  		ball.body.velocity.y = -400
	  		ball.body.velocity.x = 40
	  	} else {
	  		ball.body.velocity.y = -60
	  		ball.body.velocity.x = 200
	  	}
  	}  	
  }

  rightHand(){
  	const ball = this.context.getBallAt(this.x + 30, this.y - 20)
  	if (ball) {
  		if (this.leftHanded) {
	  		ball.body.velocity.y = -60
	  		ball.body.velocity.x = -200
	  	} else {
	  		ball.body.velocity.y = -400
	  		ball.body.velocity.x = -40
	  	}
  	}
  }
}
