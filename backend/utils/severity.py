def calculate_severity(bbox):

    x1, y1, x2, y2 = bbox

    area = (x2 - x1) * (y2 - y1)

    if area > 15000:
        return "dangerous"

    elif area > 6000:
        return "moderate"

    else:
        return "minor"