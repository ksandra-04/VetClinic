import { TestBed } from '@angular/core/testing';

import { Veterinarian } from './veterinarian';

describe('Veterinarian', () => {
  let service: Veterinarian;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Veterinarian);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
