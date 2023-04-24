import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "timerCountdown"
})
export class TimerCountdownPipe implements PipeTransform {
    transform(value: number): number {     
        const val = value.toString().split(":");
        const hours = Number(val[0]);
        const minutes = Number(val[1]);
        let ss = Number(val[2]);
        let totalSS = ((hours * 3600) + (minutes * 60) + ss);
        const minutes1: number = Math.floor(totalSS / 60);
        return totalSS;
       
    }
}
