from playwright.sync_api import sync_playwright, expect
import time

def verify_back_to_top():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate desktop to ensure back-to-top is not hidden by media queries
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:4321")

            # Wait for hydration
            page.wait_for_load_state("networkidle")

            back_to_top = page.locator("#back-to-top")

            # 1. Verify initially hidden
            print("Verifying button is initially hidden...")
            # Button should be invisible (opacity-0 class or invisible class)
            expect(back_to_top).to_have_class(re.compile(r"invisible"))
            expect(back_to_top).to_have_class(re.compile(r"opacity-0"))

            # 2. Scroll down to trigger visibility
            print("Scrolling down...")
            page.evaluate("window.scrollTo(0, 1000)")
            # Wait for intersection observer to fire
            time.sleep(1)

            # 3. Verify visible
            print("Verifying button is visible...")
            expect(back_to_top).not_to_have_class(re.compile(r"invisible"))
            expect(back_to_top).to_have_class(re.compile(r"visible"))

            # Take screenshot of visible button
            page.screenshot(path="verification/back-to-top-visible.png")
            print("Screenshot taken: visible")

            # 4. Scroll back up
            print("Scrolling back up...")
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(1)

            # 5. Verify hidden again
            print("Verifying button is hidden again...")
            expect(back_to_top).to_have_class(re.compile(r"invisible"))

            page.screenshot(path="verification/back-to-top-hidden.png")
            print("Screenshot taken: hidden")

            print("Verification successful!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    import re
    verify_back_to_top()
