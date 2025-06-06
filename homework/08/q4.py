# q4.py
# 題目：印出 n 行星號圖形，每行 i 顆星

def print_stars(n):
    """印出 n 行星號圖形，每行 i 顆星"""
    for i in range(1, n+1):
        print('*' * i)

# 測試
if __name__ == "__main__":
    print_stars(3)
    # 輸出:
    # *
    # **
    # ***
