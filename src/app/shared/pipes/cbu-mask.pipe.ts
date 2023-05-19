import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cbuMask',
})
export class CbuMaskPipe implements PipeTransform {
  transform(value: string): unknown {
    let cbu = '';
    if (value != '') {
      let ent = value.substring(0, 3);
      let suc = value.substring(3, 7);
      let v1 = value.substring(7, 8);
      let cuenta = value.substring(8, value.length-1);
      let v2 = value.slice(value.length - 1);
      cbu = ent + ' ' + suc + ' ' + v1 + ' ' + cuenta + ' ' + v2;
    }
    return cbu;
  }
}
