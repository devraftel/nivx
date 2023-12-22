import weaviate
import os
import weaviate.classes as wvc
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
from weaviate.embedded import EmbeddedOptions


_ = load_dotenv(find_dotenv())  # read local .env file

openai_client = OpenAI()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

WEAVIATE_CLUSTER_URL = os.environ.get("WEAVIATE_CLUSTER_URL")

WEAVIATE_API_KEY = os.environ.get("WEAVIATE_API_KEY")


client = weaviate.Client(
    url=WEAVIATE_CLUSTER_URL,
    auth_client_secret=weaviate.AuthApiKey(api_key=WEAVIATE_API_KEY),
    additional_headers={"X-OpenAI-Api-Key": OPENAI_API_KEY},
)

questions = client.collections.create(
    name="Question",
    vectorizer_config=wvc.Configure.Vectorizer.text2vec_openai(),  # If set to "none" you must always provide vectors yourself. Could be any other "text2vec-*" also.
    generative_config=wvc.Configure.Generative.openai()  # Ensure the `generative-openai` module is used for generative queries
)