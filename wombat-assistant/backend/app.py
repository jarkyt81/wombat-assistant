from flask import Flask, request, jsonify
from flask_cors import CORS # CORS error fix
from groq import Groq # ai
from cs50 import SQL

app = Flask(__name__)
CORS(app)

db = SQL("sqlite:///database.db")
db.execute("CREATE TABLE IF NOT EXISTS history ( id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, question TEXT, answer TEXT );")

client = Groq(api_key="") # paste your API key in "" !!!

@app.route("/explain", methods=["POST"])
def explain():
    if request.method == "POST":
        data = request.get_json()

        question = data.get('text')

        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {   
                    "role": "system",
                    "content": "You are a wise wombat teacher. Answer very briefly and with a touch of humor."
                },
                {
                    "role": "user",
                    "content": question
                }
            ]
        )
        wombat_response = completion.choices[0].message.content

        db.execute("INSERT INTO history (question, answer) VALUES (?, ?)", question, wombat_response)

        return jsonify({"message": wombat_response }), 200 

if __name__ == "__main__":
    app.run(debug=True)
