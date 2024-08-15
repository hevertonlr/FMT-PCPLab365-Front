import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeRegistrationComponent } from './grade-registration.component';

describe('GradeRegistrationComponent', () => {
  let component: GradeRegistrationComponent;
  let fixture: ComponentFixture<GradeRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
