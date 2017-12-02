import Phaser from 'phaser'

import {getRandomInt} from '../utils'


export default class extends Phaser.Sprite {
  constructor ({ game, x, y, age}) {
    super(game, x, y, 'ball', selectFromAge(age))
    this.anchor.setTo(0.5)
  }

  
}

function selectFromAge(age){
	let range = AGE_RANGES[age];
	if (!range)
		range = AGE_RANGES[AGE_RANGES.length -1]
  	return getRandomInt(range.from, range.to)
}

const AGE_RANGES = [
	{ from: 0, to: 0 },
	{ from: 0, to: 1 },
	{ from: 1, to: 1 },
	{ from: 1, to: 2 },
	{ from: 2, to: 2 },
	{ from: 2, to: 2 },
	{ from: 2, to: 3 }
]