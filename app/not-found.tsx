import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div style={{ textAlign: "center", padding: "6rem 1.5rem", fontFamily: "var(--font-mono)" }}>
      <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "1rem" }}>
        error 404
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 900, color: "var(--text-bright)", marginBottom: "1rem" }}>
        not found
      </h1>
      <p style={{ color: "var(--text-dim)", marginBottom: "2rem", fontSize: "0.875rem" }}>
        this page doesn&apos;t exist. probably a typo.
      </p>
      <Link href="/" style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        ← go home
      </Link>
    </div>
  );
}
