#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sts=4:ts=4:sw=4
#
# author: takano32 <tak@no32 dot tk>
#

import h5py
import pymongo


import sys
file_name = sys.argv[1]
f = h5py.File(file_name, 'r')

import datetime
import re
m = re.match('^MOD35_L2.A([0-9]{4})([0-9]{3}).*', file_name)
year = int(m.group(1))
yday = int(m.group(2)) - 1
datedelta = datetime.timedelta(yday)
date = datetime.datetime(year, 1, 1) + datedelta

DEBUG = False

cloud_masks = f['mod35']['Data Fields']['Cloud_Mask']
latitude = f['mod35']['Geolocation Fields']['Latitude']
longitude = f['mod35']['Geolocation Fields']['Longitude']

CLOUD_MASK = int('00000110', 2)

LAND_OR_WATER = int('11000000', 2)
WATER = int('00000000', 2)

db = pymongo.Connection('10.1.1.82', 27017).wtps
mongo = db.cloud_mask


def skip(lat, lon):
    if 36.0 < lat:
        return True
    if lat < 32.0:
        return True
    if 142.0 < lon:
        return True
    if lon < 138.0:
        return True
    return False


z = 0
cloud_mask = cloud_masks[z]
for y in range(0, len(latitude)):
    for x in range(0, len(latitude[0])):
        cm = cloud_mask[y * 5][x * 5]
        lat = latitude[y][x]
        lon = longitude[y][x]
        if cm & LAND_OR_WATER == WATER:
            continue
        score = (cm & CLOUD_MASK) >> 1
        print "x, y, z = %s, %s, %s" % (x, y, z)
        print "Latitude: %s" % lat
        print "Longitude: %s" % lon
        print "Score: %d" % score
        data = {
            'date': date,
            'lat': float(lat),
            'lon': float(lon),
            'score': int(score),
        }
        mongo.insert(data)
        print "----"

print date
f.close()
print "done"
