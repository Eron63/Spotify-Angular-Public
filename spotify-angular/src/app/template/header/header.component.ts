import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import * as firebase from 'firebase';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;
  @Input() currentUser: any;

  constructor(public authService: AuthService, 
              private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.isAuth = true;
        } else {
          this.isAuth = false;
        }
      }
    );
  }

  onSignOut() {
    this.authService.signOutUser();
  }


  selectedit(event ){
    console.log(event.target.value)
    this.router.navigate([event.target.value]);
  }

  onSearch(){
    const search = (<HTMLInputElement>document.getElementById('listSearch')).value;
    this.router.navigate(['recherche/' + search])
  }


}
