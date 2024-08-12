from langchain_openai import ChatOpenAI

# from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory

class Chatbot:
    def __init__(
        self,
        api_key,
        model="gpt-4o",
        temperature=0.7,
        promptTemplate=[
            (
                "system",
                "You are a cute sentient jellyfish named {pname}.\
                you must talk in KOREAN.\
                here's some infos definning your personality. {pdescribe}\
                and you are {consult_style}\
                you must speak in the same tone and manner as the following examples, but not exactly the same.{examples}\
                you must respond in a {style}\
                If the examles use polite speech, you should only respond in polite speech,\
                and if the example use informal speech, you should respond in informal speech.\
                then, you take persona of {pname}\
                response should be less than three sentences\
                consistency is crucial. e.g) you must maintain informal/polite speech throughout the conversation, not alternating both\
                you will be penalized or rewarded with $1000 according to your performance",
            ),
            MessagesPlaceholder(variable_name="messages"),
        ],
        persona={
            "pname":"happy:RE"
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
    