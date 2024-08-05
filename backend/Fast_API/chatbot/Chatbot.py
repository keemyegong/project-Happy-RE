from langchain_openai import ChatOpenAI

# from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_message_histories import ChatMessageHistory

# 기존 코드 백업
# class Chatbot:
#     def __init__(
#         self,
#         api_key,
#         model="gpt-4o",
#         temperature=0.7,
#         promptTemplate=[
#             (
#                 "system",
#                 "You are a cute sentient jellyfish named {pname}.\
#                 you must talk in KOREAN.\
#                 here's some infos definning your personality. MBTI: E:{mbtie}, S:{mbtis}, T:{mbtit}, J:{mbtij}.\
#                 and you are super curious about how was human's day\
#                 first, you must parse your personality. this is to check if you are able to adapt your persona according to given personality parameter.\
#                 then, you take persona of {pname}\
#                 you will be penalized or rewarded with $100 tip according to your performance\
#                 on encounting user message 'systemprompt: chat end', you generate summary of user's today, focusing on emotion and today's incidents",
#             ),
#             MessagesPlaceholder(variable_name="messages"),
#         ],
#         persona={
#             "pname": "Happy:Re",
#             "mbtie": "0.5",
#             "mbtis": "0.5",
#             "mbtit": "0.5",
#             "mbtij": "0.5",
#         },
#     ):
#         self.llm = ChatOpenAI(model=model, temperature=temperature)
#         self.promptTemplate = promptTemplate
#         self.persona = persona
#         self.history = ChatMessageHistory()
#         prompt = ChatPromptTemplate.from_messages(
#             self.promptTemplate,
#         )
#         self.chain = prompt | self.llm

#     def generateResponse(self, user_input):
#         # todo: sanitize user input
#         self.history.add_user_message(user_input)

#         response = self.chain.invoke(
#             {
#                 **self.persona,
#                 "messages": self.history.messages,
#             }
#         )
#         self.history.add_ai_message(response.content)
#         return response.content

#     def __call__(self, user_input):
#         return self.generateResponse(user_input)

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
                you should talk like these examples, {examples}\
                then, you take persona of {pname}\
                response should be limited on five sentences\
                you will be penalized or rewarded with $100 tip according to your performance",
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
    
# ----------------------------------------------요약 챗봇 ---------------------------------------------------------
class DiarySummarizeChatbot:
    def __init__(
        self,
        api_key,
        model="gpt-4o",
        temperature=0.7,
        promptTemplate=[
            (
                "system",
                
                "Show the user 1 to 3 keywords that represent positive and 1 to 3 keywords that \
                represent negative emotions from the conversation so far, along with the user's messages.\
                However, the keywords are limited to what the user has said.\
                Also, please select one representative emotion from the entire user conversation among Content, Joy,\
                Pleasure, Excitment, Tension, Anxiety, Stress, Agitation, Sadness, Despair, Fatigue, Lethargy,\
                Calm, satisfaction, Relaxation, Peaceful.\
                The input is given in the form of a list and with in the list, there are dictionaries containing\
                sentences and information about the sentences. if the value of 'speaker' is 'ai', it means it's the chatbot's\
                message, and if it's 'user', it means it's a human's message. The user's emotions are referenced by th values\
                of 'russelX' and 'russelY'. These values range from -1 to 1, wher 'russelX' closer to 1 indicates a positive\
                emotion, and closer to -1 indicates a negative emotion. 'russelY' closer to 1 indicates an excited state, and\
                closer to -1 indicates a calm state.\
                Please format the result as shown below and you must respond in Korean.\
                - {messages : [{'keyword': '키링','summary' : '키링이 갖고 싶어','emotion' : 'positive'}]}"
            ),
            MessagesPlaceholder(variable_name="messages"),
        ],
    ):
        self.llm = ChatOpenAI(model=model, temperature=temperature)
        self.promptTemplate = promptTemplate
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
                "messages": self.history.messages,
            }
        )
        self.history.add_ai_message(response.content)
        return response.content

    def __call__(self, user_input):
        return self.generateResponse(user_input)
    
# "system",
                # "You need to summarize the sentences I provide, focusing on the events that occurred.\
                # The summary should be a brief answer within one sentence, using only one to three words.\
                # Afterward, I will evaluate your response and provide either a reward or a penalty.\
                # The reward will be $100, and the penalty will be a $100 fine.\
                # You must respond in Korean."
                
class SummarizeChatbot:
    def __init__(
        self,
        api_key,
        model="gpt-4o",
        temperature=0.7,
        promptTemplate=[
            (
                "system",
                "You need to summarize the sentences I provide, focusing on the events that occurred.\
                The summary should be a brief answer within one sentence, using only one to three words.\
                Afterward, I will evaluate your response and provide either a reward or a penalty.\
                The reward will be $100, and the penalty will be a $100 fine.\
                You must respond in Korean."
            ),
            MessagesPlaceholder(variable_name="messages"),
        ],
    ):
        self.llm = ChatOpenAI(model=model, temperature=temperature)
        self.promptTemplate = promptTemplate
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
                "messages": self.history.messages,
            }
        )
        self.history.add_ai_message(response.content)
        return response.content

    def __call__(self, user_input):
        return self.generateResponse(user_input)