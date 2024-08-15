import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchoolClass } from '../interfaces/schoolclass';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export default class SchoolClassService extends BaseService<SchoolClass> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'schoolclass';
  }
}
