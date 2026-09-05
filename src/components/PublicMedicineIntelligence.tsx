"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type {
  PublicPrice,
  PublicProduct,
  PublicReadModel,
} from "@/lib/healthIntelligence/publicReadModel";
import { comparePublishedPrices } from "@/lib/healthIntelligence/publicComparison";

type Mode = "prices" | "generic" | "cost";

const modeCopy: Record<Mode, { eyebrow: string; title: string; lead: string }> =
  {
    prices: {
      eyebrow: "Medicine prices",
      title: "Understand the medicine before comparing the market.",
      lead: "Search by brand, active ingredient or manufacturer. MMS confirms the exact product first, then shows only carefully screened observations.",
    },
    generic: {
      eyebrow: "Generic medicines",
      title: "Similar does not always mean interchangeable.",
      lead: "Explore potential relationships as a starting point for a professional review, never as a replacement instruction.",
    },
    cost: {
      eyebrow: "Medication cost review",
      title: "Frame the cost question with more context.",
      lead: "Use a simple estimate to understand the shape of a monthly cost question before asking MMS to review your options.",
    },
  };

function track(event: string) {
  void fetch("/api/health-intelligence/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
  }).catch(() => undefined);
}

function ProductIdentity({ product }: { product: PublicProduct }) {
  return (
    <div className="grid gap-2 text-sm leading-6 text-warm-gray md:grid-cols-2">
      <p>
        <strong className="text-navy">Brand</strong>
        <br />
        {product.brandName}
      </p>
      <p>
        <strong className="text-navy">Active ingredient</strong>
        <br />
        {product.ingredients
          .map(
            (item) => `${item.name} ${item.strengthValue}${item.strengthUnit}`,
          )
          .join(" + ")}
      </p>
      <p>
        <strong className="text-navy">Manufacturer</strong>
        <br />
        {product.manufacturerName}
      </p>
      <p>
        <strong className="text-navy">Form / release</strong>
        <br />
        {product.dosageForm} / {product.releaseType}
      </p>
      <p>
        <strong className="text-navy">Route</strong>
        <br />
        {product.route}
      </p>
      <p>
        <strong className="text-navy">Pack / presentation</strong>
        <br />
        {product.unitsPerPack} units
        {product.deviceOrPresentation
          ? `, ${product.deviceOrPresentation}`
          : ""}
      </p>
    </div>
  );
}

function DemoNotice() {
  return (
    <p className="border-l-2 border-gold bg-[#fff7d8] px-4 py-3 text-sm leading-6 text-charcoal">
      <strong>Demonstration data — not current market pricing.</strong> These
      fictional records show how MMS will explain provenance and uncertainty.
    </p>
  );
}

