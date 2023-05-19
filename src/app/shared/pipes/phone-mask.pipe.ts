import { LocalizedString } from '@angular/compiler';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneMask',
})
export class PhoneMaskPipe implements PipeTransform {
  transform(value: string): unknown {
    let phone = '';
    if (value != '') {
      let c = value.substring(0, 3);
      let p1 = value.substring(3, 6);
      let p2 = value.substring(6, value.length);
      phone = '(' + c + ')' + ' ' + p1 + '-' + p2;
    }
    return phone;
  }
}
