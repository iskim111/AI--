from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
INPUT_FILE = ROOT / "이용현황.xlsx"
GEOJSON_PATH = ROOT / "resource" / "maps" / "seoul_municipalities_geo_simple.json"
OUTPUT_DIR = ROOT / "outputs"
DASHBOARD_DIR = OUTPUT_DIR / "dashboard"
REPORT_DIR = OUTPUT_DIR / "reports"
HTML_PATH = DASHBOARD_DIR / "seoul_district_dashboard.html"
REPORT_PATH = REPORT_DIR / "seoul_district_dashboard_summary.xlsx"


def extract_district(series: pd.Series) -> pd.Series:
    return (
        series.fillna("")
        .astype(str)
        .str.extract(r"([가-힣]+구)", expand=False)
        .fillna("")
    )


def build_age_group(series: pd.Series) -> pd.Series:
    current_year = pd.Timestamp.today().year
    age = current_year - pd.to_numeric(series, errors="coerce")
    bins = [0, 19, 29, 39, 49, 59, 69, 200]
    labels = ["19세 이하", "20대", "30대", "40대", "50대", "60대", "70세 이상"]
    return pd.cut(age, bins=bins, labels=labels, right=True).astype("object").fillna("미상")


def polygon_centroid(points: list[list[float]]) -> tuple[float, float]:
    if len(points) < 3:
        lon = sum(point[0] for point in points) / len(points)
        lat = sum(point[1] for point in points) / len(points)
        return lon, lat

    area = 0.0
    centroid_x = 0.0
    centroid_y = 0.0

    for i in range(len(points) - 1):
        x1, y1 = points[i]
        x2, y2 = points[i + 1]
        cross = x1 * y2 - x2 * y1
        area += cross
        centroid_x += (x1 + x2) * cross
        centroid_y += (y1 + y2) * cross

    if area == 0:
        lon = sum(point[0] for point in points) / len(points)
        lat = sum(point[1] for point in points) / len(points)
        return lon, lat

    area *= 0.5
    centroid_x /= 6 * area
    centroid_y /= 6 * area
    return centroid_x, centroid_y


def feature_centroid(feature: dict) -> tuple[float, float]:
    geometry = feature["geometry"]
    geom_type = geometry["type"]
    coordinates = geometry["coordinates"]

    if geom_type == "Polygon":
        return polygon_centroid(coordinates[0])

    polygons = [polygon[0] for polygon in coordinates]
    weighted = []
    for points in polygons:
        lon, lat = polygon_centroid(points)
        weighted.append((len(points), lon, lat))
    total = sum(item[0] for item in weighted) or 1
    lon = sum(weight * x for weight, x, _ in weighted) / total
    lat = sum(weight * y for weight, _, y in weighted) / total
    return lon, lat


def make_count_table(df: pd.DataFrame, column: str, name: str) -> pd.DataFrame:
    table = (
        df[column]
        .fillna("미상")
        .astype(str)
        .value_counts()
        .rename_axis(name)
        .reset_index(name="인원수")
    )
    total = int(table["인원수"].sum()) or 1
    table["비율(%)"] = (table["인원수"] / total * 100).round(1)
    return table


