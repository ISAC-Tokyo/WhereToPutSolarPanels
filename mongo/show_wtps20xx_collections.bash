#!/bin/bash

for i in `seq 2001 2012`; do
	CMD="echo show collections | mongo 210.129.195.213/wtps$i"
	echo $CMD
	eval $CMD
	echo '----'
done

