import fitz
import os



def extractPDFText(filename):

    document = fitz.open(filename)
    text = ""

    for page_num in range(len(document)):
        page = document.load_page(page_num)
        page_text = page.get_text()
        text += page_text

    return text 