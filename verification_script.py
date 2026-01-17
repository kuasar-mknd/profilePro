import time
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:4321/")

        # Scroll to contact form
        contact_form = page.locator("#contact-form")

        # Ensure it's ready
        contact_form.scroll_into_view_if_needed()

        # Fill valid email
        email_input = page.locator('input[name="email"]')
        email_input.fill("test@example.com")

        # Wait for validation icon to appear
        icon_wrapper = email_input.locator("xpath=..").locator(".validation-icon")

        # Wait for transition
        time.sleep(1)

        expect(icon_wrapper).to_have_attribute("data-visible", "true")

        # Take screenshot of the form
        contact_form.screenshot(path="verification.png")
        print("Screenshot saved to verification.png")

        browser.close()

if __name__ == "__main__":
    run()
