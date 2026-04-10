from unittest.mock import patch
from extractor.series_builder import build_series, _parse_cars, _parse_min_entries, _parse_incidents

BASIC_BLOCK = {
    "header": "Mini Stock Rookie Series - 2026 Season 1\nSome other text",
    "tables": [
        [
            ["Week", "Track", "Weather", "Laps"],
            [
                "Week 1 (2026-03-17)",
                "Charlotte Motor Speedway - Oval\n2026-04-01 13:55",
                "25°C, Rain chance 10%, Rolling start, Cautions disabled",
                "35 laps",
            ],
            [
                "Week 2 (2026-03-24)",
                "Langley Speedway\n2026-04-08 13:35",
                "21°C, Rain chance 0%, Rolling start, Cautions disabled",
                "35 laps",
            ],
        ]
    ],
}

FIXED_BLOCK = {
    "header": "NASCAR Fixed Series - 2026 Season 1",
    "tables": [
        [
            ["Week", "Track", "Weather", "Laps"],
            [
                "Week 1 (2026-03-17)",
                "Daytona\n2026-04-01 14:00",
                "28°C, Rain chance 0%, Rolling start, Cautions disabled",
                "50 laps",
            ],
        ]
    ],
}

TOC_INDEX = {
    "mini stock rookie series": ("Oval Racing", "D"),
    "nascar series": ("Oval Racing", "A"),
}


def test_build_series_basic():
    s = build_series(BASIC_BLOCK, TOC_INDEX)
    assert s is not None
    assert s.series == "Mini Stock Rookie Series"
    assert len(s.weeks) == 2


def test_build_series_weeks_ordered():
    s = build_series(BASIC_BLOCK, TOC_INDEX)
    assert s.weeks[0].week == 1
    assert s.weeks[1].week == 2


def test_build_series_toc_lookup():
    s = build_series(BASIC_BLOCK, TOC_INDEX)
    assert s.discipline == "Oval Racing"
    assert s.license_class == "D"


def test_build_series_fixed_setup():
    s = build_series(FIXED_BLOCK, TOC_INDEX)
    assert s is not None
    assert s.setup == "Fixed"


def test_build_series_open_setup():
    s = build_series(BASIC_BLOCK, TOC_INDEX)
    assert s.setup == "Open"


def test_build_series_malformed_row_skipped():
    block = {
        "header": "Mini Stock Rookie Series - 2026 Season 1",
        "tables": [
            [
                ["Week", "Track", "Weather", "Laps"],
                ["bad", "row"],  # only 2 cols — skipped
                [
                    "Week 1 (2026-03-17)",
                    "Charlotte\n2026-04-01 13:55",
                    "25°C, Rain chance 0%, Rolling start, Cautions disabled",
                    "35 laps",
                ],
            ]
        ],
    }
    s = build_series(block, TOC_INDEX)
    assert s is not None
    assert len(s.weeks) == 1


def test_build_series_no_valid_weeks_returns_none():
    block = {
        "header": "Mini Stock Rookie Series - 2026 Season 1",
        "tables": [[["Week", "Track", "Weather", "Laps"], ["bad", "row"]]],
    }
    assert build_series(block, TOC_INDEX) is None


def test_build_series_no_header_returns_none():
    block = {"header": "Some random text without season marker", "tables": []}
    assert build_series(block, TOC_INDEX) is None


def test_build_series_strips_year_from_name():
    s = build_series(BASIC_BLOCK, TOC_INDEX)
    assert "2026" not in s.series
    assert "Season" not in s.series


# --- metadata parsing ---

METADATA_BLOCK = {
    "header": (
        "GT4 Series - 2026 Season 2\n"
        "Ford Mustang GT4, Mercedes-AMG GT4, BMW M4 GT4\n"
        "Rookie 4.0 --> Pro/WC 4.0\n"
        "Races every 2 hours at :30 past\n"
        "Min entries for official: 6 | Split at: 30 | Drops: 4\n"
        "No incident DT penalties. DQ at 17 incidents."
    ),
    "tables": [
        [
            ["GT4 Series - 2026 Season 2\nFord Mustang GT4\nRookie 4.0 --> Pro/WC 4.0\n"
             "Races every 2 hours at :30 past\nMin entries for official: 6 | Split at: 30 | Drops: 4\n"
             "No incident DT penalties. DQ at 17 incidents.", None, None, None],
            ["Week 1 (2026-03-17)", "Daytona\n2026-04-01 14:00",
             "25°C, Rain chance 0%, Rolling start, Cautions disabled", "35 laps"],
        ]
    ],
}

TOC_INDEX_META = {"gt4 series": ("Road", "D")}


def test_parse_cars_single():
    assert _parse_cars(["Mini Stock"]) == ["Mini Stock"]


def test_parse_cars_multi_on_one_line():
    assert _parse_cars(["Ford Mustang GT4, Mercedes-AMG GT4, BMW M4 GT4"]) == [
        "Ford Mustang GT4", "Mercedes-AMG GT4", "BMW M4 GT4"
    ]


