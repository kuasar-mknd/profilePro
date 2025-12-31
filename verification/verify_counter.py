
import re
from playwright.sync_api import sync_playwright, expect

def verify_char_counter(page):
    # Navigate to home or a page with the contact form
    page.goto("http://localhost:4321/")

    # Wait for the contact form to be visible (it's at the bottom)
    # The CTA section ID is #cta-section
    page.locator("#cta-section").scroll_into_view_if_needed()

    # Locate the message textarea
    message_input = page.locator("#message")

    # Locate the counter and announcer
    counter = page.locator("#message-counter")
    announcer = page.locator("#message-counter-announcer")

    # 1. Verify initial state
    expect(counter).to_contain_text("0 / 5000")
    expect(announcer).to_be_empty()

    # 2. Type some text (normal state)
    message_input.fill("Hello world")
    expect(counter).to_contain_text("11 / 5000")
    expect(announcer).to_be_empty()

    # 3. Simulate approaching limit (warning state at 90%)
    # 5000 * 0.9 = 4500
    long_text = "a" * 4500
    message_input.fill(long_text)

    # Check visual class change (orange text)
    expect(counter).to_have_class(re.compile(r"text-orange-500"))

    # Check announcer text
    expect(announcer).to_contain_text("Attention, vous approchez de la limite de caractères.")

    # 4. Simulate reaching limit
    full_text = "a" * 5000
    message_input.fill(full_text)

    # Check visual class change (red text)
    expect(counter).to_have_class(re.compile(r"text-red-500"))

    # Check announcer text
    expect(announcer).to_contain_text("Limite de 5000 caractères atteinte")

    # Take screenshot of warning/error state
    page.screenshot(path="verification/contact_form_counter_refined.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_char_counter(page)
        finally:
            browser.close()
