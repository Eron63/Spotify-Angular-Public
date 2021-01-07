import { Component, OnInit } from '@angular/core';
import { AudioService } from '../services/audio.service';
import { CloudService } from '../services/cloud.service';
import { StreamState } from '../interfaces/stream-state';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { TitresService } from '../services/titres.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit{
  files: any[] = [];
  fileSub: Subscription;

  state: StreamState;

  currentFile: any = {};
  currentFileSub: Subscription;

  constructor(private audioService: AudioService,
              private cloudService: CloudService,
              private titreService: TitresService) {
    // listen to stream state
    this.audioService.getState()
      .subscribe(state => {
        this.state = state;
      });
  }

  ngOnInit(){
    // get media files
    this.fileSub = this.cloudService.filesSubject.subscribe(
      (files: any[]) => {
        this.files = files;
      });

    this.currentFileSub = this.cloudService.currentFileSubject.subscribe(
      (currentFile: any) => {
        this.currentFile = currentFile;
      });
  }

    playStream(url) {
    this.audioService.playStream(url)
      .subscribe(events => {
        // listening for fun here
      });
  }

  openFile(file: any, index: number) {
    const currentFile = { index, file };

    this.cloudService.emitCurrentFileSubject(currentFile);

    this.audioService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    //this.openFile(this.currentFile.file, this.currentFile.index)
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    let index: number;

    if(this.currentFile.file == undefined){
      return;
    }

    if(this.currentFile.index < this.files.length - 1){
      index = this.currentFile.index + 1;
    } else {
      index = this.files.length - 1;
    }

    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    let index: number;

    if(this.currentFile.file == undefined){
      return;
    }

    if(this.currentFile.index > 0){
      index = this.currentFile.index - 1;
    } else {
      index = 0;
    }

    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);

    this.audioService.getState().subscribe(
      res => {
        if(this.audioService.getEndState() == true)
        {
          this.next();
        }
      }
    )
  }

/**
 * ----------------------------------------------------------------------------------
 * --------------------- Gestion de la liste de lecture courante---------------------
 * ----------------------------------------------------------------------------------
 */

  onRemoveTitre(file: any){
    const index = this.files.indexOf(file);
    if(index>-1){
      this.files.splice(index, 1);
    }
    this.cloudService.emitFilesSubject(this.files);
  }

}
