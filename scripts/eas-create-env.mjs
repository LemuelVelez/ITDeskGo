#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const VALID_ENVIRONMENTS = new Set(['development', 'preview', 'production']);
const requestedEnvironment = process.argv[2];
const targetEnvironments = requestedEnvironment
  ? [requestedEnvironment]
  : ['preview', 'production'];

for (const environment of targetEnvironments) {
  if (!VALID_ENVIRONMENTS.has(environment)) {
    console.error(`Invalid EAS environment: ${environment}`);
    console.error('Use one of: development, preview, production');
    process.exit(1);
  }
}

const envFilePath = resolve(process.cwd(), '.env');

if (!existsSync(envFilePath)) {
  console.error(`Missing .env file: ${envFilePath}`);
  process.exit(1);
}

function parseDotenv(source) {
  const variables = [];

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);

    if (!match) {
      continue;
    }

    const [, name, rawValue] = match;
    let value = rawValue.trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    variables.push({ name, value });
  }

  return variables;
}

const variables = parseDotenv(readFileSync(envFilePath, 'utf8'));

if (variables.length === 0) {
  console.error('No environment variables found in .env.');
  process.exit(1);
}

for (const environment of targetEnvironments) {
  for (const { name, value } of variables) {
    const result = spawnSync(
      'npx',
      [
        'eas',
        'env:create',
        '--environment',
        environment,
        '--name',
        name,
        '--value',
        value,
        '--visibility',
        'plaintext',
        '--scope',
        'project',
        '--force',
        '--non-interactive',
      ],
      {
        cwd: process.cwd(),
        stdio: 'inherit',
        shell: process.platform === 'win32',
      },
    );

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}
