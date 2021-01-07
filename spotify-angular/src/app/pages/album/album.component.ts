import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TitresService} from '../../services/titres.service';
import {AudioService} from "../../services/audio.service";
import {CloudService} from "../../services/cloud.service";
import {AuthService} from "../../services/auth.service";
import {StreamState} from "../../interfaces/stream-state";
import { AlbumsService } from 'src/app/services/albums.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { Playlist } from 'src/app/model/Playlist';
import { Titre } from 'src/app/model/Titre';
import { User } from 'src/app/model/user';
import { Album } from 'src/app/model/Album';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  state: StreamState;
  previousIndex: number = -2;

  titresList: Titre[] = [];
  albumId: number;
  album: Album;

  playlists: Playlist[];
  inPlaylist: boolean = false;
  playlistMessage: string;
  titreMessage: string;
  successId: number;

  currentUser: User;
  currentIndex: number;

  files: any[] = [];
  filesSub: Subscription;
  currentFile: any = {};
  currentFileSub: Subscription;

  constructor(private titresService: TitresService,
              private route: ActivatedRoute,
              private audioService: AudioService,
              private cloudService: CloudService,
              private albumsService: AlbumsService,
              private playlistService: PlaylistsService,
              public auth: AuthService)
  {
    // get current user to be able to add to playlists
    this.currentUser = this.auth.currentUserValue;

    // listen to stream state
    this.audioService.getState()
      .subscribe(state => {
        this.state = state;
      });

  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.albumId = params['id'];

        if (this.albumId){
          this.albumsService.get(this.albumId).subscribe(
            (res: any) => {
                  this.album = res;
            }
          );

          this.titresService.getByAlbum(this.albumId).subscribe(
            (res: Titre[]) => {
              this.titresList = res;
            }, err => {
              console.error(err);
            }
          );
        }
      }, err => {
        console.error(err);
      });

    this.playlistService.getByUser(this.currentUser.id_user).subscribe(
      (res: Playlist[]) => {
        this.playlists = res;
      }, err => {
        console.error(err);
      });

    this.filesSub = this.cloudService.filesSubject.subscribe(
        (files: any[]) => {
          this.files = files;
        });

  this.currentFileSub = this.cloudService.currentFileSubject.subscribe(
        (currentFile: any) => {
          this.currentFile = currentFile;
        });
  }

    /**
   * ---------------------------------------------------------------------------------------------------------
   * ----------------------  Fonctions de lecture d'un titre et d'une playlist/album  ------------------------
   * ---------------------------------------------------------------------------------------------------------
   */

// Changement de couleur du titre actuellement joué
colorPlaying(index: number){
  if(this.previousIndex > -1){
    document.getElementsByClassName('titre-container')[this.previousIndex].classList.remove('playing');
  }
  document.getElementsByClassName('titre-container')[index].classList.add('playing');
  this.previousIndex = index;
}
/**
 * Fonctions de lecture d'un titre et d'une playlist/album
 */

setCurrentFile(titre: Titre, blobUrl: string){
  const current = {
    index: 0,
    file: {
      url: blobUrl,
      name: titre.nom_titre,
      artist: titre.listArtistes
    }
  }

  this.cloudService.emitCurrentFileSubject(current);
  return current;
}
/**
 * remplissage de this.files
 */
setFiles(titre: Titre, blobUrl: string){
  const getFiles = this.files.push({
    url: blobUrl,
    name: titre.nom_titre,
    artist: titre.listArtistes
  });

  this.cloudService.emitFilesSubject(this.files);
  const index = this.files.length - 1;
  }

/**
 * Obtention du blob correspondant à un titre
 */
async getBlob(titre: Titre): Promise<any>{

    let response: any = await this.cloudService.getBlobById(titre.id_titre).toPromise();

    const data = response.blob_morceau;
    const binary = this.cloudService.convertDataURIToBinary('data:audio/ogg;base64, ' + data);
    const blob = new Blob([binary], {type : 'audio/mp3'});
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
}


/**
 * Récupération d'un titre au sein d'une playlist
 */
