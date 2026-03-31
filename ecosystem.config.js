module.exports = {
  apps: [
    {
      name: 'hrm-backend',
      script: './backend/src/server.js',
      cwd: '/var/www/hrm',
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'hrm-frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/hrm/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
