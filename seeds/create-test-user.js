#!/usr/bin/env node
/**
 * Seed script to create a stable test user for local/dev use.
 * Usage: npm run seed:test
 * Make sure your `.env` is configured and the DB (`db.sql`) is imported.
 */

require('dotenv').config()

const db = require('../config/db')
const User = require('../config/User')
const bcrypt = require('bcrypt-nodejs')

const TEST_USER = {
  username: 'seed_testuser',
  firstname: 'Seed',
  surname: 'User',
  email: 'seed_testuser@example.com',
  password: 'Test1234!',
  joined: new Date().getTime(),
  email_verified: 'yes',
  isOnline: 'no',
}

const run = async () => {
  try {
    // If using Postgres adapter it exposes _pgPool on the db object
    if (db && db._pgPool) {
      // Use Postgres-compatible queries ($1, $2...)
      let found = await db.query(
        'SELECT id, username, email FROM users WHERE username=$1 OR email=$2 LIMIT 1',
        [TEST_USER.username, TEST_USER.email]
      )

      if (found && found.length > 0) {
        console.log('Test user already exists:')
        console.log(`  id: ${found[0].id}`)
        console.log(`  username: ${found[0].username}`)
        console.log(`  email: ${found[0].email}`)
        console.log('\nIf you want to recreate it, delete the user from your DB and re-run this script.')
        process.exit(0)
      }

      // Hash password the same way as config/User.create_user
      const hash = bcrypt.hashSync(TEST_USER.password)

      // Insert only a minimal set of columns; other columns will take defaults or empty values
      const insertQuery = `INSERT INTO users
        (username, firstname, surname, email, password, bio, joined, email_verified, account_type, instagram, twitter, facebook, github, website, phone, isOnline, lastOnline)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
        RETURNING id`

      const values = [
        TEST_USER.username,
        TEST_USER.firstname,
        TEST_USER.surname,
        TEST_USER.email,
        hash,
        '',
        String(TEST_USER.joined),
        TEST_USER.email_verified,
        'public',
        '',
        '',
        '',
        '',
        '',
        '',
        TEST_USER.isOnline,
        '',
      ]

      const res = await db._pgPool.query(insertQuery, values)
      if (res && res.rows && res.rows[0] && res.rows[0].id) {
        console.log('Created test user:')
        console.log(`  id: ${res.rows[0].id}`)
        console.log(`  username: ${TEST_USER.username}`)
        console.log(`  email: ${TEST_USER.email}`)
        console.log(`  password: ${TEST_USER.password}`)
        console.log('\nYou can now log in with these credentials on your Supabase/Postgres instance.')
        process.exit(0)
      } else {
        console.error('Unexpected response when creating user (pg):', res)
        process.exit(1)
      }
    }

    // Fallback to existing MySQL path which uses User.create_user
    let found = await db.query(
      'SELECT id, username, email FROM users WHERE username=? OR email=? LIMIT 1',
      [TEST_USER.username, TEST_USER.email]
    )

    if (found && found.length > 0) {
      console.log('Test user already exists:')
      console.log(`  id: ${found[0].id}`)
      console.log(`  username: ${found[0].username}`)
      console.log(`  email: ${found[0].email}`)
      console.log('\nIf you want to recreate it, delete the user from your DB and re-run this script.')
      process.exit(0)
    }

    let res = await User.create_user(TEST_USER)
    if (res && res.insertId) {
      console.log('Created test user:')
      console.log(`  id: ${res.insertId}`)
      console.log(`  username: ${TEST_USER.username}`)
      console.log(`  email: ${TEST_USER.email}`)
      console.log(`  password: ${TEST_USER.password}`)
      console.log('\nYou can now log in with these credentials on your local instance.')
      process.exit(0)
    } else {
      console.error('Unexpected response when creating user:', res)
      process.exit(1)
    }
  } catch (err) {
    console.error('Failed to create test user:', err)
    process.exit(1)
  }
}

run()
