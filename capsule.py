from datetime import datetime

class Time_Capsule:
    def __init__(self, date, userID):
        self.set_lock(date)
        self.user = userID
