from extractor.week_parser import parse_week_row

BASIC_ROW = [
    "Week 1 (2026-03-17)",
    "Charlotte Motor Speedway - Oval\n2026-04-01 13:55",
    "25°C, Rain chance 10%, Rolling start, Cautions disabled",
    "35 laps",
]

SEGMENT_ROW = [
    "Week 3 (2026-03-31)",
    "Eldora Speedway\n2026-04-15 19:00",
    "22°C, Rain chance 5%, Standing start, Full course cautions",
    "H: 12L C: 8L F: 25L",
]

RACETIME_ROW = [
    "Week 5 (2026-04-14)",
    "Nurburgring\n2026-04-28 14:00",
    "18°C, Rain chance 30%, Rolling start, Cautions disabled",
    "60 mins",
]

CONSTANT_WEATHER_ROW = [
    "Week 7 (2026-04-28)",
    "Daytona International Speedway\n2026-05-12 13:00",
    "Constant weather, Dynamic sky, Standing start, Local enforced cautions, Strict qualifying",
    "200 laps",
]


def test_basic_row_fields():
    w = parse_week_row(BASIC_ROW)
    assert w is not None
    assert w.week == 1
    assert w.week_start_gmt == "2026-03-17"
    assert w.track_name == "Charlotte Motor Speedway"
    assert w.track_layout == "Oval"
    assert w.event_date == "2026-04-01"
    assert w.event_time == "13:55"
    assert w.laps == 35
    assert w.segments == []
    assert w.race_time is None


def test_basic_row_weather():
    w = parse_week_row(BASIC_ROW)
    assert w.weather.air_temperature_c == 25
    assert w.weather.chance_of_rain == "10%"


def test_basic_row_race_settings():
    w = parse_week_row(BASIC_ROW)
    assert w.race_start == "rolling"
    assert w.cautions == "disabled"


def test_segment_row_structure():
    w = parse_week_row(SEGMENT_ROW)
    assert w is not None
    assert w.laps is None
    assert w.race_time is None
    assert len(w.segments) == 3
    assert w.segments[0].type == "heat" and w.segments[0].laps == 12
    assert w.segments[1].type == "consolation" and w.segments[1].laps == 8
    assert w.segments[2].type == "feature" and w.segments[2].laps == 25


def test_segment_row_cautions():
    w = parse_week_row(SEGMENT_ROW)
    assert w.cautions == "full course"
    assert w.race_start == "standing"


def test_race_time_row():
    w = parse_week_row(RACETIME_ROW)
    assert w is not None
    assert w.laps is None
    assert w.race_time is not None
    assert "60" in w.race_time


def test_constant_weather_row():
    w = parse_week_row(CONSTANT_WEATHER_ROW)
    assert w.weather.air_temperature_c == "Constant weather"
    assert w.weather.chance_of_rain == "Dynamic sky"
    assert w.cautions == "local enforced"
    assert w.qualifying_scrutiny == "strict"


def test_local_advisory_caution():
    row = [
        "Week 2 (2026-03-24)",
        "Watkins Glen\n2026-04-08 15:00",
        "20°C, Rain chance 0%, Rolling start, Local advisory cautions",
        "25 laps",
    ]
    w = parse_week_row(row)
    assert w.cautions == "local advisory"


def test_no_track_layout():
    row = [
        "Week 1 (2026-03-17)",
        "Daytona International Speedway\n2026-04-01 13:00",
        "24°C, Rain chance 0%, Rolling start, Cautions disabled",
        "200 laps",
    ]
    w = parse_week_row(row)
    assert w.track_layout is None
    assert w.track_name == "Daytona International Speedway"


def test_malformed_row_returns_none():
    assert parse_week_row(["only", "three", "cols"]) is None


def test_none_cell_returns_none():
    assert parse_week_row(["Week 1 (2026-03-17)", None, "weather", "35 laps"]) is None


from extractor.week_parser import derive_car_group_label


def test_derive_label_multi_car_common_prefix():
    cars = [
        "NASCAR Cup Series Next Gen Chevrolet Camaro ZL1",
        "NASCAR Cup Series Next Gen Ford Mustang",
        "NASCAR Cup Series Next Gen Toyota Camry",
    ]
    assert derive_car_group_label(cars) == "NASCAR Cup Series Next Gen"


def test_derive_label_gen4():
    cars = ["Gen 4 Chevrolet Monte Carlo - 2003", "Gen 4 Ford Taurus - 2003"]
    label = derive_car_group_label(cars)
    assert label.startswith("Gen 4")


def test_derive_label_trucks():
    cars = [
        "NASCAR Truck Chevrolet Silverado",
        "NASCAR Truck Ford F150",
        "NASCAR Truck RAM",
        "NASCAR Truck Toyota Tundra TRD Pro",
    ]
    assert derive_car_group_label(cars) == "NASCAR Truck"


