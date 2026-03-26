import requests
from bs4 import BeautifulSoup

url = "https://landrecords.karnataka.gov.in/service53/About?dist_code=17&taluk_code=3&hobli_code=2&village_code=18&surveyno=2&surnoc=*&hissa=*&lang=en_in"
r = requests.get(url, timeout=15)
soup = BeautifulSoup(r.text, "html.parser")

print(f"Status: {r.status_code}")
print(f"Content Length: {len(r.text)}")

selects = soup.find_all("select")
print(f"Found {len(selects)} selects")
for s in selects:
    print(f"  ID: {s.get('id')} -> {len(s.find_all('option'))} options")

if len(selects) == 0:
    print("\nNo selects found. First 500 chars of body:")
    print(r.text[:500])
