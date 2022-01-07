module.exports = {
  apps: [
    {
      name: 'punch-in-mayohr-apollo',
      script: 'sleep $(( RANDOM % 300 )); npx punch-mayohr-apollo@latest -y',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: "0 9 * * *",
      watch: false,
      autorestart: false
    },
    {
      name: 'punch-out-mayohr-apollo',
      script: 'sleep $(( RANDOM % 300 )); npx punch-mayohr-apollo@latest -y',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: "5 18 * * *",
      watch: false,
      autorestart: false
    }
  ]
};
