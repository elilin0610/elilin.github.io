# q9.py
# 題目：找出 list 中出現次數最多的數字

def most_common(nums):
    """找出 list 中出現次數最多的數字（可能有多個）"""
    d = {}
    for n in nums:
        d[n] = d.get(n, 0) + 1
    max_count = max(d.values())
    return [k for k, v in d.items() if v == max_count]

# 測試
if __name__ == "__main__":
    print(most_common([1, 2, 2, 3, 3]))  # 輸出: [2, 3]
