"""Public curated demo checks; no Auth/provider requests or real user data."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
base=os.environ.get('PATHD_BROWSER_BASE','http://127.0.0.1:3005')
shots=Path(os.environ.get('PATHD_SCREENSHOT_DIR','/tmp/pathd-v0.1.3-previews'));shots.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width in [1440,390,320]:
  context=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce');page=context.new_page();errors=[];requests=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
  page.goto(base+'/#meet-mila',wait_until='networkidle');section=page.locator('#meet-mila');section.wait_for();assert section.get_by_text('Demonstration · prewritten examples',exact=True).is_visible()
  for topic in ['Career','Life','Goals']:
   section.get_by_role('button',name=topic,exact=True).click()
   for style in ['Homegirl','CEO','Auntie','Advisor','Teacher','Mom']:
    button=section.get_by_role('button',name=style,exact=True);button.scroll_into_view_if_needed();button.click();assert button.get_attribute('aria-pressed')=='true';assert section.locator('.mila-example').get_by_text('MILA · '+style,exact=True).is_visible()
  assert section.get_by_role('link',name='Start Your PATH',exact=True).get_attribute('href')=='/sign-up'
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not any('openai' in url or '/api/companion' in url for url in requests);assert not errors,errors
  section.get_by_role('button',name='Life',exact=True).click();section.get_by_role('button',name='Homegirl',exact=True).click();section.screenshot(path=str(shots/f'mila-{width}.png'));print(f'{width}px: all eighteen curated samples, real signup CTA, reduced motion and no page overflow passed');context.close()
 browser.close()
