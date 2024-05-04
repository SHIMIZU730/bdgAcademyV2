import json
import os
from openai import OpenAI


def lambda_handler(event, context):

    # Prompt
    argsBdgNm = event["argsBdgNm"]
    prompt = (
        "以下のボードゲームについて250字程度で概要とおもしろい点を教えてください。"
        + argsBdgNm
    )

    client = OpenAI(
        api_key=os.environ["OPENAI_API_KEY"],
    )

    # Exec ChatGPT
    response = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        model="gpt-3.5-turbo",
    )
    return {"statusCode": 200, "body": response.choices[0].message.content}
