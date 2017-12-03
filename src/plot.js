export default {
	START: {
		text: "Chuck was born one day in a happy family",
		fn: (context) => {
			context.addPerson(1, context.world.centerX - 120)
		    context.addPerson(0, context.world.centerX + 120)
		},
		next: 'AGE5'
	},
	AGE5: {
		text: "When he was five years old, their parents took him to a preschool",
		fn: (context) => {
			context.setStressLevel(1)
		},
		next: 'CHOICE'
	},
	CHOICE: {
		text: "Chuck is at the playground",
		choice: {
			text: "Select a toy",
			choices: ["Cube", "Ball"],
			nexts: ["MATH", "SPORT"]
		}
	},
	MATH: {
		text: "Chuck plays with the Geometric Cube",
		problem: {
			text: "Figure it out?",
			answers: ["Yes", "No"],
			correct: 0,
			onCorrect: (context) => {
				context.chuckles.increaseInt(1)
			},
			time: 10
		},
		next: 'KINDER'
	},
	SPORT: {
		text: "Chuck tries to kick the ball",
		problem: {
			text: "One, two and three!",
			answers: ["Hit!", "Miss"],
			correct: 0,
			onCorrect: (context) => {
				context.chuckles.increaseDex(1)
			},
			time: 10
		},
		next: 'KINDER'
	},
	KINDER: {
		text: "Chuck is now at Kindergarten",
		fn: (context) => {
			context.chuckles.setAge(1)
		},
		choice: {
			text: "Favorite Class",
			choices: ["Colors", "Alphabet"],
			nexts: ["COLORS", "ALPHABET"]
		}
	},
	COLORS: {
		text: "Chuck is using the pencil colors",
		problem: {
			text: "Draw inside the shape",
			answers: ["Yes", "No"],
			correct: 0,
			onCorrect: (context) => {
				context.chuckles.increaseArt(1)
			},
			time: 10
		},
		next: 'FRIEND'
	},
	ALPHABET: {
		text: "Chuck is learning the alphabet",
		problem: {
			text: "Draw the vowels",
			answers: ["ɐɤɘɑI", "aeiou"],
			correct: 0,
			onCorrect: (context) => {
				context.chuckles.increaseInt(1)
			},
			time: 10
		},
		next: 'FRIEND'
	},
	FRIEND: {
		text: "Chuck met a friend, Paul. He gave him a nickname: Chuckles",
		fn: (context) => {
			context.addPerson(2)
		},
		next: 'HELP_FRIEND'
	},
	HELP_FRIEND: {
		text: "Paul is being harrased by some schoolmates",
		choice: {
			text: "",
			choices: ["Help Paul", "Run Away"],
			onA: (context) => {
				context.chuckles.increaseSoc(1)
			},
			nexts: ["DEATH","DEATH"],
			time: 10
		}
	},
	DEATH: {
		text: "Then he died."
	}
}