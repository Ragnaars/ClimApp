import { TestBed } from '@angular/core/testing';

import { ObtenerLocalidaqdService } from './obtener-localidaqd.service';

describe('ObtenerLocalidaqdService', () => {
  let service: ObtenerLocalidaqdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObtenerLocalidaqdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
