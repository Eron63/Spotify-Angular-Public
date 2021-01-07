import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Globals } from '../helpers/globals';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  apiUrl = this.globals.API_URL + '/search/';

  constructor(private http: HttpClient, private globals: Globals) { }

  globalSearch(search: string){
    let params = new HttpParams().set('search', search);
    
    return this.http.get(this.apiUrl, { params: params});
  }
}
