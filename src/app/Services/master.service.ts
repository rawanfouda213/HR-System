import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import {Customer} from '../Model/Customer';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }


  GetCustomer():Observable<Customer[]>{
    return this.http.get<Customer[]>("http://localhost:3000/customer");
  }

  Savecustomer(data:any){
    console.log(data)
    return this.http.post("http://localhost:3000/customer",data);
  }

  GetCustomerbycode(code:any){
    return this.http.get("http://localhost:3000/customer/"+code);
  }

  GetAssociate(){
    return this.http.get('http://localhost:3000/associate');
  }
  GetAssociatebycode(code:any){
    return this.http.get('http://localhost:3000/associate/'+code);
  }


  SaveAssociate(data:any,code:any){
    return this.http.put('http://localhost:3000/associate/'+code,data);
  }
}
