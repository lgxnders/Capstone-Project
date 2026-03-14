# def generate_response(message: str) -> str:
#     # placeholder logic
#     if "hello" in message.lower():
#         return "Hello. How can I help you?"
#     return "I am not sure how to respond to that yet."


import boto3
import json
from django.conf import settings

def generate_response(message: str, context_resources=None) -> str:
    # 1. Initialize AWS Bedrock Client
    client = boto3.client(
        'bedrock-runtime',
        region_name='us-east-1', # or your specific region
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
    )

    # 2. Construct the Prompt
    # We feed the "context_resources" (database results) into the prompt 
    # so the AI knows what resources to recommend.
    context_str = ""
    if context_resources:
        context_str = "Here are some verified resources you can recommend:\n"
        for res in context_resources:
            context_str += f"- {res.title}: {res.description} (Urgency: {res.urgency_level})\n"

    prompt = f"""
    You are a helpful mental health assistant called Care Compass. 
    User: {message}
    {context_str}
    
    Provide a supportive response. If resources are listed above, recommend the most relevant one.
    """

    # 3. Call the Model (e.g., Titan or Claude)
    # Note: The body format changes slightly depending on the model you use.
    body = json.dumps({
        "inputText": prompt,
        "textGenerationConfig": {
            "maxTokenCount": 512,
            "temperature": 0.7,
        }
    })

    try:
        response = client.invoke_model(
            modelId='amazon.titan-text-express-v1', # Example model ID
            contentType='application/json',
            accept='application/json',
            body=body
        )
        response_body = json.loads(response['body'].read())
        return response_body['results'][0]['outputText']
    except Exception as e:
        return f"Error connecting to AI: {str(e)}"