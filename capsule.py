from datetime import datetime

class Time_Capsule:
    def __init__(self, date, userID):
        self.set_lock(date)
        self.user = userID

    def set_lock(self, date):
        # encrypt
        return

    def unlock(self, date):
        if (datetime.now().date() == date):
            # decrypt
            return
