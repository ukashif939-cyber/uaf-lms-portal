# Mobile login fix

## What was wrong

1. Production build used **`http://localhost:5000`** (from `.env.local` overriding `.env.production`) — phones cannot reach your PC's localhost.
2. Firebase **Cloud Functions** (API) are not deployed yet — requires **Blaze plan**.

## What we fixed

- Frontend now calls **`https://uaf-lms-api.onrender.com`** in production.
- Firebase Hosting redeployed: https://uaf-lms-main.web.app/login

## One step you must do (free API on Render)

1. Open https://dashboard.render.com/blueprint/new  
2. Connect GitHub repo **ukashif939-cyber/uaf-lms-portal**  
3. Render reads `render.yaml` and creates **uaf-lms-api**  
4. Wait until deploy is **Live** (first build ~5–10 min)  
5. Test: https://uaf-lms-api.onrender.com/api/health → `{"status":"healthy"}`  
6. Open on your phone: https://uaf-lms-main.web.app/login  

First request after idle may take ~30s (Render free tier cold start).

## Alternative: Firebase-only API (Blaze)

1. Upgrade https://console.firebase.google.com/project/uaf-lms-main/usage/details  
2. Set `NEXT_PUBLIC_API_BASE_URL=` (empty) in `frontend/.env.production`  
3. Run `deploy-firebase.bat` (deploys hosting + functions, same domain)
