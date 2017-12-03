/* globals __DEV__ */
import Phaser from 'phaser'
import Chuckles from '../sprites/Chuckles'
import Ball from '../sprites/Ball'
import {dist, getRandomInt} from '../utils'
import plot from '../plot'

const STORY_DELAY = 5000
const EASY_MODE = true

export default class extends Phaser.State {
  init () {}
  preload () {}

  createText (x, y, initialText, size){
  	const text = this.add.text(x, y, initialText)
    text.font = 'Oswald'
    text.padding.set(10, 16)
    text.fontSize = size
    text.fill = '#000000'
    text.smoothed = false
    text.anchor.setTo(0.5)
    return text
  }

  create () {
    const banner = this.createText(this.world.centerX, 40, 'Life of Chuckles', 40)
	this.problemText = this.createText(this.world.centerX, this.world.centerY + 120, "", 30)
  	this.problemOptionA = this.createText(this.world.centerX - 100, this.game.height - 80, "", 30)
  	this.problemOptionB = this.createText(this.world.centerX + 100, this.game.height - 80, "", 30)
  	this.problemTimeText = this.createText(this.world.centerX, this.game.height - 40, "", 40)
  	this.scoreText = this.createText(this.world.centerX - 250, 30, '', 20)
  	
  	this.intText = this.createText(this.world.centerX - 250, 150, '', 20)
  	this.dexText = this.createText(this.world.centerX - 250, 180, '', 20)
  	
  	this.hpText = this.createText(this.world.centerX + 250, 30, '', 20)

  	this.socText = this.createText(this.world.centerX + 250, 150, '', 20)
  	this.artText = this.createText(this.world.centerX + 250, 180, '', 20)

  	this.storyText = this.createText(this.world.centerX,  90, '', 20)

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
    this.persons = []
    
    this.selectedAnswerIcon = this.game.add.sprite(this.world.centerX, this.game.height - 50, 'arrows', 4)
    this.selectedAnswerIcon.anchor.setTo(0.5)
    this.selectedAnswerIcon.visible = false;

    this.cursors.up.onDown.add(()=>this.chuckles.toogleHand());
    this.cursors.down.onDown.add(()=>this.chuckles.toogleHand());

    this.game.add.existing(this.chuckles)

    this.balls = []
    this.stressLevel = 0;
    this.timeout(()=> this.askForNewBall(), 5000)
    this.timeout(()=> this.spawnStory(plot.START), STORY_DELAY)
    
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 200
    this.score = 0
    this.scoreText.text = `Score: ${this.score}`
    this.updateStats()
  }

  updateStats(){
  	this.intText.text = `INT: ${this.chuckles.int}`
  	this.dexText.text = `DEX: ${this.chuckles.dex}`
  	this.hpText.text = `HP: ${this.chuckles.hp}`
  	this.socText.text = `SOC: ${this.chuckles.soc}`
  	this.artText.text = `ART: ${this.chuckles.art}`
  }

  setStressLevel(l) {
  	this.stressLevel = l
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
    this.timeout(()=> this.askForNewBall(), 5000)
  }

  askForNewBall(){
  	if (this.balls.length >= this.stressLevel){
  		this.timeout(()=> this.askForNewBall(), 5000)
  		return;
  	}
  	if (this.balls.length === 0){
  		this.spawnBall()
  	} else {
  		this.chuckles.shootNewBall = true	
  	}
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
		this.timeout(()=> this.spawnStory(plot[story.next]), STORY_DELAY)
    }
  }

  countProblemTime() {
  	if (this.problemTime === 0){
  		this.resolveProblem();
  		return;
  	}
  	this.problemTimeText.text = this.problemTime
  	this.problemTime--;
  	this.timeout(()=> this.countProblemTime(), 1000)
  }

  resolveProblem() {
  	const selectedAnswer = this.chuckles.x < this.world.centerX ? 0 : 1;
  	if (this.currentProblem.isChoice){
  		if (selectedAnswer === 0) {
  			if (this.currentProblem.onA){
  				this.currentProblem.onA(this)
  			}
  			this.problemTimeText.text = this.currentProblem.choices[0]
  		} else if (selectedAnswer === 1) {
  			if (this.currentProblem.onB){
  				this.currentProblem.onB(this)
  			}
  			this.problemTimeText.text = this.currentProblem.choices[1]
  		}
  		this.problemOptionA.text = ""
  		this.problemOptionB.text = ""
  		this.timeout(()=> this.spawnStory(plot[this.currentProblem.nexts[selectedAnswer]]), 4000)
	} else {
		if (selectedAnswer === this.currentProblem.correct){
	  		this.score++;
	  		this.scoreText.text = `Score: ${this.score}`
	  		this.problemTimeText.text = "Correct!"
	  		if (this.currentProblem.onCorrect){
	  			this.currentProblem.onCorrect(this)
	  		}
	  	} else {
	  		this.problemTimeText.text = "Wrong!"
	  		this.damage(10)
	  		if (this.dead)
	  			return;
	  	}
	  	this.timeout(()=> this.spawnStory(plot[this.currentProblem.next]), 4000)
	}
  	this.selectedAnswerIcon.visible = false;
  	this.timeout(()=> this.clearProblem(), 2000)
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
  	this.chuckles.hp -= damage
  	this.updateStats()
  	if (this.chuckles.hp <= 0){
  		this.dead = true;
  	}
  }

  addPerson(index, x){
  	if (!x){
  		if (this.persons.length == 0){
  			x = getRandomInt(60, this.game.width - 60)
  		} else {
  			let safe = 1000
	  		retry: while (true){
	  			x = getRandomInt(60, this.game.width - 60)
	  			for (let i = 0; i < this.persons.length; i++){
	  				const p = this.persons[i];
	  				const dist = Math.abs(x - p.x);
	  				if (dist < 40){
	  					if (--safe > 0){
	  						continue retry;
	  					} else {
	  						break;
	  					}
	  				}
	  			}
	  			break;
	  		}	
  		}
  	}
  	const person = this.game.add.sprite(x, this.chuckles.y - 20, 'people', index, this.personsGroup)
  	person.anchor.setTo(0.5)
  	this.persons.push(person)
  }

  update () {
  	let removed = false;
  	this.balls.forEach(b=>{
  		if (b.y >= this.world.centerY + 60) {
  			b.dead = true
  			b.body.enable = false
  			removed = true
  			this.damage(1)
  			this.chuckles.checkNextBall()
  		}
  	})
  	if (removed) {
		this.balls = this.balls.filter(b=>b.dead === false)
	}

	if (EASY_MODE){
		this.chuckles.leftHand()
		this.chuckles.rightHand()
	}
    
  	const cursors = this.cursors;
	if (cursors.left.isDown) {
	    this.chuckles.x -= this.chuckles.speed
	} else if (cursors.right.isDown) {
	    this.chuckles.x += this.chuckles.speed
	} else if (this.zKey.isDown) {
		this.chuckles.leftHand()	    
	} else if (this.xKey.isDown) {
	    this.chuckles.rightHand()
	}
	const selectedAnswer = this.chuckles.x < this.world.centerX ? 0 : 1;
  	if (selectedAnswer === 0) {
		this.selectedAnswerIcon.x = this.world.centerX - 100;
	} else {
		this.selectedAnswerIcon.x = this.world.centerX + 100;
	}
  }

	timeout(fn, time) {
		this.game.time.events.add(time, fn);
	}

  render () {
    if (__DEV__) {
    }
  }
}