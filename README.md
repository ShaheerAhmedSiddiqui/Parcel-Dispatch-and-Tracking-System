# Parcel Dispatch and Tracking System

## Project Overview

The **Parcel Dispatch and Tracking System** is a web-based application proposed to simplify parcel registration, delivery charge calculation, delivery staff assignment, shipment tracking, and failed delivery management for a local courier service.

The project is being developed as part of the Software Quality Engineering (SQE) course. Its primary objective is not only to develop a functional application but also to apply software quality practices throughout the Software Development Life Cycle (SDLC). These practices include requirements engineering, software design, test planning, systematic test-case design, automated testing, code reviews, defect management, regression testing, and software quality measurement.

The project will use GitHub to maintain source code, document team contributions, manage issues, review changes, and preserve evidence of quality improvement.

> **Current status:** Initial repository setup and project planning. Features, tests, and quality metrics will be updated as development progresses. No test results or quality measurements are claimed until they have been collected.

## Problem Statement

Small courier operations may rely on manual registers or disconnected records to manage parcel bookings and deliveries. This can lead to duplicate tracking numbers, incorrect delivery charges, invalid shipment status changes, incomplete delivery histories, and poor handling of failed deliveries.

The proposed system aims to centralize parcel management and enforce defined business rules so that shipment information remains consistent, traceable, and reliable.

## Project Objectives

- Develop a web-based application for parcel dispatch and tracking.
- Validate parcel information and generate unique tracking numbers.
- Calculate delivery charges using predefined pricing rules.
- Manage delivery staff assignments and shipment status transitions.
- Record delivery attempts, failure reasons, and return-to-sender operations.
- Apply systematic software testing and quality assurance practices.
- Track, prioritize, fix, and retest defects using GitHub Issues and Pull Requests.
- Evaluate quality using measurable metrics supported by collected evidence.
- Maintain a modular, maintainable codebase through collaborative development.

## Scope and Key Features

### Planned Core Features

1. **Parcel Registration**

   - Record sender and receiver information.
   - Capture origin, destination, weight, distance, and delivery type.
   - Validate input and generate a unique tracking number.

2. **Delivery Charge Calculation**

   - Calculate charges using configurable pricing rules.
   - Support standard and express delivery options.
   - Reject invalid weight and distance values.

3. **Delivery Staff Assignment**

   - Assign parcels to active delivery staff.
   - Prevent invalid assignments and unauthorized changes.

4. **Shipment Tracking**

   - Maintain shipment status and a timestamped history.
   - Allow customers to track parcels using a tracking number.
   - Enforce permitted status transitions.

5. **Failed Delivery and Returns**

   - Record unsuccessful delivery attempts and their reasons.
   - Support eligible retry and return-to-sender workflows.

### Out of Scope

The initial version will not include live GPS tracking, interactive maps, online payments, real-time notifications, external courier API integrations, or advanced route optimization.

## Target Users

| User                          | Responsibilities                                                        |
| ----------------------------- | ----------------------------------------------------------------------- |
| Administrator / Courier Clerk | Register parcels, calculate charges, assign staff, and manage shipments |
| Delivery Staff                | View assigned parcels and record delivery attempts and status updates   |
| Customer                      | Track a parcel and view its available shipment history                  |

Access permissions will be defined according to each user's role.

## Technology Stack

| Component                  | Technology            |
| -------------------------- | --------------------- |
| Backend                    | Node.js               |
| Web Framework              | Express.js            |
| Frontend Templates         | EJS                   |
| Interface                  | HTML, CSS, JavaScript |
| Database                   | MySQL                 |
| Automated Testing          | Jest                  |
| HTTP / Integration Testing | Supertest             |
| Version Control            | Git and GitHub        |
| CI Automation              | GitHub Actions        |

The stack may be extended when justified by project requirements and testing needs.

## Software Quality Engineering Approach

Quality assurance will be integrated throughout the SDLC rather than postponed until the end of development.

### 1. Requirements Engineering

- Document functional and non-functional requirements.
- Define acceptance criteria and measurable quality objectives.
- Maintain traceability between requirements and test cases.

### 2. Software Design

- Use a modular MVC architecture with a service layer.
- Document application components, database relationships, and important workflows.
- Review requirements and design decisions before implementation.

### 3. Implementation and Version Control

- Use short-lived feature and bug-fix branches.
- Follow Conventional Commits for meaningful commit messages.
- Develop features through linked GitHub Issues and Pull Requests.
- Require code review and appropriate testing before merging.

### 4. Test Design and Execution

- Apply Equivalence Partitioning and Boundary Value Analysis.
- Write unit tests using the Arrange–Act–Assert pattern.
- Use fixtures, mocks, and parameterized tests where appropriate.
- Apply Test-Driven Development using the Red–Green–Refactor cycle.
- Perform integration, system, regression, and user acceptance testing as applicable.

### 5. Defect Management

- Record reproducible defects using GitHub Issue templates.
- Classify defects by severity and priority.
- Track defects through triage, correction, and retesting.
- Link fixes to issues and pull requests.

### 6. Quality Evaluation

