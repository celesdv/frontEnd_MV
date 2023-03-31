import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { ErrorService } from 'src/app/service/error.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css'],
})
export class FormUserComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  action: string = 'Agregar ';
  id: number;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private errorService: ErrorService,
    private aRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [],
      roleId: [],
    });
    this.id = Number(aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (this.id != 0) {
      this.action = 'Editar ';
      this.getUser(this.id);
    }
  }

  getUser(id: number) {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (data: User) => {
        this.loading = false;
        let role = false
        if(data.roleId ===1) {
          role = true
        }
        this.form.setValue({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          roleId: data.roleId === 1 ? true : false,
        });
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
    });
  }

  accept() {
    this.loading = true;
    if (this.form.valid) {
      const user: User = {
        first_name: this.form.value.first_name,
        last_name: this.form.value.last_name,
        email: this.form.value.email,
        password: this.form.value.password,
        phone: this.form.value.phone,
        roleId: this.form.value.roleId === true ? 1 : 2,
      };

      if (this.id !== 0) {
        user.id = this.id
        this.userService.updateUser(user).subscribe({
          next: () => {
            this.toastr.success(
              `El usuario ${user.first_name} ${user.last_name} fue editado con exito`,
              'Usuario editado'
            );
            this.loading = false;
            this.router.navigate(['/users']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        })
      } else {
        this.userService.addUser(user).subscribe({
          next: () => {
            this.toastr.success(
              `El usuario ${user.first_name} ${user.last_name} fue registrado con exito`,
              'Usuario agregado'
            );
            this.loading = false;
            this.router.navigate(['/users']);
          },
          error: (e: HttpErrorResponse) => {
            this.errorService.msjError(e);
            this.loading = false;
          },
        });
      }
    }
  }
}
