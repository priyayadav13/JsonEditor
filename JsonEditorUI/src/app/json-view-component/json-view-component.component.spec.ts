import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonViewComponentComponent } from './json-view-component.component';

describe('JsonViewComponentComponent', () => {
  let component: JsonViewComponentComponent;
  let fixture: ComponentFixture<JsonViewComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JsonViewComponentComponent]
    });
    fixture = TestBed.createComponent(JsonViewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
