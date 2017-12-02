/* globals __DEV__ */
import Phaser from 'phaser'
import Chuckles from '../sprites/Chuckles'
import Ball from '../sprites/Ball'
import {dist} from '../utils'

export default class extends Phaser.State {
  init () {}
  preload () {}

  createText (x, y, initialText){
  	const text = this.add.text(x, y, initialText)
    text.font = 'Bangers'
    text.padding.set(10, 16)
    text.fontSize = 40
    text.fill = '#77BFA3'
    text.smoothed = false
    text.anchor.setTo(0.5)
    return text
  }

  create () {
    const banner = this.createText(this.world.centerX, 40, 'Life of Chuckles')
	this.problemText = this.createText(this.world.centerX, 80, "")
  	this.problemOptionA = this.createText(this.world.centerX - 100, this.game.height - 80, "")
  	this.problemOptionB = this.createText(this.world.centerX + 100, this.game.height - 80, "")
  	this.problemTimeText = this.createText(this.world.centerX, 120, "")
  	this.scoreText = this.createText(this.world.centerX - 100, this.game.height - 40, '')
  	this.hpText = this.createText(this.world.centerX + 100, this.game.height - 40, '')

    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.zKey = this.game.input.keyboard.addKey(Phaser.KeyCode.Z)
    this.xKey = this.game.input.keyboard.addKey(Phaser.KeyCode.X)

    this.chuckles = new Chuckles({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      context: this
    })

    this.game.add.existing(this.chuckles)

    this.balls = []
    this.spawnBall()
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 400
    this.currentProblemIndex = 0;
    setTimeout(()=> this.spawnProblem(), 3000)
    this.hp = 30
    this.score = 0
    this.hpText.text = `HP: ${this.hp}`
    this.scoreText.text = `Score: ${this.score}`
  }

  spawnBall(){
  	const ball = new Ball({
      game: this.game,
      x: this.chuckles.x + 40,
      y: this.chuckles.y - 200
    })

    this.balls.push(ball)
    this.game.add.existing(ball)
    this.game.physics.arcade.enable(ball)
    setTimeout(()=> this.spawnBall(), 3000)
  }

  spawnProblem(){
  	if (this.currentProblemIndex === PROBLEMS.length){
  		this.problemTimeText.text = "You win!"
  		return;
  	}
  	const problem = PROBLEMS[this.currentProblemIndex++]
  	this.currentProblem = problem;
  	this.problemText.text = problem.text
  	this.problemOptionA.text = problem.answers[0]
  	this.problemOptionB.text = problem.answers[1]
  	this.problemTime = problem.time
  	this.countProblemTime()
  }

  countProblemTime() {
  	if (this.problemTime === 0){
  		this.resolveProblem();
  		return;
  	}
  	this.problemTimeText.text = this.problemTime
  	this.problemTime--;
  	setTimeout(()=> this.countProblemTime(), 1000)
  }

  resolveProblem() {
  	const selectedAnswer = this.chuckles.x < this.world.centerX ? 0 : 1;
  	if (selectedAnswer === this.currentProblem.correct){
  		// Score, relax, go forward
  		this.score++;
  		this.scoreText.text = `Score: ${this.score}`
  		this.problemTimeText.text = "Correct!"
  	} else {
  		this.problemTimeText.text = "Wrong!"
  		this.damage(10)
  		if (this.dead)
  			return;
  	}
  	setTimeout(()=> this.clearProblem(), 2000)
  	setTimeout(()=> this.spawnProblem(), 5000) // TODO: Problems come quicker everytime
  }

  clearProblem() {
  	this.problemText.text = ""
  	this.problemOptionA.text = ""
  	this.problemOptionB.text = ""
  	this.problemTimeText.text = ""
  }

  getBallAt(x,y) {
  	return this.balls.find(b => {
  		return dist(x,y,b.x,b.y) < 20
  	})
  }

  damage(damage){
  	this.hp -= damage
	this.hpText.text = `HP: ${this.hp}`
  	if (this.hp <= 0){
  		this.dead = true;
  	}
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
    }
  }
}

const PROBLEMS = [
	{
		text: "2 + 2",
		answers: [4, 1],
		correct: 0,
		time: 10
	},
	{
		text: "7 * 6",
		answers: [42, 46],
		correct: 0,
		time: 10
	},
]