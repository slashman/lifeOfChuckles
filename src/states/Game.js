/* globals __DEV__ */
import Phaser from 'phaser'
import Chuckles from '../sprites/Chuckles'
import Ball from '../sprites/Ball'
import {dist, getRandomInt} from '../utils'
import plot from '../plot'

const STORY_DELAY = 10000

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
	this.problemText = this.createText(this.world.centerX, 100, "")
  	this.problemOptionA = this.createText(this.world.centerX - 100, this.game.height - 80, "")
  	this.problemOptionB = this.createText(this.world.centerX + 100, this.game.height - 80, "")
  	this.problemTimeText = this.createText(this.world.centerX, this.game.height - 40, "")
  	this.scoreText = this.createText(this.world.centerX - 150, 80, '')
  	this.hpText = this.createText(this.world.centerX + 150, 80, '')
  	this.storyText = this.createText(this.world.centerX, this.world.centerY + 60, '')

    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.zKey = this.game.input.keyboard.addKey(Phaser.KeyCode.Z)
    this.xKey = this.game.input.keyboard.addKey(Phaser.KeyCode.X)

	this.personsGroup = this.game.add.group()
    this.chucklesGroup = this.game.add.group()

    this.chuckles = new Chuckles({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      context: this
    })
    this.addPerson(1, this.world.centerX - 120)
    this.addPerson(0, this.world.centerX + 120)

    this.selectedAnswerIcon = this.game.add.sprite(this.world.centerX, this.game.height - 50, 'arrows', 4)
    this.selectedAnswerIcon.anchor.setTo(0.5)
    this.selectedAnswerIcon.visible = false;

    this.cursors.up.onDown.add(()=>this.chuckles.toogleHand());
    this.cursors.down.onDown.add(()=>this.chuckles.toogleHand());

    this.game.add.existing(this.chuckles)

    this.balls = []
    setTimeout(()=> this.spawnBall(), 5000)
    setTimeout(()=> this.spawnStory(plot.START), STORY_DELAY)
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 400
    this.hp = 30
    this.score = 0
    this.hpText.text = `HP: ${this.hp}`
    this.scoreText.text = `Score: ${this.score}`
  }

  spawnBall(){
  	const ball = new Ball({
      game: this.game,
      x: this.chuckles.x + 40 * (this.chuckles.leftHanded ? 1 : -1),
      y: this.chuckles.y - 200,
      age: this.chuckles.age
    })

    this.balls.push(ball)
    this.game.add.existing(ball)
    this.game.physics.arcade.enable(ball)
    setTimeout(()=> this.spawnBall(), 10000)
  }

  spawnProblem(problem){
  	this.currentProblem = problem;
  	this.problemText.text = problem.text
  	this.problemOptionA.text = problem.answers[0]
  	this.problemOptionB.text = problem.answers[1]
  	this.problemTime = problem.time
  	this.selectedAnswerIcon.visible = true;
  	this.countProblemTime()
  }

  spawnChoice(choice){
  	this.currentProblem = choice
  	this.currentProblem.isChoice = true
  	this.problemText.text = choice.text
  	this.problemOptionA.text = choice.choices[0]
  	this.problemOptionB.text = choice.choices[1]
  	this.problemTime = 5
  	this.selectedAnswerIcon.visible = true;
  	this.countProblemTime()
  }

  spawnStory(story){
  	this.storyText.text = story.text;
  	if (story.fn){
  		story.fn(this)
  	}
  	if (story.problem){
  		this.spawnProblem(story.problem)
  		this.currentProblem.next = story.next
  	} else if (story.choice) {
  		this.spawnChoice(story.choice)
  	} else if (story.next){
		setTimeout(()=> this.spawnStory(plot[story.next]), STORY_DELAY)
    }
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
  	if (this.currentProblem.isChoice){
  		this.problemTimeText.text = "Ok..."
  		setTimeout(()=> this.spawnStory(plot[this.currentProblem.nexts[selectedAnswer]]), 4000)
	} else {
		if (selectedAnswer === this.currentProblem.correct){
	  		this.score++;
	  		this.scoreText.text = `Score: ${this.score}`
	  		this.problemTimeText.text = "Correct!"
	  	} else {
	  		this.problemTimeText.text = "Wrong!"
	  		this.damage(10)
	  		if (this.dead)
	  			return;
	  	}
	  	this.chuckles.increaseAge();
	  	setTimeout(()=> this.spawnStory(plot[this.currentProblem.next]), 4000)
	}
  	this.selectedAnswerIcon.visible = false;
  	setTimeout(()=> this.clearProblem(), 2000)
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

  addPerson(index, x){
  	if (!x){
  		x = getRandomInt(60, this.game.width - 60)
  	}
  	const person = this.game.add.sprite(x, this.chuckles.y - 20, 'people', index, this.personsGroup)
  	person.anchor.setTo(0.5)
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
	const selectedAnswer = this.chuckles.x < this.world.centerX ? 0 : 1;
  	if (selectedAnswer === 0) {
		this.selectedAnswerIcon.x = this.world.centerX - 100;
	} else {
		this.selectedAnswerIcon.x = this.world.centerX + 100;
	}
  }



  render () {
    if (__DEV__) {
    }
  }
}