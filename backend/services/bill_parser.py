
import csv
import io
import os
import re
from datetime import datetime

import numpy as np
from PIL import Image, ImageOps, ImageEnhance
from pypdf import PdfReader

try:
    import pytesseract

    tesseract_path = os.environ.get(
        "TESSERACT_CMD",
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

    if os.path.isfile(tesseract_path):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path

except ImportError:
    pytesseract = None


MARATHI_MONTHS = {
    "जानेवारी": "January",
    "फेब्रुवारी": "February",
    "मार्च": "March",
    "एप्रिल": "April",
    "मे": "May",
    "जून": "June",
    "जुलै": "July",
    "ऑगस्ट": "August",
    "सप्टेंबर": "September",
    "ऑक्टोबर": "October",
    "नोव्हेंबर": "November",
    "डिसेंबर": "December",
}


def _normalize_month(value):
    if not value:
        return None

    value = value.strip()

    for marathi, english in MARATHI_MONTHS.items():
        value = value.replace(marathi, english)

    value = re.sub(r"\s+", " ", value)
    value = value.replace("_", "-").strip(" :-")

    formats = (
        "%Y-%m", "%Y/%m", "%m/%Y", "%m-%Y",
        "%b %Y", "%B %Y", "%b-%Y", "%B-%Y",
        "%d/%m/%Y", "%d-%m-%Y",
        "%B %d, %Y", "%b %d, %Y",
    )

    for fmt in formats:
        try:
            return datetime.strptime(value, fmt).strftime("%Y-%m")
        except ValueError:
            pass

    match = re.search(
        r"\b(January|February|March|April|May|June|July|August|"
        r"September|October|November|December|Jan|Feb|Mar|Apr|"
        r"Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s/-]+(20\d{2})\b",
        value,
        re.IGNORECASE
    )

    if match:
        try:
            parsed = datetime.strptime(
                match.group(1)[:3].title() + " " + match.group(2),
                "%b %Y"
            )
            return parsed.strftime("%Y-%m")
        except ValueError:
            pass

    match = re.search(r"\b(20\d{2})[-/](0?[1-9]|1[0-2])\b", value)

    if match:
        return f"{match.group(1)}-{int(match.group(2)):02d}"

    return None


def _normalize_date(value):
    if not value:
        return None

    value = value.strip()

    for fmt in (
        "%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%d.%m.%Y"
    ):
        try:
            return datetime.strptime(value, fmt).strftime("%Y-%m-%d")
        except ValueError:
            pass

    return None


def _number_after(text, patterns):
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            raw = match.group(1).replace(",", "").strip()

            try:
                return float(raw)
            except ValueError:
                continue

    return None


def _parse_text(text):
    text = text.replace("\r", "\n").replace("₹", " Rs. ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"(?<=\d)[Oo](?=\d)", "0", text)

    normalized = text

    for marathi, english in MARATHI_MONTHS.items():
        normalized = normalized.replace(marathi, english)

    month = None

    month_patterns = [
        r"(?:BILL OF SUPPLY FOR THE MONTH OF|"
        r"bill\s*month|billing\s*month|billing\s*period|"
        r"bill\s*period)\s*[-: ]*\s*"
        r"([A-Za-z]{3,12}[\s/-]*20\d{2})",

        r"\b(January|February|March|April|May|June|July|August|"
        r"September|October|November|December|Jan|Feb|Mar|Apr|"
        r"Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s/-]+(20\d{2})\b",
    ]

    for pattern in month_patterns:
        match = re.search(pattern, normalized, re.IGNORECASE)

        if match:
            candidate = (
                match.group(1)
                if len(match.groups()) == 1
                else match.group(1) + " " + match.group(2)
            )

            month = _normalize_month(candidate)

            if month:
                break

    if not month:
        for marathi in MARATHI_MONTHS:
            match = re.search(
                re.escape(marathi) + r"\s*[-/ ]\s*(20\d{2})",
                text
            )

            if match:
                month = _normalize_month(match.group(0))
                break

    units_patterns = [
        r"(?:units?\s*consumed|energy\s*consumed|"
        r"total\s*units|unit\s*consumption|"
        r"एकूण\s*वापर|वीज\s*वापर|एकूण\s*युनिट्स?)"
        r"\s*[:=\-]?\s*([\d,]+(?:\.\d+)?)",

        r"\b([\d,]+(?:\.\d+)?)\s*kwh\b",
        r"\b([\d,]+(?:\.\d+)?)\s*units?\b",
    ]

    units = _number_after(text, units_patterns)

    amount_patterns = [
        r"(?:amount payable|current bill amount|"
        r"total amount payable|net amount|amount due|"
        r"bill amount|bill total|payable amount|"
        r"देय रक्कम|बिलाची रक्कम|एकूण देय रक्कम)"
        r"[^\d\n]{0,50}(?:Rs\.?|INR)?\s*"
        r"([\d,]+(?:\.\d{1,2})?)",

        r"(?:Rs\.?|INR)\s*([\d,]+\.\d{1,2})",
    ]

    amount = _number_after(text, amount_patterns)

    due_date_text = None

    date_match = re.search(
        r"(?:due\s*date|pay\s*by|last\s*date\s*of\s*payment|"
        r"देय\s*दिनांक|अंतिम\s*दिनांक)"
        r"\s*[:\-]?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})",
        text,
        re.IGNORECASE
    )

    if date_match:
        due_date_text = date_match.group(1)

    return {
        "month": month,
        "units": units if units is not None and units > 0 else None,
        "amount": amount if amount is not None and amount > 0 else None,
        "dueDate": _normalize_date(due_date_text),
        "needs_review": True,
    }


def parse_bill_file(filename, content):
    extension = filename.lower().rsplit(".", 1)[-1]

    if extension == "csv":
        decoded = content.decode("utf-8-sig", errors="replace")
        rows = list(csv.DictReader(io.StringIO(decoded)))

        if not rows:
            raise ValueError("The CSV file contains no bill records.")

        row = {
            re.sub(r"[^a-z]", "", str(key).lower()): value
            for key, value in rows[0].items()
            if key is not None
        }

        def get_value(*names):
            for name in names:
                value = row.get(name)
                if value not in (None, ""):
                    return value
            return None

        month = _normalize_month(
            get_value("month", "billmonth", "billingmonth")
        )

        try:
            units = float(
                str(get_value(
                    "units", "unit", "kwh",
                    "unitsconsumed", "consumption"
                )).replace(",", "")
            )

            amount = float(
                str(get_value(
                    "amount", "billamount",
                    "totalamount", "amountpayable"
                ))
                .replace(",", "")
                .replace("₹", "")
                .replace("Rs.", "")
                .strip()
            )

        except (TypeError, ValueError):
            raise ValueError(
                "CSV must contain valid units and amount values."
            )

        if not month or units <= 0 or amount <= 0:
            raise ValueError(
                "CSV needs valid month, units and amount columns."
            )

        result = {
            "month": month,
            "units": units,
            "amount": amount,
            "dueDate": _normalize_date(
                get_value("duedate", "payby")
            ),
            "needs_review": True,
        }

    elif extension == "pdf":
        reader = PdfReader(io.BytesIO(content))
        text = "\n".join(
            page.extract_text() or "" for page in reader.pages
        )

        if not text.strip():
            raise ValueError(
                "PDF has no selectable text. Try a clearer PDF or image."
            )

        result = _parse_text(text)

    elif extension in ("jpg", "jpeg", "png", "webp"):
        if pytesseract is None:
            raise ValueError(
                "Tesseract OCR is not available on the server."
            )

        try:
            with Image.open(io.BytesIO(content)) as source_image:
                image = ImageOps.exif_transpose(source_image)
                image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)

                gray = ImageOps.grayscale(image)
                gray = ImageEnhance.Contrast(gray).enhance(1.5)
                gray_array = np.array(gray)

            text = pytesseract.image_to_string(
                gray_array,
                lang="eng",
                config="--psm 6",
                timeout=20
            )

            print(f"OCR extracted {len(text)} characters.")
            result = _parse_text(text)

            del gray_array

        except Exception as exc:
            raise ValueError(
                f"Image OCR failed: {exc}"
            ) from exc

    else:
        raise ValueError(
            "Supported file types: CSV, PDF, JPG, JPEG, PNG and WebP."
        )

    if (
        not result
        or not result.get("month")
        or result.get("units") is None
        or result.get("amount") is None
    ):
        raise ValueError(
            "Could not identify the bill month, units and amount. "
            "Please upload a clearer bill or enter the values manually."
        )

    return result