import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { Department } from '../Model/department';


@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private addURL = 'http://localhost:5010/api/Department/AddDepartment';
  private baseDeptURL = 'http://localhost:5010/api/Department/GetAllDepartments';
  private getByIdURL = 'http://localhost:5010/api/Department/dept/';
  private editURL = 'http://localhost:5010/api/Department/deptId/';
  private delURL = 'http://localhost:5010/api/Department/';

  constructor(private http: HttpClient) {}
  addDepartment(dept: Department): Observable<Department> {
    return this.http.post<Department>(this.addURL, dept);
  }
  deleteDepartment(id: any): Observable<any> {
    return this.http.delete<Department>(this.delURL + id);
  }
  getDepartments() {
    return this.http.get(this.baseDeptURL);
  }
  getDepartmentById(id:any):Observable<any>{
    return this.http.get<Department>(this.getByIdURL+id);
  }
  editDepartment(id:any,dept:Department){
    return this.http.put<Department>(
      this.editURL+ id,
      dept
    );
  }
}