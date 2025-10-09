from datetime import datetime

class Time_Capsule:
    def __init__(self, date, name):
        self.set_lock(date)
        self.name = name

    def set_lock(capsule, date):
        #encrypt
        return

    def unlock(capsule, date):
        if (datetime.now() == date):
            return