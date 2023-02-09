import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent {
  @Input() student: any;
  @Output() deleteStudentEvent = new EventEmitter<any>();
  //student: any = {};

  constructor() {
    //let pos = this.generaNumero(0, this.studentList.length - 1);
    //this.student = this.studentList[pos];
  }

  ngOnInit() {
    let num = this.generaNumero(1, 2);
    this.student.present = num == 1;
  }

  onStudentClick() {
    this.student.present = !this.student.present;
  }

  getStyle(student: any) {
    const color = student.gender == 'F' ? 'pink' : 'cyan';
    return {
      backgroundColor: color,
    };
  }

  getClasses(student: any) {
    return {
      blink: !student.present,
    };
  }

  onDeleteStudent(){
    this.deleteStudentEvent.emit(this.student);
  }

  generaNumero(a: number, b: number) {
    return Math.floor((b - a + 1) * Math.random()) + a;
  }
}
