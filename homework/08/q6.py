# q6.py
# 題目：回傳字串中每個字元出現次數的字典

def count_chars(s):
    """回傳字串中每個字元出現次數的字典"""
    d = {}
    for c in s:
        d[c] = d.get(c, 0) + 1
    return d

# 測試
if __name__ == "__main__":
    print(count_chars("hello"))  # 輸出: {'h': 1, 'e': 1, 'l': 2, 'o': 1}
