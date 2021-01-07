import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Globals } from '../helpers/globals';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  apiUrl = this.globals.API_URL + '/categories/';

  constructor(private http: HttpClient, private globals: Globals) { }

  getAll(){
    return this.http.get(this.apiUrl);
  }

  getById(id: number){
    return this.http.get(this.apiUrl + id);
  }
}
