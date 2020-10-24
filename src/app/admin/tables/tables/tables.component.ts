import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserData, DataService } from '../data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { RegisterApiService } from '../../../shared/register.api.service';
import { Student } from '../../../shared/student';
import {User} from '../../../shared/User';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalService } from '../_modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailQueue } from 'src/app/shared/mailqueue';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit, AfterViewInit {
  
  displayedColumns = ['select', 'name', 'email', 'mobile', 'country','dob','gender'];
  dataSource: MatTableDataSource<User>;
  selection: SelectionModel<User>;
  user:any= [];
  maildata;DialogData;
  maildetails:MailQueue={
    subject:'',
    body:'',
    userDetails:[],
    userrole:''
  };
  StudentData:any= [];
  foods: MailStatus[] = [
    {value: 'admin', viewValue: 'Admin'},
    {value: 'user', viewValue: 'User'}
  ];
  selectedStatus:string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  subject: string;
  body: string;
  studentForm: FormGroup;

  constructor(public fb: FormBuilder,private readonly dataService: DataService, private studentApi: RegisterApiService,public dialog: MatDialog,private modalService: ModalService) {
    this.studentApi.GetUserDetails().subscribe(data => {
      this.user = data;
      console.log(JSON.stringify(data)+"data");
      console.log(this.user);
      this.dataSource = new MatTableDataSource<User>(this.user);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      
      }, 0);
    }) 
  }

  ngOnInit() {
    this.submitBookForm();
    
    this.dataSource = new MatTableDataSource(this.user);
    this.selection = new SelectionModel<User>(true, []);
    //For Modal default code
    this.body = 'This text can be updated in modal 1';
  }
  submitBookForm() {
   
    this.studentForm = this.fb.group({
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
     
  })
  }
  openModal(id: string) {
    this.modalService.open(id);
}

closeModal(id: string) {
    this.modalService.close(id);
}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  sendMail() {  
  //  debugger;  
  this.maildata=this.studentForm.value;
    console.log("inside 1");
    const numSelected = this.selection.selected; 
    console.log("inside 2");
    this.maildetails.userDetails=numSelected;
    console.log("inside 3")
    this.maildetails.subject=this.maildata.subject;
    console.log("inside 4")
    this.maildetails.body=this.maildata.body;
    console.log("selected values in USER:"+JSON.stringify(this.maildetails));
    console.log("final user"+JSON.stringify(this.maildetails))

    console.log("===>"+JSON.stringify(this.maildetails)); 
  if (numSelected.length > 0) {

        if (confirm("Are you sure to send mail ")) {  
             this.studentApi.sendmail(this.maildetails).subscribe(result => {  
                 alert(result);  
                this.ngOnInit;  
           })  
        }
         
     } else {  
       alert("Select at least one row");  
    } 
  }
  userRole(){ 
     
  //  debugger;  
  this.maildata=this.studentForm.value;
  console.log("inside 1");
  const numSelected = this.selection.selected; 
  console.log("inside 2");
  this.maildetails.userDetails=numSelected;
  console.log("inside 3")
  this.maildetails.userrole=this.maildata.userrole;
 
  console.log("selected values in USER:"+JSON.stringify(this.maildetails));
  console.log("final user"+JSON.stringify(this.maildetails))

  console.log("===>"+JSON.stringify(this.maildetails)); 
if (numSelected.length > 0) {

      if (confirm("Are you sure to send mail ")) {  
        this.studentApi.userRole(this.selectedStatus).subscribe(data => {
          this.StudentData = data;
          console.log(JSON.stringify(data)+"data");
          console.log(this.StudentData);
          this.dataSource = new MatTableDataSource<User>(this.StudentData);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          
          }, 0);
        })
      }
       
   } else {  
     alert("Select at least one row");  
  } 

    console.log(this.selectedStatus+"manikandan Subramaniyan");
    
 

  }
  openDialog(): void {
    console.log("inside openDialog method")
     this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });

  }
   //to display the error message in UI
   public handleError = (controlName: string, errorName: string) => {
    return this.studentForm.controls[controlName].hasError(errorName);
  } 
  onStatusSelection1() {
    console.log(this.selectedStatus+"manikandan Subramaniyan");
    
      this.studentApi.getMailStatus(this.selectedStatus).subscribe(data => {
        this.StudentData = data;
        console.log(JSON.stringify(data)+"data");
        console.log(this.StudentData);
        this.dataSource = new MatTableDataSource<User>(this.StudentData);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        
        }, 0);
      })
    
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    console.log("inside close")
    this.dialogRef.close();
  }

}
export interface DialogData {
  subject: string;
  body: string;
}

interface MailStatus {
  value: string;
  viewValue: string;
}
