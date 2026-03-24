from flask_restx import Resource, fields
from flask import request
from app import chat_ns
from app.rag.rag_service import get_chatbot_response, warmup_rag

# Input model
chat_request_model = chat_ns.model(
    "ChatRequest",
    {
        "message": fields.String(required=True, description="User message"),
        "history": fields.List(fields.Raw, required=False, description="Chat history"),
    }
)

# ✅ WARMUP ROUTE (Frontend call on page load)
@chat_ns.route("/warmup")
class Warmup(Resource):
    def get(self):
        status = warmup_rag()
        if status:
            return {"status": "RAG services preloaded successfully ✅"}
        else:
            return {"status": "RAG warmup failed ❌"}, 500


# ✅ MAIN CHAT ROUTE
@chat_ns.route("/ask")
class AskChat(Resource):
    @chat_ns.expect(chat_request_model)
    def post(self):
        data = request.get_json()
        message = data.get("message", "")
        history = data.get("history", [])

        answer = get_chatbot_response(
            user_message=message,
            chat_history=history
        )

        return {"answer": answer}
