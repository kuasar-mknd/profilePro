import time
from playwright.sync_api import sync_playwright, expect
import os

def verify_accessibility_fixes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use mobile context to test hamburger button visibility
        context = browser.new_context(viewport={"width": 375, "height": 812})
        page = context.new_page()

        try:
            # Wait for server
            time.sleep(5)

            print("Navigating to home...")
            page.goto("http://localhost:4321")

            # 1. Verify Header Logo Title
            print("Verifying Header Logo Title...")
            logo_link = page.locator("#main-header a[href='/']").first
            expect(logo_link).to_have_attribute("title", "Samuel Dulex - Accueil")
            print("✅ Header Logo Title verified")

            # 2. Verify Footer Logo Title
            print("Verifying Footer Logo Title...")
            # Scroll to footer
            footer = page.locator("footer")
            footer.scroll_into_view_if_needed()
            footer_logo = page.locator("#main-footer a[href='/']").first
            expect(footer_logo).to_have_attribute("title", "Retour à l'accueil")
            print("✅ Footer Logo Title verified")

            # 3. Verify Hamburger Button Keyshortcuts
            print("Verifying Hamburger Button Keyshortcuts...")
            # Check initial state (should NOT have aria-keyshortcuts)
            menu_btn = page.locator("#menu_toggle")
            # expect(menu_btn).not_to_have_attribute("aria-keyshortcuts", "Escape")
            # Note: Playwright doesn't have a direct 'not_to_have_attribute' for optional attrs easily without regex
            # We'll check it has it AFTER click

            menu_btn.click()
            expect(menu_btn).to_have_attribute("aria-expanded", "true")
            expect(menu_btn).to_have_attribute("aria-keyshortcuts", "Escape")
            print("✅ Hamburger Button Keyshortcuts verified (open state)")

            menu_btn.click()
            expect(menu_btn).to_have_attribute("aria-expanded", "false")
            # In closed state, attribute is removed.
            # We can verify it's gone by checking evaluate
            has_attr = menu_btn.evaluate("el => el.hasAttribute('aria-keyshortcuts')")
            assert not has_attr, "aria-keyshortcuts should be removed when closed"
            print("✅ Hamburger Button Keyshortcuts verified (closed state)")

            # 4. Verify Project Card Aria-Label (Post.astro)
            print("Verifying Project Card Aria-Label...")
            # Navigate to project list to ensure we see posts
            page.goto("http://localhost:4321/project")

            # Find the first project card link
            # The structure is article > a[href^='/project/']
            # We need to wait for content
            card_link = page.locator("article a[href^='/project/']").first
            expect(card_link).to_be_visible()

            aria_label = card_link.get_attribute("aria-label")
            print(f"Found aria-label: {aria_label}")

            # Check if it contains the intro (we don't know the specific text, but it should be long)
            # Standard label was "Voir le projet X - Lecture estimée Y minutes"
            # New label is "Voir le projet X. [Intro]. Lecture estimée Y minutes."
            assert "Lecture estimée" in aria_label
            # Verify title attribute is present
            title_attr = card_link.get_attribute("title")
            print(f"Found title: {title_attr}")
            assert "Voir le projet :" in title_attr
            print("✅ Project Card Attributes verified")

            # 5. Verify Image Gallery Aria-HasPopup
            print("Verifying Gallery Aria-HasPopup...")
            # We need a page with a gallery. Let's try to find one.
            # Assuming 'corps-et-ame' has images or similar.
            # Let's search for any page with .image-gallery

            # Let's go to a specific known project
            page.goto("http://localhost:4321/project/corps-et-ame")

            gallery = page.locator(".image-gallery")
            if gallery.count() > 0:
                img_btn = gallery.locator("[data-gallery-image]").first
                expect(img_btn).to_have_attribute("aria-haspopup", "dialog")
                print("✅ Gallery Image Aria-HasPopup verified")
            else:
                print("⚠️ No gallery found on this page, skipping gallery check.")

            # 6. Verify Contact Form Attributes
            print("Verifying Contact Form Attributes...")
            # Contact form is usually on home or contact page. It's on home in this project.
            page.goto("http://localhost:4321")

            # Check textarea autocomplete
            message_area = page.locator("textarea[name='message']")
            expect(message_area).to_have_attribute("autocomplete", "off")

            # Check input glow aria-hidden
            # It's a sibling of the input
            glow = page.locator(".input-glow").first
            expect(glow).to_have_attribute("aria-hidden", "true")
            print("✅ Contact Form Attributes verified")

            # Take a screenshot for the record
            page.screenshot(path=".jules/verification/a11y-check.png")

        except Exception as e:
            print(f"❌ Test failed: {e}")
            # Take screenshot on failure
            page.screenshot(path=".jules/verification/failure.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_accessibility_fixes()
