---
name: "Yaotu Landing Page"
description: "A warm landing system that uses the main YaoTu site's Open Runde type, yellow controls, white 16px cards, and level scenery frames."
colors:
  yaotu-yellow: "#facc14"
  yaotu-yellow-dark: "#c79400"
  display-orange: "#df6f32"
  display-gold: "#f0ad00"
  ink: "#171714"
  paper: "#fffdf6"
  warm-ground: "#f7f2df"
  warm-line: "#d6cfb7"
  muted-ink: "#625f55"
  white: "#ffffff"
typography:
  display-ahhh:
    fontFamily: "Open Runde, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(3rem, 6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.82
    letterSpacing: "-0.04em"
  display-yaotu:
    fontFamily: "Open Runde, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(5rem, 11vw, 9.5rem)"
    fontWeight: 700
    lineHeight: 0.82
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Open Runde, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Open Runde, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Open Runde, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Open Runde, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  control-sm: "9px"
  control: "10px"
  media-sm: "12px"
  card: "14px"
  media: "16px"
  group: "18px"
  capsule: "999px"
spacing:
  compact: "0.5rem"
  standard: "1rem"
  comfortable: "1.5rem"
  roomy: "2rem"
  section-gap: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.yaotu-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "#ffda3a"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  button-inverse:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
    height: "3rem"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0.75rem"
    height: "3rem"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "16px"
    padding: "1.5rem"
---

# Design System: Yaotu Landing Page

## Overview

**Creative North Star: "The Yellow Orbit"**

The Yellow Orbit makes local discovery feel warm, tangible, and immediately recognizable. A calm paper field holds an oversized split-scale wordmark while level scenery capsules form a loose constellation around it; the brand signal stays dominant and the photography supplies place, not spectacle.

Below the hero, the page becomes editorial and orderly. Warm tonal sections, parallel card rows, compact controls, and generous vertical intervals keep a friendly marketplace message legible without slipping into a generic card dashboard. Motion is brief, soft, and purposeful, with the pointer-made photo bubbles treated as an extension of the hero constellation.

**Key Characteristics:**
- Warm paper and straw surfaces anchored by a rare, vivid Yaotu yellow.
- Friendly rounded typography with tight, oversized display settings.
- Level scenery capsules arranged around clear central copy.
- Equal white card rows and asymmetric heading-to-copy compositions.
- Main-site elevation tokens, short motion, and visible keyboard focus.

## Colors

The palette uses warm near-neutrals as the field, near-black for structure, yellow for decisive actions, and orange-gold only for the central wordmark.

### Primary
- **Yaotu Yellow:** The main action, selection, step-number, and brand-signal color.
- **Dark Golden Yellow:** A supporting interaction color for scroll chrome and directional accents, never a competing fill.

### Secondary
- **Display Orange:** Reserved for the smaller `ahhh` half of the central wordmark.
- **Display Gold:** Reserved for the larger `yaotu` half of the central wordmark.

### Neutral
- **Warm Paper:** The primary page and modal surface.
- **Warm Ground:** Alternating section background and subtle control track.
- **Yaotu Ink:** Primary text, active tabs, and the dark final call-to-action field.
- **Muted Ink:** Supporting copy and inactive control labels.
- **Warm Line:** Quiet borders and dividers.
- **White:** Filled secondary actions and reversed text.

### Named Rules

**The Yellow Signal Rule.** Use yellow for the primary action and small wayfinding signals; its concentration is what preserves its force.

**The Two-Tone Wordmark Rule.** Keep `ahhh` orange and `yaotu` gold, with no hover color change and no redistribution of these colors into ordinary headings.

## Typography

**Display Font:** Open Runde (with Helvetica Neue, Helvetica, Arial, sans-serif fallback)
**Body Font:** Open Runde (with Helvetica Neue, Helvetica, Arial, sans-serif fallback)

**Character:** One rounded sans family carries the entire page. Weight and scale—not font switching—create hierarchy, producing an approachable voice with enough density for decisive conversion controls.

### Hierarchy
- **Display Ahhh** (700, fluid 3–5.5rem, 0.82 line-height): The smaller opening half of the hero wordmark.
- **Display Yaotu** (700, fluid 5–9.5rem, 0.82 line-height): The dominant half of the hero wordmark.
- **Headline** (700, fluid 2.5–5rem, 0.98 line-height): Section headings, constrained to roughly 18 characters per line.
- **Title** (700, 1.35rem, 1.15 line-height): Feature and content-card titles.
- **Body** (400, 1rem, 1.75 line-height): Explanations and supporting copy, usually kept within 34rem or similar readable measures.
- **Label** (700, 0.875rem, 1.5 line-height): Buttons, tabs, and compact control labels.

### Named Rules

**The Split-Scale Rule.** `ahhh` must remain visibly smaller than `yaotu`; on compact screens the two parts stack without losing that hierarchy.

## Layout

The landing page uses full-width tonal bands with content padded by a fluid section shell: vertical padding scales from 5rem to 8rem, while horizontal padding grows from 1.25rem toward a centered 82rem content region. The hero is broader, topping out at 94rem so the scenery constellation can frame the copy without crowding it.

