import os

from os.path import isfile, join, isdir, dirname, abspath
from os import listdir
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

