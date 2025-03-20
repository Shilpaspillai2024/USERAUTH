
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AdminToken {
  admin: boolean;
}

export const adminAuth = (req: Request & { admin?: boolean }, res: Response, next: NextFunction) => {
  
  const token = req.header('x-auth-token');

  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AdminToken;
    
    if (!decoded.admin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    
    req.admin = true;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};