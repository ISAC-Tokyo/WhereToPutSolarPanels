#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sts=4:ts=4:sw=4
#
# author: takano32 <tak@no32 dot tk>
#

DEBUG = False

import h5py
import pymongo


import sys
file_name = sys.argv[1]

import datetime
import re
m = re.match('^MOD35_L2.A([0-9]{4})([0-9]{3}).*', file_name)
year = int(m.group(1))
yday = int(m.group(2)) - 1
datedelta = datetime.timedelta(yday)
date = datetime.datetime(year, 1, 1) + datedelta
if not yday % 12 == 0:
    print "pass"
    print file_name
    print "--------"
    exit()

f = h5py.File(file_name, 'r')
cloud_masks = f['mod35']['Data Fields']['Cloud_Mask']
latitude = f['mod35']['Geolocation Fields']['Latitude']
longitude = f['mod35']['Geolocation Fields']['Longitude']

CLOUD_QUORITY = int('00000110', 2)
DAY_OR_NIGHT = int('00001000', 2)
LAND_OR_WATER = int('11000000', 2)

# mongoc = pymongo.Connection('10.1.1.82', 27017)  # server 2
mongoc = pymongo.Connection('10.1.2.94', 27017) # server 3
mongo = mongoc.wtps12_12.cloud_mask


def in_japan(lat, lon):
    if 50.0 < lat:
        return False
    if lat < 20.0:
        return False
    if 150.0 < lon:
        return False
    if lon < 120.0:
        return False
    return True


def valid_cloud_mask(cm):
    if cm & 1 == 0:
        # 0: Not determined.
        # 1: Determined.
        return False  # if 0
    if (cm & DAY_OR_NIGHT) >> 3 == 0:
        # 0: NIGHT
        # 1: DAY
        return False  # if 0
    return True

z = 0
cloud_mask = cloud_masks[z]
for y in range(0, len(latitude)):
    for x in range(0, len(latitude[0])):
        cm = cloud_mask[y * 5][x * 5]
        lat = latitude[y][x]
        lon = longitude[y][x]

        if not in_japan(lat, lon):
            continue

        if not valid_cloud_mask(cm):
            continue

        score = 0
        if 1 < (cm & CLOUD_QUORITY) >> 1:
            # 00: Cloudy
            # 01: Uncertain
            # 10: Probably Clear
            # 11: Confident Clear
            score = 1  # if 10 or 11

        land_or_water = (cm & LAND_OR_WATER) >> 6
        # 00: Water
        # 01: Coastal
        # 10: Desert
        # 11: Land

        if DEBUG:
            print "x, y, z = %s, %s, %s" % (x, y, z)
            print "Latitude: %s" % lat
            print "Longitude: %s" % lon
            print "Score: %d" % score
            print "Land or Water: %d" % land_or_water
            print "----"

        data = {
            'date': date,
            'loc': {
                'lat': float(lat),
                'lon': float(lon),
            },
            'score': int(score),
            'low': int(land_or_water),
        }
        mongo.insert(data)

mongoc.disconnect()
f.close()
print date
print file_name
print '--------'
