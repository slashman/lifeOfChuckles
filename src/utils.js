export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const dist = (x1, y1, x2, y2) => {
	const a = x1 - x2
	const b = y1 - y2
	return Math.sqrt( a*a + b*b );
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export const getRandomInt = (min, max)  => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}