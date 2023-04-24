import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class SummernoteTextEditorService {
 
    constructor(
        private router: Router,       
    ) { }

    private data;

    setData(data) {        
        this.data = data;       
    }

    getDataSummernote() {
        let temp = this.data;
        this.clearData();
        return temp;
    }    
    clearData() {
        this.data = undefined;
    }
}
