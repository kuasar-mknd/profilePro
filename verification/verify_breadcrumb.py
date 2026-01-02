from playwright.sync_api import sync_playwright, expect
import re

def verify_breadcrumb_icon():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate reduced motion to prevent animation issues
        context = browser.new_context(reduced_motion="reduce")
        page = context.new_page()

        try:
            # Go to a project page which has breadcrumbs
            # We need to wait for the server to be ready
            page.goto("http://localhost:4321/project/corps-et-ame")

            # Wait for content to load
            page.wait_for_selector("nav[aria-label=\"Fil d'Ariane\"]")

            # Locate the breadcrumb nav
            breadcrumb = page.get_by_label("Fil d'Ariane")
            expect(breadcrumb).to_be_visible()

            # Check for the icon
            # It should be an svg inside the list items
            # The structure is li > svg
            icon = breadcrumb.locator("svg").first
            expect(icon).to_be_visible()

            # Take a screenshot
            breadcrumb.scroll_into_view_if_needed()
            page.screenshot(path="verification/breadcrumb_verification.png")
            print("Screenshot taken at verification/breadcrumb_verification.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_breadcrumb_icon()
