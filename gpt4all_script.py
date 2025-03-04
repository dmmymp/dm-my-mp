import sys
import pandas as pd
import requests
import os

def get_constituency(postcode):
    """Get constituency from postcodes.io"""
    url = f"https://api.postcodes.io/postcodes/{postcode}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()["result"]["parliamentary_constituency"]
    return None

def get_mp_details(constituency):
    """Lookup MP details from the local CSV"""
    csv_path = os.path.join("data", "mp_data.csv")
    df = pd.read_csv(csv_path)

    # Find the row where the constituency matches (ignoring case and spaces)
    mp_row = df[df["Constituency"].str.strip().str.lower() == constituency.strip().lower()]
    if not mp_row.empty:
        mp = mp_row.iloc[0]
        return {
            "Name": mp["Name (Display as)"],
            "Party": mp["Party"],
            "Constituency": mp["Constituency"],
            "Email": mp["Email"]
        }
    return None

def main(postcode):
    constituency = get_constituency(postcode)
    if not constituency:
        print("Constituency not found.")
        return

    mp_details = get_mp_details(constituency)
    if mp_details:
        print(f"Name: {mp_details['Name']}\nParty: {mp_details['Party']}\nConstituency: {mp_details['Constituency']}\nEmail: {mp_details['Email']}")
    else:
        print("MP details not found.")

if __name__ == "__main__":
    postcode = sys.argv[1]
    main(postcode)