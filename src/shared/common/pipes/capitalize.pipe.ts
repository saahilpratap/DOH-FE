import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'Capitalize' })

export class CapitalizePipe implements PipeTransform {
    transform(value: string): string {
        let newStr: string = "";
        for (var i = 0; i <= value.length; i++) {
            if (value.charAt(i).toUpperCase() == value.charAt(i)) {
                newStr += ' ';
            }
            newStr += value.charAt(i);
        }
        return newStr;
    }
}
