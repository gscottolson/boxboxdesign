from datetime import datetime

def validate_series(series_data):
    flags = []
    weeks = series_data.get('weeks', [])
    allowed_race_starts = {"rolling", "standing"}
    allowed_scrutiny = {"permissive", "moderate", "lenient", "strict"}
    allowed_cautions = {"disabled", "full course", "local enforced", "local advisory"}

    for i, week in enumerate(weeks):
        # Date format check
        try:
            week_date = datetime.strptime(week['week_start_gmt'], "%Y-%m-%d")
        except Exception:
            flags.append({'week': week['week'], 'field': 'week_start_gmt', 'reason': 'Invalid date format'})
            continue

        # Consecutive week check: gap must be a positive multiple of 7 days
        # (allows weekly, bi-weekly, and season-break gaps for tour series)
        if i > 0:
            prev_date = datetime.strptime(weeks[i-1]['week_start_gmt'], "%Y-%m-%d")
            days_diff = (week_date - prev_date).days
            if not (days_diff > 0 and days_diff % 7 == 0):
                flags.append({'week': week['week'], 'field': 'week_start_gmt', 'reason': 'Non-consecutive week or unexpected gap'})

        # Temperature check
        temp = week.get('weather', {}).get('air_temperature_c')
        if isinstance(temp, int):
            if not (0 < temp <= 40):
                flags.append({'week': week['week'], 'field': 'air_temperature_c', 'reason': 'Unrealistic temperature'})

        # Rain chance check
        rain = week.get('weather', {}).get('chance_of_rain')
        if rain is not None and rain not in ("None", "Dynamic sky"):
            try:
                if not (rain.endswith('%') and 0 <= int(rain.rstrip('%')) <= 100):
                    flags.append({'week': week['week'], 'field': 'chance_of_rain', 'reason': 'Invalid rain chance'})
            except Exception:
                flags.append({'week': week['week'], 'field': 'chance_of_rain', 'reason': 'Invalid rain chance format'})

        # Lap or duration check
        if week.get('laps') is not None:
            if not (1 <= week['laps'] <= 500):
                flags.append({'week': week['week'], 'field': 'laps', 'reason': 'Unrealistic lap count'})
        elif 'duration' in week:
            if not (week['duration'].endswith('mins') or week['duration'].endswith('min')):
                flags.append({'week': week['week'], 'field': 'duration', 'reason': 'Invalid duration format'})

        # Allowed values checks
        if week.get('race_start') and week['race_start'] not in allowed_race_starts:
            flags.append({'week': week['week'], 'field': 'race_start', 'reason': 'Invalid race start value'})
        if week.get('qualifying_scrutiny') and week['qualifying_scrutiny'] not in allowed_scrutiny:
            flags.append({'week': week['week'], 'field': 'qualifying_scrutiny', 'reason': 'Invalid qualifying scrutiny value'})
        if week.get('cautions') and week['cautions'] not in allowed_cautions:
            flags.append({'week': week['week'], 'field': 'cautions', 'reason': 'Invalid cautions value'})


    return flags
