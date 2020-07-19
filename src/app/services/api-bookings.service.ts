import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from './bookingResponse';

@Injectable({
  providedIn: 'root',
})
export class ApiBookingsService {
  url_user = 'https://dev.tuten.cl/TutenREST/rest/user/testapis@tuten.cl';


  constructor() {}


  //Método que hace la petición http a la api para validar al usuario ingresado
  async validarUser(email, password, app) {
 
    var settings: any = {
      url: 'https://dev.tuten.cl/TutenREST/rest/user/'+email,
      method: 'PUT',
      timeout: 0,
      headers: {
        password: password,
        app: app,
        Accept: 'application/json',
      },
      processData: false,
      mimeType: 'multipart/form-data',
      contentType: false,
    };

    let data;
    await $.ajax(settings).done(function (response) {
     
       data = JSON.parse(response);
      //  console.log(data)
    });
    
    
    return data;
    // return data;
  }
  //Método para obtener todos los bookings con el contacto y el token obtenido del inicio de sesión
  async getBookings(){
    const adminemail = "testapis@tuten.cl";
    const email = "contacto@tuten.cl";
    const token = localStorage.getItem("token");
    const current =  true;
    const app = "APP_BCK";


    var settings: any = {
      url: 'https://dev.tuten.cl/TutenREST/rest/user/'+email+'/bookings?current='+current,
      method: 'GET',
      timeout: 0,
      headers: {
        adminemail: adminemail,
        token: token,
        app: app,
        Accept: 'application/json',
      },
      processData: false,
      mimeType: 'multipart/form-data',
      contentType: false,
    };

    let data:Array<Booking> =[];;
    await $.ajax(settings).done(function (response) {
     
       data = JSON.parse(response);
      //  console.log(data)
    });
    
    
    return data;
  }

}