def build_html(context: dict[str, object]) -> str:
    data_json = json.dumps(context, ensure_ascii=False)
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>서울 구별 장애인 거주 대시보드</title>
  <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
  <style>
    :root {{
      --bg: #f4f7fb;
      --panel: #ffffff;
      --text: #162338;
      --muted: #607086;
      --line: #d8e1ee;
      --accent: #d7264f;
      --shadow: 0 18px 40px rgba(22, 35, 56, 0.08);
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: "Noto Sans KR", sans-serif;
      background: linear-gradient(180deg, #edf3fb 0%, #f7f9fc 100%);
      color: var(--text);
    }}
    .wrap {{
      max-width: 1500px;
      margin: 0 auto;
      padding: 18px;
    }}
    .title {{
      margin: 0 0 14px;
      font-size: 1.45rem;
      font-weight: 800;
    }}
    .meta {{
      margin: 0 0 16px;
      color: var(--muted);
      font-size: 0.95rem;
    }}
    .layout {{
      display: grid;
      grid-template-columns: 1fr 1.1fr;
      gap: 18px;
    }}
    .panel {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 24px;
      box-shadow: var(--shadow);
      padding: 14px;
      min-height: 760px;
    }}
    .panel h2 {{
      margin: 0 0 10px;
      font-size: 1.05rem;
    }}
    .chart {{
      width: 100%;
      height: 690px;
    }}
    @media (max-width: 1100px) {{
      .layout {{
        grid-template-columns: 1fr;
      }}
      .panel {{
        min-height: 620px;
      }}
      .chart {{
        height: 560px;
      }}
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <h1 class="title">서울 구별 장애인 거주현황</h1>
    <p class="meta">{context["file_name"]} · 시트 {context["sheet_name"]} · {context["row_count"]}건 · 주소에서 추출한 구 기준</p>

    <div class="layout">
      <section class="panel">
        <h2>서울 행정구역 지도</h2>
        <div id="mapChart" class="chart"></div>
      </section>
      <section class="panel">
        <h2>구별 장애유형 분포</h2>
        <div id="barChart" class="chart"></div>
      </section>
    </div>
  </div>

  <script>
    const dashboardData = {data_json};

    const mapTrace = {{
      type: "choropleth",
      geojson: dashboardData.geojson,
      featureidkey: "properties.SIG_KOR_NM",
      locations: dashboardData.map.locations,
      z: dashboardData.map.values,
      text: dashboardData.map.hoverText,
      hovertemplate: "%{{text}}<extra></extra>",
      colorscale: [
        [0, "#ffe7ed"],
        [0.35, "#ffb9c8"],
        [0.7, "#f06282"],
        [1, "#c9153f"]
      ],
      marker: {{
        line: {{
          color: "#ffffff",
          width: 1.2
        }}
      }},
      showscale: false
    }};

    const labelTrace = {{
      type: "scattergeo",
      mode: "text",
      lon: dashboardData.map.labelLon,
      lat: dashboardData.map.labelLat,
      text: dashboardData.map.labelText,
      textfont: {{
        family: "Noto Sans KR, sans-serif",
        size: 11,
        color: "#162338"
      }},
      hoverinfo: "skip"
    }};

    Plotly.newPlot("mapChart", [mapTrace, labelTrace], {{
      margin: {{ t: 0, r: 0, b: 0, l: 0 }},
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      geo: {{
        fitbounds: "locations",
        visible: false,
        showcountries: false,
        showcoastlines: false,
        showframe: false,
        bgcolor: "#ffffff"
      }}
    }}, {{
      displayModeBar: false,
      responsive: true
    }});

    const barTraces = dashboardData.bar.datasets.map((dataset, index) => ({{
      type: "bar",
      name: dataset.label,
      y: dashboardData.bar.labels,
      x: dataset.values,
      orientation: "h",
      marker: {{
        color: dashboardData.bar.colors[index % dashboardData.bar.colors.length]
      }},
      hovertemplate: "%{{y}}<br>%{{fullData.name}}: %{{x}}명<extra></extra>"
    }}));

    Plotly.newPlot("barChart", barTraces, {{
      barmode: "stack",
      margin: {{ t: 10, r: 10, b: 50, l: 90 }},
      paper_bgcolor: "#ffffff",
      plot_bgcolor: "#ffffff",
      legend: {{
        orientation: "h",
        y: 1.08
      }},
      xaxis: {{
        title: "인원수",
        gridcolor: "#e6edf5",
        zeroline: false
      }},
      yaxis: {{
        autorange: "reversed"
      }}
    }}, {{
      displayModeBar: false,
      responsive: true
    }});
  </script>
</body>
</html>
"""


def main() -> None:
    DASHBOARD_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_excel(INPUT_FILE, sheet_name=0)
    df["주소구"] = extract_district(df["주소"])
    df.loc[df["주소구"] == "", "주소구"] = df.loc[df["주소구"] == "", "구"].fillna("미상")
    df["주소구"] = df["주소구"].fillna("미상")
    df["연령대"] = build_age_group(df["출생연도"])
    df["장애구분"] = df["장애구분"].fillna("미상").astype(str)

    district_table = make_count_table(df, "주소구", "주소구")
    disability_table = make_count_table(df, "장애구분", "장애구분")
    age_table = make_count_table(df, "연령대", "연령대")

    district_disability = pd.crosstab(df["주소구"], df["장애구분"]).astype(int)
    district_disability["합계"] = district_disability.sum(axis=1)
    district_disability = district_disability.sort_values("합계", ascending=False)

    geojson = json.loads(GEOJSON_PATH.read_text(encoding="utf-8"))
    feature_names = [feature["properties"]["SIG_KOR_NM"] for feature in geojson["features"]]
    counts_map = dict(zip(district_table["주소구"], district_table["인원수"]))

    label_lon: list[float] = []
    label_lat: list[float] = []
    label_text: list[str] = []
    hover_text: list[str] = []
    z_values: list[int] = []

    for feature in geojson["features"]:
        name = feature["properties"]["SIG_KOR_NM"]
        count = int(counts_map.get(name, 0))
        lon, lat = feature_centroid(feature)
        label_lon.append(lon)
        label_lat.append(lat)
        label_text.append(f"{name}<br>{count}명")
        hover_text.append(f"{name}<br>거주인원 {count}명")
        z_values.append(count)

    with pd.ExcelWriter(REPORT_PATH, engine="openpyxl") as writer:
        district_table.to_excel(writer, sheet_name="구별분포", index=False)
        disability_table.to_excel(writer, sheet_name="장애유형분포", index=False)
        age_table.to_excel(writer, sheet_name="연령대분포", index=False)
        district_disability.drop(columns="합계").to_excel(writer, sheet_name="구별_장애유형")

    context = {
        "file_name": INPUT_FILE.name,
        "sheet_name": "Sheet1",
        "row_count": f"{len(df):,}",
        "geojson": geojson,
        "map": {
            "locations": feature_names,
            "values": z_values,
            "hoverText": hover_text,
            "labelLon": label_lon,
            "labelLat": label_lat,
            "labelText": label_text,
        },
        "bar": {
            "labels": district_disability.index.tolist(),
            "datasets": [
                {"label": column, "values": district_disability[column].tolist()}
                for column in district_disability.columns
                if column != "합계"
            ],
            "colors": [
                "#d7264f",
                "#1f77b4",
                "#f59e0b",
                "#10b981",
                "#8b5cf6",
                "#0ea5e9",
                "#64748b",
                "#ef4444",
            ],
        },
    }

    HTML_PATH.write_text(build_html(context), encoding="utf-8")
    print(f"HTML={HTML_PATH}")
    print(f"REPORT={REPORT_PATH}")


if __name__ == "__main__":
    main()
