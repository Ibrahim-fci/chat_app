import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTransform',
  standalone: true
})
export class TextTransformPipe implements PipeTransform {



  transform(description: string): string {
    if (description.length > 10) {
      return description.slice(0, 10) + "..."
    }
    return description + "...";
  }

}
