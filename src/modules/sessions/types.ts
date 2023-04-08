export type SignInRequestBody = {
  subdomain: string;
  email: string;
  password: string;
};

export type UpdatePasswordRequestBody = {
  subdomain: string;
  userId: string;
  password: string;
  newPassword: string;
};