async getTitre(idTitre: number){
  let titre: any = await this.titresService.getById(idTitre).toPromise();

  if(titre){
    return titre;
  }
}
/**
 * Lecture d'une playlist
 */
 async playAlbum( ){
  this.cloudService.emitFilesSubject([]);
  let index = 0;

  /** Rotation du vinyle */
  if(!this.state.playing){
    this.state.playing = true;
    document.getElementById('vinyleBlock').classList.add('rotation');
  } else {
    this.state.playing = false;
    document.getElementById('vinyleBlock').classList.remove('rotation');
    this.audioService.pause();
    return;
  }

  /** Initialisation du currentFile, premier titre de la playlist */
  const firstTitre = this.titresList[0];
  const blobFirstUrl = await this.getBlob(firstTitre);
  const current = this.setCurrentFile(firstTitre, blobFirstUrl);

  this.openFile(current.file, 0, firstTitre);

  /** Remplissage du files, liste de tous les titres+blob */
  for(let titre of this.titresList){
    const blobUrl = await this.getBlob(titre);
    this.setFiles(titre, blobUrl);
    index++;
  }
}

/**
 * Lecture d'un seul titre
 */
async playSingleTitre(idTitre: number, index: number){

  this.colorPlaying(index);

  //Récupération du titre joué et incrémentation du compteur de vues
  let titre: any = await this.titresService.getById(idTitre).toPromise();

  titre.nb_vues++;
  titre = await this.titresService.save(titre, idTitre).toPromise();

  const blobUrl = await this.getBlob(titre);
  this.setFiles(titre, blobUrl);
  const current = this.setCurrentFile(titre, blobUrl);

  this.openFile(current.file, 0, titre);
}

  playStream(url: string) {
    this.audioService.playStream(url)
      .subscribe(events => {

      });
  }

  openFile(file: any, index: number, titre: Titre) {
    titre.nb_vues++;
    this.titresService.save(titre, titre.id_titre).subscribe(
      (res: Titre) => {
        //console.log(res.nb_vues);
      });

    this.audioService.stop();
    this.playStream(file.url);
  }
/**
 * ---------------------------------------------------------------------------------------------------------
 * --------------------------------- GESTION DE PLAYLIST ---------------------------------------------------
 * ---------------------------------------------------------------------------------------------------------
 */

  /**
   * Affiche le bloc caché au clique sur le plus en ajoutant ou enlevant la classe CSS displayed
   * @param index
   */
  onClickAdd(index: number){
    this.currentIndex = index;
    const block = document.getElementsByClassName('add-to-playlist')[index];
    const curtain = document.getElementById('page');

    if(block.classList.contains('displayed')){

    } else {
      block.classList.add('displayed');
      curtain.classList.add('curtain');
    }
  }
/**
 * On enlève le rideau noir si on clique à l'extérieur du bloc affiché par la focntion précédente 'onClickAdd()'
 */
  removeCurtain(){
    document.getElementsByClassName('add-to-playlist')[this.currentIndex].classList.remove('displayed');
    document.getElementById('page').classList.remove('curtain');
    this.titreMessage = null;
    this.playlistMessage = null;
  }

/**
 * Ajoute le titre à une playlist
 * @param playlist
 * @param titre
 * @param i
 */
  onClickAddToPlaylist(playlist: Playlist, titre: Titre, i: number){
    playlist.listTitres.push(titre);
    this.playlistService.save(playlist, playlist.id_playlist).subscribe(
        res => {
          this.titreMessage = 'Morceau ajouté';
          this.successId = i;
        }, err => {
          console.error(err);
        }
    )
  }

  /**
   * Liée au formulaire de création d'une playlist
   * NB : en TS, il faut caster le getElement en HTMLInputElement qui lui contient l'attribut value
   */
  onSubmit(titre: Titre, i: number){
    const playlistName = (<HTMLInputElement>document.getElementsByClassName('new-playlist-input')[i]).value;

    if(playlistName.length == 0){
      return
    }

    const playlist: Playlist = new Playlist(playlistName, this.currentUser , [titre]);

    this.playlistService.save(playlist).subscribe(
      res => {
        this.playlistMessage = 'La playlist contenant le morceau a bien été créée';
      }, err => {
        console.error(err);
      });
  }
}
