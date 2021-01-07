import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {AlbumsService} from '../../services/albums.service';
import {CategoriesService} from '../../services/categories.service';
import {TitresService} from '../../services/titres.service';
import {PlaylistsService} from '../../services/playlists.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title: string = 'Accueil';
  albumsList: any = [];
  albumsSub: Subscription;

  categoriesList: any[] = [];
  categoriesSub: Subscription;

  titresList: any = [];
  titresSub: Subscription;

  playlistsList: any = [];
  playlistsSub: Subscription;

  constructor(private albumsService: AlbumsService,
              private categoriesService: CategoriesService,
              private titresService: TitresService,
              private playlistsService: PlaylistsService) { }

  ngOnInit(): void {
    this.albumsSub = this.albumsService.getAll().subscribe(
      (res) => {
        this.albumsList = res;
      }, err => {
        console.error(err);
      }
    );

    this.categoriesSub = this.categoriesService.getAll().subscribe(
      (res: any[]) => {
        this.categoriesList = res;
      }, err => {
        console.error(err);
      }
    );

    this.playlistsSub = this.playlistsService.getAll().subscribe(
      (res: any[]) => {
        this.playlistsList = res;
      }, err => {
        console.error(err);
      }
    );

    this.titresSub = this.titresService.getMostPlayed().subscribe(
      (res) => {
        this.titresList = res;
      }, err => {
        console.error(err);
      }
    );
  }

}
