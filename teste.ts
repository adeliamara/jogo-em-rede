const matriz = [[1, 2], [2, 3], [1, 2, 3], [1, 2]];
const element = [2, 3];

let count = 0;

matriz.forEach((arr) => {
  if (arr.length === element.length && arr.every((val, index) => val === element[index])) {
    count++;
  }
});

console.log(count); // 2
