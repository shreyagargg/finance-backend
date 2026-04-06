# Finance Dashboard Backend

A Node.js/Express backend for managing financial records with Role-Based Access Control (RBAC).

## 🚀 Setup
1. **Database**: Create a PostgreSQL DB and run the schema (provided in `/database/schema.sql`).
2. **Env**: Create a `.env` file with `DATABASE_URL` and `JWT_SECRET`.
3. **Install**: `npm install`
4. **Run**: `npm start`

## 🔐 Access Control
- **Admin**: Full Access (CRUD records, manage users).
- **Analyst**: View-only records and full access to Dashboard Analytics.
- **Viewer**: View-only access to the Dashboard Summary.

## 🛠 Features implemented
- **Soft Deletes**: Records aren't wiped; they are timestamped as deleted.
- **Pagination**: `GET /records?page=1&limit=10` to handle large datasets.
- **Dynamic Filtering**: Filter by Date Range, Category, and Type.
- **Aggregated Analytics**: Dashboard API uses SQL grouping for financial health insights.
- **Security**: Password hashing with Bcrypt and stateless JWT auth.

## 📝 Tradeoffs & Assumptions
- **Assumption**: Categories are fixed (ENUM) to maintain data quality for the analytics dashboard.
- **Tradeoff**: Used manual validation instead of a heavy library like Joi to keep the bundle lightweight and demonstrate core logic.