- Calculate test pass rate and requirements test coverage.
- Evaluate defect retest success and other relevant metrics when sufficient data is available.
- Document test evidence, unresolved defects, limitations, and improvement recommendations.
- Report actual measurements rather than invented or unsupported results.

## Repository Structure

```text
.
├── .github/          # Issue templates, PR template, CI workflow
├── src/              # Application source code
│   ├── config/       # Configuration and database connection
│   ├── routes/       # HTTP route definitions
│   ├── controllers/  # Request and response handling
│   ├── services/     # Business rules
│   ├── repositories/ # Database access
│   ├── models/       # Data models
│   ├── middleware/   # Authentication, validation, error handling
│   ├── validators/   # Input validation
│   ├── views/        # EJS templates
│   └── public/       # CSS, JavaScript, and images
├── tests/            # Unit, integration, system, and acceptance tests
├── database/         # Schema, migrations, and seed data
├── docs/             # Requirements, design, QA, testing, metrics, reports
├── scripts/          # Development and maintenance scripts
├── .env.example      # Example environment configuration
├── CONTRIBUTING.md   # Branching, commits, and collaboration rules
├── package.json      # Dependencies and npm scripts
└── README.md
```

The repository structure will evolve as requirements and implementation progress. Documentation and tests will be maintained alongside the relevant changes.

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js (LTS version)
- npm
- MySQL Server
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System.git
cd parcel-dispatch-tracking-system
```

Install the project dependencies:

```bash
npm install
```

Create a local `.env` file using `.env.example` as a reference. Configure the database connection and other required environment variables. Do not commit credentials or other secrets.

Create the MySQL database and apply the schema when the database setup is available.

### Running the Application

The application startup command will be configured in `package.json`:

```bash
npm start
```

During development, the project may also provide:

```bash
npm run dev
```

These commands will be usable after the corresponding scripts and application entry points have been implemented.

## Running Tests

Automated test commands will be configured in `package.json`.

The planned commands are:

```bash
npm test
npm run test:unit
npm run test:integration
```

Test configuration, available scripts, and prerequisites will be updated as the test suite is introduced.

Test results will be recorded with their execution context and supporting evidence.

## GitHub Workflow

All project changes should follow this workflow:

1. Create a GitHub Issue describing the requirement, task, or defect.
2. Create a branch from the latest `main`.
3. Implement the change and add or update tests.
4. Commit using Conventional Commits.
5. Open a Pull Request and reference the related Issue.
6. Complete the code-review checklist and address review feedback.
7. Run the required automated tests and CI checks.
8. Merge only after the required review and checks pass.
9. Update documentation and quality evidence where applicable.

The `main` branch should remain stable. Direct pushes should be avoided once branch protection is configured.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the detailed collaboration process.

## Documentation

Project documentation will be maintained in the `docs/` directory.

| Area                  | Key Documents                                                   |
| --------------------- | --------------------------------------------------------------- |
| Requirements          | Project proposal, SRS, user stories, acceptance criteria        |
| Design                | Architecture, database design, use-case diagrams, UI prototypes |
| Quality Assurance     | SQA plan, risk register, review checklist, workflow notes       |
| Test Planning         | Test plan, test cases, requirements traceability matrix         |
| Test Design           | Equivalence Partitioning and Boundary Value Analysis            |
| Test Execution        | Execution report, defect report, test evidence                  |
| Development Practices | TDD log, unit-testing notes, lessons learned                    |
| Quality Evaluation    | Quality metrics report and recommendations                      |
| Final Submission      | Consolidated final report and presentation materials            |

## Project Team

| Member                 | Responsibility              |
| ---------------------- | --------------------------- |
| Shaheer Ahmed Siddiqui | Development                 |
| Lakesh Kumar           | Testing and Evaluation (QA) |
| Safeer Ahmed Mirani    | Documentation               |

All members are expected to participate in reviews, testing, issue resolution, and the final demonstration.

## Project Schedule

The estimated project duration is **4–6 weeks**.

| Phase     | Planned Activities                                                    |
| --------- | --------------------------------------------------------------------- |
| Week 1    | Repository setup, proposal, requirements, and initial design          |
| Week 2    | SRS, quality plan, database design, and test planning                 |
| Weeks 3–4 | Feature implementation, TDD, code reviews, and automated tests        |
| Week 5    | Integration, system testing, defect fixing, and regression testing    |
| Week 6    | Quality metrics, evidence collection, final report, and demonstration |

The schedule is preliminary and may be adjusted according to course deadlines and project progress.

## Quality Principles

- Every important requirement should have clear acceptance criteria and linked tests.
- Every defect should be reproducible, prioritized, and tracked.
- Every significant code change should be reviewed and tested.
- Regression tests should be rerun after relevant fixes.
- Quality claims should be supported by actual results and evidence.
- Documentation should evolve with the implementation.
- Team contributions should be visible through meaningful Git history and Pull Requests.

## License

This project is intended to use the MIT License. See [LICENSE](LICENSE) once the license file has been added.

---

**Course:** Software Quality Engineering
**Project:** Parcel Dispatch and Tracking System
**Development approach:** Quality-driven, testable, and iterative SDLC
