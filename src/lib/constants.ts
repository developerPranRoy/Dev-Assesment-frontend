// Seeded company that the demo COMPANY owner (owner@acme.dev) and evaluator
// belong to. Used as a fallback companyId so the demo "just works" — the
// create-company flow takes over for newly registered companies whose GET
// against this id returns 403/404.
export const SEED_COMPANY_ID = "seed-company-acme";

// $0.50 per credit — kept in sync with the backend's Stripe pricing.
export const CREDIT_PRICE_USD = Number(
  process.env.NEXT_PUBLIC_CREDIT_PRICE_USD ?? 0.5,
);
