import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementButtonComponent } from './implement-button.component';

describe('ImplementButtonComponent', () => {
  let component: ImplementButtonComponent;
  let fixture: ComponentFixture<ImplementButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImplementButtonComponent]
    });
    fixture = TestBed.createComponent(ImplementButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
