export interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserParams {
  email?: string;
  password?: string;
  name?: string;
}
