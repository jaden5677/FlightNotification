// Mirrors User.get_json() from Apps/Backend/models/user.py (branch FN-1).
export interface UserDto {
    id: string;
    fName: string;
    lName: string;
    email: string;
    nationality: string;
    DOB: Date;
    gender: string | null;
    cNumber: string | null;
    aType: 'ADMIN' | 'USER';
    specialR: number | null;
}

export interface LoginResponse {
    access_token: string;
}