def test_parse_cars_wrapped_lines():
    lines = ["Ford Mustang GT4, Mercedes-AMG GT4, Aston", "Martin Vantage GT4"]
    result = _parse_cars(lines)
    assert "Ford Mustang GT4" in result
    assert "Aston Martin Vantage GT4" in result


def test_parse_min_entries():
    assert _parse_min_entries("Min entries for official: 6 | Split at: 30 | Drops: 4") == (6, 30, 4)


def test_parse_min_entries_no_match():
    assert _parse_min_entries("some other line") == (None, None, None)


def test_parse_incidents_no_penalty_with_dq():
    assert _parse_incidents("No incident DT penalties. DQ at 17 incidents.") == (None, None, 17)


def test_parse_incidents_no_penalty_no_dq():
    assert _parse_incidents("No incident DT penalties. No incident DQ.") == (None, None, None)


def test_parse_incidents_penalty_every_with_dq():
    assert _parse_incidents("Penalty every 17 incidents. DQ at 25 incidents.") == (17, None, 25)


def test_parse_incidents_penalty_at_with_repeat_no_dq():
    assert _parse_incidents("Penalty at 17 incidents, and every 8 after. No incident DQ.") == (17, 8, None)


def test_build_series_metadata_fields():
    s = build_series(METADATA_BLOCK, TOC_INDEX_META)
    assert s is not None
    assert s.cars == ["Ford Mustang GT4", "Mercedes-AMG GT4", "BMW M4 GT4"]
    assert s.race_cadence == "Races every 2 hours at :30 past"
    assert s.min_entries == 6
    assert s.split_at == 30
    assert s.drops == 4
    assert s.incident_penalty is None
    assert s.incident_dq == 17


# --- schedule_mode and car_group_label overrides ---

DRAFT_MASTER_BLOCK = {
    "header": (
        "Draft Master Challenge by Simagic - 2026 Season 2\n"
        "See race week for cars in use that week.\n"
        "Rookie 4.0 --> Pro/WC 4.0\n"
        "Races every hour on the hour\n"
        "Min entries for official: 6 | Split at: 26 | Drops: 4\n"
        "Penalty every 17 incidents. DQ at 25 incidents."
    ),
    "tables": [
        [
            [
                (
                    "Draft Master Challenge by Simagic - 2026 Season 2\n"
                    "See race week for cars in use that week.\n"
                    "Rookie 4.0 --> Pro/WC 4.0\n"
                    "Races every hour on the hour\n"
                    "Min entries for official: 6 | Split at: 26 | Drops: 4\n"
                    "Penalty every 17 incidents. DQ at 25 incidents."
                ),
                None, None, None,
            ],
            [
                "Week 1 (2026-03-17)",
                (
                    "Talladega Superspeedway\n"
                    "NASCAR Cup Series Next Gen Chevrolet\n"
                    "Camaro ZL1, NASCAR Cup Series Next Gen\n"
                    "Ford Mustang, NASCAR Cup Series Next Gen\n"
                    "Toyota Camry\n"
                    "(2025-12-20 11:40 1x)"
                ),
                "75°F/24°C, Rain chance None, Rolling\nstart, Cautions disabled, Qual scrutiny\n- Strict.",
                "16 laps",
            ],
            [
                "Week 2 (2026-03-24)",
                (
                    "Talladega Superspeedway\n"
                    "Gen 4 Chevrolet Monte Carlo - 2003, Gen 4 Ford\n"
                    "Taurus - 2003\n"
                    "(2025-12-27 12:00 1x)"
                ),
                "66°F/19°C, Rain chance None, Rolling\nstart, Cautions disabled, Qual scrutiny\n- Strict.",
                "16 laps",
            ],
        ]
    ],
}

DRAFT_MASTER_TOC = {"draft master challenge": ("Oval", "D")}


def test_schedule_mode_auto_detected_as_cars():
    s = build_series(DRAFT_MASTER_BLOCK, DRAFT_MASTER_TOC)
    assert s is not None
    assert s.schedule_mode == "cars"


def test_schedule_mode_not_set_for_regular_series():
    s = build_series(BASIC_BLOCK, TOC_INDEX)
    assert s.schedule_mode is None


def test_schedule_mode_override_from_file():
    overrides = {"car_group_labels": {}, "schedule_modes": {"Mini Stock Rookie Series": "tracks"}}
    with patch("extractor.series_builder._load_overrides", return_value=overrides):
        s = build_series(BASIC_BLOCK, TOC_INDEX)
    assert s.schedule_mode == "tracks"


def test_car_group_label_override_from_file():
    overrides = {
        "car_group_labels": {"Draft Master Challenge/week_1": "Cup Next Gen"},
        "schedule_modes": {},
    }
    with patch("extractor.series_builder._load_overrides", return_value=overrides):
        s = build_series(DRAFT_MASTER_BLOCK, DRAFT_MASTER_TOC)
    assert s is not None
    assert s.weeks[0].car_group_label == "Cup Next Gen"
