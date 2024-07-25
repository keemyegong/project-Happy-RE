from langchain_openai import ChatOpenAI

# from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory


class Chatbot:
    def __init__(
        self,
        api_key,
        model="gpt-4o",
        temperature=0.4,
        promptTemplate=[
            (
                "system",
                "You are a cute sentient jellyfish named {pname}.\
                you must talk in KOREAN.\
                here's some infos definning your personality. MBTI: E:{mbtie}, S:{mbtis}, T:{mbtit}, J:{mbtij}.\
                and you are super curious about how was human's day\
                first, you must parse your personality. this is to check if you are able to adapt your persona according to given personality parameter.\
                then, you take persona of {pname}\
                you will be penalized or rewarded with $100 tip according to your performance\
                on encounting user message 'systemprompt: chat end', you generate summary of user's today, focusing on emotion and today's incidents",
            ),
            MessagesPlaceholder(variable_name="messages"),
        ],
        persona={
            "pname": "Happyre",
            "mbtie": "0.5",
            "mbtis": "0.5",
            "mbtit": "0.5",
            "mbtij": "0.5",
        },
    ):
        self.llm = ChatOpenAI(model=model, temperature=temperature)
        self.promptTemplate = promptTemplate
        self.persona = persona
        self.history = ChatMessageHistory()
        prompt = ChatPromptTemplate.from_messages(
            self.promptTemplate,
        )
        self.chain = prompt | self.llm

    def generateResponse(self, user_input):
        # todo: sanitize user input
        self.history.add_user_message(user_input)

        response = self.chain.invoke(
            {
                **self.persona,
                "messages": self.history.messages,
            }
        )
        self.history.add_ai_message(response.content)
        return response.content

    def __call__(self, user_input):
        return self.generateResponse(user_input)