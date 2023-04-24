//import { Injectable, ViewChild } from '@angular/core';
//import { Router } from '@angular/router';


//@Injectable()
//export class PivotGridService {
 
//    constructor(
//        private router: Router,       
//    ) { }

//    private data;

//    setData(data) {        
//        this.data = data;       
//    }

//    getDataUploadFile() {
//        let temp = this.data;
//        this.clearData();
//        return temp;
//    }    
//    clearData() {
//        this.data = undefined;
//    }
//}





import { Injectable } from '@angular/core';

export class Sale {
    id: number;
    region: string;
    country: string;
    city: string;
    amount: number;
    date: Date;
}

let sales: Sale[];

@Injectable()
export class PivotGridService {
    getSales() {
        return sales;
    }
}
