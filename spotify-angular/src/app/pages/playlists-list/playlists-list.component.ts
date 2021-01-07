import { Component, OnInit } from '@angular/core';
import {PlaylistsService} from '../../services/playlists.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';
import { Playlist } from 'src/app/model/Playlist';

@Component({
  selector: 'app-playlists-list',
  templateUrl: './playlists-list.component.html',
  styleUrls: ['./playlists-list.component.scss']
})
export class PlaylistsListComponent implements OnInit {

  userId: number;
  currentUser: User;

  playlistsList: Playlist[] = [];
  playlistsSub: Subscription;

  constructor(private playlistsService: PlaylistsService,
              private authService: AuthService,
              private route: ActivatedRoute) { 
    this.currentUser = this.authService.currentUserValue;
              }

  ngOnInit(): void {
    this.playlistsSub = this.route.params.subscribe(
      params => {
        this.userId = params['id'];

        if(this.userId){
          this.playlistsService.getByUser(this.userId).subscribe(
            (res: Playlist[]) => {
              this.playlistsList = res;
            }, err => {
              console.error(err);
            });
        }
      });
  }
}
