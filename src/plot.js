export default {
	START: {
		text: "Chuck was born one day in a happy family",
		fn: (context) => {
			context.addPerson(1, context.world.centerX - 120)
		    context.addPerson(0, context.world.centerX + 120)
		    return 'AGE5'
		}
	},
	AGE5: {
		text: "When he was five years old, their parents took him to a preschool",
		fn: (context) => {
			context.setStressLevel(1)
			return 'CHOICE'
		}
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
			correct: 1,
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
			context.chuckles.setAge(1)
			context.addPerson(2)
			context.chuckles.increaseHap(1)
			return 'HELP_FRIEND'
		}
	},
	HELP_FRIEND: {
		text: "Paul is being harrased by some schoolmates",
		choice: {
			text: "",
			choices: ["Help Paul", "Run Away"],
			onA: (context) => {
				context.chuckles.increaseSoc(1)
			},
			nexts: ["ELEM","ELEM"],
			time: 10
		}
	},
	ELEM: {
		text: "Chuck is now at Elementary School",
		next: 'FATHERDIED'
	},
	FATHERDIED: {
		text: "Chuck's father passed away last summer.",
		fn: (context) => {
			context.removePerson(0)
			context.setStressLevel(2)
			context.chuckles.reduceHap(1)
			return 'ELEM_SUB'
		}
	},
	ELEM_SUB: {
		text: "Chuck must focus in a subject",
		choice: {
			text: "Favorite Class",
			choices: ["Math", "Sport"],
			nexts: ["MATH2", "SPORT2"]
		}
	},
	MATH2: {
		text: "Chuck is at Math Class",
		problem: {
			text: "Square Root of 81?",
			answers: ["8", "9"],
			correct: 1,
			onCorrect: (context) => {
				context.chuckles.increaseInt(1)
			},
			time: 10
		},
		next: 'JUNIOR_HIGH'
	},
	SPORT2: {
		text: "Chuck is on the soccer team",
		problem: {
			text: "He kicks the ball...",
			answers: ["Miss", "Goal!"],
			correct: 1,
			onCorrect: (context) => {
				context.chuckles.increaseDex(1)
			},
			time: 10
		},
		next: 'JUNIOR_HIGH'
	},
	JUNIOR_HIGH: {
		text: "Chuck is now at Junior High",
		next: 'GAB1'
	},
	GAB1: {
		text: "Chuck sees a girl and falls in love",
		fn: (context) => {
			context.addPerson(3)
			if (context.chuckles.soc > 0){
				return 'GAB2'
			} else {
				return 'NOGAB'
			}
		}
	},
	GAB2: {
		text: "He fills up with courage and gives her a flower",
		fn: (context) => {
			context.chuckles.increaseHap(1)
			context.chuckles.gab = true
			return 'HIGH_SCHOOL'
		}
	},
	NOGAB: {
		text: "But he's too coward to talk with her",
		fn: (context) => {
			context.chuckles.gab = false
			context.removePerson(3)
			return 'HIGH_SCHOOL'
		}
	},
	HIGH_SCHOOL: {
		text: "Chuck is now at High School",
		choice: {
			text: "The exams are close",
			choices: ["Hang out", "Study"],
			onA: (context) => {
				context.chuckles.increaseSoc(2)
			},
			onB: (context) => {
				context.chuckles.increaseInt(2)
			},
			nexts: ["EXAMS","EXAMS"],
			time: 10
		}
	},
	EXAMS: {
		text: "Chuckles does his High School Exams",
		fn: (context) => {
			if (context.chuckles.int >= 3){
				return 'WON_EXAMS'
			} else {
				return 'LOST_EXAMS'
			}
		}
	},
	WON_EXAMS: {
		text: "He passes the exams",
		fn: (context) => {
			context.chuckles.setAge(2)
			context.setStressLevel(3)
			context.chuckles.increaseHap(1)
			return "UNI"
		}
	},
	LOST_EXAMS: {
		text: "He failed the exams",
		fn: (context) => {
			context.chuckles.setAge(2)
			context.setStressLevel(3)
			context.chuckles.reduceHap(1)
			return "HAMB"
		}
	},
	HAMB: {
		text: "Chuckles works at an hamburger stand",
		fn: (context) => {
			context.chuckles.increaseSoc()
			if (context.chuckles.gab){
				return "DUMP_GAB";
			} else {
				return "ROX";
			}
		},
		problem: {
			text: "He tries to flip the burgers",
			answers: ["Like a pro!", "Faaail"],
			correct: 0,
			onCorrect: (context) => {
				context.chuckles.increaseArt(1)
			},
			time: 10
		},
	},
	UNI: {
		text: "Chuck enters University",
		choice: {
			text: "The exams are close",
			choices: ["Hang out", "Study"],
			onA: (context) => {
				context.chuckles.increaseSoc(2)
			},
			onB: (context) => {
				context.chuckles.increaseInt(2)
			},
			nexts: ["EXAMS2","EXAMS2"],
			time: 10
		}
	},
	EXAMS2: {
		text: "Chuckles does his College Exams",
		fn: (context) => {
			if (context.chuckles.gab){
				return "DUMP_GAB";
			} else {
				return "ROX";
			}
		}
	},
	DUMP_GAB: {
		text: "Gabrielle abandons Chuckles",
		fn: (context) => {
			context.chuckles.gab = false
			context.removePerson(3)
			context.chuckles.reduceHap(1)
			return 'ROX'
		}
	},
	ROX: {
		text: "Chuckles falls in love with Roxene",
		fn: (context) => {
			context.chuckles.setAge(3)
			context.chuckles.gab = false
			context.addPerson(4)
			return 'PROPOSE_ROX'
		}
	},
	PROPOSE_ROX: {
		text: "",
		choice: {
			text: "Propose to Roxene?",
			choices: ["YES!", "NO WAY!"],
			nexts: ["MARRY_ROX","DUMP_ROX"],
			time: 10
		}
	},
	MARRY_ROX: {
		text: "Chuckles Marries Roxene",
		fn: (context) => {
			context.setStressLevel(4)
			context.chuckles.increaseHap(1)
			return "CHILD"
		},
	},
	CHILD: {
		text: "Chuckles has a child, Chuck Jr.",
		fn: (context) => {
			context.chuckles.increaseHap(1)
			return "END"
		}
	},
	DUMP_ROX: {
		text: "Roxene abandons Chuckles",
		fn: (context) => {
			context.removePerson(4)
			context.chuckles.reduceHap(1)
			return 'END'
		}
	},
	END: {
		text: "The End."
	}
}