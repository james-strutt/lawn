**Conduct a comprehensive code review and refactor of the following file(s). The primary goal is to simplify code, reduce lines of code, and improve clarity while retaining 100% of existing functionality.**

## Priority: Simplify and Reduce

**Every line of code is a liability.** The best code is code that doesn't exist. Before adding or keeping any code, ask: "Is this necessary?"

### Code Reduction Techniques

Apply these aggressively throughout the review:

- **Early returns / guard clauses** - Flatten nested `if/else` blocks. Return early for error/edge cases to reduce indentation depth
  ```typescript
  // Before (nested)
  function calculate(input: Input): Result | null {
    if (input) {
      if (input.value) {
        if (input.value > 0) {
          return computeResult(input)
        }
      }
    }
    return null
  }

  // After (flat)
  function calculate(input: Input): Result | null {
    if (!input?.value || input.value <= 0) return null
    return computeResult(input)
  }
  ```

- **Remove unnecessary `else` after `return`/`throw`/`continue`/`break`**
  ```typescript
  // Before
  if (condition) {
    return valueA
  } else {
    return valueB
  }

  // After
  if (condition) return valueA
  return valueB
  ```

- **Optional chaining (`?.`) and nullish coalescing (`??`)** - Replace verbose null checks
  ```typescript
  // Before
  const name = property && property.details && property.details.name
    ? property.details.name
    : 'Unknown'

  // After
  const name = property?.details?.name ?? 'Unknown'
  ```

- **Ternary expressions** for simple conditional assignments (not for complex logic or side effects)
  ```typescript
  // Before
  let label: string
  if (count === 1) {
    label = 'property'
  } else {
    label = 'properties'
  }

  // After
  const label = count === 1 ? 'property' : 'properties'
  ```

- **Destructuring** - Extract what you need upfront
  ```typescript
  // Before
  const address = property.address
  const price = property.price
  const suburb = property.suburb

  // After
  const { address, price, suburb } = property
  ```

- **Array methods** over imperative loops - Use `map`, `filter`, `find`, `some`, `every`, `reduce`, `flatMap`
  ```typescript
  // Before
  const results: string[] = []
  for (let i = 0; i < properties.length; i++) {
    if (properties[i].price > 1000000) {
      results.push(properties[i].address)
    }
  }

  // After
  const results = properties
    .filter(p => p.price > 1000000)
    .map(p => p.address)
  ```

- **Use `includes()` instead of chained `||` comparisons**
  ```typescript
  // Before
  if (zone === 'R1' || zone === 'R2' || zone === 'R3') { ... }

  // After
  if (['R1', 'R2', 'R3'].includes(zone)) { ... }
  ```

- **Object shorthand and spread**
  ```typescript
  // Before
  const config = { name: name, value: value, enabled: enabled }
  const merged = Object.assign({}, defaults, overrides)

  // After
  const config = { name, value, enabled }
  const merged = { ...defaults, ...overrides }
  ```

- **Template literals** over string concatenation
  ```typescript
  // Before
  const message = 'Found ' + count + ' properties in ' + suburb

  // After
  const message = `Found ${count} properties in ${suburb}`
  ```

- **Inline trivial one-use functions** - If a function is called once and its body is short, inline it
- **Remove unnecessary intermediate variables** - If a variable is used once immediately after assignment, consider inlining
- **Simplify boolean expressions**
  ```typescript
  // Before
  if (isValid === true) { ... }
  return enabled ? true : false
  const hasItems = items.length > 0 ? true : false

  // After
  if (isValid) { ... }
  return enabled
  const hasItems = items.length > 0
  ```

- **Collapse single-use utility wrappers** - Don't wrap a function just to call another function with the same signature
- **Avoid unnecessary `async/await`** - If just returning a promise, return it directly
  ```typescript
  // Before
  async function fetchProperty(id: string): Promise<Property> {
    return await propertyService.getById(id)
  }

  // After
  function fetchProperty(id: string): Promise<Property> {
    return propertyService.getById(id)
  }
  ```

### React-Specific Simplification

