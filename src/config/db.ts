import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getServerDBConfig = () => {
  return createEnv({
    runtimeEnv: {
      DATABASE_DRIVER: process.env.DATABASE_DRIVER || 'neon',
      DATABASE_TEST_URL: process.env.DATABASE_TEST_URL,
      DATABASE_URL: process.env.DATABASE_URL,

      KEY_VAULTS_SECRET: process.env.KEY_VAULTS_SECRET,

      REMOVE_GLOBAL_FILE: process.env.DISABLE_REMOVE_GLOBAL_FILE !== '0',

      V2_API_URL: process.env.V2_API_URL,
      V2_LOBE_SHARED_SECRET: process.env.V2_LOBE_SHARED_SECRET,
      V2_USER_ID: process.env.V2_USER_ID ? Number(process.env.V2_USER_ID) : undefined,
    },
    server: {
      DATABASE_DRIVER: z.enum(['neon', 'node']),
      DATABASE_TEST_URL: z.string().optional(),
      DATABASE_URL: z.string().optional(),

      KEY_VAULTS_SECRET: z.string().optional(),

      REMOVE_GLOBAL_FILE: z.boolean().optional(),

      V2_API_URL: z.string().url().optional(),
      V2_LOBE_SHARED_SECRET: z.string().optional(),
      V2_USER_ID: z.number().int().positive().optional(),
    },
  });
};

export const serverDBEnv = getServerDBConfig();
