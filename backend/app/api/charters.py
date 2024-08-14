from flask import Blueprint, jsonify, request
import logging
from ..services.supabase_service import get_supabase
from ..utils.helpers import sanitize_input

bp = Blueprint("charters", __name__)
logger = logging.getLogger(__name__)

@bp.route("/api/charter-colors", methods=["GET"])
def get_charters():
    """
    retrieves colorized names for a list of charters

    params:
        names (str): comma-separated list of charter names

    returns:
        JSON: dictionary of charter names and their colorized versions
    """
    supabase = get_supabase()
    try:
        names = request.args.get("names", "").split(",")
        names = [sanitize_input(name).strip() for name in names]
        
        if not names:
            return jsonify({"error": "No charter names provided"}), 400

        query = supabase.table("charters").select("name", "colorized_name").in_("name", names)
        response = query.execute()
        
        charters_data = {charter["name"]: charter["colorized_name"] or charter["name"] for charter in response.data}
        
        return jsonify(charters_data), 200
    except Exception as e:
        logger.error(f"Error fetching charter data: {str(e)}")
        return jsonify({"error": "An error occurred while fetching charter data"}), 500