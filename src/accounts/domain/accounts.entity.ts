export type AccountRole = 'producer' | 'admin';

export class Account {
  private readonly _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _passwordHash: string;
  private _role: AccountRole;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
    role: AccountRole = 'producer',
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._passwordHash = passwordHash;
    this._role = role;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();

    this.validate();
  }

  private validate() {
    if (!this._id) throw new Error('ID is required');
    if (!this._firstName) throw new Error('First name is required');
    if (!this._lastName) throw new Error('Last name is required');
    if (!this._email) throw new Error('Email is required');
    if (!this._passwordHash) throw new Error('Password hash is required');
  }

  get id() {
    return this._id;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._passwordHash;
  }

  get role() {
    return this._role;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get createdAt() {
    return this._createdAt;
  }

  updateEmail(newEmail: string) {
    if (this._email === newEmail) {
      throw new Error('Current email and new email cannot be the same');
    }

    if (!newEmail.includes('@')) {
      throw new Error('Invalid email');
    }

    this._email = newEmail;
    this.touch();
  }

  updateName(first: string, last: string) {
    this._firstName = first;
    this._lastName = last;
    this.touch();
  }

  changeRole(newRole: AccountRole) {
    this._role = newRole;
    this.touch();
  }

  updatePasswordHash(newHash: string) {
    this._passwordHash = newHash;
    this.touch();
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
