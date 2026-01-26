from playwright.sync_api import sync_playwright, expect

def verify_footer_link():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:4321")

            print("Waiting for footer...")
            footer = page.locator("#main-footer")
            expect(footer).to_be_visible()

            print("Looking for the link with the new accessible name IN THE FOOTER...")
            # Scope to footer
            link = footer.get_by_role("link", name="Samuel Dulex - Retour à l'accueil")

            expect(link).to_be_visible()

            print("Link found! Verifying title attribute...")
            title_attr = link.get_attribute("title")
            if title_attr != "Samuel Dulex - Retour à l'accueil":
                raise Exception(f"Title attribute mismatch. Expected 'Samuel Dulex - Retour à l'accueil', got '{title_attr}'")

            print("Scrolling to footer...")
            link.scroll_into_view_if_needed()

            # Wait a bit for any animations
            page.wait_for_timeout(500)

            print("Taking screenshot...")
            page.screenshot(path="verification.png")
            print("Verification successful!")

        except Exception as e:
            print(f"Verification failed: {e}")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_footer_link()
