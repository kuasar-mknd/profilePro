from tools import code_review

# Request code review
try:
    review = code_review()
    print("Code Review:", review)
except Exception as e:
    print("Error:", e)
