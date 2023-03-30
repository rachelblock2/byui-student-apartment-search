import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from './account/account.service';

@Injectable({
  providedIn: 'root'
})

export class AccessGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    const requiresLogin = route.data.requiresLogin || false;
    if (requiresLogin) {
      let token = this.accountService.getTokenCookie();
      if (!token) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
      // Check that the user is logged in...
    } else {
      return false;
    }
  }
}
