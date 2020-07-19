import { Component, OnInit } from '@angular/core';
import { ApiBookingsService } from 'src/app/services/api-bookings.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private api: ApiBookingsService, private router: Router) {

     
    let token = localStorage.getItem('token');

    if (token.toString() !== "null") {
      this.router.navigate(['home']);
    }
  }

  ngOnInit(): void {
  
  }

  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    app: new FormControl(''),
  });

  validarUser() {
    let email = this.form.value['email'];
    let password = this.form.value['password'];
    let app = this.form.value['app'];

    this.api.validarUser(email, password, app).then((data: any) => {
      console.log(data.sessionTokenBck != null);
      if (data.sessionTokenBck != null) {
        localStorage.setItem('token', data.sessionTokenBck);
        this.router.navigate(['home']);
      }
    });
  }
}
