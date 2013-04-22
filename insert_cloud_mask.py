#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim: et sts=4:ts=4:sw=4
#
# author: takano32 <tak@no32 dot tk>
#

import h5py
import pymongo

import datetime

#file_name = 'MOD35_L2.A2004274.1140.005.2010148215256.h5'
#> ruby -rdate -e 'p Date.new(2004, 1, 1) + 274 - 1'
# => <Date: 2004-09-30 ((2453279j,0s,0n),+0s,2299161j)>

import sys
file_name = sys.argv[1]
f = h5py.File(file_name, 'r')

DEBUG = False

cloud_masks = f['mod35']['Data Fields']['Cloud_Mask']
latitude = f['mod35']['Geolocation Fields']['Latitude']
longitude = f['mod35']['Geolocation Fields']['Longitude']

CLOUD_MASK = int('00000110', 2)

LAND_OR_WATER = int('11000000', 2)
WATER = int('00000000', 2)

db = pymongo.Connection('10.1.1.82', 27017).test
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
        print "x, y, z = %s, %s, %s" % (x, y, z)
        cm = cloud_mask[y * 5][x * 5]
        lat = latitude[y][x]
        lon = longitude[y][x]
        if cm & LAND_OR_WATER == WATER: continue
        score = (cm & CLOUD_MASK) >> 1
        print "Latitude: %s" % lat
        print "Longitude: %s" % lon
        print "Score: %d" % score
        mongo.insert({
            'date': datetime.datetime(2012, 1, 1),
            'lat': float(lat),
            'lon': float(lon),
            'score': int(score),
        })
        print "----"
print "done"



