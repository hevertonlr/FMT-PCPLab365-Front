import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { SchoolSubject } from '../interfaces/schoolsubject';

@Injectable({
  providedIn: 'root'
})
export class SchoolsubjectService extends BaseService<SchoolSubject> {

  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'materias';
   }
}