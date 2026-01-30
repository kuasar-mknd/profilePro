from playwright.sync_api import sync_playwright
import time

def verify_hero():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to home page...")
            page.goto("http://localhost:4321")

            print("Waiting for hero title...")
            # Wait for "Connecter" text to be visible
            page.wait_for_selector('text=Connecter', state='visible', timeout=10000)

            print("Waiting for animation to complete (3 seconds)...")
            # Wait enough time for the animation and cleanup to run
            time.sleep(3)

            print("Taking screenshot...")
            page.screenshot(path="verification/hero_cleanup.png")
            print("Screenshot saved to verification/hero_cleanup.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_hero()
