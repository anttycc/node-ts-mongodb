const jwt =require('jsonwebtoken');
const secretKey = process.env.secretKey || 'secret';

export const getToken = (data:any) => {

  return jwt.sign({
    data: data
  }, secretKey, { expiresIn: '15m' });
}

export const verifyToken = (token:string) => {

  try {
    return {valid:true,docodeToken:jwt.verify(token, secretKey)};
  } catch (err) {
    return {valid:false,err};
  }
}