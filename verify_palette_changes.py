
from playwright.sync_api import sync_playwright, expect

def verify_palette_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # 1. Homepage: Service Cards & Social Icons
        print("Navigating to Homepage...")
        page.goto("http://localhost:4321/")
        page.wait_for_load_state("networkidle")

        # Scroll to services to ensure they are rendered (content-visibility)
        services_section = page.locator(".services-section")
        services_section.scroll_into_view_if_needed()
        page.wait_for_timeout(1000) # Wait for animations

        # Screenshot Services
        page.screenshot(path="/home/jules/verification/homepage_services.png")
        print("Screenshot of Homepage Services taken.")

        # 2. Contact Form: Character Counter
        print("Navigating to Contact Form...")
        contact_section = page.locator("#cta-section")
        contact_section.scroll_into_view_if_needed()

        # Type into message to trigger counter
        message_input = page.locator("textarea[name='message']")
        message_input.fill("A" * 4501) # Near limit (90%)
        page.wait_for_timeout(500)

        # Screenshot Contact Form with Counter
        contact_form = page.locator("#contact-form")
        contact_form.screenshot(path="/home/jules/verification/contact_form_counter.png")
        print("Screenshot of Contact Form Counter taken.")

        # 3. Project Page: Breadcrumbs & Video Player
        print("Navigating to Project Page...")
        # Find a project link
        page.goto("http://localhost:4321/project")
        page.wait_for_load_state("networkidle")

        first_project = page.locator("article a").first
        first_project.click()
        page.wait_for_load_state("networkidle")

        # Screenshot Breadcrumbs
        breadcrumbs = page.locator("nav[aria-label='Fil d\\'Ariane']")
        if breadcrumbs.is_visible():
            breadcrumbs.screenshot(path="/home/jules/verification/project_breadcrumbs.png")
            print("Screenshot of Breadcrumbs taken.")

        # 4. 404 Page
        print("Navigating to 404 Page...")
        page.goto("http://localhost:4321/404-test-page")
        page.wait_for_load_state("networkidle")

        # Screenshot 404 content
        main_content = page.locator("main")
        main_content.screenshot(path="/home/jules/verification/404_page.png")
        print("Screenshot of 404 Page taken.")

        browser.close()

if __name__ == "__main__":
    verify_palette_changes()
