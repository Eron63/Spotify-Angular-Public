import { TestBed } from '@angular/core/testing';

import { TitresService } from './titres.service';

describe('TitresService', () => {
  let service: TitresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
