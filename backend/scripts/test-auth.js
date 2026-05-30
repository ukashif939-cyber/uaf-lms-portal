/** End-to-end auth smoke test */
async function testLogin(email, password) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${email}: ${data.message || res.status}`);

  const dash = await fetch("http://localhost:5000/api/student/dashboard", {
    headers: { "x-user-id": data.user.id },
  });
  if (!dash.ok) throw new Error(`${email}: dashboard ${dash.status}`);

  console.log(`✅ ${email} → role=${data.user.role}, dashboard OK`);
  return data;
}

(async () => {
  await testLogin("ali.khan@uaf.edu.pk", "password123");
  await testLogin("admin@uaf.edu.pk", "admin");
  console.log("\nAll auth tests passed.");
})().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
