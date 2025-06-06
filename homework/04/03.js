// 3. 計算陣列數字總和
function sumArray(arr) {
  return arr.reduce((sum, n) => sum + n, 0);
}

console.log(sumArray([1, 2, 3, 4])); 
// 10