import csv

def load_gps(csv_file):

    gps_data = []

    with open(csv_file) as f:

        reader = csv.DictReader(f)

        for row in reader:

            gps_data.append({
                "timestamp": row["timestamp"],
                "latitude": float(row["latitude"]),
                "longitude": float(row["longitude"])
            })

    return gps_data


def match_gps(frame_time, gps_data):

    closest = min(
        gps_data,
        key=lambda g: abs(float(g["timestamp"]) - frame_time)
    )

    return closest