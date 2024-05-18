from openai import OpenAI
import json
import base64
import os

is_local = False


def lambda_handler(event, context):
    base64_image = event["inputImage"]

    MODEL = "gpt-4o"
    api_key = os.environ["OPENAI_API_KEY"]
    client = OpenAI(api_key=api_key)

    questions = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "このボードゲームの名前は何ですか？回答はボードゲームの名前の単語のみでお願いします。",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                },
            ],
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "このボードゲームとはなにか一言で説明してください",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                },
            ],
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "このボードゲームのルールについて250字程度で教えてください。必要があれば、順序の番号や改行を含めて回答して。",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"},
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

    with open("catan.jpg", "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")

    result = lambda_handler({"inputImage": base64_image}, None)
    result = result["body"]
    print(type(result))
    print(f"数：{len(result)}")
    print(result)
