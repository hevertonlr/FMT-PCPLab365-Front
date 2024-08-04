import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private fieldAliases: { [key: string]: string } = {
    email: 'E-mail',
    password: 'Senha',
  };
  getErrorMessages = (form: FormGroup) => {
    const errors: string[] = [];

    Object.keys(form.controls).forEach((key) => {
      const controlErrors = form.get(key)?.errors;
      if (!controlErrors) return;

      const alias = this.fieldAliases[key] || key;
      Object.keys(controlErrors).forEach((errorKey) => {
        switch (errorKey) {
          case 'required':
            errors.push(`O campo ${alias} é obrigatório.`);
            break;
          case 'email':
            errors.push(`Informe um endereço de e-mail válido.`);
            break;
          case 'minlength':
            errors.push(
              `${alias} deve ter ao menos ${controlErrors['minlength'].requiredLength} caracteres.`,
            );
            break;
          default:
            errors.push(`O campo ${alias} é inválido.`);
        }
      });
    });
    return errors;
  };
  getInputErrorMessage = (form: FormGroup, inputName: string) => {
    const errors = form.get(inputName)?.errors;
    if (!errors) return;
    const alias = this.fieldAliases[inputName] || inputName;
    if (errors['required']) return `O campo ${alias} é obrigatório.`;
    if (errors['email']) return `Informe um endereço de e-mail válido.`;
    if (errors['minlength'])
      return `${alias} deve ter ao menos ${errors['minlength'].requiredLength} caracteres.`;

    return `O campo ${alias} é inválido.`;
  };

  getAlertProperties(form: FormGroup): {
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
      alertProperties.alertErrors = this.getErrorMessages(form);
    }

    return alertProperties;
  }
}
