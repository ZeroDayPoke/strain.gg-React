#!/usr/bin/env python3
"""Data Extraction Module"""

import pytesseract
from PIL import Image
from pdf2image import convert_from_path

def extract_pdf_text(file_path):
    # Convert PDF pages to images
    images = convert_from_path(file_path)

    # Extract text from each image using OCR
    text = ""
    for image in images:
        image_text = pytesseract.image_to_string(image)
        text += image_text + "\n"

    return text

def extract_terpene_data(text):
    lines = text.split('\n')
    terpene_data = {}

    # Indicators to help control the data extraction process
    terpene_section_started = False
    terpene_section_ended = False

    for line in lines:
        # If we found the start of the terpene section, we set the flag
        if "Terpenes: HT-SOP-17 (GCMS)" in line:
            print("Beginning UWU terpene extraction... Please stand by...")
            terpene_section_started = True

        # If we found the end of the terpene section, we set the flag
        if "Total Terpenes" in line:
            print("Terpene extraction complete! Processing data...")
            terpene_section_ended = True

        # While we are in the terpene section, we extract the data
        if terpene_section_started and not terpene_section_ended:
            words = line.split()
            if len(words) >= 1:  # Must at least have the terpene name
                terpene_name = words[0]
                terpene_result = words[1]
                terpene_data[terpene_name] = terpene_result

    return terpene_data

if __name__ == '__main__':
    pdf_file_path = 'SAMPLE_STRAIN_PDF.pdf'

    # Convert the PDF into searchable text using OCR
    images = convert_from_path(pdf_file_path)
    image_texts = []
    for image in images:
        image_text = pytesseract.image_to_string(image)
        image_texts.append(image_text)

    # Concatenate the image texts into a single text
    text = '\n'.join(image_texts)

    terpene_data = extract_terpene_data(text)
    print('\nTerpene data:')
    for terpene, data in terpene_data.items():
        print(f"{terpene}: {data}")
