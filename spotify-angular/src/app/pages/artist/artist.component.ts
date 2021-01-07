import { Component, OnInit } from '@angular/core';
import { AlbumsService } from 'src/app/services/albums.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {

  artisteId: number;
  albumsList: any[];
  albumSub: Subscription;

  constructor(private albumsService: AlbumsService,
              private route: ActivatedRoute){}

  ngOnInit() {
    this.albumSub = this.route.params.subscribe(
      params => {
        this.artisteId = params['id'];

        if(this.artisteId){
          this.albumsService.getByArtiste(this.artisteId).subscribe(
            (res: any[]) => {
              this.albumsList = res;
            }, err => {
              console.error(err);
            });
        }
      }, err => {
        console.error(err);
      });
  }
  
}

