import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UsersService} from './users.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';
import { Globals } from '../helpers/globals';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserSubject: BehaviorSubject<any>;
  currentUser: Observable<any>;
  logged: boolean = false;
  
  urlApi = this.globals.API_URL + '/users/';

  constructor(private http: HttpClient,
              private usersService: UsersService,
              private router: Router,
              private globals: Globals) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
  /**
   * Pour créer un nouvel utilisateur on vérifie d'abord dans la base si le nom ou l'email n'existe pas déjà,
   * ensuite, s'ils n'existent pas, on enregistre l'utilisateur dans la base et dans firebase.
   */
  createNewUser(user: User, password: string) {
    console.log(user);
    return this.http.post(this.urlApi, user).subscribe(
      res => {
        firebase.auth().createUserWithEmailAndPassword(user.email_user, password).then(
          () => {
            console.log('user ' + user.nom_user + ' crée');
            this.router.navigate(['/accueil']);
          }, (error) => {
            console.error(error);
          });
      }, err => {
        console.error(err);
      });
  }

  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            this.usersService.getByEmail(email).subscribe(
              (user: User) => {
                if(user){
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  this.currentUserSubject.next(user);
                  location.reload(true);
                }
              });
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  signOutUser() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    firebase.auth().signOut();
    location.reload(true);
  }

  getDefaultAvatar(){
    return this.http.get('http://localhost:4200/assets/images/avatar.jpg', { responseType: 'blob'});
  }

}
