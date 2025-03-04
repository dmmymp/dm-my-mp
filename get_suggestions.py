import sys
from gpt4all import GPT4All

def main(issue, constituency):
    # Path to the locally downloaded Mistral model
    model_path = "/Users/toshiakisuzuki/Library/Application Support/nomic.ai/GPT4All/mistral-7b-instruct-v0.1.Q4_0.gguf"  # Update if needed
    model = GPT4All(model_path)

    # Conditional prompt: If the issue is "MP Conduct," address the MP directly
    if issue.startswith("MP Conduct"):
        prompt = (
            f"Give one very short and simple description of a problem from the local MP's behaviour or conduct, and practical solution "
            f"related to MP conduct in the {constituency} constituency. "
            "Address the MP directly using phrases like 'you, as their MP' instead of third-person references. "
            "Assume limited funds available."
            "Reasonable suggested solutions only."
            
            "Use clear words, keep it to one sentence each, and make it relevant to local issues."
        )
    else:
        # General prompt for other issues
        prompt = (
            f"Give a very short and simple description of a problem and practical solution "
            f"in the {constituency} constituency related to {issue}. "
            "Assume limited funding available for the solution."
            "Keep it to one sentence each."
            "and ensure compliance with UK laws (e.g., Public Order Act 1986, Online Safety Act 2023). "
            "Use clear words, and make it relevant to local issues."
        )

    # Generate suggestions from the model
    response = model.generate(prompt, max_tokens=100).strip()

    # Parse the response into problem and solution
    if "Solution:" in response:
        problem, solution = response.split("Solution:", 1)
        problem = problem.replace("Problem:", "").strip()
        solution = solution.strip()
    else:
        problem = response.strip()
        solution = "No solution provided."

    # Output for API route to capture
    print(f"{problem}\nSolution: {solution}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        issue = sys.argv[1]
        constituency = sys.argv[2]
        main(issue, constituency)
    else:
        print("Error: Issue and constituency are required.")
