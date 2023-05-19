import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cuilMask',
})
export class CuilMaskPipe implements PipeTransform {
  transform(value: string): unknown {
    let cuil = '';
    if (value != '') {
      let c1 = value.substring(0, 2);
      let dni = value.substring(2, value.length - 1);
      let c2 = value.slice(value.length - 1);
      cuil = c1 + '-' + dni + '-' + c2;
    }
    return cuil;
  }
}
