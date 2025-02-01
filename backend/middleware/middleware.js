import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { JwtPayload } from 'jsonwebtoken';


dotenv.config();

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Supabase URL and Key must be provided');
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware to authenticate the Supabase token
export const authenticateSupabaseToken = async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
   res.status(401).json({ message: 'Token is missing. Access denied.' });
   return
  }

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    res.status(403).send('Invalid or expired token');
    return;
  }

  req.user = user as JwtPayload; // Attach user to the request object

  next(); // Proceed to the next middleware/route
};
