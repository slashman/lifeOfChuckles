/* globals __DEV__ */
import Phaser from 'phaser'
import Chuckles from '../sprites/Chuckles'
import Ball from '../sprites/Ball'
import {dist, getRandomInt} from '../utils'
import plot from '../plot'

const STORY_DELAY = 4000
const EASY_MODE = true
const BALL_DELAY = 3000

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

  	this.hapText = this.createText(this.world.centerX + 250, 210, '', 20)

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
    this.timeout(()=> this.askForNewBall(), BALL_DELAY)
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
  	this.hapText.text = `Happy: ${this.chuckles.hap}`
  }

  setStressLevel(l) {
  	this.stressLevel = l+1
  }

  spawnBall(){
  	if (this.dead) return;
  	const ball = new Ball({
      game: this.game,
      x: this.chuckles.x + 40 * (this.chuckles.leftHanded ? 1 : -1),
      y: this.chuckles.y - 200,
      age: this.chuckles.age
    })

    this.balls.push(ball)
    this.game.add.existing(ball)
    this.game.physics.arcade.enable(ball)
    this.timeout(()=> this.askForNewBall(), BALL_DELAY)
  }

  scoreBall(){
  	this.score += this.balls.length;
  	this.scoreText.text = `Score: ${this.score}`
  	this.scoreSound()
  }

  askForNewBall(){
  	if (this.dead) return;
  	if (this.balls.length >= this.stressLevel){
  		this.timeout(()=> this.askForNewBall(), BALL_DELAY)
  		return;
  	}
  	if (this.balls.length === 0){
  		this.spawnBall()
  	} else {
  		this.chuckles.shootNewBall = true	
  	}
  }

  spawnProblem(problem){
  	if (this.dead) return;
  	this.currentProblem = problem;
  	this.problemText.text = problem.text
  	this.problemOptionA.text = problem.answers[0]
  	this.problemOptionB.text = problem.answers[1]
  	this.problemTime = problem.time
  	this.selectedAnswerIcon.visible = true;
  	this.countProblemTime()
  }

  spawnChoice(choice){
  	if (this.dead) return;

  	this.currentProblem = choice
  	this.currentProblem.isChoice = true
  	this.problemText.text = choice.text
  	this.problemOptionA.text = choice.choices[0]
  	this.problemOptionB.text = choice.choices[1]
  	this.problemTime = 10
  	this.selectedAnswerIcon.visible = true;
  	this.countProblemTime()
  }

  spawnStory(story){
  	if (this.dead) return;
  	this.eventSound();
  	this.storyText.text = story.text;
  	let next = story.next
  	if (story.fn){
  		next = story.fn(this)
  	}
  	if (story.problem){
  		this.spawnProblem(story.problem)
  		this.currentProblem.next = next
  	} else if (story.choice) {
  		this.spawnChoice(story.choice)
  	} else if (next){
		this.timeout(()=> this.spawnStory(plot[next]), STORY_DELAY)
    }
  }

  countProblemTime() {
  	if (this.dead) return;
  	if (this.problemTime === 0){
  		this.resolveProblem();
  		return;
  	}
  	this.problemTimeText.text = this.problemTime
  	this.problemTime--;
  	this.timeout(()=> this.countProblemTime(), 1000)
  }

  resolveProblem() {
  	if (this.dead) return;
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
	  		this.score += 20;
	  		this.scoreSound()
	  		this.scoreText.text = `Score: ${this.score}`
	  		this.problemTimeText.text = "Good!"
	  		if (this.currentProblem.onCorrect){
	  			this.currentProblem.onCorrect(this)
	  		}
	  	} else {
	  		this.problemTimeText.text = "Boo!"
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
  	this.explosionSound()
  	this.chuckles.hp -= damage
  	this.updateStats()
  	if (this.chuckles.hp <= 0){
  		this.dead = true;
  		this.problemText.text = "You failed at living."
  	}
  }

  removePerson(index){
  	const toRemove = this.persons.find(p=>p.personIndex === index)
  	this.persons = this.persons.filter(p=>p.personIndex !== index)
  	toRemove && toRemove.destroy()
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
  	person.personIndex = index;
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

	if (this.dead) return;

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

  explosionSound() {
  	this.doSound([3,,0.2458,0.2613,0.3727,0.1637,,-0.2891,,,,-0.7479,0.8218,,,,0.2222,-0.0107,1,,,,,0.5])
  }

  scoreSound() {
  	 this.doSound([0,,0.1004,,0.2588,0.3634,,0.2999,,,,,,0.5796,,0.4403,,,1,,,,,0.5])
  }

  eventSound() {
  	this.doSound([0,0.023,0.0646,0.0149,0.6111,0.2414,,-0.3153,-0.0119,-0.9614,0.3539,-0.6659,-0.0534,0.1527,0.0018,0.4871,0.0879,-0.0111,0.6889,-0.0805,0.2089,0.162,-0.2478,0.5])
  }

 doSound (values){
 	var soundURL = jsfxr(values); 
	 var player = new Audio();
	 player.src = soundURL;
	 player.play();
 }
}