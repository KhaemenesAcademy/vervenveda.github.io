# Cross-account route preservation — domain cutover hold

Status: SOURCE REVIEW ONLY. No DNS, GitHub Pages, or STOS changes are authorized.

## Core finding

The proposed lightweight public gateway is `KhaemenesAcademy/vervenveda.github.io`, whereas the Vervenveda ecosystem's public project repositories are principally owned by `vervenveda`. GitHub Pages ordinarily inherits the custom user-site domain only for project sites owned by the **same account**. Therefore transferring `vervenveda.com` between accounts does not preserve the previous owner's `/project.github.io/` routes automatically.

Official documentation: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages

## Literal and dynamically built homepage dependencies

Exact currently authored destination families include:

| URL family | Owner | Migration gate |
| --- | --- | --- |
| `https://vervenveda.com/Khaemenes_Academy.github.io/family/` | Vervenveda Academy repo | Child/family route must remain reachable |
| `https://vervenveda.com/Khaemenes_Academy.github.io/adult/` | Vervenveda Academy repo | Adult entrance must remain reachable |
| `https://vervenveda.com/KhaemenesAcademy_Home.github.io/` | Vervenveda Academy Home repo | Academy front door must remain reachable |
| `https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1` | Vervenveda Linguistics repo | Translator loader must still return executable JS |
| `https://vervenveda.com/Khaemenes_High.github.io/grades/grade-<NN>/student-profile/` | Vervenveda High School repo | Dynamically constructed grade-profile routes must work |
| `https://vervenveda.com/Khaemenes_Academy.github.io/student/` | Vervenveda Academy repo | Dynamically constructed student route must work |

The full curated ecosystem has many more routes beyond the homepage's literal anchors. This is a **sample of high-priority routes**, not an exhaustive route migration inventory.

## Permissible resolution strategies (review only)

1. Keep the existing Vervenveda domain and all projects on the present account while validating the Gateway on a separate preview URL.
2. Move the Gateway publication into an account/domain configuration that preserves existing Vervenveda project-site inheritance.
3. If the domain must move across accounts, introduce a separately operated reverse proxy with explicit path routing, TLS, and monitored rollback. GitHub Pages by itself is not that proxy.
4. A limited redirect map can preserve individual entry points, but cannot replace a full-project-path proxy without verifying all deep resources.

Any strategy requires independent checks of domain ownership/verification, TLS, 200/3xx targets, the 11,026-page index, app scripts, authentication/registration entrances, and STOS separation.

## Publication states

- `SOURCE_PARITY`: master and gateway index Git blob identical
- `LOCAL_PREVIEW_PASS`: offline dependency and browser checks have passed
- `ROUTE_PARITY_PASS`: representative and all critical published project routes work after candidate mapping
- `CUTOVER_APPROVED`: owner explicitly approves migration and rollback

Only the final state can permit DNS change. This document does not set any state to PASS.
