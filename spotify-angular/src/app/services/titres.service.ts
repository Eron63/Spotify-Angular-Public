import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Globals } from '../helpers/globals';
import { Titre } from '../model/Titre';

@Injectable({
  providedIn: 'root'
})
export class TitresService {

  apiUrl = this.globals.API_URL + '/titres/';

  constructor(private http: HttpClient, private globals: Globals) { }

  getAll(){
    return this.http.get(this.apiUrl);
  }

  getById(id: number){
    return this.http.get(this.apiUrl + id);
  }

  getByAlbum(id: number){
    return this.http.get(this.apiUrl + 'by-album/' + id);
  }

  getByCategorie(id: number){
    return this.http.get(this.apiUrl + 'by-categorie/' + id);
  }

  get20ByCategorie(id: number, a: number){
    return this.http.get(this.apiUrl + 'by-categorie-20/' + id + '/' + a);
  }

  getRandom(){
    return this.http.get(this.apiUrl + 'random');
  }

  getMostPlayed(){
    return this.http.get(this.apiUrl + 'most-played');
  }

  save(titre: any, id?: number){
    return this.http.put(this.apiUrl + id, titre);
  }

  viewIncrementor(titre: Titre){
    titre.nb_vues++;
    return this.save(titre, titre.id_titre);
  }

}
