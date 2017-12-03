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

  	this.hp = 20
  	this.dex = 1
  	this.speed = 1
  	this.int = 0
  	this.art = 0
  	this.soc = 0
  	this.hap = 3

    this.age = 0
  }

  setAge (age) {
  	this.age = age;
  	let range = AGE_RANGES[this.age]
  	if (!range) {
  		range = AGE_RANGES[AGE_RANGES.length - 1]
  	}
  	this.animations.add('dance', [0+range.app*2, 1+range.app*2], 3, true)
	this.animations.play('dance')
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
  	if (ball && ball.body) {
  		if (this.leftHanded) {
	  		ball.body.velocity.y = -200
	  		ball.body.velocity.x = 40
	  	} else {
	  		ball.body.velocity.y = -60
	  		ball.body.velocity.x = 100
	  	}
	  	if (!ball.touched){
	  		ball.touched = true;
	  		if (++ball.touchTimes > 20){
	  			ball.dead = true
	  			this.context.balls = this.context.balls.filter(b=>b.dead === false)
	  			ball.destroy()
	  		}
	  		setTimeout(()=>ball.touched = false, 500)
	  		this.context.scoreBall()
	  	}
  	}
  	this.checkNextBall()
  }

  rightHand(){
  	const ball = this.context.getBallAt(this.x + 30, this.y - 20)
  	if (ball && ball.body) {
  		if (this.leftHanded) {
	  		ball.body.velocity.y = -60
	  		ball.body.velocity.x = -100
	  	} else {
	  		ball.body.velocity.y = -200
	  		ball.body.velocity.x = -40
	  	}
	  	if (!ball.touched){
	  		ball.touched = true;
	  		if (++ball.touchTimes > 20){
	  			ball.dead = true
	  			this.context.balls = this.context.balls.filter(b=>b.dead === false)
	  			ball.destroy()
	  		}
	  		setTimeout(()=>ball.touched = false, 500)
	  		this.context.scoreBall()
	  	}
  	}
  	this.checkNextBall()
  }

  checkNextBall(){
  	if (this.shootNewBall){
  		this.shootNewBall = false
  		this.context.spawnBall()
  	}
  }

  increaseInt(){
  	this.int++
  	this.hp += 5
  	this.context.updateStats()
  }

  increaseDex(){
  	this.dex ++
  	this.speed ++
  	this.context.updateStats()
  }

  increaseArt(){
  	this.art++
  	this.context.updateStats()
  }

  increaseSoc(){
  	this.soc ++
  	this.context.updateStats()
  }

  increaseHap(){
  	this.hap ++
  	this.context.updateStats()
  }

  reduceHap(){
  	this.hap --
  	this.context.updateStats()
  }

}


const AGE_RANGES = [
	{ app: 0 },
	{ app: 1 },
	{ app: 2 },
	{ app: 3 }
]