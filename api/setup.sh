#!/bin/bash

if [[ $(uname -m) != 'x86_64' ]]; then
    apt-get update
    apt-get install hdf5-tools pkg-config libhdf5-dev -y
fi

pip install -r requirements.txt
python download_model.py