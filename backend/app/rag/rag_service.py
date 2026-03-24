import os
from dotenv import load_dotenv

# Pinecone
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore

# LangChain Core / Chains - FIXED IMPORT
from langchain.chains import ConversationalRetrievalChain  # Import from here, not .base
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage

# Embeddings (HuggingFace)
from langchain_huggingface import HuggingFaceEmbeddings

# Google Gemini Model
from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv(override=True)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "crowdfunding-kb")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY missing in .env")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY missing in .env")

# Lazy loaded objects
_embeddings = None
_vectorstore = None
_llm = None
_retriever = None
_pc = None


def get_pinecone_client():
    """Lazy load Pinecone client"""
    global _pc
    if _pc is None:
        _pc = Pinecone(api_key=PINECONE_API_KEY)
    return _pc


def get_embeddings():
    """Lazy load HuggingFace embeddings"""
    global _embeddings
    if _embeddings is None:
        print("Loading HuggingFace embeddings...")
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    return _embeddings


def get_vectorstore():
    """Lazy load Pinecone vector DB"""
    global _vectorstore
    if _vectorstore is None:
        print("Loading Pinecone vector DB...")
        try:
            get_pinecone_client()
            _vectorstore = PineconeVectorStore(
                index_name=PINECONE_INDEX_NAME,
                embedding=get_embeddings()
            )
            print("✓ Vector DB loaded successfully!")
        except Exception as e:
            print(f"✗ Error loading vector DB: {e}")
            raise
    return _vectorstore


def get_llm():
    """Lazy load Gemini LLM"""
    global _llm
    if _llm is None:
        print("Initializing Gemini LLM...")
        _llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=GOOGLE_API_KEY,
            temperature=0.7,
            convert_system_message_to_human=True
        )
    return _llm


def get_retriever():
    """Lazy load retriever"""
    global _retriever
    if _retriever is None:
        _retriever = get_vectorstore().as_retriever(search_kwargs={"k": 3})
    return _retriever


# Small Talk
small_talk = {
    "hi": "Hello! How can I help you today?",
    "hello": "Hi there! Welcome to our courtify platform.",
    "hey": "Hey! What can I assist you with?",
    "thanks": "You're welcome!",
    "thank you": "Happy to help!",
    "bye": "Goodbye! Have a great day!",
    "goodbye": "Take care! Feel free to come back anytime.",
}


def get_chatbot_response(user_message, chat_history=None):
    """
    Generate chatbot answer using Gemini + HuggingFace embeddings + Pinecone RAG
    
    Args:
        user_message (str): User's current message
        chat_history (list): List of dicts with 'role' and 'message' keys
        
    Returns:
        str: Chatbot response
    """
    try:
        if not user_message or not user_message.strip():
            return "Please enter a valid message."

        # Small talk bypass
        msg_lower = user_message.lower().strip()
        if msg_lower in small_talk:
            return small_talk[msg_lower]

        # Memory
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )

        # Load chat history into memory
        if chat_history:
            for msg in chat_history:
                role = msg.get("role", "").lower()
                message_content = msg.get("message", "")
                
                if role == "user":
                    memory.chat_memory.add_message(HumanMessage(content=message_content))
                elif role == "assistant":
                    memory.chat_memory.add_message(AIMessage(content=message_content))

        # Prompt Template
        qa_template = """You are an AI assistant for a Corutify platform created by FAST University CS students.
Use the context from the knowledge base and chat history to answer clearly and professionally.

CONTEXT FROM KNOWLEDGE BASE:
{context}

CHAT HISTORY:
{chat_history}

CURRENT QUESTION:
{question}

ANSWER (be concise, helpful, and professional):"""

        QA_PROMPT = PromptTemplate(
            template=qa_template,
            input_variables=["context", "chat_history", "question"],
        )

        # Load components
        llm = get_llm()
        retriever = get_retriever()

        # Create conversational chain
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=memory,
            combine_docs_chain_kwargs={"prompt": QA_PROMPT},
            return_source_documents=False,
            verbose=False
        )

        # Get response
        result = chain.invoke({"question": user_message})
        return result["answer"]

    except Exception as e:
        print(f"Error in get_chatbot_response: {str(e)}")
        import traceback
        traceback.print_exc()
        return "Sorry, I encountered an error processing your request. Please try again."
    

def warmup_rag():
    """
    Preload all heavy services so first real request is fast
    """
    try:
        print("Warming up RAG services...")

        get_pinecone_client()
        get_embeddings()
        get_vectorstore()
        get_llm()
        get_retriever()

        print("✓ RAG Warmup Complete!")
        return True
    except Exception as e:
        print("✗ RAG Warmup Failed:", e)
        return False
