import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[addModal]',
})
export class AddModalDirective {
  // @Input() addModal = '';
  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    document.querySelector('.apartment-modal').classList.add('background');
    document.querySelector('.apartment-details').classList.add('show');
  }
}