- **Derive state, don't store it** - If a value can be computed from existing state/props, compute it inline. Do not `useState` + `useEffect` to sync derived values
  ```typescript
  // Before (unnecessary state + effect)
  const [total, setTotal] = useState(0)
  useEffect(() => {
    setTotal(price + stampDuty + fees)
  }, [price, stampDuty, fees])

  // After (derived)
  const total = price + stampDuty + fees
  ```

- **Avoid unnecessary `useEffect`** - Common antipattern: using effects for transformations that belong in event handlers or render logic
- **Avoid unnecessary `useMemo`/`useCallback`** - Only memoise when there's a measured performance problem or when passing to `React.memo` children. Simple calculations don't need memoisation
- **Simplify conditional rendering**
  ```typescript
  // Before
  {isLoading ? <Spinner /> : null}

  // After
  {isLoading && <Spinner />}
  ```

- **Fragment shorthand** - Use `<>...</>` instead of `<React.Fragment>...</React.Fragment>`
- **Simplify event handler props** - If a handler just calls a function with the same args, pass the function directly
  ```typescript
  // Before
  onClick={() => handleClick()}

  // After
  onClick={handleClick}
  ```

### Dead Code Removal

- **Remove unused imports, variables, functions, types, interfaces, and parameters**
- **Remove commented-out code blocks** - Version control is the archive
- **Remove unreachable code** after `return`, `throw`, `break`, `continue`
- **Remove empty `useEffect` cleanup functions** (`return () => {}`)
- **Remove no-op catch blocks** (`catch (e) {}`) - either handle the error or remove the try/catch
- **Remove redundant type assertions** where TypeScript can already infer the type
- **Remove unnecessary `toString()`, `Boolean()`, `Number()` conversions** when the value is already the correct type

## Review Criteria

### 1. Code Quality Fundamentals

- **Single Responsibility**: Each function/module should do one thing well
- **DRY**: Identify and eliminate duplication
  - Centralise duplicate code to shared locations (`@/utils`, `@/services`, `@/components`)
  - Search for existing implementations before creating new helpers
- **KISS**: Simplify overly complex logic - if it needs a comment to explain, simplify it
- **Clear naming**: Variables, functions, and classes should reveal intent
  - Avoid generic names (`handleClick`, `processData`, `helperFunction`)
  - Use domain-specific names (`handlePropertySelection`, `calculateStampDuty`, `formatMortgagePayment`)

### 2. Type Safety (TypeScript)

- **Eliminate `any` types** - Use proper typing or generics
- **Add explicit return types** to all exported functions (leverage inference for internal/trivial functions)
- **Don't over-annotate** - Let TypeScript infer where it can
  ```typescript
  // Over-annotated
  const count: number = 0
  const name: string = 'default'
  const items: string[] = arr.filter((x: string): boolean => x.length > 0)

  // Let TypeScript infer
  const count = 0
  const name = 'default'
  const items = arr.filter(x => x.length > 0)
  ```
- **Use discriminated unions** over loose object types where appropriate
- **Leverage utility types** (`Pick`, `Omit`, `Partial`, `Required`, `Record`, etc.)
- **Check for existing types** before creating new ones - consolidate duplicates to shared locations
- **Avoid type suppression comments** (`@ts-expect-error`, `@ts-ignore`, `eslint-disable`) - fix the underlying issue instead

### 3. Architecture & Patterns

- **Separation of concerns** - UI components, business logic (utils), data access (services/stores) in separate layers
- **Consistent error handling** - Type errors with guards: `if (error instanceof Error) { ... }`
- **Path aliases** - Use `@/` imports instead of relative paths
- **Zustand stores** - Keep stores focused; one store per domain (property, user, map). Derive computed values with selectors, don't duplicate state
- **React Query** - Use for all server state. Don't duplicate server data into local state
- **Avoid unnecessary abstraction** - Three similar lines are better than a premature abstraction. Only extract when there are 3+ genuine uses
- **Flatten callback hell** - Use `async/await` instead of nested `.then()` chains

### 4. Maintainability

