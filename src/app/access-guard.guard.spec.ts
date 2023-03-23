import { TestBed } from '@angular/core/testing';

import { AccessGuard } from './access-guard.guard';

describe('AccessGuardGuard', () => {
  let guard: AccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
