import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[toggleHeader]'
})
export class ToggleHeaderDirective {

  constructor() { }

  @HostListener('click') onClick() {
    const mainnav = document.querySelector('.navigation');

    mainnav.classList.toggle('responsive');

    window.onresize = () => {
      if (window.innerWidth > 500) mainnav.classList.remove('responsive');
    };
  }
}
