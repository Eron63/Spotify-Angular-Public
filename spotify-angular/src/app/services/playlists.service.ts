import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Globals } from '../helpers/globals';
import { Playlist } from '../model/Playlist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {

  apiUrl = this.globals.API_URL + '/playlists/';

  constructor(private http: HttpClient, private globals: Globals) { }

  getAll(){
    return this.http.get(this.apiUrl);
  }

  getById(id: number){
    return this.http.get(this.apiUrl + id);
  }

  getByUser(id: number){
    return this.http.get(this.apiUrl + 'by-user/' + id);
  }
  
  save(playlist: Playlist, id?: number){
    if(id){
      return this.http.put(this.apiUrl + id, playlist);
    }
    else {
      return this.http.post(this.apiUrl, playlist);
    }
  }

  delete(id: number){
    return this.http.delete(this.apiUrl + id);
  }
}
