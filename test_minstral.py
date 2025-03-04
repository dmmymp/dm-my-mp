from gpt4all import GPT4All

def main():
    model_path = "/Users/toshiakisuzuki/Library/Application Support/nomic.ai/GPT4All/mistral-7b-instruct-v0.1.Q4_0.gguf"
    model = GPT4All(model_path)

    prompt = "Rewrite this sentence in a formal letter style: I am concerned about local healthcare services."
    response = model.generate(prompt, max_tokens=100, temp=0.3).strip()

    if response:
        print("✅ Model Response:")
        print(response)
    else:
        print("❌ No response generated.")

if __name__ == "__main__":
    main()
