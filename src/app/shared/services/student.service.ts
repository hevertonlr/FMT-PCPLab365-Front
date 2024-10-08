import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService extends BaseService<Student> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'students';
  }
}
