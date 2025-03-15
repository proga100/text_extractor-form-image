# Image to Text Extractor

A web application that extracts text from images using OCR (Optical Character Recognition).

## Features

- Upload images in various formats (PNG, JPG, JPEG, BMP)
- Extract text from images using Tesseract OCR
- Copy extracted text to clipboard
- Responsive design for desktop and mobile devices

## Prerequisites

- Python 3.7+
- Tesseract OCR engine

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd image-to-text-extractor
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Install Tesseract OCR:
   - **Windows**: Download and install from [https://github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki)
   - **macOS**: `brew install tesseract`
   - **Linux**: `sudo apt install tesseract-ocr`

4. Update the `TESSERACT_PATH` in `app.py` if necessary.

## Usage

1. Start the application:
   ```
   python app.py
   ```

2. Open your web browser and navigate to `http://localhost:5000`

3. Upload an image and click "Extract Text"

## License

MIT 