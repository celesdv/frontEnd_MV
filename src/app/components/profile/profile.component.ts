import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/service/error.service';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  token = localStorage.getItem('token');
  info: any;
  userId!: number;
  user!: User;
  loading: boolean = true;
  editPass: boolean = false;
  form: FormGroup;
  userPassword: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private errorService: ErrorService,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      oldPass: ['', [Validators.required]],
      newPass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    if (this.token && this.token != '') {
      this.info = JSON.parse(atob(this.token.split('.')[1]));
      this.userId = this.info.id;
    }
    if (this.userId) {
      this.userService.getById(this.userId).subscribe({
        next: (data: User) => {
          this.user = data;
          console.log(this.user);
          this.loading = false;
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false;
        },
      });
    }
  }

  updatePassword() {
    this.editPass = !this.editPass;
    this.form.reset();
  }

  accept() {
    let data = {
      oldPassword: this.form.value.oldPass,
      password: this.form.value.newPass,
    };

    console.log(data, this.user.id);
    this.userService.updatePassword(this.user, data).subscribe({
      next: () => {
        this.toastr.success(
          `La contraseña fue actualizada con exito`,
          'Usuario editado'
        );
        this.form.reset();
        this.editPass = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.form.reset();
        this.editPass = false;
      },
    });
  }
}
