import { Component, Input } from '@angular/core';
import { map, takeWhile } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.less']
})
export class CountDownComponent {
   

   
  @Input() seconds = 300;

  timeRemaining = timer(0, 1000).pipe(
    map(n => (this.seconds - n) * 1000),
    takeWhile(n => n >= 0),
    );

    public constructor() {


    }
    ngOnInit(): void {
      
    }
    
}
