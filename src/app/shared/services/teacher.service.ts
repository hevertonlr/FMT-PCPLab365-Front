import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../interfaces/teacher';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService extends BaseService<Teacher> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'teachers';
  }
}
