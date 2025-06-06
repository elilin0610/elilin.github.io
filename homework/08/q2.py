# q2.py
# 題目：計算整數 list 的平均值（小數點取到一位）

def average(nums):
    """回傳整數 list 的平均值（小數點取到一位）"""
    return round(sum(nums) / len(nums), 1) if nums else 0

# 測試
if __name__ == "__main__":
    print(average([1, 2, 3]))  # 輸出: 2.0
