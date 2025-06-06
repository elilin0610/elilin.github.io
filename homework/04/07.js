// 7. 向量物件
class Vector {
  constructor(arr) {
    this.arr = arr;
  }
  add(v) {
    return new Vector(this.arr.map((n, i) => n + v.arr[i]));
  }
  sub(v) {
    return new Vector(this.arr.map((n, i) => n - v.arr[i]));
  }
  dot(v) {
    return this.arr.reduce((sum, n, i) => sum + n * v.arr[i], 0);
  }
}

let a = new Vector([1,2,3])
let b = new Vector([4,5,6])

console.log(a.add(b).sub(b).dot(b))
