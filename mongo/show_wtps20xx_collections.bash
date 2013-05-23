#!/bin/bash

for i in `seq 2001 2012`; do
	CMD="echo show collections | mongo 10.1.1.35/wtps$i"
	echo $CMD
	eval $CMD
	echo '----'
done

