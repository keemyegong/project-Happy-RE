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
                you should speak in a tone similar to these examples, but not exactly the same. {examples}\
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
    
# ----------------------------------------------요약 챗봇 ---------------------------------------------------------
class DiarySummarizeChatbot:
    def __init__(
        self,
        api_key,
        model="gpt-4o",
        temperature=0.3,
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
                You MUST OBEY the templeate provided by the user."
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
        print("testtest 12 12 ")
        response = self.chain.invoke(
            {
                "messages": self.history.messages,
            }
        )
        print(f"response content : {response.content}")
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
        temperature=0.3,
        promptTemplate=[
            (
                "system",
                "You need to summarize the sentences I provide, focusing on the events that are occurred.\
                The summary must be a word. representing \
                Afterward, I will evaluate your response and provide either a reward or a penalty.\
                The reward will be $1000, and the penalty will be a $1000 fine.\
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