- **Self-documenting code** - Code explains itself; comments explain "why" not "what"
- **Remove non-critical comments** - Keep only security warnings, complex business logic explanations, bug workarounds
- **Remove AI-generated markers** - Verbose tutorial-style comments, generic names
- **Function length** - Target <30 lines per function; split if longer
- **File size** - Target ≤500 lines; split into smaller components/utilities if larger
- **Consistent formatting** - Follow existing ESLint rules and project conventions

### 5. Performance & Reliability

- **Fix obvious inefficiencies** but avoid premature optimisation
- **Proper async/await handling** with error boundaries
- **Memory leak prevention** - Every `useEffect` with side effects must clean up:
  - Event listeners: `addEventListener` → `removeEventListener`
  - Subscriptions: `.subscribe()` → `.unsubscribe()`
  - Timers: `setTimeout`/`setInterval` → `clearTimeout`/`clearInterval`
  - Map instances: create on mount, dispose on unmount
- **Null/undefined safety** - Use type guards and optional chaining
- **Avoid redundant re-renders** - Don't create new objects/arrays in render that could be constants or memoised

### 6. Testability

- **Pure functions** where possible (especially financial calculations, formatters, utilities)
- **Mockable dependencies** - Avoid hard-coded imports of side-effectful modules in business logic
- **Clear input/output contracts** - Functions should have predictable behaviour based on inputs

### 7. Tailwind & Brutal Design System

- **Use Tailwind utility classes** - Don't write custom CSS for things Tailwind handles
- **Use the Brutal component library** (`@/components/brutal/*`) for consistent UI
- **Use Tailwind theme values** defined in `tailwind.config.js` - don't hardcode colours, shadows, fonts
  ```typescript
  // ✅ Use theme classes
  className="bg-brand-accent text-surface-primary shadow-brutal"

  // ❌ Don't hardcode
  style={{ backgroundColor: '#146CFD', color: '#FFFFFF' }}
  ```
- **Use `cn()` from `@/lib/utils`** for conditional class merging (clsx + tailwind-merge)

### 8. Security

- Never hardcode API keys, secrets, or credentials
- Load secrets from environment variables (`import.meta.env.VITE_*`)
- Validate and sanitise all external inputs (form inputs, search text, coordinates)
- Use Supabase RLS (Row Level Security) for data access control
- Route payments through Stripe server-side (never handle card details client-side)

## Before Starting Review

1. Check if file is unused (delete instead of refactoring)
2. Search `@/utils`, `@/services`, `@/components` for existing utilities that could replace code in this file
3. Check for existing types - consolidate duplicates
4. Check for similar already-reviewed files as reference for patterns
5. **Count the current lines of code** for before/after comparison

## Output Format

For each file reviewed, provide:

1. **Summary**: Lines of code before/after, percentage reduction
2. **Issues Found**: List problems with severity (Critical/Major/Minor)
3. **Refactored Code**: The improved version with key changes annotated
4. **Changes Made**: Grouped list of what changed and why
5. **Breaking Changes**: Flag any changes that might affect other files (renamed exports, changed signatures)

## Additional Instructions

- **Preserve existing functionality exactly** - Do not change behaviour unless fixing a bug
- **Prioritise by impact** - Fix critical issues and biggest simplifications first
- **Be aggressive with simplification** - If code can be shorter without losing clarity, make it shorter
- **Do not add code** - This review should result in fewer lines, not more. The only exception is adding a type definition that enables removing `any` types
- **Consolidate related small files** if they belong together and the combined result is under 500 lines
- **Every `if/else` should be questioned** - Can it be a ternary? An early return? A lookup table? A logical expression?

## After Review

- Verify no TypeScript errors (`npx tsc --noEmit`)
- Verify no ESLint errors (`npx eslint src/`)
- Verify tests still pass (`npx vitest run`)
- Verify no type suppression comments exist in the code
- Verify no duplicate types remain
- Verify proper cleanup in all `useEffect` hooks
- Verify functionality matches original behaviour
- Update imports in dependent files if needed
- **Report final line count vs original**
