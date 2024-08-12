import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private httpClient: HttpClient) {}
  getRoles() {
    return this.httpClient.get('http://localhost:5010/api/Role/GetAllRoles');
  }
  
  getListOfPages() {
    return this.httpClient.get('http://localhost:5010/api/Role/GetListOfPages');
  }
  addRole(model: any) {
    return this.httpClient.post('http://localhost:5010/api/Role/add', model);
  }
  saveRole(model: any) {
    return this.httpClient.post(
      'http://localhost:5010/api/Role/saveRole',
      model
    );
  }
  deleteRole(id: any) {
    return this.httpClient.post(
      'http://localhost:5010/api/Role/DeleteRole',
      id
    );
  }
  getOneRole(id: number) {
    return this.httpClient.get(`http://localhost:5010/api/Role/GetRoleById${id}`);
  }
}
