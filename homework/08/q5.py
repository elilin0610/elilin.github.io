# q5.py
# 題目：根據分數回傳等第（A~F）

def grade(score):
    """根據分數回傳等第（A~F）"""
    if 90 <= score <= 100:
        return 'A'
    elif 80 <= score < 90:
        return 'B'
    elif 70 <= score < 80:
        return 'C'
    elif 60 <= score < 70:
        return 'D'
    else:
        return 'F'

# 測試
if __name__ == "__main__":
    print(grade(85))  # 輸出: B
