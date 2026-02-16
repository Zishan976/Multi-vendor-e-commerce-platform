# TODO: Fix Bugs and Code Quality Issues

## Bugs to Fix:

- [ ] 1. Fix getAllProducts - replace params.slice(0, -2) with explicit countParams
- [ ] 2. Fix updateVendorProducts - only include provided fields in update

## Code Quality Issues:

- [ ] 3. Add rate limiting to auth endpoints (login, signup)
- [ ] 4. Add email validation in signup
- [ ] 5. Implement refresh token rotation

## Files to Edit:

- [ ] package.json - add express-rate-limit dependency
- [ ] controllers/productController.js - fix bugs #1 and #2
- [ ] controllers/authUserController.js - fix issues #4 and #5
- [ ] routes/authUserRouter.js - add rate limiting middleware