Section introductions pair a dominant heading with a narrower supporting paragraph from 768px upward. Journey content becomes three columns at that breakpoint; team cards become three equal parallel columns, while feature cards move from one column to two at 768px and four equal parallel columns at 1024px. Card grids use a recurring 1rem gap. Mobile preserves the editorial order and lets the split hero wordmark stack.

**The Parallel Card Rule.** Feature cards share equal standing in a four-column desktop row, and team cards share equal standing in a three-column desktop row; do not reintroduce a featured spanning card.

**The Orbit Clearance Rule.** Photography may frame and react around the hero, but the central wordmark, promise, and two actions retain an unobstructed stacking layer.

## Elevation & Depth

Depth follows the live main site. Ordinary cards use a 1px gray border plus a restrained `0 1px 4px rgba(0,0,0,.06)` shadow. The yellow primary action uses the brand's characteristic 4px golden bottom shadow. Only modal-level containers use `0 16px 48px rgba(0,0,0,.16)` over a 95% white surface.

### Named Rules

**The Three-Level Depth Rule.** Use the light card shadow for ordinary surfaces, the golden 4px bottom shadow for yellow conversion controls, and the 16×48 modal shadow only for protected overlays.

## Shapes

Controls and shapes follow the main site: buttons use 10px, fields use 12px, and cards, modal containers, journey media, and fixed hero photography use 16px. Pointer-made hero photography remains a true 136px circle, always parallel to the viewport and never outlined.

**The Level Scenery Rule.** All static and pointer-made hero photos remain unrotated; visual variety comes from scale, crop, placement, opacity, blur, and timing.

## Components

### Buttons
- **Shape:** Compact rounded rectangle (10px) with a 3rem minimum height and 1.5rem horizontal padding.
- **Primary:** Yaotu Yellow fill, Yaotu Ink text, bold label type, and warm ambient depth.
- **Secondary:** White filled surface, Yaotu Ink text, a quiet Warm Line border, and neutral ambient depth. It is a filled secondary action, not an outline-only button.
- **Inverse:** Transparent on the final ink field with a translucent white border; it fills white and switches to ink text on hover.
- **Hover / Focus:** The primary shadow compresses from 4px to 3px on hover and 1px on active, matching the main site. All keyboard focus uses a 3px dark-gold outline with 3px offset.
- **Copy:** Hero buttons contain text only. The final action uses the exact `Become a Local Guide` label and routes to `/become-guide`.

### Cards / Containers
- **Corner Style:** 16px, matching the live guide card and destination panel.
- **Background:** Solid white.
- **Shadow Strategy:** `0 1px 4px rgba(0,0,0,.06)` for standard cards; `0 16px 48px rgba(0,0,0,.16)` only for modal containers.
- **Border:** 1px `#e5e7eb` for ordinary cards; modal containers rely on shadow and white/95 material.
- **Internal Padding:** 1.5rem by default, increasing to 2rem for team content on larger screens.
- **Arrangement:** Equal parallel cards on desktop; no card spans rows or columns to claim featured status.

### Inputs / Fields
- **Style:** White 3rem-high fields with a 10px radius, a warm-gray border, and 0.75rem internal padding.
- **Focus:** Dark-gold ring plus the landing-page focus outline.
- **Disabled:** Lower opacity and a not-allowed cursor.

### Navigation
- **Style:** There is no conventional link bar. The masthead keeps the official supplied Yaotu logo at upper left and a compact language control at upper right on a translucent Warm Paper capsule.

### Journey Toggle
- **Style:** Two bold labels sit in a Warm Ground rounded track; the active mode is filled with Yaotu Ink and reversed to white.
- **Shape:** The track is 12px; individual tabs are 9px with a 2.75rem minimum height.

### Scenery Constellation
- **Static state:** Level scenery-only photographs use a consistent 16px radius and a quiet 1px warm border.
- **Pointer state:** Desktop pointer movement spawns level 136×136px circular scenery bubbles after 170px of travel. They have no border or shadow, scale and fade through blur, hold briefly, and disappear without entering the central copy zone.
- **Responsive state:** Pointer-follow imagery is absent on touch-primary devices; the static constellation remains the visual fallback.

## Do's and Don'ts

### Do:
- **Do** keep the official supplied Yaotu logo in the upper-left masthead.
- **Do** preserve the orange-small/gold-large split of the central `ahhh yaotu` wordmark.
- **Do** use scenery-only hero imagery and keep every photo level with the viewport.
- **Do** keep the hero primary action yellow and the secondary action white-filled, both without arrow icons.
- **Do** preserve equal parallel card layouts at desktop widths.
- **Do** reuse the measured main-site card, button, and modal elevation tokens.
- **Do** honor reduced-motion preferences by collapsing transitions and disabling smooth scroll.

### Don't:
- **Don't** rotate hero photography or let pointer-made images cover the central copy zone.
- **Don't** recolor the central wordmark on hover.
- **Don't** convert the secondary hero action into a transparent or outline-only treatment.
- **Don't** add unsupported ratings, testimonials, metrics, or guarantees as visual proof devices.
- **Don't** invent new shadow strengths or radii outside the measured main-site scale.
