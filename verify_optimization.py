from playwright.sync_api import sync_playwright, expect
import time

def verify_optimizations(page):
    # 1. Verify About Page Skills (No Hover Effects)
    print("Navigating to /about...")
    page.goto("http://localhost:4321/about")

    # Wait for content to load
    page.wait_for_selector("text=Enchanté, moi c'est Samuel")

    # Scroll to skills
    skills_header = page.get_by_text("Créateur Visuel &")
    skills_header.scroll_into_view_if_needed()

    # Find a skill item (e.g., "Astro") inside the list
    # Use first() to just pick one from the list if there are duplicates, but filter by text "Astro"
    skill_item = page.locator("li").filter(has_text="Astro").first
    skill_item.scroll_into_view_if_needed()

    # Hover over it
    skill_item.hover()
    time.sleep(0.5) # Wait for any transition

    # Take screenshot of skills section
    print("Taking screenshot of skills section...")
    page.screenshot(path="/home/jules/verification/skills_hover.png")

    # Assertions (Programmatic check)
    # Check if class list contains 'hover:scale-105' (should be REMOVED)
    # Note: We can check the class attribute directly
    class_attr = skill_item.get_attribute("class")
    if class_attr and "hover:scale-105" not in class_attr:
        print("✅ SUCCESS: 'hover:scale-105' removed from skills.")
    else:
        print(f"❌ FAILURE: 'hover:scale-105' still present in class: {class_attr}")

    # 2. Verify CTA Section (No will-change-transform)
    print("Navigating to /...")
    page.goto("http://localhost:4321/")

    # Scroll to CTA
    cta_section = page.locator("#cta-section")
    cta_section.scroll_into_view_if_needed()

    # Find the large orb
    # It was: class="absolute top-1/2 left-1/2 ... animate-pulse duration-4s"
    # We can try to find it by its unique classes or structure
    # It's inside #cta-section -> .absolute.inset-0.-z-10 -> .motion-reduce:hidden -> div with animate-pulse

    # Let's just verify the class on the page source for simplicity if finding element is hard
    # But finding it is better.
    orb = page.locator("#cta-section .animate-pulse.duration-4s").first

    if orb.count() > 0:
        class_attr_orb = orb.get_attribute("class")
        if class_attr_orb and "will-change-transform" not in class_attr_orb:
            print("✅ SUCCESS: 'will-change-transform' removed from CTA orb.")
        else:
            print(f"❌ FAILURE: 'will-change-transform' still present in class: {class_attr_orb}")
    else:
        print("⚠️ WARNING: Could not find CTA orb element.")

    page.screenshot(path="/home/jules/verification/cta_section.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_optimizations(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
