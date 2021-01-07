import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Globals } from '../helpers/globals';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  apiUrl = this.globals.API_URL + '/albums/';

  constructor(private http: HttpClient, private globals: Globals) { }

  getAll(){
    return this.http.get(this.apiUrl);
  }

  get(id: number){
    return this.http.get(this.apiUrl + id);
  }

  getByArtiste(id: number){
    return this.http.get(this.apiUrl + 'by-artiste/' + id);
  }

}