function SearchAndConfirm({
  model,
  onConfirm,
}: {
  model: PublicReadModel;
  onConfirm: (product: PublicProduct) => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PublicProduct | null>(null);
  const results = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return model.products.filter((product) =>
      terms.every((term) =>
        [
          product.brandName,
          product.genericName,
          product.manufacturerName,
          product.dosageForm,
          ...product.ingredients.map((item) => item.name),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [model.products, query]);
  return (
    <div className="grid gap-6">
      <label className="grid gap-2 text-sm font-semibold text-charcoal">
        Search a brand, ingredient or manufacturer
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(null);
            track("medicine_search");
          }}
          placeholder="Try Clarionex or Meridian"
          className="min-h-12 rounded-md border border-gold-light bg-white px-4 text-base font-normal text-charcoal outline-none transition focus:border-gold focus:ring-2 focus:ring-gold-light/50"
        />
      </label>
      {query && !selected ? (
        <div className="grid gap-2" aria-live="polite">
          {results.length ? (
            results.map((product) => (
              <button
                type="button"
                key={product.id}
                onClick={() => setSelected(product)}
                className="border-b border-gold-light/60 py-4 text-left transition hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span className="font-serif text-2xl text-navy">
                  {product.brandName}
                </span>
                <span className="ml-3 text-sm text-warm-gray">
                  {product.genericName} · {product.manufacturerName} ·{" "}
                  {product.unitsPerPack} units
                </span>
              </button>
            ))
          ) : (
            <p className="border border-gold-light/60 p-4 text-sm text-warm-gray">
              No product identity found. Try the brand name, active ingredient
              or manufacturer.
            </p>
          )}
        </div>
      ) : null}
      {selected ? (
        <div className="border-y border-gold/40 py-6">
          <p className="editorial-kicker text-deep-green">
            Is this your medicine?
          </p>
          <h3 className="mt-3 font-serif text-3xl text-navy">
            {selected.brandName}
          </h3>
          <div className="mt-5">
            <ProductIdentity product={selected} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                onConfirm(selected);
                track("product_confirmed");
              }}
              className="rounded-md bg-navy px-5 py-3 text-sm font-semibold text-ivory"
            >
              Yes, continue
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-md border border-navy/30 px-5 py-3 text-sm font-semibold text-navy"
            >
              Choose another
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MarketRows({
  model,
  product,
}: {
  model: PublicReadModel;
  product: PublicProduct;
}) {
  const rows = model.markets
    .map((market) => ({
      market,
      prices: model.prices.filter(
        (price) =>
          price.marketId === market.id &&
          (price.productId === product.id ||
            product.brandName === "Northstar A"),
      ),
    }))
    .filter(({ prices }) => prices.length);
  const base = rows.find(({ market }) => market.countryCode === "MY")
    ?.prices[0];
  return (
    <div className="grid gap-3">
      {rows.map(({ market, prices }) =>
        prices.map((price) => {
          const comparison =
            base && base.id !== price.id
              ? comparePublishedPrices(base, price)
              : null;
          return (
            <article
              key={price.id}
              className="border-b border-gold-light/60 py-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-serif text-2xl text-navy">
                  {market.countryName}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-deep-green">
                  {price.publication === "demo_preview"
                    ? "Demonstration data"
                    : "Verified exact match"}
                </span>
              </div>
              <div className="mt-3 grid gap-3 text-sm text-warm-gray sm:grid-cols-4">
                <p>
                  <strong className="block text-navy">Local price</strong>
                  {price.currency} {price.observedLocalPrice.toLocaleString()}
                </p>
                <p>
                  <strong className="block text-navy">
                    Per {price.normalizationUnit || "pack"}
                  </strong>
                  {price.normalizedQuantity
                    ? `${price.currency} ${(price.observedLocalPrice / price.normalizedQuantity).toFixed(2)}`
                    : "Not available"}
                </p>
                <p>
                  <strong className="block text-navy">Basis</strong>
                  {price.comparisonBasis?.replaceAll("_", " ") ||
                    "Not available"}
                </p>
                <p>
                  <strong className="block text-navy">Observed</strong>
                  {price.observedAt
                    ? new Date(price.observedAt).toLocaleDateString("en-MY", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Not available"}
                </p>
              </div>
              {comparison?.compatible &&
              price.publication === "verified_public" ? (
                <p className="mt-3 text-sm text-deep-green">
                  Observed price difference:{" "}
                  {comparison.observedDifferencePercent}% against the Malaysia
                  observation. This is not a savings promise.
                </p>
              ) : price.publication === "demo_preview" ? (
                <p className="mt-3 text-sm text-warm-gray">
                  Illustrative only. This record is never treated as a current
                  verified market price.
                </p>
              ) : (
                <p className="mt-3 text-sm text-warm-gray">
                  {comparison?.message || "No verified comparison available."}
                </p>
              )}
            </article>
          );
        }),
      )}
    </div>
  );
}

export function PublicMedicineIntelligence({ mode }: { mode: Mode }) {
  const [model, setModel] = useState<PublicReadModel | null>(null);
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [monthlySpend, setMonthlySpend] = useState("150");
  const [units, setUnits] = useState("30");
  useEffect(() => {
    fetch("/api/health-intelligence/public")
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(setModel)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);
  const copy = modeCopy[mode];
  return (
    <main className="bg-ivory">
      <section className="relative isolate overflow-hidden bg-[#06171d] px-4 pb-16 pt-36 text-ivory md:pb-24 md:pt-44">
        <Image src="/mms-medicine-access-consult.png" alt="" fill priority className="-z-20 object-cover object-[64%_center]" sizes="100vw" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,23,29,.98),rgba(6,23,29,.86)_48%,rgba(6,23,29,.38)),linear-gradient(0deg,rgba(6,23,29,.86),transparent_60%)]" />
        <div className="mx-auto grid min-h-[520px] max-w-6xl content-end md:min-h-[580px]">
          <p className="editorial-kicker text-champagne">{copy.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.98] md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/75">
            {copy.lead}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/health-intelligence"
              className="inline-flex min-h-11 items-center rounded-md border border-ivory/40 px-5 py-3 text-sm font-semibold text-ivory"
            >
              Health Intelligence
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-md bg-champagne px-5 py-3 text-sm font-semibold text-navy"
            >
              Ask MMS to review my options
            </Link>
          </div>
        </div>
      </section>
      <section data-public-section className="px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <p className="editorial-kicker text-deep-green">
              MMS public intelligence
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-navy">
              Clarity before a cost or access decision.
            </h2>
            <p className="mt-5 leading-8 text-warm-gray">
              A lower price does not automatically mean the medicine is
              available to you. Prescription requirements, product registration,
              local availability, import rules, licensed dispensing and clinical
              suitability all matter.
            </p>
            <div className="mt-7 border-l-2 border-bronze bg-warm-white px-5 py-4 text-sm leading-6 text-warm-gray">
              <strong className="text-navy">Important:</strong> This tool
              provides education and published reference information only. It
              does not prescribe, recommend a switch, or provide purchase or
              import instructions.
            </div>
          </div>
          <div className="grid gap-8">
            {loading ? (
              <p className="text-warm-gray">
                Loading verified reference records...
              </p>
            ) : error || !model ? (
              <p
                role="alert"
                className="border border-gold-light p-5 text-warm-gray"
              >
                No public reference data is available at the moment. Please ask
                MMS for a professional review.
              </p>
            ) : (
              <>
                <DemoNotice />
                <SearchAndConfirm model={model} onConfirm={setProduct} />
                {mode === "prices" && product ? (
                  <div className="border-t border-gold/35 pt-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="editorial-kicker text-deep-green">
                          Confirmed product
                        </p>
                        <h2 className="mt-2 font-serif text-3xl text-navy">
                          {product.brandName}
                        </h2>
                      </div>
                      <span className="border border-gold/50 px-3 py-1 text-xs font-semibold uppercase tracking-[.12em] text-deep-green">
                        {product.identityStatus === "demo_preview"
                          ? "Demo preview"
                          : "Verified identity"}
                      </span>
                    </div>
                    <div className="mt-6">
                      <MarketRows model={model} product={product} />
                    </div>
                  </div>
                ) : null}
                {mode === "generic" && product ? (
                  <div className="border-t border-gold/35 pt-6">
                    <h2 className="font-serif text-3xl text-navy">
                      Potential relationships
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-warm-gray">
                      These are not instructions to change medication. A
                      clinician must review suitability before any medication
                      decision.
                    </p>
                    <div className="mt-5 grid gap-4">
                      {model.genericCandidates
                        .filter((item) => item.sourceProductId === product.id)
                        .map((item) => (
                          <article
                            key={item.relationshipId}
                            className="border-b border-gold-light/60 py-4"
                          >
                            <h3 className="font-serif text-2xl text-navy">
                              {item.candidate.brandName}
                            </h3>
                            <p className="mt-2 text-sm font-semibold text-deep-green">
                              {item.patientLabel === "potential_direct_generic"
                                ? "Potential direct generic match"
                                : item.patientLabel ===
                                    "professional_review_required"
                                  ? "Possible equivalent — professional review required"
                                  : "Not suitable for automatic comparison"}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-warm-gray">
                              {item.candidate.genericName} ·{" "}
                              {item.candidate.manufacturerName} ·{" "}
                              {item.candidate.dosageForm} ·{" "}
                              {item.candidate.unitsPerPack} units
                            </p>
                          </article>
                        ))}
                      {!model.genericCandidates.some(
                        (item) => item.sourceProductId === product.id,
                      ) ? (
                        <p className="text-sm text-warm-gray">
                          No eligible relationship is available for this
                          confirmed product.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {mode === "cost" ? (
                  <div className="border-t border-gold/35 pt-6">
                    <h2 className="font-serif text-3xl text-navy">
                      A simple cost frame
                    </h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold text-charcoal">
                        Units per month
                        <input
                          value={units}
                          onChange={(event) => setUnits(event.target.value)}
                          inputMode="numeric"
                          className="min-h-12 rounded-md border border-gold-light bg-white px-4 font-normal"
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold text-charcoal">
                        Current monthly spend
                        <input
                          value={monthlySpend}
                          onChange={(event) =>
                            setMonthlySpend(event.target.value)
                          }
                          inputMode="decimal"
                          className="min-h-12 rounded-md border border-gold-light bg-white px-4 font-normal"
                        />
                      </label>
                    </div>
                    <p className="mt-5 border-l-2 border-gold bg-warm-white px-4 py-3 text-sm leading-6 text-warm-gray">
                      Estimated annual spend:{" "}
                      <strong className="text-navy">
                        {(Number(monthlySpend || 0) * 12).toLocaleString()} in
                        your current currency
                      </strong>
                      . This is a planning estimate, not a savings claim.
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
      <section data-public-section className="bg-[#07151d] px-4 py-16 text-ivory md:py-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
          <div>
            <p className="editorial-kicker text-champagne">The next step</p>
            <h2 className="mt-3 font-serif text-4xl">
              Ask MMS to review my options.
            </h2>
            <p className="mt-3 max-w-xl text-ivory/70">
              Share the context with a qualified team member. Personalised
              review, prescribing and dispensing remain professional decisions.
            </p>
          </div>
          <Link
            href="/contact"
            onClick={() => track("professional_review_cta_clicked")}
            className="rounded-md bg-champagne px-5 py-3 text-sm font-semibold text-navy"
          >
            Request professional review
          </Link>
        </div>
      </section>
    </main>
  );
}
