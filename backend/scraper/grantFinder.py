import os
import time
import json
from dotenv import load_dotenv
import pandas as pd
from google import genai
from google.genai import types
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from datetime import datetime

# ================= CONFIGURATION =================
# TODO: PASTE YOUR API KEY HERE
# Load the environment variables from .env file
load_dotenv()

# Now you can access the environment variable just like before
api_key = os.environ.get('API_KEY')
GEMINI_API_KEY = api_key 

ORGANISATION_MISSION = """
Towards that end, for more than two decades, Tsao Foundation has pioneered approaches 
to ageing and eldercare across a range of disciplines to empower mature adults to 
master their own ageing journey over their life course in terms of self-care, 
growth and development.
"""

BASE_URL = "https://oursggrants.gov.sg/grants/new"
# =================================================

client = genai.Client(api_key=GEMINI_API_KEY)

def get_all_grant_links():
    """Launches browser and aggressively finds links without waiting for specific classes."""
    print(">>> 1. Initializing Chrome...")
    
    options = webdriver.ChromeOptions()
    # Stability flags
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        
        print(">>> Browser started. Loading portal...")
        driver.get(BASE_URL)
        
        # FIX: Just wait for the body to be present (failsafe)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        time.sleep(3) # Give it a moment to render visually
        
        print(">>> Attempting to scroll...")
        # FIX: Aggressive scrolling loop
        for _ in range(5):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            print("    ...scrolled down")
            time.sleep(2)
            
        print(">>> Extracting links...")
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        links = []
        # FIX: Find ALL links that look like grant details
        for a in soup.find_all('a', href=True):
            href = a['href']
            # Logic: Grant links usually have /grants/ in them, but not /new
            if "/grants/" in href and "/new" not in href:
                full_link = "https://oursggrants.gov.sg" + href if href.startswith("/") else href
                if full_link not in links:
                    links.append(full_link)
        
        # Remove duplicates
        links = list(set(links))
        
        print(f">>> Found {len(links)} unique grant links.")
        return links[:20], driver
        
    except Exception as e:
        print(f"Browser Error: {e}")
        return [], None

def scrape_page_text(driver, url):
    """Visits a specific grant page and extracts text."""
    try:
        driver.get(url)
        time.sleep(2) 
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        text = soup.get_text(separator=' ', strip=True)
        return text
    except Exception as e:
        print(f"Failed to scrape {url}: {e}")
        return ""

def analyze_with_gemini(grant_text, mission):
    """Uses the new google.genai SDK to analyze relevance."""
    
    prompt = f"""
    You are an expert grant consultant.
    
    MY MISSION: "{mission}"
    GRANT DATA: "{grant_text[:15000]}"

    PRECONDITIONS:
    1. You will only analyse grants which are specific to eldercare in singapore for local seniors in Singapore.
    2. The grant cannot be closed.

    TASK:
    1. Is this grant RELEVANT? (Keywords: Ageing, Eldercare, Community Care, Manpower, Organisational Excellence). 
    2. Extract details into JSON.

    OUTPUT SCHEMA (JSON):
    {{
        "is_relevant": true,
        "reasoning": "string",
        "grant_name": "string",
        "issue_area": "string",
        "scope": "string",
        "kpis": "string",
        "funding_quantum": "string",
        "due_date": "string"
    }}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-3-pro-preview',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        # 1. Clean the response (sometimes AI adds markdown blocks)
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            # Remove first line (```json) and last line (```)
            lines = raw_text.splitlines()
            if len(lines) >= 2:
                raw_text = "\n".join(lines[1:-1])

        # 2. Parse JSON
        data = json.loads(raw_text)
        
        # 3. FIX: Handle List vs Dictionary
        if isinstance(data, list):
            return data[0] if data else None
            
        return data
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return None

def main():
    links, driver = get_all_grant_links()
    
    if not links:
        print(">>> No links found. The site structure might have changed slightly.")
        if driver: driver.quit()
        return

    relevant_grants = []
    
    print(f">>> 2. Analyzing {len(links)} grants with Gemini...")
    
    try:
        for i, link in enumerate(links):
            print(f"[{i+1}/{len(links)}] Analyzing...", end="\r")
            
            page_text = scrape_page_text(driver, link)
            if not page_text: continue
            
            analysis = analyze_with_gemini(page_text, ORGANISATION_MISSION)
            
            if analysis and analysis.get("is_relevant"):
                print(f"\n   [MATCH] {analysis.get('grant_name')}")
                relevant_grants.append({
                    "Grant Name": analysis.get("grant_name"),
                    "URL": link,
                    "Issue Area": analysis.get("issue_area"),
                    "Scope": analysis.get("scope"),
                    "KPIs": analysis.get("kpis"),
                    "Funding": analysis.get("funding_quantum"),
                    "Due Date": analysis.get("due_date"),
                    "Reasoning": analysis.get("reasoning")
                })
            
            time.sleep(2) # Respect rate limits

    finally:
        if driver:
            driver.quit()

    if relevant_grants:
        df = pd.DataFrame(relevant_grants)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"Gemini_Grant_Report_{timestamp}.xlsx"
        df.to_excel(filename, index=False)
        print(f"\n\n>>> SUCCESS! Found {len(relevant_grants)} grants. Saved to '{filename}'.")
    else:
        print("\n>>> Done. No relevant grants found.")

if __name__ == "__main__":
    main()