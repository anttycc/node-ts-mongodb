import bcrypt from 'bcrypt';

export const validatePassword = (value: string, value2: string) => {
  return bcrypt.compareSync(value2, value);
};
export const getPasswordHash = (value: string) => {
  return bcrypt.hashSync(value, 10);
}