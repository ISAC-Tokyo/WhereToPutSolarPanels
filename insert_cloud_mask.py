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

mongoc = pymongo.Connection('10.1.1.82', 27017)
mongo = mongoc.wtps.cloud_mask


def in_japan(lat, lon):
    if 50.0 < lat:
        return True
    if lat < 20.0:
        return True
    if 150.0 < lon:
        return True
    if lon < 120.0:
        return True
    return False


z = 0
cloud_mask = cloud_masks[z]
for y in range(0, len(latitude)):
    for x in range(0, len(latitude[0])):
        cm = cloud_mask[y * 5][x * 5]
        lat = latitude[y][x]
        lon = longitude[y][x]
        if not in_japan(lat, lon):
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
mongoc.disconnect()
f.close()
print "done"
