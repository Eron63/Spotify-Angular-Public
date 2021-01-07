import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-modify',
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss']
})
export class ModifyComponent implements OnInit {

  userForm: FormGroup;
  selectedFile: File;
  fileBlob;
  fileUrl;

  currentUser: User;
  message: string;

  constructor(private authService: AuthService,
              private userService: UsersService,
              private formBuilder: FormBuilder) { 
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    console.log(this.currentUser)

    this.userForm = this.formBuilder.group({
      pseudo: [this.currentUser.nom_user, [Validators.required]],
      email: [this.currentUser.email_user, [Validators.required, Validators.email]],
      avatar: ''
    })
  }

  changeFile(){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });  
  }

  onFileSelected(event){
    this.selectedFile = event.target.files[0];
    this.changeFile().then((base64: string): any => {
      this.fileUrl = base64;
      const pref = base64.split(',');
      this.fileBlob = pref[1];
    });
  }

  onSubmit(){
    
    var reader = new FileReader();
    reader.readAsText(this.selectedFile);

    const user: User = new User(this.userForm.value.pseudo, this.userForm.value.email, this.fileBlob);

    this.userService.save(this.currentUser.id_user, user).subscribe(
      res => {
        this.message = 'Vos informations ont bien été modifiées';
        this.currentUser = this.authService.currentUserValue;
      }, err => {
        console.error(err);
      }
    )

  }

}
