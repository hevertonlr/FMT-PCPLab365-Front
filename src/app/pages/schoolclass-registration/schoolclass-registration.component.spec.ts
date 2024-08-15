import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolclassRegistrationComponent } from './schoolclass-registration.component';

describe('SchoolclassRegistrationComponent', () => {
  let component: SchoolclassRegistrationComponent;
  let fixture: ComponentFixture<SchoolclassRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolclassRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolclassRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
