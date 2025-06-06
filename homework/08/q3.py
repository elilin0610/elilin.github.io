# q3.py
# 題目：將整數 list 分成 even/odd 兩組，回傳字典

def classify_even_odd(numbers):
    """將整數 list 分成 even/odd 兩組，回傳字典"""
    result = {'even': [], 'odd': []}
    for n in numbers:
        if n % 2 == 0:
            result['even'].append(n)
        else:
            result['odd'].append(n)
    return result

# 測試
if __name__ == "__main__":
    print(classify_even_odd([1, 2, 3, 4]))  # 輸出: {'even': [2, 4], 'odd': [1, 3]}
