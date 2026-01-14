import time
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Wait for server to be ready (dumb wait)
        time.sleep(5)

        try:
            print("Navigating to project page...")
            page.goto("http://localhost:4321/project/corps-et-ame")

            # Wait for content to load
            page.wait_for_selector(".prose")

            # Find the heading
            # My slug logic should produce 'synopsis-intention'
            heading = page.locator("#synopsis-intention")

            if not heading.count():
                print("Heading #synopsis-intention not found. Trying to find by text.")
                heading = page.get_by_role("heading", name="Synopsis & Intention")
                if heading.count():
                    id = heading.get_attribute("id")
                    print(f"Found heading with ID: {id}")
                else:
                    print("Heading not found at all!")
                    # Dump page content for debugging
                    print(page.content())
                    return

            print("Hovering over heading...")
            heading.hover()

            # Wait for transition
            time.sleep(1)

            # Check if anchor link is present and visible (opacity 1)
            anchor = heading.locator(".anchor-link")
            expect(anchor).to_be_visible()

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/verification.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
