import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/service/error.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading:boolean = false;
  public form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {}

  login() {
    if (this.form.valid) {
      this.loading = true
      this.userService.login(this.form.value).subscribe({
        next: (data) => {
          localStorage.setItem('token', data.token);
          this.router.navigate(['/dashboard'])
        },
        error: (e: HttpErrorResponse) => {
          this.errorService.msjError(e);
          this.loading = false
        }
      });
    } else {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }
  }
}
