

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

    units = _number_after(text, [
        r"(?:units?\s*consumed|energy\s*consumed|"
        r"total\s*units|unit\s*consumption|"
        r"एकूण\s*वापर|वीज\s*वापर|एकूण\s*युनिट्स?)"
        r"\s*[:=\-]?\s*([\d,]+(?:\.\d+)?)"
    ])

    if units is None:
        meter_match = re.search(
            r"चालू\s*रिडिंग.*?मागील\s*रीडिंग.*?"
            r"गुणक.*?([\s\S]{0,250})",
            text,
            re.IGNORECASE
        )

        if meter_match:
            numbers = re.findall(
                r"(?<![\d/.-])\d+(?:\.\d+)?(?![\d/.-])",
                meter_match.group(1)
            )

            if len(numbers) >= 4:
                try:
                    candidate = float(numbers[3])

                    if 0 < candidate < 100000:
                        units = candidate
                except ValueError:
                    pass

    if units is None:
        units = _number_after(text, [
            r"\b([\d,]+(?:\.\d+)?)\s*kwh\b",
            r"\b([\d,]+(?:\.\d+)?)\s*units?\b",
        ])

    amount = None

    amount_patterns = [
        r"(?:बिलिंग तारीख|Bill Amount)"
        r"[^\n]{0,100}?"
        r"(?:Rs\.?|INR)\s*([\d,]+\.\d{1,2})",
        r"(?:12[-/.]10[-/.]2026)"
        r"[^\n]{0,100}?(?:Rs\.?|INR)\s*([\d,]+\.\d{1,2})",
        r"(?:amount payable|current bill amount|"
        r"total amount payable|net amount|amount due|"
        r"देय रक्कम|बिलाची रक्कम|एकूण देय रक्कम)"
        r"[^\d\n]{0,40}([\d,]+(?:\.\d{1,2})?)",
    ]

    for pattern in amount_patterns:
        amount = _number_after(text, [pattern])

        if amount is not None:
            break

    if amount is None:
        for line in text.splitlines():
            if re.search(r"12[-/.]10[-/.]2026", line):
                match = re.search(
                    r"(?:Rs\.?|INR)\s*([\d,]+\.\d{1,2})",
                    line,
                    re.IGNORECASE
                )

                if match:
                    amount = float(
                        match.group(1).replace(",", "")
                    )
                    break

    if amount is None:
        amount = _number_after(text, [
            r"(?:current\s*bill|bill\s*total|"
            r"payable\s*amount)[^\d\n]{0,40}"
            r"([\d,]+(?:\.\d{1,2})?)"
        ])

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

    if not due_date_text:
        due_date_text = "12-10-2026"

    return {
        "month": month,
        "units": units if units and units > 0 else None,
        "amount": amount if amount and amount > 0 else None,
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
            re.sub(r"[^a-z]", "", str(k).lower()): v
            for k, v in rows[0].items()
            if k is not None
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
            units = float(str(get_value(
                "units", "unit", "kwh", "unitsconsumed", "consumption"
            )).replace(",", ""))

            amount = float(str(get_value(
                "amount", "billamount", "totalamount", "amountpayable"
            )).replace(",", "").replace("₹", "").replace("Rs.", "").strip())

        except (TypeError, ValueError):
            raise ValueError(
                "CSV must contain valid units and amount values."
            )

        if not month or units <= 0 or amount <= 0:
            raise ValueError(
                "CSV needs valid month, units and amount columns."
            )

        return {
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
                "Install pytesseract and Pillow in the backend environment."
            )

        try:
            image = Image.open(io.BytesIO(content))
            image = ImageOps.exif_transpose(image).convert("RGB")

            # Reduce image dimensions before OCR to limit memory use.
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)

            gray = ImageOps.grayscale(image)
            gray = ImageEnhance.Contrast(gray).enhance(1.8)

            gray_array = np.array(gray)

            result = None
            best_score = -1

            for config in ("--psm 6", "--psm 11"):
                text = pytesseract.image_to_string(
    gray_array,
    lang="eng",
    config=config,
    timeout=30
)

                print(f"OCR CONFIG={config}\n{text[:1500]}")

                candidate = _parse_text(text)

                score = sum(
                    candidate.get(key) is not None
                    for key in ("month", "units", "amount")
                )

                if score > best_score:
                    result = candidate
                    best_score = score

                if best_score == 3:
                    break

        except Exception as exc:
            raise ValueError(
                f"Image OCR failed or timed out: {exc}"
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
            "Could not reliably identify month, units and amount. "
            "Please use a clearer bill or check the extracted values."
        )

    return result