---
name: uploaded-images-registry
description: Canonical registry of every image the user has uploaded to the SAF golf foundation web app. Consult this skill before sourcing imagery, choosing hero backgrounds, building galleries, or generating new images so existing uploads are reused first.
---

# SAF Uploaded Images Registry

This skill is the single source of truth for **user-supplied imagery** in this project. Before generating, fetching, or stock-sourcing any image, check this list and reuse what's already on disk.

## Why this exists

The user has uploaded photographs of real SAF student athletes and program participants. Those people are the brand. Always prefer real uploaded imagery over stock photos or AI-generated images for hero banners, galleries, testimonials, and program pages.

## Registry

### Hero banner photography (10 images, 1920×1080)

Source uploads: 10 user-supplied JPEGs of SAF student athletes (tournaments, signing days, awards, swing action). Center-cropped to 16:9 and resized to 1920×1080 for full-bleed hero use.

| Path | Subject | Dimensions |
|---|---|---|
| `src/assets/hero/hero-01.jpg` … `hero-10.jpg` | Real SAF student athletes: tournament winners, college signings, swing action | 1920×1080 each |

**Where they're used:**
- `src/components/PageHero.tsx` — rotating slideshow background on every page hero (each page sets a different `imageOffset` for variety).

### Student athlete gallery (15 images, low-res)

Source upload: `SAF_Success.png` — a 5×3 photo collage, cropped into 15 individual JPGs.

| Path | Subject | Dimensions |
|---|---|---|
| `src/assets/success-gallery/student-01.jpg` … `student-15.jpg` | SAF junior golfers / student athletes | 368×283 each |

**Where they're used:**
- `src/components/SuccessGallerySlider.tsx` — auto-scrolling carousel on Home, Success Stories, Programs, Sponsors pages.

**Caveat:** Source images are small (368×283). Use only as card-sized gallery tiles. For hero backgrounds, prefer the `src/assets/hero/` set above.

### Branding assets

| Path | Purpose |
|---|---|
| `src/assets/saf-logo.png` | Primary SAF logo |
| `src/assets/saf-logo-full.png` | Full-lockup logo (logo + wordmark) |
| `src/assets/saf-logo-white.png` | White variant for dark backgrounds (used in Footer / Header on dark surfaces) |
| `src/assets/media-logos.png` | Press / media social-proof banner (rendered grayscale per design memory) |

## Rules for the agent

1. **Reuse before generating.** When a task needs imagery (hero, card, gallery, social proof, OG image), check this registry first. Only generate or fetch new images if nothing here fits.
2. **Update this registry on every new upload.** When the user uploads an image and we copy it into `src/assets/...`, append a row to the appropriate section above with path, subject, and dimensions. If a new category emerges (e.g., event photos, veterans program photos), add a new H3 section.
3. **Respect image quality.** The student gallery is low-resolution. Never use it for a print-quality OG/share image (1200×630) without re-upscaling or replacing with a higher-res source.
4. **Vary imagery across pages.** When the same image set is reused across pages (e.g., `PageHero` slideshow), set a different `imageOffset` on each page so visitors see fresh faces as they navigate.
5. **Crop carefully.** Always use `object-cover` with `object-position: center` (or a documented focal point) so subjects aren't decapitated at narrow breakpoints. Verify visually before shipping.
6. **Never delete uploaded images** without explicit user confirmation, even if they appear unused — the user may have plans for them.

## How to update this skill

1. Edit `.agents/skills/uploaded-images-registry/SKILL.md` with the new entries.
2. Run `skills--apply_draft` with path `.agents/skills/uploaded-images-registry` to activate the updated version.
