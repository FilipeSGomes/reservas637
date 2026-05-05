from __future__ import annotations

import csv
from collections import Counter
from datetime import date, datetime, time, timedelta
from pathlib import Path


START_DATE = date(2026, 5, 5)
END_DATE = date(2026, 12, 31)
OUTPUT_PATH = Path("data/bloqueios_aulas_2026.csv")


# IDs exatos usados no sistema
COURT_TN1 = "TN1"
COURT_TN2 = "TN2"
COURT_BT1 = "BT1"


# 0=segunda ... 6=domingo
SCHEDULE = {
    0: [  # Segunda
        (COURT_TN1, "06:00", "10:00"),
        (COURT_TN1, "15:00", "21:00"),
    ],
    1: [  # Terça
        (COURT_TN1, "06:00", "09:00"),
        (COURT_TN1, "15:00", "21:00"),
        (COURT_TN2, "18:00", "20:00"),
    ],
    2: [  # Quarta
        (COURT_TN1, "06:00", "11:30"),
        (COURT_TN1, "15:00", "20:00"),
        (COURT_TN2, "17:00", "19:00"),
        (COURT_BT1, "16:00", "21:00"),
    ],
    3: [  # Quinta
        (COURT_TN1, "06:00", "10:00"),
        (COURT_TN1, "15:00", "20:00"),
        (COURT_TN2, "18:00", "19:00"),
    ],
    4: [  # Sexta
        (COURT_TN1, "06:00", "11:00"),
        (COURT_TN1, "15:00", "19:00"),
    ],
}


def parse_hhmm(value: str) -> time:
    return datetime.strptime(value, "%H:%M").time()


def combine_day(d: date, hhmm: str) -> datetime:
    return datetime.combine(d, parse_hhmm(hhmm))


def iter_hour_slots(day: date, start_hhmm: str, end_hhmm: str):
    start_dt = combine_day(day, start_hhmm)
    end_dt = combine_day(day, end_hhmm)
    cursor = start_dt

    while cursor < end_dt:
        yield cursor.time().strftime("%H:%M")
        cursor += timedelta(hours=1)


def generate_rows():
    rows = []
    current = START_DATE

    while current <= END_DATE:
        weekday = current.weekday()
        for court, start_hhmm, end_hhmm in SCHEDULE.get(weekday, []):
            for slot_start in iter_hour_slots(current, start_hhmm, end_hhmm):
                rows.append(
                    {
                        "data": current.isoformat(),
                        "quadra": court,
                        "horario_inicio": slot_start,
                        "motivo": "Aula",
                        "tipo": "Aula",
                    }
                )
        current += timedelta(days=1)

    return rows


def write_csv(rows):
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["data", "quadra", "horario_inicio", "motivo", "tipo"],
        )
        writer.writeheader()
        writer.writerows(rows)


def print_summary(rows):
    count_by_court = Counter(row["quadra"] for row in rows)
    print(f"Total de linhas geradas: {len(rows)}")
    print("Quantidade por quadra:")
    for court in sorted(count_by_court):
        print(f"- {court}: {count_by_court[court]}")
    print(f"Período coberto: {START_DATE.isoformat()} até {END_DATE.isoformat()}")


def main():
    rows = generate_rows()
    write_csv(rows)
    print_summary(rows)


if __name__ == "__main__":
    main()
