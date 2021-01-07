import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Globals } from '../helpers/globals';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = this.globals.API_URL + '/users/';

  constructor(private http: HttpClient, private globals: Globals) { }

  getByEmail(email: string)
  {
    return this.http.get(this.apiUrl + 'by-email/' + email);
  }

  save(id: number, user: User){
    console.log(user)
    return this.http.put(this.apiUrl + id, user);
  }
}
