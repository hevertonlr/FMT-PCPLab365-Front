import { Injectable } from '@angular/core';
import { Grade } from '../interfaces/grade';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class GradeService extends BaseService<Grade> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'grades';
  }
}
