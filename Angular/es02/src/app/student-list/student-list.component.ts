import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent {
  // se non metto ! non devo inizializzarla
  @ViewChild('txtName') _txtName!: ElementRef;

  studentList: any[] = [
    { name: 'Pippo', city: 'Fossano', gender: 'M' },
    { name: 'Elena', city: 'Bra', gender: 'F' },
    { name: 'Minnie', city: 'Cuneo', gender: 'F' },
    { name: 'Pluto', city: 'Bra', gender: 'M' },
    { name: 'Mario', city: 'Fossano', gender: 'M' },
    { name: 'Paola', city: 'Fossano', gender: 'F' },
    { name: 'Maura', city: 'Bra', gender: 'F' },
    { name: 'Paolo', city: 'Cuneo', gender: 'M' },
    { name: 'Piero', city: 'Bra', gender: 'M' },
    { name: 'Francesca', city: 'Fossano', gender: 'F' },
  ];

  public studentName: string = '';
  public studentGender: string = 'M';
  public studentCity: string = '';
  public cities: string[] = ['Bra', 'Fossano', 'Alba', 'Savigliano', 'Cuneo'];

  onCreateStudent() {
    let newStudent = {
      name: this.studentName,
      city: this.studentCity,
      gender: this.studentGender,
      present: false,
    };
    this.studentList.push(newStudent);
    this.studentName = '';
    this.studentCity = '';
    this._txtName.nativeElement.focus();
  }

  onDeleteStudent(i:number){
    this.studentList.splice(i, 1);
  }
}
