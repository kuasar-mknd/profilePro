
from playwright.sync_api import sync_playwright, expect
import re

def verify_contact_form_error_focus():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()
        page = context.new_page()

        try:
            # Navigate to the page
            page.goto("http://localhost:4321/")
            page.wait_for_load_state("networkidle")

            contact_form = page.locator("#contact-form")
            contact_form.scroll_into_view_if_needed()

            # Wait for the form to be stable
            expect(contact_form.get_by_role("button", name="Envoyer le message")).to_be_visible()
            page.wait_for_timeout(500) # Ensure animations are settled

            # Mock the API endpoint to simulate a server error
            page.route(
                "https://api.web3forms.com/submit",
                lambda route: route.fulfill(status=500, body="Server Error")
            )

            # Fill the form with valid data to pass client-side checks
            page.get_by_label("Nom complet").fill("Test User")
            page.get_by_label("Email").fill("test@example.com")
            page.get_by_role("textbox", name="Message (obligatoire)").fill("This is a test message for verification.")

            # Click submit
            submit_button = page.get_by_role("button", name="Envoyer le message")
            submit_button.click()

            # Wait for the error message to appear
            error_message = page.locator("#form-error-message")
            expect(error_message).to_be_visible()

            # Click the "Try Again" button
            try_again_button = error_message.get_by_role("button", name="Réessayer")
            try_again_button.click()

            # Assert that the submit button is now focused
            expect(submit_button).to_be_focused()

            # Take a screenshot to visually verify the focus ring
            page.screenshot(path="verification/focus_verification.png")
            print("Screenshot taken: verification/focus_verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="verification/error_screenshot.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_contact_form_error_focus()
