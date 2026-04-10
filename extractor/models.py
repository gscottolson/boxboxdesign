from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class WeatherData:
    air_temperature_c: int | str | None = None
    chance_of_rain: str | None = None


@dataclass
class SegmentData:
    type: str = ""
    laps: int = 0


@dataclass
class CarBalance:
    fuel_pct: float | None = None
    ballast_kg: float | None = None
    power_pct: float | None = None
    tire_sets: int | None = None


@dataclass
class WeekData:
    week: int = 0
    week_start_gmt: str = ""
    track: str = ""
    track_name: str = ""
    track_layout: str | None = None
    event_date: str | None = None
    event_time: str | None = None
    weather: WeatherData = field(default_factory=WeatherData)
    race_start: str | None = None
    cautions: str | None = None
    qualifying_scrutiny: str | None = None
    grid_by_class: bool = False
    min_drivers: int | None = None
    max_drivers: int | None = None
    fair_share: str | None = None
    lucky_dog: bool = False
    gwc: int | None = None
    restart_file: str | None = None   # "double" | "single"
    restart_position: str | None = None  # "back" | "inside" | "maintain"
    start_zone: bool = False
    caution_laps_count: bool = True
    car_balance: dict[str, CarBalance] = field(default_factory=dict)
    notes: list[str] = field(default_factory=list)
    cars_in_use: list[str] = field(default_factory=list)
    car_group_label: str = ""
    laps: int | None = None
    race_time: str | None = None
    segments: list[SegmentData] = field(default_factory=list)


@dataclass
class SeriesData:
    series: str = ""
    discipline: str | None = None
    license_class: str | None = None
    setup: str = "Open"
    cars: list[str] = field(default_factory=list)
    schedule_mode: str | None = None
    race_cadence: str | None = None
    min_entries: int | None = None
    split_at: int | None = None
    drops: int | None = None
    incident_penalty: int | None = None         # DT threshold; None = no DT penalty
    incident_penalty_repeat: int | None = None  # repeat interval ("every N after")
    incident_dq: int | None = None              # DQ threshold; None = no DQ
    weeks: list[WeekData] = field(default_factory=list)
