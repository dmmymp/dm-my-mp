import subprocess

letter = "Dear MP, I am concerned about local healthcare services."
name = "John Doe"
address = "123 High Street, Norwich"
email = "john.doe@example.com"

process = subprocess.Popen(
    ["python3", "mistral_tidy_letter.py", letter, name, address, email],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)

stdout, stderr = process.communicate()

print("STDOUT:", stdout.decode())
print("STDERR:", stderr.decode())
