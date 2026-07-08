from enum import Enum

class NotifType(Enum):
    DELAY = "Delay"
    CANCELLATION = "Cancellation"
    GATE_CHANGE = "Gate Change"
    BOARDING_CALL = "Boarding Call"
    OTHER = "Other"