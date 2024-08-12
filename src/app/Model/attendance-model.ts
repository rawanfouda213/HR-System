export interface AttendanceModel {
    id: number;
    department?: string;
    attend?: string;
    leave?: string;
    day?: string;

    name?: string;
    attendence?: Date;
  departure?: Date;
}
