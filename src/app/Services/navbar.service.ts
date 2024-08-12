import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  visible:boolean;
  showNavbar: BehaviorSubject<boolean>;

  constructor() { 
    this.visible = true; 
    this.showNavbar = new BehaviorSubject(true);
  }

  hide(){
    this.showNavbar.next(false);

  }

  display(){
    this.showNavbar.next(true);
  }

  // hide(){
  //   this.visible = false;
  // }
  // show(){
  //   this.visible = true;
  // }
  toggle(){
    this.visible = !this.visible;
  }
}
