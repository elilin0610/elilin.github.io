// 1. 計算字串中字母出現的次數
function countLetters(str) {
  const map = new Map();
  for (const char of str) {
    // 如果字母不在 map 裡map.get會回傳 undefined 這樣 or 會回傳 0 
    // 所以set 會是 0 + 1
    // 如果字母在 map 裡map.get會回傳對應的數字
    map.set(char, (map.get(char) || 0) + 1);
  }
  return map;
}

console.log(countLetters("banana"));
// Map { 'b' => 1, 'a' => 3, 'n' => 2 }