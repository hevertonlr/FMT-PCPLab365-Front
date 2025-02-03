import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../interfaces/teacher';
import { BaseService } from './base.service';
import { catchError, map, Observable } from 'rxjs';
import { mapGender } from '../enums/gender';
import { mapCivilState } from '../enums/civilstate';

@Injectable({
  providedIn: 'root',
})
export class TeacherService extends BaseService<Teacher> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'docentes';
  }
  override getOne = (id: string): Observable<Teacher> =>
    this.http.get<Teacher>(this.API_URL + `/${id}`).pipe(
      map((teacher) => ({
        ...teacher,
        gender: mapGender(teacher.gender),
        civilState: mapCivilState(teacher.civilState),
      })),
      catchError(this.handleError),
    );

  override getAll = (): Observable<Teacher[]> =>
    this.http.get<Teacher[]>(this.API_URL).pipe(
      map((teachers) =>
        teachers.sort((a, b) => a.id.toString().localeCompare(b.id.toString())),
      ),
      catchError(this.handleError),
    );
}
