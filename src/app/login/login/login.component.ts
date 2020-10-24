import { Component, OnInit,NgZone} from '@angular/core';
import { Router } from '@angular/router';
import {RegisterApiService} from '../../shared/register.api.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Student } from '../../shared/student';

import {FormControl} from '@angular/forms';
import { User } from '../../shared/User';
import { MustMatch } from '../../_helper/must-match.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 

 
  disableSelect = new FormControl(false);
  studentForm: FormGroup;
 // owner:Student;
  errorMessage:any;
  displayError:any;
  hide = true;
  hide1=true;
  SectioinArray: any = ['A', 'B', 'C', 'D', 'E'];
  user:User;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(public fb: FormBuilder,private router: Router,  private studentApi: RegisterApiService,
    private ngZone: NgZone,) {}
  
  ngOnInit() {
    this.submitBookForm();
  }
  // onLogin(owner:any) {
  //   console.log(JSON.stringify(owner));
  //   if (this.studentForm.valid) {
  //     this.studentApi.AddStudent(this.studentForm.value).subscribe(res => {
  //       this.ngZone.run(() => this.router.navigateByUrl('/students-list'))
  //     });
  //   }
  //   localStorage.setItem('isLoggedin', 'true');
    
  // }
  public handleError = (controlName: string, errorName: string) => {
    return this.studentForm.controls[controlName].hasError(errorName);
  } 
  onLogin() {
    delete this.studentForm.value.repassword;
    this.user=this.studentForm.value;
    
    console.log(this.user)
    console.log("first place"+JSON.stringify(this.user));
    if (this.studentForm.valid) {
      this.studentApi.login(this.user).subscribe(
          newOwner => {
            this.user = newOwner;
            console.log("output==>"+this.user);
          if(newOwner==1){
              this.displayError="";
               localStorage.setItem('isLoggedin', 'true');
              this.router.navigate(['/dashboard']);
             
            }else if(newOwner==2){
              this.displayError="Email Id not found.Please Register!"
             } else if(newOwner==3){
              this.displayError="Password you have entered is incorrect!"
              }else {
                this.displayError="Something went wrong .Please try again later!"
              }
        //   //  this.gotoOwnersList();
          },
          error => this.errorMessage = error as any
          
       );
    }
   // owner._id = null;
    // this.studentApi.register(owner).subscribe(
    //   newOwner => {
    //     this.owner = newOwner;
    //     console.log("output==>"+this.owner);
    //     if(newOwner==0){
    //       this.displayError="Something went wrong.Please try again later!"
    //     }else{
    //       this.displayError="";
    //       localStorage.setItem('isLoggedin', 'true');
    //       this.router.navigate(['/dashboard']);
    //     }
    //   //  this.gotoOwnersList();
    //   },
    //   error => this.errorMessage = error as any
      
    // );
    console.log("output error==>"+this.errorMessage)
  }
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.studentForm.get('dob').setValue(convertDate, {
      onlyself: true
    })
  } 
  submitBookForm() {
   
    this.studentForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required,Validators.min(3)] ]
    })
  }
  get passwordInput() { return this.studentForm.get('password'); } 
  get repasswordInput() { return this.studentForm.get('repassword'); } 
  onRegister(){
    this.router.navigate(['/register']);
  }
 //for telephone

}
