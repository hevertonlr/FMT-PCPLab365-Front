import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  getErrorMessages = (
    form: FormGroup,
    fieldAliases: { [key: string]: string },
  ) => {
    const errors: string[] = [];

    Object.keys(form.controls).forEach((key) => {
      const controlErrors = form.get(key)?.errors;
      if (!controlErrors) return;

      const alias = fieldAliases[key] || key;
      Object.keys(controlErrors).forEach((errorKey) => {
        const errorMessage = this.getErrorMessage(
          errorKey,
          alias,
          controlErrors[errorKey],
        );
        if (errorMessage) {
          errors.push(errorMessage);
        }
      });
    });
    return errors;
  };

  getControlErrors = (
    form: FormGroup,
    controlName: string,
    fieldAliases: { [key: string]: string } | string,
  ): string[] => {
    const errors: string[] = [];
    const controlErrors = form.get(controlName)?.errors;

    if (!controlErrors) return errors;

    const alias =
      typeof fieldAliases === 'string'
        ? fieldAliases
        : fieldAliases[controlName] || controlName;

    Object.keys(controlErrors).forEach((errorKey) => {
      const errorMessage = this.getErrorMessage(
        errorKey,
        alias,
        controlErrors[errorKey],
      );
      if (errorMessage) {
        errors.push(errorMessage);
      }
    });

    return errors;
  };

  getAlertProperties(
    form: FormGroup,
    fieldAliases: { [key: string]: string },
  ): {
    showAlert: boolean;
    alertMessage: string;
    alertErrors: string[];
  } {
    const alertProperties = {
      showAlert: false,
      alertMessage: '',
      alertErrors: [] as string[],
    };

    if (form.invalid) {
      alertProperties.showAlert = true;
      alertProperties.alertMessage = 'Por favor verifique os campos:';
      alertProperties.alertErrors = this.getErrorMessages(form, fieldAliases);
    }

    return alertProperties;
  }

  isValid = (form: FormGroup, inputName: string) => {
    const invalid = this.checkIsInvalid(form, inputName);
    const valid = this.checkIsValid(form, inputName);
    if (invalid && !valid) return false;
    if (!invalid && valid) return true;
    return undefined;
  };

  private checkIsInvalid = (form: FormGroup, controlName: string): boolean => {
    const control = form.get(controlName);
    return (control?.invalid && (control?.dirty || control?.touched)) ?? false;
  };
  private checkIsValid = (form: FormGroup, controlName: string): boolean => {
    const control = form.get(controlName);
    return (control?.valid && (control?.dirty || control?.touched)) ?? false;
  };

  private getErrorMessage = (
    errorKey: string,
    alias: string,
    errorValue: any,
  ): string | null => {
    switch (errorKey) {
      case 'required':
        return `O campo ${alias} é obrigatório.`;
      case 'email':
        return `Informe um endereço de e-mail válido.`;
      case 'minlength':
        return `${alias} deve ter ao menos ${errorValue.requiredLength} caracteres.`;

      case 'maxLength':
        return `${alias} deve no máximo ${errorValue.requiredLength} caracteres.`;
      case 'min':
        return `${alias} deve ser maior ou igual a ${errorValue.min}.`;
      case 'max':
        return `${alias} deve ser menor ou igual a ${errorValue.max}.`;
      case 'pattern':
        if (alias === 'CPF') {
          return `O campo ${alias} deve estar no formato 000.000.000-00.`;
        }
        if (alias === 'Telefone' || alias === 'Celular') {
          return `O campo ${alias} deve estar no formato (00) 00000-0000.`;
        }
        return `O campo ${alias} possui um formato inválido.`;
      default:
        return `O campo ${alias} é inválido.`;
    }
  };
}
