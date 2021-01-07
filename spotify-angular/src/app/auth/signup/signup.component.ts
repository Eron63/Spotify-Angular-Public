import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;
  errorMessage: string;

  selectedFile: File;
  fileUrl;
  fileBlob;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService) { }

  ngOnInit() {
    this.initForm();

    this.authService.getDefaultAvatar().subscribe(
      (res: File) => {
        this.selectedFile = res;
        this.changeFile(this.selectedFile).then((base64: string): any => {
          this.fileUrl = base64;
          const pref = base64.split(',');
          this.fileBlob = pref[1];
        });

      }, err => {
        console.error(err);
    });
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      pseudo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }

  changeFile(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });  
  }

  onFileSelected(event){
    this.selectedFile = event.target.files[0];
    this.changeFile(this.selectedFile).then((base64: string): any => {
      this.fileUrl = base64;
      const pref = base64.split(',');
      this.fileBlob = pref[1];
    });
  }

  onSubmit() {
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const pseudo = this.signUpForm.get('pseudo').value;

    const user = new User(pseudo, email, this.fileBlob);

    this.authService.createNewUser(user, password);
  }
}
