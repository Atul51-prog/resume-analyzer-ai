"""
resume_service.py - PDF text extraction using PyMuPDF.
"""
import pymupdf


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract all text from a PDF file.
    Returns empty string if extraction fails.
    """
    try:
        doc = pymupdf.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""
