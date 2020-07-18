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
  constructor(private api: ApiBookingsService, private router: Router) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');

    if (token == null) {
      this.router.navigate(['login']);
    } else {
      this.getBookings();
    }
  }

  getBookings() {
    this.api.getBookings().then((data) => {
      this.data = data;

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

choosedMethod(opcion){
  this.choosed = opcion;
  
  this.filtrar();
}

  BookingListFiltered;
  filtrar(){
    this.BookingListFiltered = this.BookingList;
    
    if(this.searchValue>0  || this.precio>0){

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
      this.BookingListFiltered = this.BookingList;
    }
  }

  

}
