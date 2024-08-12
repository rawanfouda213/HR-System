import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../Model/employee';
import { Gender } from '../Model/gender';
@Injectable({
  providedIn: 'root'
})
export class AllEmployeesService {

  private baseURL = 'http://localhost:5010/api/Employee/GetAllEmployees';
  private URL = 'http://localhost:5010/api/EmployeeActions/';
  private addURL = 'http://localhost:5010/api/EmployeeActions/AddEmployee';
  private getURL = 'http://localhost:5010/api/Employee/emp/';
  private delURL = 'http://localhost:5010/api/EmployeeActions/id?id=';
  private genderURL = 'http://localhost:5010/api/Employee/gender/';

  constructor(private http: HttpClient) {}

  getEmployeeData() {
    return this.http.get(this.baseURL);
  }

  getEmployeeById(id:any):Observable<any>{
    return this.http.get<Employee>(this.getURL+id);
  }
  getEmployeeGender(id:any):Observable<any>{
    return this.http.get<Gender>(this.genderURL+id);
  }
  editEmployee(id:any,employee:Employee){
    return this.http.put<Employee>(
      this.URL+ id,
      employee
    );
  }
  deleteEmployee(id:any):Observable<any>{
    return this.http.delete<Employee>(this.delURL+id);

  }
  addEmployee(employee:any):Observable<any>{
    return this.http.post<Employee>(this.addURL,employee);
  }
}