def test_derive_label_legends_year():
    cars = [
        "NASCAR Legends Buick LeSabre - 1987",
        "NASCAR Legends Chevrolet Monte Carlo - 1987",
        "NASCAR Legends Ford Thunderbird - 1987",
        "NASCAR Legends Pontiac Grand Prix - 1987",
    ]
    label = derive_car_group_label(cars)
    assert "Legends" in label
    assert "1987" in label


def test_derive_label_single_car_strips_legacy():
    cars = ["[Legacy] NASCAR Cup Chevrolet Impala COT - 2009"]
    label = derive_car_group_label(cars)
    assert "[Legacy]" not in label
    assert label  # non-empty


def test_derive_label_empty_returns_empty():
    assert derive_car_group_label([]) == ""


def test_derive_label_single_car_no_legacy():
    cars = ["Ford Mustang GT4"]
    assert derive_car_group_label(cars) == "Ford Mustang GT4"


def test_derive_label_mixed_manufacturer_gt3():
    """Multi-manufacturer GT3 grids have no common prefix; should return 'GT3'."""
    cars = [
        "Acura NSX GT3 EVO 22",
        "Aston Martin Vantage GT3 EVO",
        "Audi R8 LMS EVO II GT3",
        "BMW M4 GT3 EVO",
        "Chevrolet Corvette Z06 GT3.R",
        "Ferrari 296 GT3",
        "Ford Mustang GT3",
        "Lamborghini Huracán GT3 EVO",
        "McLaren 720S GT3 EVO",
        "Mercedes-AMG GT3 2020",
        "Porsche 911 GT3 R (992)",
    ]
    assert derive_car_group_label(cars) == "GT3"


def test_derive_label_mixed_manufacturer_gt4():
    """Multi-manufacturer GT4 grids have no common prefix; should return 'GT4'."""
    cars = [
        "Aston Martin Vantage GT4",
        "BMW M4 G82 GT4 Evo",
        "Ford Mustang GT4",
        "McLaren 570S GT4",
        "Mercedes-AMG GT4",
        "Porsche 718 Cayman GT4 Clubsport MR",
    ]
    assert derive_car_group_label(cars) == "GT4"


DRAFT_MASTER_ROW_WEEK1 = [
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
]

DRAFT_MASTER_ROW_WEEK2 = [
    "Week 2 (2026-03-24)",
    (
        "Talladega Superspeedway\n"
        "Gen 4 Chevrolet Monte Carlo - 2003, Gen 4 Ford\n"
        "Taurus - 2003\n"
        "(2025-12-27 12:00 1x)"
    ),
    "66°F/19°C, Rain chance None, Rolling\nstart, Cautions disabled, Qual scrutiny\n- Strict.",
    "16 laps",
]


def test_draft_master_week1_cars_extracted():
    w = parse_week_row(DRAFT_MASTER_ROW_WEEK1)
    assert w is not None
    assert len(w.cars_in_use) == 3
    assert "NASCAR Cup Series Next Gen Chevrolet Camaro ZL1" in w.cars_in_use
    assert "NASCAR Cup Series Next Gen Ford Mustang" in w.cars_in_use
    assert "NASCAR Cup Series Next Gen Toyota Camry" in w.cars_in_use


def test_draft_master_week1_car_group_label():
    w = parse_week_row(DRAFT_MASTER_ROW_WEEK1)
    assert w.car_group_label == "NASCAR Cup Series Next Gen"


def test_draft_master_week2_cars_extracted():
    w = parse_week_row(DRAFT_MASTER_ROW_WEEK2)
    assert w is not None
    assert len(w.cars_in_use) == 2
    assert "Gen 4 Chevrolet Monte Carlo - 2003" in w.cars_in_use
    assert "Gen 4 Ford Taurus - 2003" in w.cars_in_use


def test_draft_master_week1_track_still_parsed():
    w = parse_week_row(DRAFT_MASTER_ROW_WEEK1)
    assert w.track_name == "Talladega Superspeedway"
    assert w.track_layout is None
    assert w.event_date == "2025-12-20"
    assert w.event_time == "11:40"
    assert w.laps == 16


def test_no_cars_row_still_works():
    """Existing behavior: rows without car lines produce empty cars_in_use."""
    w = parse_week_row(BASIC_ROW)
    assert w is not None
    assert w.cars_in_use == []
    assert w.car_group_label == ""


RING_MEISTER_SINGLE_CAR_ROW = [
    "Week 1 (2026-03-17)",
    "Nürburgring Nordschleife - Industriefahrten\nLigier JS P320\n(2026-04-01 13:50 1x)",
    "66°F/19°C, Rain chance None, Detached qual, Rolling start, Local advisory cautions, Qual scrutiny - Strict.",
    "3 laps",
]


def test_single_car_after_complete_layout_is_extracted():
    """A single car on its own line after a complete 'Track - Layout' should be parsed as a car."""
    w = parse_week_row(RING_MEISTER_SINGLE_CAR_ROW)
    assert w is not None
    assert w.cars_in_use == ["Ligier JS P320"]
    assert w.car_group_label == "Ligier JS P320"


