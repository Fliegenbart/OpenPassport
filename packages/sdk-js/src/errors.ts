export class OpenPassportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenPassportError";
  }
}

export class PassportVerificationError extends OpenPassportError {
  public readonly errors: string[];

  constructor(errors: string[]) {
    super(`Passport verification failed: ${errors.join("; ")}`);
    this.name = "PassportVerificationError";
    this.errors = errors;
  }
}

export class MessageVerificationError extends OpenPassportError {
  public readonly errors: string[];

  constructor(errors: string[]) {
    super(`Message verification failed: ${errors.join("; ")}`);
    this.name = "MessageVerificationError";
    this.errors = errors;
  }
}
