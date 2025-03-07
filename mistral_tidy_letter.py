import sys
import json
from gpt4all import GPT4All

def main():
    if len(sys.argv) != 2:
        print("Error: JSON input required.", file=sys.stderr)
        sys.exit(1)

    try:
        # Parse JSON input from Node.js
        data = json.loads(sys.argv[1])
        letter = data.get("letter", "").strip()
        name = data.get("name", "").strip()
        address = data.get("address", "").strip()
        email = data.get("email", "").strip()

        if not letter:
            print("Error: Missing required letter field.", file=sys.stderr)
            sys.exit(1)

        # Path to the locally downloaded Mistral model
        model_path = "/Users/toshiakisuzuki/Library/Application Support/nomic.ai/GPT4All/mistral-7b-instruct-v0.1.Q4_0.gguf"
        model = GPT4All(model_path)

        # Prompt for Mistral to tidy the letter, preserving user details as placeholders
        prompt = (
            f"Improve the following letter to be formal, concise, and professional. "
            f"If it is a local MP issue, format the letter to concern the addressee directly as the local MP. "
            f"Do not include address details in letter body"
            f"Ensure placeholder name, address, postcode, and email are included at the end of the letter"
            f"Preserve placeholders like [Your Name], [Your Address], and [Your Email] for later replacement, and keep all key details intact.\n\n"
            f"---\n{letter}\n---\n\n"
            "Tidied Letter:"
        )

        # Generate tidied letter with error handling
        try:
            response = model.generate(prompt, max_tokens=500).strip()
            if not response:
                raise ValueError("Model generated no response.")
        except Exception as e:
            print(f"Error generating response: {e}", file=sys.stderr)
            # Fallback: Use the original letter with user details appended
            response = letter

        # Replace placeholders with actual user details
        tidied_text = response.replace("[Your Name]", name).replace("[Your Address]", address).replace("[Your Email]", email)

        # Output in the required format for app/api/tidyLetter/route.ts
        print(f"===BEGIN==={tidied_text}===END===")

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()