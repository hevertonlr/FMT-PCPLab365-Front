import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Gender } from '../enums/gender';
import { CivilState } from '../enums/civilstate';
import { SchoolSubject } from '../enums/schoolsubject';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  constructor() {}
  enableAllFields = (form: FormGroup) =>
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((subKey) => {
          control.get(subKey)?.enable();
        });
      } else {
        control?.enable();
      }
    });

  disableAllFields = (
    form: FormGroup,
    includes?: string[],
    except?: string[],
  ) =>
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((subKey) => {
          if (except?.includes(subKey) || !includes?.includes(subKey)) return;
          control.get(subKey)?.disable();
        });
      } else {
        if (except?.includes(key) || !includes?.includes(key)) return;
        control?.disable();
      }
    });
  markAllAsDirty = (form: FormGroup) => {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      if (control?.hasValidator(Validators.required)) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity();
      }
    });
  };

  setReadOnly = (form: FormGroup) => {
    const addressGroup = form.get('address') as FormGroup;
    Object.keys(addressGroup.controls).forEach((field) => {
      const control = addressGroup.get(field);
      console.log(field);
      if (field === 'cep' || field === 'referencePoint') return;

      control?.value ? control?.disable() : control?.enable();
    });
  };

  getAllGenders = () =>
    Object.keys(Gender).map((key) => ({
      key,
      value: Gender[key as keyof typeof Gender],
    }));
  getAllCivilStates = () =>
    Object.keys(CivilState).map((key) => ({
      key,
      value: CivilState[key as keyof typeof CivilState],
    }));
  getAllSchoolSubjects = () =>
    Object.keys(SchoolSubject).map((key) => ({
      key,
      value: SchoolSubject[key as keyof typeof SchoolSubject],
    }));
}
