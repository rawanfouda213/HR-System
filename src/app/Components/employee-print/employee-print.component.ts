import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-print',
  templateUrl: './employee-print.component.html',
  styleUrls: ['./employee-print.component.css']
})
export class EmployeePrintComponent {
  @Input() employee: any;
}
