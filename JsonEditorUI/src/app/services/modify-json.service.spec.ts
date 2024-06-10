import { TestBed } from '@angular/core/testing';

import { ModifyJsonService } from './modify-json.service';

describe('ModifyJsonService', () => {
  let service: ModifyJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifyJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
