import { AppRouteHandler } from '@/types';
import { UsersRoute } from './user.route';

export const users: AppRouteHandler<UsersRoute> = (c) => {
  return c.json([
    { name: 'Alice', phone: '+1234567890', email: 'alice@email.com' },
    { name: 'Bob', phone: '+9876543210', email: 'Bob@email.com' },
  ]
  );
}

