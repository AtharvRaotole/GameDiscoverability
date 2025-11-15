# Starting the Backend Server

## Quick Start

1. **Open a new terminal window/tab**

2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```

4. **You should see:**
   ```
   🚀 Server running on http://localhost:3001
   📊 Environment: development
   🔗 CORS enabled for: http://localhost:3000
   ```

5. **Keep this terminal open** - the server needs to keep running

## Verify Backend is Running

Open another terminal and test:
```bash
curl http://localhost:3001/health
```

You should get a JSON response like:
```json
{
  "status": "ok",
  "timestamp": "...",
  "database": "connected",
  "redis": "not configured"
}
```

## Troubleshooting

### Port Already in Use
If you see "Port 3001 is already in use":
- Find and kill the process: `lsof -ti:3001 | xargs kill`
- Or change the port in `backend/.env`: `PORT=3002`

### Database Connection Error
- Make sure your `.env` file has the correct `DATABASE_URL`
- Run: `npm run setup-database` to verify connection

### CORS Issues
- Make sure `CORS_ORIGIN=http://localhost:3000` in `backend/.env`
- This should match your frontend URL

## Common Issues

1. **"Failed to fetch" in frontend**
   - ✅ Backend is not running → Start it with `npm run dev`
   - ✅ Backend is on wrong port → Check `PORT` in `.env`
   - ✅ CORS mismatch → Check `CORS_ORIGIN` matches frontend URL

2. **Backend starts but crashes**
   - Check the error message in the terminal
   - Verify all environment variables are set
   - Run `npm run check-setup` to verify configuration

