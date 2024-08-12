import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeesAttendanceComponent } from '../Components/employees-attendance/employees-attendance.component';
import { Observable, catchError, throwError } from 'rxjs';
import { Employee } from '../Model/employee';
import { AttendanceModel } from '../Model/attendance-model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseURL = 'http://localhost:5010/api/Attendance';
  private apiUrl = 'http://localhost:5010/api/Attendance/AddAttendance';


  constructor(private http: HttpClient) { }

  getAllEmployeeAttendance(): Observable<EmployeesAttendanceComponent[]> {
    return this.http.get<EmployeesAttendanceComponent[]>(this.baseURL + '/GetAllEmployeeAttendance');
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseURL + '/GetAllEmployees');
  }

  // addEmployeeAttendance(employee:any):Observable<any>{
  //   return this.http.post(this.baseURL,employee);
  // }

  // addEmployeeAttendance(employeeId: number, attendance: Date, departure: Date): Observable<any> {
  //   return this.http.post<any>(this.apiUrl, { employeeId, attendance, departure });
  // }

  addAttendance(employeeId: number, attendance: Date) {
    const formData = {
      id: 0,
      EmployeeId: employeeId,
      Attendance: attendance,
      // Departure: departure || null
    };
    return this.http.post(`${this.baseURL}`, formData);
  }

  deleteEmployeeAttendance(id: number) {
    return this.http.delete(`${this.baseURL}/DeleteEmployeeAttendance/${id}`);
  }



  // editEmployeeAttendance(attendanceId: number, attendance: Date, departure: Date): Observable<any> {
  //   const requestData = {
  //     id: attendanceId,
  //     attendance: attendance.toISOString(),
  //     departure: departure.toISOString()
  //   };

  //   return this.http.put(`${this.apiUrl}/EditEmpAttendace`, requestData).pipe(
  //     catchError((error: any) => {
  //       throw error;
  //     })
  //   );
  // }


  getAttendanceById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseURL}/${id}`);
  }

  // editAttendance(attendanceId: number, attendanceDateTime: Date, departureDateTime: Date): Observable<any> {
  //   const body = {
  //     id: attendanceId,
  //     attendanceDateTime: attendanceDateTime, // Convert date to ISO string for sending to server
  //     departureDateTime: departureDateTime // Convert date to ISO string for sending to server
  //   };
  //   return this.http.put<any>(`${this.baseURL}/${attendanceId}`, body);
  // }

  editAttendance(
    attendanceId: number,
    attendanceDateTime: Date,
    departureDateTime: Date
  ): Observable<any> {
    const body = {
      id: attendanceId,
      attendance: attendanceDateTime, // Convert date to ISO string for sending to server
      departure: departureDateTime, // Convert date to ISO string for sending to server
    };
    return this.http.put<any>(`${this.baseURL}`, body);
  }




  // updateEmployee(id: number, data: any): Observable<any> {
  //   return this.http.put(`${this.baseURL}/${id}`, data);
  // }





  getEmployeeAttendanceBetweenDates(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.baseURL}/GetEmployeeAttendanceBetweenDates?startDate=${startDate}&endDate=${endDate}`);
  }


}
