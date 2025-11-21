# Contributing to YATRAFLOW

First off, thank you for considering contributing to YATRAFLOW! It's people like you that make YATRAFLOW such a great tool for road safety.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots if possible**
* **Include your environment details** (browser, OS, device)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain which behavior you expected to see instead**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguide
* Include thoughtful comments in your code
* End all files with a newline
* Avoid platform-dependent code

## Development Setup

### Prerequisites

```bash
# Node.js 18+
node --version

# npm or yarn
npm --version
```

### Setup

1. Fork and clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/yatraflow.git
cd yatraflow
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file (optional, for local development)

4. Configure Firebase (see SETUP.md)

5. Start development server
```bash
npm run dev
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Shadcn)
│   ├── landing/     # Landing page components
│   └── dashboard/   # Dashboard components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configs
├── pages/           # Route page components
├── store/           # Zustand state management
└── types/           # TypeScript type definitions
```

## Coding Guidelines

### TypeScript

* Use TypeScript for all new files
* Define proper types for all props and functions
* Avoid `any` types
* Use interfaces for object shapes

```typescript
// Good
interface UserProps {
  name: string;
  email: string;
  role: UserRole;
}

// Bad
function updateUser(user: any) { }
```

### React Components

* Use functional components with hooks
* Keep components small and focused
* Use custom hooks for complex logic
* Prefer composition over props drilling

```typescript
// Good
export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};

// Bad - component too large
export const Dashboard = () => {
  // 500 lines of code...
};
```

### Styling

* Use TailwindCSS utility classes
* Follow the design system in `index.css`
* Use semantic color tokens from the design system
* Never use arbitrary values without good reason

```typescript
// Good - uses design system
<Button className="bg-primary text-primary-foreground">

// Bad - arbitrary colors
<Button className="bg-[#1a2b3c] text-white">
```

### State Management

* Use Zustand for global state
* Use local state for component-specific state
* Keep state minimal and normalized

```typescript
// Good
const user = useStore((state) => state.user);
const setUser = useStore((state) => state.setUser);

// Bad - selecting entire store
const store = useStore();
```

### Firebase

* Use proper error handling
* Don't expose sensitive data in console logs
* Use Firestore security rules properly
* Optimize queries (use indexes)

```typescript
// Good
try {
  const result = await addDoc(collection(db, 'hazards'), data);
  return { success: true, id: result.id };
} catch (error) {
  console.error('Error adding hazard:', error);
  return { success: false, error };
}
```

### Performance

* Lazy load heavy components
* Memoize expensive computations
* Avoid unnecessary re-renders
* Optimize images

```typescript
// Good
const MemoizedMap = memo(MapView);

// Good
const expensiveValue = useMemo(() => 
  calculateSomethingExpensive(data), 
  [data]
);
```

## Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that don't affect code meaning (formatting, etc)
* `refactor`: Code change that neither fixes a bug nor adds a feature
* `perf`: Performance improvement
* `test`: Adding missing tests
* `chore`: Changes to build process or auxiliary tools

**Examples:**

```
feat(dashboard): add real-time location tracking

Implement GPS tracking using the Geolocation API with smooth updates
every 5 seconds. Added error handling for denied permissions.

Closes #123
```

```
fix(alerts): resolve proximity calculation bug

Fixed haversine formula implementation that was causing incorrect
distance calculations for alert triggers.

Fixes #456
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Component renders correctly
- [ ] All interactions work as expected
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile
- [ ] Firebase operations succeed
- [ ] Error states are handled gracefully

### Future: Automated Testing

We plan to add:
* Unit tests (Jest + React Testing Library)
* Integration tests
* E2E tests (Playwright)

## Documentation

* Update README.md if needed
* Add JSDoc comments for complex functions
* Update SETUP.md for configuration changes
* Update DEPLOYMENT.md for deployment changes

```typescript
/**
 * Calculate distance between two geographic points using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lng1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lng2 - Longitude of second point
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  // Implementation...
};
```

## Pull Request Process

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly**
   ```bash
   npm run dev
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   * Use a clear title and description
   * Reference any related issues
   * Add screenshots if applicable
   * Request review from maintainers

7. **Address review comments**
   * Make requested changes
   * Push additional commits to the same branch
   * Re-request review when ready

8. **Merge**
   * Maintainers will merge your PR when approved
   * Delete your branch after merge

## Review Process

* PRs require at least one approval
* Changes may be requested by reviewers
* Keep PR scope focused and small
* Respond to review comments promptly

## Community

* Be respectful and considerate
* Welcome newcomers and foster inclusive environment
* Provide constructive feedback
* Help others learn and grow

## Questions?

* Open a GitHub Discussion
* Join our community chat (if available)
* Email the maintainers

## Recognition

Contributors will be recognized in:
* README.md contributors section
* Release notes
* Project documentation

---

Thank you for contributing to safer roads! 🚗💨
