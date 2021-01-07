import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';

import {AuthService} from './services/auth.service';
import { CloudService } from './services/cloud.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'spotify-angular';
  currentUser;

  constructor(private authService: AuthService,
              private cloudService: CloudService) {
    
    /** CONFIGURATION FIREBASE **/
    const config = {
      apiKey: 'AIzaSyAueiEvtQ-ohjSBDRj1uNXDyWRz0HvZFeA',
      authDomain: 'spotify-bb2ba.firebaseapp.com',
      databaseURL: 'https://spotify-bb2ba.firebaseio.com',
      projectId: 'spotify-bb2ba',
      storageBucket: 'spotify-bb2ba.appspot.com',
      messagingSenderId: '96377839049',
      appId: '1:96377839049:web:3b28da5a0edc024a1b9c18',
      measurementId: 'G-H1Z1PC569Q'
    };
    firebase.initializeApp(config);

    this.currentUser = this.authService.currentUserValue;
    
  }

  ngOnInit(){
  }
}
