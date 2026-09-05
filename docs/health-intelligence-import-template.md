# Health Intelligence CSV Import Template

Release 2C.1 supports validation and dry-run preview only. Confirmed imports must enter Collected/unverified state and can never publish directly.

Required header order:

```csv
source_key,country,observed_product_name,ingredient,manufacturer,strength,dosage_form,pack,price,currency,basis,observed_date,source_reference
```

Countries are `MY`, `TH` or `SG`; currencies must respectively be `MYR`, `THB` or `SGD`. Dates use `YYYY-MM-DD`. Maximum size is 1 MB and 500 data rows. Formula-prefixed cells, malformed quoting, negative prices, invalid countries, mismatched currencies and invalid dates are rejected. Product matching may be completed later in the review queue.

