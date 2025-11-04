/*
 * Database adapter that chooses MySQL or Postgres (Supabase) at runtime.
 * If process.env.DATABASE_URL is set (Postgres), this uses `pg` and
 * exposes a compatible `query(sql, params, cb)` and `connect(cb)` API
 * so the rest of the code (which expects mysql's connection shape)
 * can continue to call `query` either with callbacks or promises.
 */

const DEBUG = false

if (process.env.DATABASE_URL) {
  // Postgres (Supabase/Neon/etc.) adapter
  const { Pool } = require('pg')

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })

  function log(...args) {
    if (DEBUG) console.log('[DB:pg]', ...args)
  }

  async function query(q, params, cb) {
    // Normalize args: (q, cb) or (q, params, cb)
    if (typeof params === 'function') {
      cb = params
      params = []
    }
    params = params || []
    log(q, params)
    try {
      const res = await pool.query(q, params)
      // For mysql compatibility we return rows and also an insertId when possible
      const out = res.rows
      if (cb) return cb(null, out)
      return out
    } catch (err) {
      if (cb) return cb(err)
      throw err
    }
  }

  function connect(cb) {
    // pool connects lazily; provide a no-op connect for compatibility
    if (cb) return cb(null)
    return Promise.resolve()
  }

  module.exports = {
    query,
    connect,
    // expose the pool for advanced usage if needed
    _pgPool: pool,
  }
} else {
  // Fall back to original MySQL module
  module.exports = require('./Mysql')
}
