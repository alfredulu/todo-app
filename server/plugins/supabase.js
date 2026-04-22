import fp from 'fastify-plugin';
import { createClient } from '@supabase/supabase-js';

async function supabasePlugin(fastify, options) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY environment variables are required');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  fastify.decorate('supabase', supabase);
}

export default fp(supabasePlugin);
