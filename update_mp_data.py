import requests
import os

# 📥 URL to download the latest MP data CSV
csv_url = "https://www.parliament.uk/globalassets/documents/transparency/contact-information-for-mps/17.02.csv"  # Replace with the actual URL

# 📂 Where to save the CSV in your project
save_path = os.path.join("data", "mp_data.csv")

try:
    print("Downloading MP data...")

    # 🌐 Download the CSV from the internet
    response = requests.get(csv_url)
    response.raise_for_status()  # Check for any download errors

    # 💾 Save the CSV file to your project
    with open(save_path, 'wb') as file:
        file.write(response.content)

    print("✅ MP data updated successfully!")

except requests.exceptions.RequestException as e:
    print(f"❌ Error downloading the file: {e}")
