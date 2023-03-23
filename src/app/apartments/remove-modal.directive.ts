import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[removeModal]',
})
export class RemoveModalDirective {
  // @Input() addModal = '';
  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    document.querySelector('.apartment-modal').classList.remove('background');
    document.querySelector('.apartment-details').classList.remove('show');
  }
}