def test_single_car_track_name_unaffected():
    """Track name and layout should not include the car name."""
    w = parse_week_row(RING_MEISTER_SINGLE_CAR_ROW)
    assert w.track_name == "Nürburgring Nordschleife"
    assert w.track_layout == "Industriefahrten"


MUGELLO_GRAND_PRIX_ROW = [
    "Week 1 (2026-03-17)",
    "Autodromo Internazionale del Mugello - Grand\nPrix\n(2026-04-01 13:50 1x)",
    "66°F/19°C, Rain chance None, Rolling start.",
    "10 laps",
]


def test_wrapped_layout_not_parsed_as_car():
    """'Grand Prix' split across two lines should join as the layout, not produce a car."""
    w = parse_week_row(MUGELLO_GRAND_PRIX_ROW)
    assert w is not None
    assert w.track_layout == "Grand Prix"
    assert w.cars_in_use == []


# ── New metadata field tests ─────────────────────────────────────────────────

ENDURANCE_ROW = [
    "Week 1 (2026-03-17)",
    "Nürburgring Nordschleife - Industriefahrten\n(2026-04-01 13:50 1x)",
    (
        "69°F/20°C, Rain chance None, Grid by class, Rolling start, Local enforced cautions, "
        "Min 1 driver, Max 16 drivers, Drive Fair Share - Declare drivers, Qual scrutiny - Permissive.\n"
        "BMWM2: fuel: 75%\nGR86: fuel: 60%\nRENC: fuel: 70%\nMX16: fuel: 75%"
    ),
    "3 laps",
]

BOP_ROW = [
    "Week 1 (2026-03-17)",
    "Circuit de Spa-Francorchamps - Spa\n(2026-04-01 13:50 1x)",
    (
        "67°F/20°C, Rain chance None, Grid by class, Rolling start, Local enforced cautions, "
        "Min 1 driver, Max 16 drivers, Drive Fair Share - Declare drivers, Qual scrutiny - Permissive.\n"
        "MGT3E: fuel: 98%, 3.0kg, pwr: -1.25%\nF296: fuel: 98%, pwr: -0.75%\n"
        "FMGT3: 20.0kg, pwr: -2.50%"
    ),
    "60 mins",
]

RESTART_ROW = [
    "Week 2 (2026-03-24)",
    "Daytona International Speedway - Oval\n2026-04-01 14:00",
    (
        "68°F/20°C, Rain chance None, Rolling start, Full course cautions, "
        "Lucky dog, 3-G/W/C, Double-file Back, Qual scrutiny - Moderate.\n"
        "LM23: 1 tire sets"
    ),
    "80 laps",
]

CAUTION_LAPS_ROW = [
    "Week 3 (2026-03-31)",
    "Talladega Superspeedway\n2026-04-08 14:00",
    "75°F/24°C, Rain chance None, Rolling start, Full course cautions, Cautions laps do not count, 1-G/W/C, Double-file Back, Qual scrutiny - Moderate.",
    "80 laps",
]


def test_endurance_grid_by_class():
    w = parse_week_row(ENDURANCE_ROW)
    assert w.grid_by_class is True


def test_endurance_driver_limits():
    w = parse_week_row(ENDURANCE_ROW)
    assert w.min_drivers == 1
    assert w.max_drivers == 16


def test_endurance_fair_share():
    w = parse_week_row(ENDURANCE_ROW)
    assert w.fair_share == "Declare drivers"


def test_endurance_car_balance_fuel():
    w = parse_week_row(ENDURANCE_ROW)
    assert "BMWM2" in w.car_balance
    assert w.car_balance["BMWM2"].fuel_pct == 75.0
    assert w.car_balance["GR86"].fuel_pct == 60.0
    assert w.car_balance["MX16"].fuel_pct == 75.0


def test_bop_ballast_and_power():
    w = parse_week_row(BOP_ROW)
    assert w.car_balance["MGT3E"].fuel_pct == 98.0
    assert w.car_balance["MGT3E"].ballast_kg == 3.0
    assert w.car_balance["MGT3E"].power_pct == -1.25
    assert w.car_balance["F296"].power_pct == -0.75
    assert w.car_balance["FMGT3"].ballast_kg == 20.0
    assert w.car_balance["FMGT3"].power_pct == -2.50


def test_restart_lucky_dog():
    w = parse_week_row(RESTART_ROW)
    assert w.lucky_dog is True
    assert w.gwc == 3
    assert w.restart_file == "double"
    assert w.restart_position == "back"


def test_restart_tire_sets():
    w = parse_week_row(RESTART_ROW)
    assert w.car_balance["LM23"].tire_sets == 1


def test_caution_laps_do_not_count():
    w = parse_week_row(CAUTION_LAPS_ROW)
    assert w.caution_laps_count is False


def test_caution_laps_count_default_true():
    w = parse_week_row(BASIC_ROW)
    assert w.caution_laps_count is True


def test_no_notes_on_clean_row():
    w = parse_week_row(BASIC_ROW)
    assert w.notes == []
