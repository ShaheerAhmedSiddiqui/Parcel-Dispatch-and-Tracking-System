
# Parcel Dispatch and Tracking System
## AI Development Guidelines

### 1. Project Understanding
- Inspect the existing repository before starting.
- Read README.md and package.json.
- Understand the existing architecture and folder structure.
- Review existing modules before implementing new ones.
- Do not duplicate existing functionality.

### 2. Technology Stack
- Backend: Node.js and Express.js.
- Frontend: HTML, CSS, JavaScript and EJS.
- Database: MySQL.
- Follow the existing project architecture.
- Do not introduce React, Vue or Angular.

### 3. Development Rules
- Implement tasks in small, manageable chunks.
- Follow existing coding conventions.
- Keep routes, controllers, models and views organized.
- Use reusable EJS partials where appropriate.
- Validate user input and handle errors.
- Avoid unnecessary dependencies.

### 4. Git Workflow
- Never directly modify main.
- Create a feature branch for each task or module.
- Never delete existing branches without permission.
- Never force-push without permission.
- Do not overwrite existing work.
- Keep commits meaningful.
- Merge only after reviewing changes and tests.

### 5. Testing
- Test every implemented feature.
- Check existing functionality for regressions.
- Verify database queries and form validation.
- Report tests that fail or cannot be executed.

### 6. Project Safety
- Never expose database credentials.
- Never commit .env files.
- Preserve existing database structures unless changes are required.
- Do not remove working features without permission.

### 7. Task Reporting
After every task, report:
- What was implemented.
- Files created or modified.
- Branch used.
- Tests executed and their results.
- Remaining issues.
