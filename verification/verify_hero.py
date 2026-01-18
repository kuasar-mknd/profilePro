import time
from playwright.sync_api import sync_playwright

def verify_hero():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use localhost:4321 as default for Astro dev
        page = browser.new_page()
        try:
            page.goto("http://localhost:4321")
            # Wait for content to load
            page.wait_for_selector(".hero-title", state="visible")
            # Wait a bit for animations to play
            time.sleep(2)

            # Take screenshot
            page.screenshot(path="verification/hero.png")
            print("Screenshot saved to verification/hero.png")

            # Optional: Check if the element exists and has classes
            hero_letters = page.locator(".letter-animate")
            count = hero_letters.count()
            print(f"Found {count} animated letters")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_hero()
