# Design System Strategy: The Monolith & The Muse

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Architectural Editorial."** 

This is not a standard e-commerce template; it is a digital gallery space. We treat streetwear as high art. The system is built on the tension between the "Monolith" (rigid, heavy, black, sans-serif UI) and the "Muse" (graceful, light, serif typography and high-fashion photography). By leaning into a strictly square-edged, 0px radius world, we reject the friendly "bubbly" nature of modern apps in favor of a cold, premium authority. 

We break the "template" feel through **intentional asymmetry**. Product descriptions should be offset from their images, and typography should vary drastically in scale to create a rhythm that feels more like a printed fashion magazine than a website.

---

## 2. Colors: Tonal Architecture
The palette is a study in grayscale restraint. We use color not to decorate, but to define space and hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Use of 1px solid borders for sectioning or containment is strictly prohibited. 
Boundaries must be defined solely through background color shifts. To separate the header from a hero section, or a product grid from a footer, transition from `surface` (#F9F9F9) to `surface-container` (#EEEEEE). This creates a "monolithic" feel where the site is composed of blocks rather than outlines.

### Surface Hierarchy & Nesting
Treat the UI as layered sheets of premium cardstock.
- **Base Layer:** `surface` (#F9F9F9) for the primary page background.
- **Product Cards:** `surface-container-lowest` (#FFFFFF) to make products pop with a sharp, clean edge against the off-white background.
- **Utility Sections:** `surface-container` (#EEEEEE) for secondary information like filters or technical specs.

### The "Glass & Gradient" Rule
While the brand is minimalist, flat gray can feel "dead." For floating elements (like a "Quick Add" drawer or a mobile navigation overlay), use a backdrop-blur effect (20px+) combined with a semi-transparent `surface` color. This ensures the high-quality photography is never fully obscured, maintaining a sense of depth and luxury.

---

## 3. Typography: The Typeface Paradox
We utilize a dual-font system to create a "High-End Editorial" vibe.

- **The Muse (Noto Serif):** Used for `display` and `headline` tiers. This font provides the soul. It should be used for brand moments, lookbook titles, and editorial quotes. It represents the "art" of streetwear.
- **The Monolith (Inter):** Used for `title`, `body`, and `label`. This is the workhorse. It must be clean, legible, and modern. It represents the "utility" and "engineering" of the garments.

### Typographic Scale
- **Display-LG (3.5rem / Noto Serif):** Used for hero statements. Needs massive tracking (letter-spacing: -0.02em) to feel intentional.
- **Body-MD (0.875rem / Inter):** The standard for product descriptions. High line-height (1.6) is required to ensure the "whitespace" philosophy extends into the text blocks themselves.
- **Label-SM (0.6875rem / Inter):** Used for price tags and category labels. Always uppercase with increased letter-spacing (+0.1em) for a premium, tagged appearance.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are the enemy of this aesthetic. We achieve depth through **Tonal Layering** and physical stacking.

- **The Layering Principle:** To lift a card, do not add a shadow. Instead, place a `surface-container-lowest` (#FFFFFF) card on a `surface-container-low` (#F3F3F3) background. The sharp contrast in hex value provides all the "lift" required.
- **Ambient Shadows:** In rare cases where an element must float (e.g., a modal), use a "Shadow-Light": `box-shadow: 0 20px 40px rgba(26, 28, 28, 0.04)`. It must be barely perceptible, mimicking the way light hits a thick piece of matte paper.
- **The Ghost Border Fallback:** For accessibility on input fields, use the `outline-variant` token at 10% opacity. If the user can see the border clearly at first glance, it is too heavy.

---

## 5. Components

### Buttons
- **Primary:** `primary` (#000000) background with `on-primary` (#FFFFFF) text. Rectangular (0px radius). Padding: 16px 32px. Transitions should be an instant "hard-cut" to `primary-container` (#1C1B1B) on hover.
- **Secondary:** `outline` (#747878) Ghost Border (10% opacity) with `on-surface` text. No background.

### Cards & Lists
- **The "No-Divider" Rule:** Vertical white space (using a 32px or 64px step) is the only allowed divider. 
- **Product Cards:** Must use square aspect ratios for imagery. Content (Name, Price) should be left-aligned with a `label-md` for the price, creating a "spec sheet" look.

### Input Fields
- **Styling:** Underline-only or subtle background shift (`surface-container-high`). No four-sided boxes.
- **State:** Error states use `error` (#BA1A1A) but keep the typography in `inter` to maintain the technical feel.

### Additional Component: The "Editorial Scroller"
A horizontal, edge-to-edge image scroller where the `display-md` serif typography overlaps the images. This breaks the grid and forces the user to see the interface as a composed photograph.

---

## 6. Do's and Don'ts

### Do:
- **Embrace the Void:** If you think there is enough whitespace, double it.
- **Hard Edges Only:** Every button, card, and image must have a 0px border-radius.
- **Type as Art:** Let the Serif typography be the primary "graphic" element when photos aren't present.

### Don't:
- **Never use 100% Black for body text:** Use `on-surface` (#1A1C1C) to keep the text from feeling "vibrant" or digital.
- **No Gradients:** Avoid color gradients. The only allowed "gradients" are the natural falloff in high-end photography or the backdrop-blur of the glassmorphism.
- **No Rounding:** Even a 2px radius destroys the "Architectural" feel. Keep it sharp.