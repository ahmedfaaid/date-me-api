import type { ZodSchema } from '@/types';

const multipartContent = <T extends ZodSchema>(
  schema: T,
  description: string
) => {
  return {
    content: {
      'multipart/form-data': {
        schema
      }
    },
    description
  };
};

export default multipartContent;
