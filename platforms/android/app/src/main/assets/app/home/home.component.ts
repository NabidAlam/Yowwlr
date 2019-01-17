import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from "../services";
import { Yowl } from "../models";
import { RouterExtensions } from 'nativescript-angular/router/router-extensions';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: "yw-home",
    templateUrl: "home.html"
})
export class HomeComponent implements OnInit { 

    public yowl: Yowl;
    id: string;
    name: string;
    username: string;
    text: string;
    date: string;
    UID: string

    public yowls$: Observable<any>;
    
    constructor(private routerExtensions: RouterExtensions,
        private firebaseService: FirebaseService,
        private router: Router
    ) {}

    ngOnInit() {        
       this.firebaseService.getMessage();
    }
    
    sendYowl(){
      this.yowl = new Yowl(
          this.id,
          this.name,
          this.username,
          this.text,
          this.date,
          this.UID,
      )
        this.firebaseService.sendYowl(this.yowl).then((message:any) => {
            alert(message);
       }) 
    }

    logout() {
        this.firebaseService.logout();
        this.routerExtensions.navigate(["/login"], { clearHistory: true });
    }
}

