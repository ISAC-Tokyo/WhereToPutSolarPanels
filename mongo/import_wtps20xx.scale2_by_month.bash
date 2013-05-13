#!/bin/bash
# 

for i in `seq 2001 2012`; do
	CMD="mongoimport -h 10.1.1.35 -d wtps20xx -c scale2_by_month_ < wtps$i.scale2_by_month.json"
	echo $CMD
	eval $CMD
done


