export type FieldErrors = {
  [field: string]: string[];
};

export interface IValidatorFields<PropsValidated> {
  errors: FieldErrors | null;
  validateDate: PropsValidated | null;
  validate(data: any): boolean;
}
