import { Component, OnInit } from '@angular/core';
import { ApiBookingsService } from 'src/app/services/api-bookings.service';
import { Router } from '@angular/router';
import { Booking } from 'src/app/services/bookingResponse';
import { BookingToShow } from 'src/app/services/BookingToShow';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import * as $ from "jquery";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  faSearch = faSearch;
  data: Array<Booking> = [];
  BookingList: Array<BookingToShow> = [];
  searchValue = 0;
  choosed = "y";
  precio = 0;
  isCollapse = true;
  constructor(private api: ApiBookingsService, private router: Router) {}

  toggleState() {
    let foo = this.isCollapse;
    this.isCollapse = foo === false ? true : false;
  }

  ngOnInit(): void {
    
    //Si el usuario inició sesión, se obtienen los bookings, de lo contrario se redirige al inicio de sesión
    let token = localStorage.getItem('token');

    if (token.toString() == "null") {
      this.router.navigate(['login']);
    } else {
      this.getBookings();
    }
  }

  salir(){
    localStorage.setItem("token", null)
    this.router.navigate(['login']);
  }

  getBookings() {
    this.api.getBookings().then((data) => {
      this.data = data;
      /*Se recorren los bookings obtenidos y se crean nuevos objetos
       simplificados de la información que solicitan para visualizar*/
      this.data.forEach((element) => {
        console.log(element.bookingId);
        let booking: BookingToShow = {
          bookingID: 0,
          cliente: '',
          direccion: '',
          fecha_creacion: new Date(),
          precio: 0,
        };

        booking.bookingID = element.bookingId;
        booking.cliente =
          element.tutenUserClient.firstName +
          ' ' +
          element.tutenUserClient.lastName;
        booking.direccion = element.locationId.streetAddress;
        booking.fecha_creacion = new Date(element.bookingTime);
        booking.precio = element.bookingPrice;

        this.BookingList.push(booking);
      });
    });
    this.BookingListFiltered = this.BookingList;
  }

buscar(){
  let valor = ""+this.searchValue;
  if(valor!=null){
    this.filtrar();
  }else{
    this.searchValue = 0;
    this.filtrar();
  }
}

//Cada que se escoga una opción de filtrado, se procederá a filtrar la información
choosedMethod(opcion){
  this.choosed = opcion;
  
  this.filtrar();
}

  BookingListFiltered;
  filtrar(){
    this.BookingListFiltered = this.BookingList;
    
    if(this.searchValue>0  || this.precio>0){
      //Se filtra por el bookingid
      if(this.searchValue>0){
        console.log(this.searchValue)
       this.BookingListFiltered =  this.BookingList.filter((item)=>{
        if (
          item.bookingID == this.searchValue
        ) {
          return item;
        }
        });
      }
      //Se filtra por precio 
        if(this.choosed=="y"){
          
          this.BookingListFiltered =  this.BookingListFiltered.filter((item)=>{
            if (
              item.precio == this.precio
            ) {
              return item;
            }
            })
        }else{
          if(this.choosed==">="){

            this.BookingListFiltered =  this.BookingListFiltered.filter((item)=>{
              if (
                item.precio >= this.precio
              ) {
                return item;
              }
              })
          }else{
            this.BookingListFiltered =  this.BookingListFiltered.filter((item)=>{
              if (
                item.precio <= this.precio
              ) {
                return item;
              }
              })
          }
        }
      

    }else{
      //En caso de que no se ingrese bookingId y/o precio, los datos son los iniciales.
      this.BookingListFiltered = this.BookingList;
    }
  }

  

}
