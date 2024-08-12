import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSalariesService {

  // private apiUrl = '';

  private apiUrl = 'http://localhost:5010/api/Salary';

  constructor(private http: HttpClient) { }

  // const url = `${this.apiUrl}/salary?employeeName=${employeeName}&month=${month}&year=${year}`;
  //   return this.http.get(url);

  getAllSalaries(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getSalariesByMonthAndYear(month: number, year: number): Observable<any[]> {
    // Adjust the API endpoint based on your backend implementation
    const apiUrl = `http://localhost:5010/api/Salary/searchEmployees?month=${month}&year=${year}`;
    return this.http.get<any[]>(apiUrl);
  }

  getEmployeeDetails(employeeId: number, month: number, year: number): Observable<any[]> {
    const apiUrl = `http://localhost:5010/api/Salary/GetEmployeeAttendanceDetails?employeeId=${employeeId}&month=${month}&year=${year}`;
    return this.http.get<any[]>(apiUrl);
  }
  
}
