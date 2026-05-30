const { Client } = require("pg");

const users = ["postgres", "Grace", "grace", "Administrator"];
const passwords = ["", "postgres", "admin", "password", "123456", "root", "Grace", "grace", "uaf", "UAF2024", "UAF2025"];
const ports = [5432, 5433, 5434];

async function tryConnect(port, user, password) {
  const client = new Client({
    host: "localhost",
    port,
    user,
    password: password || undefined,
    database: "postgres",
    connectionTimeoutMillis: 3000,
  });
  try {
    await client.connect();
    await client.query("SELECT 1");
    await client.end();
    return true;
  } catch {
    try {
      await client.end();
    } catch {}
    return false;
  }
}

(async () => {
  for (const port of ports) {
    for (const user of users) {
      for (const password of passwords) {
        process.stdout.write(`port=${port} user=${user} password="${password}" ... `);
        const ok = await tryConnect(port, user, password);
        console.log(ok ? "OK" : "fail");
        if (ok) {
          const auth = password
            ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
            : encodeURIComponent(user);
          const url = `postgresql://${auth}@localhost:${port}/uaf_lms`;
          console.log("DATABASE_URL=" + url);
          process.exit(0);
        }
      }
    }
  }
  console.log("No working connection found");
  process.exit(1);
})();
