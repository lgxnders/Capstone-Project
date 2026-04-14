# Server Code Review

The following is a structured list of design concerns and issues found in the `server/src/` directory.
Each item includes a category, description, relevant file(s), and a suggested fix.

---

## SECURITY

### 1. No ownership check on user routes
- **File:** `src/routes/users.ts`, `src/controllers/users.ts`
- **Issue:** `getUser` and `updateUser` only require `requireAuth`. Any authenticated user can read or modify any other user's data by supplying a different `:id` param. There is no check that the requesting user owns the resource.
- **Fix:** In the controller, verify `req.user.userId === parseInt(id)` before proceeding, or require `requireAdmin` for cross-user access.

### 2. No ownership check on `getHistory`
- **File:** `src/controllers/chat.ts` (line 81)
- **Issue:** Any authenticated user can retrieve any conversation by supplying a known `conversationId`. The handler does not verify that the conversation belongs to the requesting user.
- **Fix:** After fetching the conversation, check that `conversation.userId === req.user.userId` before returning it.

### 3. Inconsistent JWT_SECRET handling
- **Files:** `src/middleware/auth.ts` (line 6), `src/controllers/auth.ts` (line 8)
- **Issue:** The middleware throws and crashes the server if `JWT_SECRET` is unset — which is correct. However, the auth controller falls back to `'dev_secret'` if it is unset. These two files are inconsistent. If the middleware already enforces presence at startup, the fallback in the controller is misleading and should not exist.
- **Fix:** Remove the `|| 'dev_secret'` fallback in the controller. Use the same pattern as the middleware: read the env var and throw (or assert) if it is missing.

---

## RACE CONDITION

### 4. Manual userId increment is not atomic
- **File:** `src/controllers/auth.ts` (lines 30–31)
- **Issue:** The registration handler fetches the current max `userId` and adds 1 to derive the next ID. Two simultaneous registration requests can both read the same max value and produce a duplicate `userId`, causing a unique constraint violation or silent collision.
- **Fix:** Either (a) drop the custom numeric `userId` entirely and use MongoDB's `_id` as the user identifier throughout, or (b) use a dedicated atomic counter document with a `$inc` operation to generate the next ID safely.

---

## BROKEN / STUB CODE

### 5. Users controller is entirely unimplemented
- **File:** `src/controllers/users.ts`
- **Issue:** `getUser` returns hardcoded placeholder data (`{ id, email: 'placeholder@email.com' }`). `updateUser` echoes back the request body without touching the database. `deleteUser` returns 204 without deleting anything. All three routes are non-functional.
- **Fix:** Implement each handler with real database operations against `UserModel`.

### 6. AI integration is not connected
- **File:** `src/controllers/chat.ts` (lines 37–38)
- **Issue:** `replyContent` is hardcoded to the string `"reply DEBUG"`. The `formattedHistory` variable is computed but never used. The comment `// CALL AI HERE` marks the gap. The core feature of the application does not work.
- **Fix:** Integrate the AI client (e.g. Anthropic SDK), pass `formattedHistory` and the incoming `message` to the model, and assign the response to `replyContent`.

---

## DEBUG CODE IN PRODUCTION PATHS

### 7. Fire-and-forget debug query runs on every message
- **File:** `src/controllers/chat.ts` (lines 68–70)
- **Issue:** After saving each message, the handler runs an additional `ConversationModel.findById(...).populate('messages')` and dumps the result to the console with `JSON.stringify`. This fires on every single `sendMessage` call, adding a redundant DB round-trip and polluting server logs.
- **Fix:** Remove this block entirely before shipping.

### 8. Raw console.log in conversation service
- **File:** `src/services/conversation.ts` (line 8)
- **Issue:** `console.log(conversation)` logs the full conversation object on every call to `getConversationHistory`. This is debug output that should not be in production code.
- **Fix:** Remove the `console.log` statement.

---

## DESIGN / CONSISTENCY

### 9. Auth routes are not under `/api`
- **File:** `src/server.ts` (lines 31–34)
- **Issue:** Chat, users, and resources are all mounted under `/api/...`, but auth is mounted at `/auth` (not `/api/auth`). This is an inconsistent API surface.
- **Fix:** Change `app.use('/auth', authRoutes)` to `app.use('/api/auth', authRoutes)` and update any client-side references.

### 10. `ChatMessage.conversationId` is a plain String instead of ObjectId
- **File:** `src/models/ChatMessage.ts` (line 7)
- **Issue:** Every other cross-model reference in the schema uses `Schema.Types.ObjectId` with a `ref`. `conversationId` is defined as a plain `String`, losing the referential intent and preventing Mongoose population.
- **Fix:** Change the field definition to `{ type: Schema.Types.ObjectId, ref: 'Conversation', required: true }`.

### 11. Resource model has a custom `id` alongside MongoDB's `_id`
- **Files:** `src/models/Resource.ts` (line 7), `src/controllers/resources.ts` (line 34)
- **Issue:** The resource schema defines a separate string `id` field, and `getResourceById` queries against it using `as any` to suppress a type error. The `as any` cast signals that the type system is fighting this design. The dual-ID approach adds unnecessary complexity.
- **Fix:** Either use `_id` for all lookups (the standard Mongoose approach), or properly type the custom `id` field so the cast is not needed.

### 12. `Conversation.userId` is a raw Number with no model reference
- **File:** `src/models/Conversation.ts` (line 9)
- **Issue:** `User.conversations` correctly uses `Schema.Types.ObjectId` with `ref: 'Conversation'`, but the reverse — `Conversation.userId` — stores a plain number with no `ref`. This is inconsistent and means there is no navigable relationship from a conversation back to its owner in Mongoose.
- **Fix:** If keeping the custom numeric `userId`, add an index on it. If migrating to `_id`-based references, change this to `{ type: Schema.Types.ObjectId, ref: 'User', required: true }`.

### 13. `NewUser` type exposes a settable `role` field
- **File:** `src/types/user.ts` (line 20)
- **Issue:** `NewUser` includes `role?: 'user' | 'admin'`, which implies that callers can specify a role at registration time. The controller correctly hardcodes `role: 'user'`, but the type creates a misleading contract and makes a future refactor more likely to accidentally wire up privilege escalation.
- **Fix:** Remove `role` from the `NewUser` interface.

### 14. Convoluted PORT validation in server setup
- **File:** `src/server.ts` (lines 13–23)
- **Issue:** The PORT check wraps a manual `throw` inside a `try/catch` that exists solely to catch that same throw. This is indirect and adds noise for a simple presence check.
- **Fix:** Replace with a direct `if (!process.env.PORT) { console.error('...'); process.exit(1); }` followed by `const PORT = process.env.PORT`.

### 15. Typo in error message
- **File:** `src/controllers/chat.ts` (line 31)
- **Issue:** The error string reads `'Failed to create conversation/'` — there is a stray trailing slash.
- **Fix:** Change to `'Failed to create conversation'`.
