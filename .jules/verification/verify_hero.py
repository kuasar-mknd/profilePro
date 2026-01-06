import re
from playwright.sync_api import sync_playwright, expect

def verify_hero_carousel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a mobile viewport to match potential mobile usage and ensure carousel is visible
        context = browser.new_context(viewport={"width": 375, "height": 812}, has_touch=True)
        page = context.new_page()

        try:
            # Navigate to home page
            page.goto("http://localhost:4321/")

            # Wait for the carousel to be present
            carousel = page.locator("#hero-carousel")
            expect(carousel).to_be_visible(timeout=10000)

            # Get the number of slides
            # The structure is #hero-carousel > #carousel-track > div (slides)
            # We need to wait a bit for hydration/JS to run if needed, but here it's static HTML

            slides = page.locator("#carousel-track > div")
            count = slides.count()
            print(f"Number of slides found: {count}")

            # Verify we have slides (should be at most 30 = 15*2)
            # If projectImages < 15, count will be 2 * projectImages
            # We just want to ensure it's not broken (0 slides) and bounded (<= 30)
            assert count > 0, "Carousel should have slides"
            assert count <= 30, f"Carousel should have at most 30 slides, found {count}"

            # Take a screenshot
            page.screenshot(path=".jules/verification/hero_carousel.png")
            print("Verification successful. Screenshot saved.")

        except Exception as e:
            print(f"Verification failed: {e}")
            # Take error screenshot
            page.screenshot(path=".jules/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_hero_carousel()
