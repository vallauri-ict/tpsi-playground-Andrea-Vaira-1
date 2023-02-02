import { Component } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent {
  studentList: any[] = [
    { name: 'Pippo', city: 'Fossano', gender: 'M', present: true },
    { name: 'Elena', city: 'Bra', gender: 'F', present: true },
    { name: 'Minnie', city: 'Cuneo', gender: 'F', present: true },
    { name: 'Pluto', city: 'Bra', gender: 'M', present: true },
    { name: 'Mario', city: 'Fossano', gender: 'M', present: true },
    { name: 'Paola', city: 'Fossano', gender: 'F', present: false },
    { name: 'Maura', city: 'Bra', gender: 'F', present: false },
    { name: 'Paolo', city: 'Cuneo', gender: 'M', present: false },
    { name: 'Piero', city: 'Bra', gender: 'M', present: false },
    { name: 'Francesca', city: 'Fossano', gender: 'F', present: false },
  ];

  //student: any = {};

  constructor() {
    //let pos = this.generaNumero(0, this.studentList.length - 1);
    //this.student = this.studentList[pos];
  }

  getStyle(student:any){
    const color = student.gender == 'F'? 'pink':'cyan';
    return{
      "backgroundColor":color
    }
  }

  getClasses(student:any){
    let isBlinked = student.city == 'Fossano'
    return {
      "blink":isBlinked
    }
  }

  generaNumero(a: number, b: number) {
    return Math.floor((b - a + 1) * Math.random()) + a;
  }
}
