import { Component, OnInit } from '@angular/core';
import {PlaylistsService} from '../../services/playlists.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from 'src/app/services/cloud.service';
import { AudioService } from 'src/app/services/audio.service';
import { TitresService } from 'src/app/services/titres.service';
import {StreamState} from "../../interfaces/stream-state";
import { Titre } from 'src/app/model/Titre';
import { Playlist } from 'src/app/model/Playlist';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  p: number = 1;
  
  playlist: Playlist;
  playlistId: number;
  playlistSub: Subscription;

  playlistEditMessage: string;

  previousIndex: number;
  currentUser: User;
  playlistPlayingId: number;

  state: StreamState;

  files: any[] = [];
  filesSub: Subscription;

  currentFile: any = {};
  currentFileSub: Subscription;

  constructor(private playlistsService: PlaylistsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cloudService: CloudService,
    private audioService: AudioService,
    private titresService: TitresService) { 
      this.currentUser = this.authService.currentUserValue;
      
      this.audioService.getState()
      .subscribe(state => {
        this.state = state;
      });
      
    }

  ngOnInit(): void {
    
    this.playlistSub = this.route.params.subscribe(
      params => {
        this.playlistId = params['id'];
        
        if(this.playlistId){
          this.playlistsService.getById(this.playlistId).subscribe(
            (res: any) => {
              this.playlist = res;
            });
          }
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
 * --------------------- BLOC ADMINISTRATION DE LA PLAYLIST -----------------------------------------------
 */
  displaySpoiler(){
      const spoiler = document.getElementById('spoilerEdit');
      if(spoiler.style.display == "none" || spoiler.style.display == ""){
        spoiler.style.display = "block";
      } else {
        spoiler.style.display = "none";
      }
  }
/**
 * Suppression de la playlist dans la base
 * @param id
 */
  onDelete(id: number){
    if(window.confirm('Voulez-vous vraiment supprimer cette playlist ?')){
      this.playlistsService.delete(id).subscribe(
        res => {
          this.router.navigate(['/accueil']);
        }, err => {
          console.error(err);
        });
    }
  }

/**
 * Suppression d'un titre de la playlist
 * @param id 
 */
  onRemoveTitre(titre: Titre){
    const index = this.playlist.listTitres.indexOf(titre);
    if(index>-1){
      this.playlist.listTitres.splice(index, 1);
    }
    
    this.playlistsService.save(this.playlist, this.playlist.id_playlist).subscribe(
      res => {
        console.log('Le titre a bien été supprimé');
      }, err => {
        console.error(err);
      });
  }

  /**
   * Slider de la modification du titre de la playlist
   */

  expand(){
    this.playlistEditMessage = 'Entrée pour valider';
    document.getElementById('slider').className = 'expanded';
    setTimeout(function() {
      document.getElementById('input').focus();
    }, 500);
  }

  collapse(){
    this.playlistEditMessage = null;
    document.getElementById('slider').className = 'collapsed';
    document.getElementById('input').blur();
  }

  onSubmit(){
    const name = (<HTMLInputElement>document.getElementById('input')).value;
    this.playlist.nom_playlist = name;
    this.playlistsService.save(this.playlist, this.playlistId).subscribe(
      res => {
        console.log('Le nom de la playlist a bien été changé');
      },err => {
        console.error(err);
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

setCurrentFile(titre: Titre, blobUrl: string): any{
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
async getTitre(idTitre: number): Promise<any>{
  let response: any = await this.titresService.getById(idTitre).toPromise();

  if(response){
    return response;
  }
}
/**
 * Lecture d'une playlist
 */
 async playPlaylist(playlist: Playlist){
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
  const firstTitre = playlist.listTitres[0];
  const blobFirstUrl = await this.getBlob(firstTitre);
  const current = this.setCurrentFile(firstTitre, blobFirstUrl);
  
  this.openFile(current.file, 0);

  /** Remplissage du files, liste de tous les titres+blob */
  for(let titre of playlist.listTitres){
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
  this.openFile(current.file, 0);
}

/**
 *  ----------------------  Liens avec le service audio  ---------------------------------------
 */
  playStream(url: string) {
    this.audioService.playStream(url)
      .subscribe(events => {
      });
  }

  openFile(file, index: number) {
    this.audioService.stop();
    this.playStream(file.url);
  }

}
