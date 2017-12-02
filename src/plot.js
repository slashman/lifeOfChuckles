export default {
	START: {
		text: "Chuck was born one day in a happy family",
		next: 'CHOICE'
	},
	CHOICE: {
		text: "Chuck grew up, started juggling things around",
		choice: {
			text: "Select a toy",
			choices: ["Cube", "Ball"],
			nexts: ["MATH", "SPORT"]
		}
	},
	MATH: {
		text: "Chuck became interested on Math",
		problem: {
			text: "2 + 2",
			answers: [4, 1],
			correct: 0,
			time: 10
		},
		next: 'FRIEND'
	},
	SPORT: {
		text: "Chuck became interested on Sports",
		fn: (context) => {
			context.spawnBall()
		},
		next: 'FRIEND'
	},
	FRIEND: {
		text: "Chuck met a friend, Paul. He gave him a nickname: Chuckles",
		fn: (context) => {
			context.addPerson(2)
		},
		next: 'DEATH'
	},
	DEATH: {
		text: "Then he died."
	}
}