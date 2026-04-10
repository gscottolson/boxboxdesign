from extractor.validation import validate_series


def _make_series(weeks):
    return {"weeks": weeks}


def _week(**overrides):
    base = {
        "week": 1,
        "week_start_gmt": "2026-03-17",  # Tuesday
        "weather": {"air_temperature_c": 20, "chance_of_rain": "0%"},
        "laps": 35,
        "race_start": "rolling",
        "qualifying_scrutiny": "strict",
        "cautions": "disabled",
    }
    base.update(overrides)
    return base


def test_valid_week_no_flags():
    assert validate_series(_make_series([_week()])) == []


def test_week_start_non_tuesday_no_flag():
    # Validator no longer requires Tuesday; any weekday is valid
    flags = validate_series(_make_series([_week(week_start_gmt="2026-03-18")]))  # Wednesday
    assert not any(f["reason"] == "Week does not start on Tuesday" for f in flags)


def test_week_start_invalid_format():
    flags = validate_series(_make_series([_week(week_start_gmt="not-a-date")]))
    assert any(f["field"] == "week_start_gmt" for f in flags)


def test_non_consecutive_weeks():
    w1 = _week(week=1, week_start_gmt="2026-03-17")
    w2 = _week(week=2, week_start_gmt="2026-03-30")  # 13 days — not a multiple of 7
    flags = validate_series(_make_series([w1, w2]))
    assert any(f["week"] == 2 and f["field"] == "week_start_gmt" for f in flags)


def test_biweekly_gap_no_flag():
    w1 = _week(week=1, week_start_gmt="2026-03-17")
    w2 = _week(week=2, week_start_gmt="2026-03-31")  # 14 days — bi-weekly, valid
    assert validate_series(_make_series([w1, w2])) == []


def test_temperature_too_high():
    flags = validate_series(_make_series([_week(weather={"air_temperature_c": 45, "chance_of_rain": "0%"})]))
    assert any(f["field"] == "air_temperature_c" for f in flags)


def test_temperature_zero():
    flags = validate_series(_make_series([_week(weather={"air_temperature_c": 0, "chance_of_rain": "0%"})]))
    assert any(f["field"] == "air_temperature_c" for f in flags)


def test_rain_over_100():
    flags = validate_series(_make_series([_week(weather={"air_temperature_c": 20, "chance_of_rain": "150%"})]))
    assert any(f["field"] == "chance_of_rain" for f in flags)


def test_rain_invalid_format():
    flags = validate_series(_make_series([_week(weather={"air_temperature_c": 20, "chance_of_rain": "heavy"})]))
    assert any(f["field"] == "chance_of_rain" for f in flags)


def test_laps_too_high():
    flags = validate_series(_make_series([_week(laps=600)]))
    assert any(f["field"] == "laps" for f in flags)


def test_laps_zero():
    flags = validate_series(_make_series([_week(laps=0)]))
    assert any(f["field"] == "laps" for f in flags)


def test_invalid_race_start():
    flags = validate_series(_make_series([_week(race_start="flying")]))
    assert any(f["field"] == "race_start" for f in flags)


def test_invalid_scrutiny():
    flags = validate_series(_make_series([_week(qualifying_scrutiny="impossible")]))
    assert any(f["field"] == "qualifying_scrutiny" for f in flags)


def test_invalid_cautions():
    flags = validate_series(_make_series([_week(cautions="sometimes")]))
    assert any(f["field"] == "cautions" for f in flags)
