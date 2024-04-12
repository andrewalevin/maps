import os

from os.path import isfile, join, isdir, dirname, abspath
from os import listdir

import geopy
import gpxpy
import gpxpy.gpx

import geopandas as gpd
from shapely.geometry import LineString

import pathlib
import utils
import string
import tools
import json

def parseActivityDataInGpxData(gpx=None):
    if not gpx:
        return None

    activity = {}
    activity['time'] = gpx.time
    activity['link'] = gpx.link
    tracks = []
    for track_item in gpx.tracks:
        track = {}

        track['name'] = track_item.name
        track['type'] = track_item.type
        segments = []
        for segment_item in track_item.segments:
            segment = {}
            points = []
            for point_item in segment_item.points:
                point = []
                # print(point_item)
                # point.append(point.time)
                point.append(float(point_item.latitude))
                point.append(float(point_item.longitude))
                if point_item.elevation:
                    point.append(float(point_item.elevation))
                points.append(point)
            segment['points'] = points
            segments.append(segment)
        track['segments'] = segments
        tracks.append(track)
    activity['tracks'] = tracks

    return activity


def getActivityDataFromGpxFile(file_path):
    if not isfile(file_path):
        return None

    # print('file_path', file_path)
    file_handle = open(file_path, "r")
    gpx_data = gpxpy.parse(file_handle)
    file_handle.close()

    activity_data = parseActivityDataInGpxData(gpx_data)

    return activity_data


from ipyleaflet import Map, Polyline
from ipywidgets import Layout


import geopandas as gpd
from shapely.geometry import LineString, Point
from scipy.interpolate import splprep, splev
import numpy as np
import matplotlib.pyplot as plt


def simplify(gdf, tolerance=0.001):
    gdf_simplified = gdf.simplify(tolerance)
    print('Simplify Coords count: ', len(gdf.geometry.iloc[0].coords), ' -> ',
          len(gdf_simplified.geometry.iloc[0].coords))
    print('Tolerance: ', tolerance)
    print()

    return gdf_simplified


def gdf2line(_gdf, color='red'):
    return Polyline(locations=list(_gdf.geometry.iloc[0].coords), color=color, fill=False)


def gdf2centroid(_gdf):
    return list(_gdf.centroid[0].coords)[0]


def gdf2splines(_gdf):
    _points = list(_gdf.geometry.iloc[0].coords)

    # Fit spline through points
    tck, _ = splprep(np.array(_points).T, s=0.0)

    # Evaluate spline at a higher resolution
    u_new = np.linspace(0, 1, 1000)
    spline_points = splev(u_new, tck)

    # Convert spline points to Shapely Point objects
    point_geoms = [Point(x, y) for x, y in zip(*spline_points)]

    return gpd.GeoDataFrame(geometry=[LineString(point_geoms)])


def gdf_reverse_coords(_gdf):
    return gpd.GeoDataFrame({'geometry': [LineString([(c2, c1) for c1, c2 in list(_gdf.geometry.iloc[0].coords)])]})


def points2gdf(_points):
    return gpd.GeoDataFrame(geometry=[LineString(_points)])


def gdf2coords(_gdf):
    return list(_gdf.geometry.iloc[0].coords)


def export_js(name, variable, data, output_root='data-output', ):
    export_js_template = string.Template('''
const $variable = $jsdata;
''')
    tag = string.Template('''<script src="$path"></script>''')

    root = pathlib.Path(output_root)
    file = root.joinpath(f'{name}-{variable}.js')
    variable = f'{variable}Coordinates'
    text_data = export_js_template.substitute(
        variable=variable,
        jsdata=json.dumps(data, indent=4)
    )
    print('🚀 Export. Path and Variable: ')
    print(file.resolve().relative_to(file.resolve().parent.parent.parent.parent))
    print()

    print(variable)
    print()

    remote_path = f'https://andrewalevin.github.io/{file.resolve().relative_to(file.resolve().parent.parent.parent.parent)}'
    print(tag.substitute(path=remote_path))
    print()

    print(tag.substitute(path=file.resolve()))
    print()

    utils.write_file(file, text_data)


def get_distance(points = []):
    total = 0

    for idx, point in enumerate(points):
        if idx == 0:
            continue
        coords_1 = (points[idx - 1][0], points[idx - 1][1])
        coords_2 = (points[idx][0], points[idx][1])

        dist = geopy.distance.geodesic(coords_1, coords_2).m
        total += dist
    return total


def export_js_v5(name, stage_name='stage0', data='', output_root='data-output', ):
    export_js_template = string.Template('''
const $varname = $jsdata;
''')
    tag = string.Template('''<script src="$path"></script>''')

    root = pathlib.Path(output_root)
    designed_name = f'{name}-{stage_name}'
    file = root.joinpath(f'{designed_name}.js')
    text_data = export_js_template.substitute(
        varname=stage_name,
        jsdata=json.dumps(data, indent=4)
    )
    print('🚀 Export. Path and Variable: ')
    print(file.resolve().relative_to(file.resolve().parent.parent.parent.parent))
    print()


    remote_path = f'https://andrewalevin.github.io/{file.resolve().relative_to(file.resolve().parent.parent.parent.parent)}'
    print(tag.substitute(path=remote_path))
    print()

    print(tag.substitute(path=file.resolve()))
    print()

    utils.write_file(file, text_data)


import geopy.distance


def get_rhombus_path(rounds=1, center=None, delta=0.0001):
    if center is None:
        center = [55.751426, 37.618879]
    rhombus_points = [
        (center[0] - delta, center[1]),
        (center[0], center[1] + delta),
        (center[0] + delta, center[1]),
        (center[0], center[1] - delta),
    ]

    points = []
    for round in range(rounds):
        points += rhombus_points

    segemnet_distance = get_distance([rhombus_points[0], rhombus_points[1]])
    total_distance = int(4. * segemnet_distance * rounds - 1.)
    print('📐 total_distance: ', total_distance, 'meters')

    return points2gdf(points)


def reverse_coords(coords):
    return [[c[1], c[0]] for c in coords]


def gdf2bounds(gdf):
    return gdf.geometry.iloc[0].bounds


def round_items(items, count):
    return [[round(sub_item, count) for sub_item in item] for item in items]


def round1(items):
    return round_items(items, 1)


def round2(items):
    return round_items(items, 2)


def round3(items):
    return round_items(items, 3)


def round4(items):
    return round_items(items, 4)


def round5(items):
    return round_items(items, 5)


def round6(items):
    return round_items(items, 6)

