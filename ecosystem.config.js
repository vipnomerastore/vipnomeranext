module.exports = {
  apps: [
    {
      name: "vipnomerastore-next",

      script: "npm",

      args: "start",

      instances: "max",

      exec_mode: "cluster",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Логи
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_file: "./logs/combined.log",
      time: true,

      // Автоперезапуск
      watch: false,
      ignore_watch: ["node_modules", "logs"],

      // Мониторинг
      max_memory_restart: "1G",

      // Graceful reload
      wait_ready: true,
      listen_timeout: 3000,
      kill_timeout: 5000,
    },
  ],
};
