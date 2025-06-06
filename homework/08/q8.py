# q8.py
# 題目：判斷 n 是否為質數

def is_prime(n):
    """判斷 n 是否為質數"""
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

# 測試
if __name__ == "__main__":
    print(is_prime(7))  # 輸出: True
    print(is_prime(8))  # 輸出: False
