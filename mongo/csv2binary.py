# -*- coding: utf-8 -*-

import csv
from struct import pack

f = open('./alldate_scale1.csv')

# 解像度の逆数
RESOLUTION = 10

LAT_MIN = 20 * RESOLUTION
LAT_MAX = 50 * RESOLUTION
LON_MIN = 120 * RESOLUTION
LON_MAX = 150 * RESOLUTION

def init_ranks_array():
    ranks = []
    for lat in range(LAT_MIN, LAT_MAX + 1):
        for lon in range(LON_MIN, LON_MAX + 1):
            ranks.append(0.0)

    print "Ranks Size:", len(ranks)
    return ranks


def fill_rank_data(arr):
    for row in csv.reader(f, delimiter=','):
        if row[0] == "value.loc.lat":
            # Ignore Header row
            continue

        lat = float(row[0])
        lon = float(row[1])
        score = float(row[2])

        row = int(lat * RESOLUTION - LAT_MIN) - 1
        col = int(lon * RESOLUTION - LON_MIN)
        idx = row * (LAT_MAX - LAT_MIN + 1) + col

        arr[idx] = int(score * 10000)

    return arr


def write_binary(ranks):
    out = open('binary_map_[20,120]to[50,150].dat', 'wb')
    for rank in ranks:
        out.write(pack('<H', rank))


def main():
    ret = init_ranks_array()
    ret = fill_rank_data(ret)
    write_binary(ret)

if __name__ == "__main__":
    main()
