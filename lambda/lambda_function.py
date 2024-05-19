import json
import os
from openai import OpenAI

is_local = True


def lambda_handler(event, context):

    argsBdgNm = event["argsBdgNm"]

    MODEL = "gpt-4o"
    api_key = os.environ["OPENAI_API_KEY"]
    client = OpenAI(api_key=api_key)

    questions = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"{argsBdgNm}とはなにか一言で説明してください",
                },
            ],
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"{argsBdgNm}のルールについて250字程度で教えてください。必要があれば、順序の番号や改行を含めて回答して。",
                },
            ],
        },
    ]

    role = [
        {
            "role": "system",
            "content": "あなたは世界中のボードゲームに詳しい専門家です。私の質問に答えてください！",
        },
    ]

    responses = []
    try:
        for question in questions:
            response = client.chat.completions.create(
                model=MODEL,
                messages=[role[0], question],
                temperature=0.0,
            )
            responses.append(response.choices[0].message.content)
    except Exception as e:
        return {"statusCode": 500, "body": str(e)}
    return {"statusCode": 200, "body": responses}


if is_local:
    from dotenv import load_dotenv

    load_dotenv()

    result = lambda_handler({"argsBdgNm": "カタン"}, None)
    result = result["body"]
    print(type(result))
    print(f"数：{len(result)}")
    print(result)
