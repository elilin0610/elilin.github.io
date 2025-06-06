# q7.py
# 題目：將字典轉成 "a:1, b:2" 這種格式的字串

def dict_to_string(d):
    """將字典轉成 'a:1, b:2' 這種格式的字串"""
    return ', '.join(f'{k}:{v}' for k, v in d.items())

# 測試
if __name__ == "__main__":
    print(dict_to_string({'a': 1, 'b': 2}))  # 輸出: a:1, b:2
