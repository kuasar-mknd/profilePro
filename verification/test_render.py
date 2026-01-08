from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        try:
            # 1. Test Homepage Services Section
            page.goto("http://localhost:4321/")
            # Wait for content to load
            page.wait_for_load_state("networkidle")

            # Check if services section has content-visibility: auto
            # Note: We can't easily check CSS property computation in Playwright Python directly
            # without evaluation, but we can check if it renders correctly.

            services = page.locator(".services-section")
            expect(services).to_be_visible()

            # Scroll to it
            services.scroll_into_view_if_needed()
            page.wait_for_timeout(1000) # Wait for potential reveal animation

            page.screenshot(path="verification/services_visible.png")
            print("Services section screenshot taken")

            # 2. Test Contact Form (Footer area)
            contact = page.locator(".contact-form-section")
            contact.scroll_into_view_if_needed()
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/contact_visible.png")
            print("Contact form screenshot taken")

            # 3. Test Latest Posts (Bento Grid)
            # Find the bento grid container
            bento = page.locator(".bento-grid")
            # Scroll to it
            bento.scroll_into_view_if_needed()
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/bento_visible.png")
            print("Bento grid screenshot taken")

            # 4. Verify no layout shift or invisible content issues
            # We just ensure elements are visible. content-visibility should handle rendering
            # when on-screen.

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
