# MVC Architecture — Source Layout and Responsibilities

## Primary pattern

The project uses MVC with supporting service and repository layers. The service and repository folders do not replace MVC; they prevent controllers from becoming overloaded and keep persistence separate from business rules.

Request path: **Route → Middleware → Controller → Service → Repository → MySQL**. The controller returns an EJS view, a redirect, or JSON.

## Target source layout

```text
src/
├── app.js
├── server.js
├── config/
│   ├── db.js
│   └── env.js
├── routes/
│   ├── auth.routes.js
│   ├── parcel.routes.js
│   ├── staff.routes.js
│   └── tracking.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── parcel.controller.js
│   ├── staff.controller.js
│   └── tracking.controller.js
├── models/
│   ├── user.model.js
│   ├── parcel.model.js
│   ├── parcel-assignment.model.js
│   ├── shipment-history.model.js
│   └── delivery-attempt.model.js
├── services/
│   ├── chargeCalculator.js
│   ├── statusMachine.js
│   ├── trackingNumber.js
│   ├── auth.service.js
│   ├── parcel.service.js
│   ├── assignment.service.js
│   ├── shipment-history.service.js
│   └── delivery-attempt.service.js
├── repositories/
│   ├── user.repository.js
│   ├── parcel.repository.js
│   ├── assignment.repository.js
│   ├── shipment-history.repository.js
│   └── delivery-attempt.repository.js
├── middleware/
│   ├── auth.js
│   ├── role.js
│   ├── validation.js
│   └── error.js
├── validators/
│   ├── auth.validator.js
│   └── parcel.validator.js
└── views/
    ├── auth/
    ├── admin/
    ├── staff/
    ├── tracking/
    ├── errors/
    └── partials/
```

The existing repository already has `app.js`, `server.js`, `config/db.js`, `middleware/auth.js`, service placeholders, and EJS files under `src/views`. Keep existing files and the UI teammate's work. Introduce missing folders/modules incrementally; do not move or rename view files without coordinating with the frontend owner.

## Responsibility rules

| Folder | Should contain | Should not contain |
|---|---|---|
| routes | Express method/path mappings and middleware chain | SQL or pricing/status business logic |
| controllers | Request parsing, service calls, response selection | Direct SQL or complex business rules |
| models | Domain entity definitions and model-level data representation | HTML rendering or Express route declarations |
| services | Use-case orchestration and business rules | Express req/res objects or raw SQL |
| repositories | Parameterized SQL and transaction handling | HTTP response logic |
| middleware | Authentication, role authorization, common request checks, error handling | Feature-specific page rendering |
| validators | Reusable input rules and normalization | Database writes |
| views | EJS markup, layouts, and partials | Authorization decisions or business rules |
| config | Environment and database setup | Hard-coded credentials |

## Role and route boundary

- Administrator / Courier Clerk routes: parcel registration, charge preview, parcel search, assignment and authorized return management.
- Delivery Staff routes: assigned parcel list and permitted delivery updates.
- Public customer route: tracking-number lookup and read-only status/history display.

The public tracking route must not disclose private staff account information or unnecessary personal data.

## Testing boundary

- Test service business rules with Jest unit tests.
- Test routes/controllers with Supertest and injected or mocked repositories where possible.
- Test MySQL repository behavior separately as integration tests.
- Keep test names traceable to SRS IDs (for example, FR-18, FR-23, BR-08).
