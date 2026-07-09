// Mirrors Notification.get_json() and NotifType from
// Apps/Backend/models/notification.py and models/notiftype.py (branch FN-1).
export type NotifType =
    | 'DELAY'
    | 'CANCELLATION'
    | 'GATE_CHANGE'
    | 'BOARDING_CALL'
    | 'OTHER';

export interface NotificationDto {
    id: number;
    flight_number: string;
    notif_type: NotifType;
    message: string;
    gate: string | null;
    created_by: string;
    created_at: Date;
}
