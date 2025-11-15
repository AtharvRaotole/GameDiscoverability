# GameSoul Testing Guide

## Test Structure

### Frontend Tests
Located in `frontend/src/**/__tests__/`

### Backend Tests
Located in `backend/src/**/__tests__/`

## Running Tests

### Frontend
```bash
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

### Backend
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

## Test Coverage

### Current Coverage

**Frontend:**
- API client tests
- Component tests (EmotionInput)

**Backend:**
- Emotion analysis service
- Soul score calculation

### Adding Tests

#### Frontend Component Test
```typescript
import { render, screen } from "@testing-library/react";
import { MyComponent } from "../MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

#### Backend Service Test
```typescript
import { myFunction } from "../my-service";

describe("MyService", () => {
  it("should do something", () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

## Test Environment

Tests run with:
- Mocked external APIs (OpenAI, Pinecone)
- Test database (or mocked)
- Test environment variables

## CI/CD

Tests run automatically on:
- Push to main/develop branches
- Pull requests

See `.github/workflows/ci.yml` for configuration.

## Best Practices

1. **Test critical paths first**
   - User flows
   - Business logic
   - Error handling

2. **Mock external dependencies**
   - APIs
   - Database (for unit tests)
   - Third-party services

3. **Keep tests fast**
   - Use mocks
   - Avoid real network calls
   - Parallel execution

4. **Write descriptive test names**
   - "should return error when input is invalid"
   - "should calculate soul score correctly"

5. **Test edge cases**
   - Empty inputs
   - Invalid data
   - Boundary conditions

## Future Test Additions

- [ ] E2E tests (Playwright/Cypress)
- [ ] Integration tests for API flows
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Load testing

