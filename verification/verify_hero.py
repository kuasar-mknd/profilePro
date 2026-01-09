from playwright.sync_api import sync_playwright, expect

def verify_hero_carousel():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        try:
            # Navigate to homepage
            page.goto("http://localhost:4321/")

            # Wait for carousel to be visible
            carousel = page.locator("#hero-carousel")
            expect(carousel).to_be_visible(timeout=10000)

            # Verify that img tags are present inside the carousel track
            # and that they have srcset attributes
            images = page.locator("#carousel-track img")

            # Wait for at least one image to be present
            expect(images.first).to_be_visible()

            count = images.count()
            print(f"Found {count} images in carousel.")

            if count == 0:
                print("Error: No images found in carousel")
                exit(1)

            # Check the first image for srcset
            first_img = images.first
            srcset = first_img.get_attribute("srcset")

            if srcset:
                print(f"First image srcset: {srcset[:50]}...")
                if "224w" in srcset and "288w" in srcset:
                    print("SUCCESS: srcset contains expected width descriptors.")
                else:
                    print("WARNING: srcset might be missing expected width descriptors.")
            else:
                print("ERROR: srcset attribute missing on carousel image.")
                exit(1)

            # Check that there are NO picture tags in the carousel track
            pictures = page.locator("#carousel-track picture")
            pic_count = pictures.count()
            print(f"Found {pic_count} picture tags in carousel.")

            if pic_count > 0:
                print("ERROR: Found <picture> tags! Optimization failed.")
                exit(1)
            else:
                print("SUCCESS: No <picture> tags found.")

            # Take a screenshot
            page.screenshot(path="verification/hero_carousel.png")
            print("Screenshot saved to verification/hero_carousel.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_hero_carousel()
