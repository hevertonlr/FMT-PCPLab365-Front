import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {
  constructor(protected override http: HttpClient) {
    super(http);
    this.API_URL += 'users';
  }
}
