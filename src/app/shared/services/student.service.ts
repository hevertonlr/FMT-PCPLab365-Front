import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import { BaseService } from './base.service';
import { catchError, map, Observable } from 'rxjs';
import { mapGender } from '../enums/gender';

@Injectable({
  providedIn: 'root',
})
export class StudentService extends BaseService<Student> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'alunos';
  }

  override getOne = (id: string): Observable<Student> =>
      this.http.get<Student>(this.API_URL + `/${id}`).pipe(
        map(student => ({
          ...student,
          gender: mapGender(student.gender),
        })),
        catchError(this.handleError)
      );

  override getAll = (): Observable<Student[]> =>
    this.http.get<Student[]>(this.API_URL).pipe(
      map(students => students.map(student => ({
        ...student,
        gender: mapGender(student.gender),
      }))),
      catchError(this.handleError)
    );

}
