# q10.py
# 題目：輸入學生資料 list，每筆是 dict，印出每位學生的總分與平均

def summary(data):
    """印出每位學生的總分與平均"""
    for student in data:
        total = sum(student['scores'])
        avg = round(total / len(student['scores']), 1)
        print(f"{student['name']} 總分: {total}, 平均: {avg}")

# 測試
if __name__ == "__main__":
    students = [
        {'name': 'Alice', 'scores': [90, 80, 70]},
        {'name': 'Bob', 'scores': [100, 85, 95]}
    ]
    summary(students)
