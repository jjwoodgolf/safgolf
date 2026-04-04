

# Image Strategy Plan for SAF Website

## Phase 1: Extract Individual Images from Uploaded Collage

The uploaded image (`SAF_Success.png`) contains 15 individual photos in a 5x3 grid. I will:

1. **Copy the uploaded image** to the project
2. **Write a Python script** to crop each of the 15 individual photos from the grid, removing the blue borders
3. **Save each as a separate image** in `src/assets/success-gallery/` (e.g., `student-01.png` through `student-15.png`)

## Phase 2: Build a Student Success Image Slider

Create a new `SuccessGallerySlider` component using the existing Embla carousel (`src/components/ui/carousel.tsx`):

- Auto-scrolling carousel showing individual student photos
- Responsive: 4 images visible on desktop, 2 on tablet, 1 on mobile
- Smooth looping animation
- Optional pause on hover

## Phase 3: Place Images Strategically Across Pages

| Page | Placement | Purpose |
|------|-----------|---------|
| **Home (`/`)** | Add the `SuccessGallerySlider` between the Success Stories preview and the Donate CTA section | Show breadth of student impact, build credibility |
| **Success Stories (`/success-stories`)** | Add the slider at the top of the stories section, below the hero | Visual proof of the many students helped |
| **Programs (`/programs`)** | Add a smaller version of the gallery in the programs overview | Show real participants in SAF programs |
| **Sponsors (`/sponsors`)** | Add the slider in the "How Funds Are Used" section | Show sponsors their dollars at work |
| **Events (`/events`)** | Reserved spot for future event images (no changes now) | Placeholder for event photography |

## Technical Details

- Images stored in `src/assets/success-gallery/` and imported as ES6 modules for proper bundling
- The slider component will use the existing `Carousel` UI primitives with Embla's autoplay plugin
- Install `embla-carousel-autoplay` for auto-scroll behavior
- Each image will have rounded corners, consistent sizing, and a subtle hover effect

## Steps Summary

1. Copy uploaded image and run Python cropping script to extract 15 individual photos
2. Install `embla-carousel-autoplay` dependency
3. Create `SuccessGallerySlider` component with auto-scrolling carousel
4. Add the slider to Home, Success Stories, Programs, and Sponsors pages
5. Test responsive behavior across viewport sizes

