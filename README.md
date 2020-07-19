# Descripción

Se requiere el desarrollo de una WebApp desarrollada usando Angular 6 o similar si prefiere este lenguaje, o en su defecto, Angular JS. Si no conoce alguno de estos lenguajes,
pregunte si se puede utilizar otro.


### Paso 1: Crear proyecto
```
ng new bookings 
```

### Paso 2: Crear componentes (Home, Login)
```
ng g components/login  
ng g components/home  
```

### Paso 3: Crear rutas 

(app-routing.module.ts)
```
const routes: Routes = [

  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "home",
    component: HomeComponent,
  },{
    path: "login",
    component: LoginComponent,
  }
  
];

export const routingComponents = [
  HomeComponent,
  LoginComponent
];
```

(app.module)
```
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    routingComponents
  ]

```

### Paso 4: Crear servicio (api-bookings.service)
```
ng g s services/api-bookings 
```

Desarrollamos el servicio
```
 url_user = 'https://dev.tuten.cl/TutenREST/rest/user/testapis@tuten.cl';


  constructor(private Http: HttpClient) {}


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

```

### Paso 5: Instalar Bootstrap, JQuery y Popperjs
```
npm install jquery
npm install bootstrap 
npm install popper.js
npm i @types/jquery --save
```

### Paso 6: login.ts y Login.html
Login.ts
```
 constructor(private api: ApiBookingsService, private router: Router) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');

    if (token != null) {
      this.router.navigate(['home']);
    }
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
```

Login.html
```
<div class="container col-md-8">
    <h1 class="card-text"> Inicio de sesión</h1>
  <form [formGroup]="form">
    <div class="form-group">
      <label for="exampleInputEmail1">Email</label>
      <input formControlName="email" type="email" class="form-control" id="email" aria-describedby="emailHelp">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input formControlName="password" type="password" class="form-control" id="password">
    </div>
    <div class="form-group">
        <label for="exampleInputPassword1">App</label>
        <input formControlName="app" type="text" class="form-control" id="app">
      </div>
    <button type="submit" class="btn btn-primary" (click)="validarUser()">Iniciar sesión</button>
  </form>
</div>

```

### Paso 7: home.ts y home.html

home.ts
```
data: Array<Booking> = [];
  BookingList: Array<BookingToShow> = [];
  searchValue = 0;
  choosed = "y";
  precio = 0;
  constructor(private api: ApiBookingsService, private router: Router) {}

  ngOnInit(): void {
    //Si el usuario inició sesión, se obtienen los bookings, de lo contrario se redirige al inicio de sesión
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

  
```


home.html
```
<div class="container">

  <div class=" container ">
    <div class="row filters">
      <div class="col">
        <label for="">BookingID</label>
        <form class="form">
          <div>
            <div class="input-group">
              <div class="input-group-prepend">

                <div class="input-group-text">
                  <fa-icon [icon]="faSearch"></fa-icon>

                </div>
              </div>
              <input [(ngModel)]="searchValue" name="searchValue" class="form-control mr-sm-2" type="number" min="0"
                placeholder="ingrese boking id" (ngModelChange)="buscar()" />

            </div>
          </div>
        </form>

      </div>
      <div class="col">
        <div class="row">
          <div class="col" style="margin-top: 2em">
            <div class="dropdown">
              <button style="width: 8em;" class="btn btn-secondary dropdown-toggle" type="button"
                id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{choosed}}
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" (click)="choosedMethod('y')">y</a>
                <a class="dropdown-item" (click)="choosedMethod('>=')">>=</a>
                <a class="dropdown-item" (click)="choosedMethod('<=')">
                  <=</a> </div> </div> </div> <div class="col">
                    <label for="">Precio</label>
                    <input [(ngModel)]="precio" class="form-control " type="number" min="0" (ngModelChange)="filtrar()">
              </div>
            </div>


          </div>
        </div>

      </div>




      <table class="table">
        <thead>
          <tr>

            <th scope="col">BookingId</th>
            <th scope="col">Cliente</th>
            <th scope="col">Fecha de creación</th>
            <th scope="col">Dirección</th>
            <th scope="col">Precio</th>

          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let booking of BookingListFiltered ">

            <td>{{booking.bookingID}}</td>
            <td>{{booking.cliente}}</td>
            <td>{{booking.fecha_creacion.toDateString()}}</td>
            <td>{{booking.direccion}}</td>
            <td>{{booking.precio | currency:'USD':'symbol':'1.0'}}</td>


          </tr>

        </tbody>
      </table>
    </div>

```

### Paso 8: estilos al gusto. 


## Running

`ng serve` 

## Tecnologías
```
    "angular": "~9.1.3"
    "bootstrap": "^4.4.0"
    "jquery": "^3.5.1",
    "popper.js": "^1.16.1",
    "rxjs": "~6.5.4"
```
