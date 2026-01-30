from playwright.sync_api import sync_playwright

def verify_email_icon():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:4321/about")

        # Scroll to contact form
        contact_form = page.locator("#contact-form")
        contact_form.scroll_into_view_if_needed()

        # Fill email
        email_input = contact_form.locator('input[name="email"]')
        email_input.fill("test@example.com")

        # Wait for animation/state update
        page.wait_for_timeout(500)

        # Take screenshot of the email field area
        email_group = contact_form.locator('.form-group:has(input[name="email"])')
        email_group.screenshot(path="verification_email_icon.png")

        browser.close()

if __name__ == "__main__":
    verify_email_icon()
